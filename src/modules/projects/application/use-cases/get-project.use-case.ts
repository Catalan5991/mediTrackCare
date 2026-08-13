import { Injectable } from '@nestjs/common';

@Injectable()
export class GetProjectUseCase {
  execute(id: number): unknown {
    return { id };
  }
}
