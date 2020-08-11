import { Controller, Get, Redirect } from '@nestjs/common';

export interface Redirect {
  url: string;
  statusCode?: number;
}

@Controller()
export class AppController {
  @Get()
  @Redirect()
  redirectSwagger(): Redirect {
    return { url: '/api-docs' };
  }
}
