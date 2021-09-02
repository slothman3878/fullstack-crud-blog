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
import ormConfig from './orm.config';
import session from 'express-session';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';
import cors from 'cors';
import { Server } from 'http';
import path from 'path';

require('dotenv').config();

import { PostResolver } from "./resolvers/post.resolver";
import { TypeResolver } from "./resolvers/type.resolver";
import { UserResolver } from "./resolvers/user.resolver";

export default class Application {
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
      this.apollo = new ApolloServer({
        schema: await buildSchema({
          resolvers: [
            PostResolver, 
            TypeResolver,
            UserResolver
          ],
          validate: false,
        }),
        context: ({ req, res }) => ({
          req,
          res,
          em: this.orm.em.fork() 
        }),
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
    this.app.use(express.json());    
    this.app.use(express.static(path.join(__dirname,"../client/build")));

    /// Session Store
    const RedisStore = connectRedis(session);
    const redis = new Redis();
    this.app.use(
      session({
        store: new RedisStore({
          client: redis,
          disableTouch: true,
        }),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24, // 1 years
          httpOnly: true,
        },
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET ?? [],
        resave: false,
      })
    );

    this.apollo.applyMiddleware({
      app: this.app,
      cors: false,
    });

    try {
      const port = process.env.PORT || 5000;

      this.app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname,"../client/build/index.html"));
      });

      this.app.listen(port, () => {
        console.log('=================================================')
        console.log(` server started on ${port}`);
        console.log(` api endpoint is "http://localhost:${port}/graphql"`);
        console.log('=================================================');
      });
    } catch (error) {
      console.log('Could not initialize server', error);
      throw Error(error);
    }
  };
}