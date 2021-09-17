import {
  Connection,
  IDatabaseDriver,
  MikroORM
} from '@mikro-orm/core';
import { 
  SqlEntityManager,
  EntityManager,
  PostgreSqlDriver,
  AbstractSqlDriver,
  AbstractSqlConnection
} from '@mikro-orm/postgresql';
import ormConfig from './orm.config';

export default class Database {
  public init=async()=>{
    const orm = await MikroORM.init<PostgreSqlDriver>(ormConfig);
    return orm.em.fork();
  }
}