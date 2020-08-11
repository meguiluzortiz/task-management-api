import { NestFactory } from '@nestjs/core';
import { Logger, INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as config from 'config';
import { ServerConfig } from './config/config.interfaces';
import { ConfigKeys } from './config/config-keys.enum';

const logger = new Logger('bootstrap');
// Development config is loaded by default
const environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const serverConfig = config.get<ServerConfig>(ConfigKeys.SERVER);

async function bootstrap() {
  logger.debug(`Application environment: ${environment}`);
  const app = await NestFactory.create(AppModule);

  cors(app);
  swagger(app);

  const port = serverConfig.port;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}

function cors(app: INestApplication) {
  if (environment === 'production') {
    app.enableCors({ origin: serverConfig.origin });
    logger.log(`Accepting requests from origin "${serverConfig.origin}"`);
  } else {
    app.enableCors();
  }
}

function swagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('Task Management API Endpoints')
    .setVersion('1.0.0')
    .addTag('auth')
    .addTag('task')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api-docs', app, document);
}

bootstrap();
