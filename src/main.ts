import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';
import { ServerConfig } from './config/config.interfaces';
import { ConfigKeys } from './config/config-keys.enum';

async function bootstrap() {
  // Development config is loaded by default
  const environment = process.env.NODE_ENV === undefined ? 'development' : process.env.NODE_ENV;

  const logger = new Logger('bootstrap');
  logger.debug(`Application environment: ${environment}`);
  const app = await NestFactory.create(AppModule);
  const serverConfig = config.get<ServerConfig>(ConfigKeys.SERVER);

  if (environment === 'production') {
    app.enableCors({ origin: serverConfig.origin });
    logger.log(`Accepting requests from origin "${serverConfig.origin}"`);
  } else {
    app.enableCors();
  }

  const port = serverConfig.port;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
