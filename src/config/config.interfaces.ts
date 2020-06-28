export interface ServerConfig {
  port: number;
  origin: string;
}

export interface DatabaseConfig {
  type: any;
  port: number;
  database: string;
  host: string;
  username: string;
  password: string;
  synchronize: boolean;
}

export interface JwtConfig {
  expiresIn: number;
  secret: string;
}
