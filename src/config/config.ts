export const Config = (): any => ({
  database: {
    url: process.env.DATABASE_URL,
    synchronize: process.env.DATABASE_SYNC === 'true',
    ssl: process.env.DATABASE_SSL === 'true',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN ? Number(process.env.JWT_EXPIRES_IN) : 3600,
  },
});
