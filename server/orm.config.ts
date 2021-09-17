import { MikroORM, Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import path from 'path';

export default {
  migrations: {
    tableName: 'mikro_orm_migrations', // name of database table with log of executed transactions
    path: path.join(__dirname, "./migrations"), // path to the folder with migrations    
    pattern: /^[\w-]+\d+\.ts$/, // regex pattern for the migration files    
    allOrNothing: true, // wrap all migrations in master transaction    
    dropTables: true, // allow to disable table dropping    
    safe: false, // allow to disable table and column dropping     
    emit: 'ts',
    disableForeignKeys: false,
  },
  clientUrl: process.env.DATABASE_URL,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['server/**/*.entity.ts'],
  type: 'postgresql',
  forceUndefined: true,
  driverOptions: {
    connection: { ssl: { rejectUnauthorized: false } },
  },
} as Options<PostgreSqlDriver>;