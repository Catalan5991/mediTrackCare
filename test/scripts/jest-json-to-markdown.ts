import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

interface AssertionResult {
  fullName?: string;
  status?: string;
  failureMessages?: string[];
}
interface SuiteResult {
  name?: string;
  status?: string;
  assertionResults?: AssertionResult[];
}
interface JestResult {
  startTime?: number;
  numTotalTestSuites?: number;
  numPassedTestSuites?: number;
  numFailedTestSuites?: number;
  numTotalTests?: number;
  numPassedTests?: number;
  numFailedTests?: number;
  numPendingTests?: number;
  testResults?: SuiteResult[];
}

const input = resolve('test/results/e2e-results.json');
if (!existsSync(input))
  throw new Error(`No se encontró un resultado real de Jest en ${input}`);
const result = JSON.parse(readFileSync(input, 'utf8')) as JestResult;
const total = result.numTotalTests ?? 0;
const passed = result.numPassedTests ?? 0;
const pending = result.numPendingTests ?? 0;
const executionStatus =
  total === 0 || pending === total ? 'NO EJECUTADO' : 'EJECUTADO';
const failures = (result.testResults ?? []).flatMap((suite) =>
  (suite.assertionResults ?? [])
    .filter((test) => test.status === 'failed')
    .map(
      (test) =>
        `| ${test.fullName ?? 'Unknown'} | ${(test.failureMessages?.[0] ?? 'No detail').replace(/\r?\n/g, ' ')} |`,
    ),
);
const elapsed = result.startTime
  ? ((Date.now() - result.startTime) / 1000).toFixed(2)
  : 'N/D';
const markdown = `# Resultados reales de pruebas E2E

- Fecha de ejecución: ${new Date().toISOString()}
- Estado: ${executionStatus}
- Suites: ${result.numTotalTestSuites ?? 0} (${result.numPassedTestSuites ?? 0} aprobadas, ${result.numFailedTestSuites ?? 0} fallidas)
- Pruebas: ${total} (${passed} aprobadas, ${result.numFailedTests ?? 0} fallidas, ${result.numPendingTests ?? 0} omitidas)
- Tiempo observado: ${elapsed} s
- Porcentaje de aprobación: ${total ? ((passed / total) * 100).toFixed(2) : '0.00'}%

## Pruebas fallidas

| Prueba | Detalle |
| --- | --- |
${failures.length ? failures.join('\n') : '| Ninguna | - |'}

## Reportes

- HTML: \`test/results/html/e2e-report.html\`
- JUnit: \`test/results/junit/e2e-results.xml\`
- JSON: \`test/results/e2e-results.json\`
- Cobertura: \`coverage/lcov-report/index.html\`
`;
const output = resolve('docs/E2E_TEST_RESULTS.md');
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, markdown, 'utf8');
