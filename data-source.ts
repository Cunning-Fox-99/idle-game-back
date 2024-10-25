// src/data-source.ts
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'dbname',
  entities: [__dirname + '/entity/*.ts'],
  migrations: [__dirname + '/migration/*.ts'],
});
