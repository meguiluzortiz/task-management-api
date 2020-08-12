import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const logger = new Logger('TypeOrmConfig');

export const typeOrmConfigFactory = (configService: ConfigService): TypeOrmModuleOptions => {
  const synchronize = configService.get('database.synchronize');
  const ssl = configService.get('database.ssl');
  logger.log(`Database synchronize: ${synchronize}`);
  logger.log(`Database security ssl rejectUnauthorized: ${ssl}`);

  const opts: TypeOrmModuleOptions = {
    type: 'postgres',
    url: configService.get('database.url'),
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize,
  };

  const sslOpts = Object.assign({}, opts, {
    extra: {
      ssl: { rejectUnauthorized: false },
    },
  });

  return ssl ? sslOpts : opts;
};
