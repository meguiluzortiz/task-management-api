import { NestFactory } from '@nestjs/core';
import { Logger, INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

const logger = new Logger('bootstrap');
const environment = process.env.NODE_ENV;

async function bootstrap() {
  logger.debug(`Application environment: ${environment}`);
  const app = await NestFactory.create(AppModule);

  swagger(app);

  const port = process.env.PORT;
  await app.listen(port);
  logger.log(`Application started on port http://localhost:${port}`);
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
