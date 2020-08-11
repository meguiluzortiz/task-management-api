import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

export interface Redirect {
  url: string;
  statusCode?: number;
}

@Controller()
export class AppController {
  @ApiExcludeEndpoint()
  @Get()
  @Redirect()
  redirectSwagger(): Redirect {
    return { url: '/api-docs' };
  }
}
