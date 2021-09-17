import { EntityManager } from '@mikro-orm/postgresql';
import { Request, Response } from 'express';
import { GraphQLSchema } from 'graphql';

export interface MyContext {
  em: EntityManager;
  req: Request;
  res: Response;
};

export interface InitOptions {
  schema: GraphQLSchema;
  em: EntityManager;
}