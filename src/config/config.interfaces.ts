export interface ServerConfig {
  port: number;
  origin: string;
}

export interface DatabaseConfig {
  type: any;
  url: string;
  synchronize: boolean;
}

export interface JwtConfig {
  expiresIn: number;
  secret: string;
}
