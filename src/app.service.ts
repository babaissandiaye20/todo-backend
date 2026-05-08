import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck() {
    return {
      status: 'ok',
      service: 'todo-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
