import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import { ConfigKeys } from '../../config/config-keys.enum';
import { DatabaseConfig } from '../../config/config.interfaces';

const dbConfig = config.get<DatabaseConfig>(ConfigKeys.DB);

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: (process.env.RDS_PORT as any) || dbConfig.port,
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: (process.env.TYPEORM_SYNC as any) || dbConfig.synchronize,
};
