import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import { ConfigKeys } from './config-keys.enum';
import { DatabaseConfig } from './config.interfaces';
import { Logger } from '@nestjs/common';

const dbConfig = config.get<DatabaseConfig>(ConfigKeys.DB);
const logger = new Logger('TypeOrmConfig');
logger.log(`Database synchronize: ${dbConfig.synchronize}`);

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  url: dbConfig.url,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: dbConfig.synchronize,
};
