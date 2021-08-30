import { EntityManager } from '@mikro-orm/postgresql';

export type MyContext = {
  em: EntityManager
};