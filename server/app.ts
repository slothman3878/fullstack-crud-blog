import express from 'express';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
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
import cors from 'cors';
import { Server } from 'http';
import ormConfig from './orm.config';

import { HelloResolver } from "./resolvers/hello.resolver";
import { PostResolver } from "./resolvers/post.resolver";
import { TypeResolver } from "./resolvers/type.resolver";

export default class Application {
//  public orm: MikroORM<IDatabaseDriver<Connection>>;
  public orm: MikroORM<AbstractSqlDriver<AbstractSqlConnection>>;
  public app: express.Application;
  public apollo: ApolloServer;
  public server: Server;

  //Connect to Database
  public connect = async (): Promise<void> => {
    try {
      this.orm = await MikroORM.init<PostgreSqlDriver>(ormConfig);
    } catch (error) {
      console.error('Could not connect to the database', error);
      throw Error(error);
    }
  };

  //Setup GraphQL
  public setUp = async (): Promise<void> => {
    try {
      //const em: SqlEntityManager = this.orm.em.fork();
      this.apollo = new ApolloServer({
        schema: await buildSchema({
          resolvers: [HelloResolver, PostResolver, TypeResolver],
          validate: false,
        }),
        context: () => ({ em: this.orm.em.fork() }),
      });
      await this.apollo.start();
    } catch (error) {
      console.log('Could not set up Apollo Server', error);
      throw Error(error);
    }
  }

  //Initialize Server
  public init = async (): Promise<void> => {
    this.app = express();

    this.app.use(cors());
    
    try {
      this.apollo.applyMiddleware({
        app: this.app,
        cors: false,
      });

      const port = process.env.PORT || 5000;
      this.app.listen(port, () => {
        console.log(`http://localhost:${port}/graphql`);
      });
    } catch (error) {
      console.log('Could not initialize server', error);
      throw Error(error);
    }
  };
}