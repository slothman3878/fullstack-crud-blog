import express from 'express';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { GraphQLSchema } from 'graphql';
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
import passport from 'passport';
import cors from 'cors';
import { Server } from 'http';
import path from 'path';

require('dotenv').config();
require('./authentication');
import { DI } from './constants';

import { graphqlHTTP } from 'express-graphql';

import { HelloResolver } from "./resolvers/hello.resolver";
import { PostResolver } from "./resolvers/post.resolver";
import { TypeResolver } from "./resolvers/type.resolver";
import { UserResolver } from "./resolvers/user.resolver";

export default class Application {
  public orm: MikroORM<AbstractSqlDriver<AbstractSqlConnection>>;
  public app: express.Application;
  public schema: GraphQLSchema;
  public apollo: ApolloServer;
  public server: Server;

  //Connect to Database
  public connect = async (): Promise<void> => {
    try {
      this.orm = await MikroORM.init<PostgreSqlDriver>(ormConfig);
      DI.em = this.orm.em.fork();
    } catch (error) {
      console.error('Could not connect to the database', error);
      throw Error(error);
    }
  };

  //Setup GraphQL
  public setUp = async (): Promise<void> => {
    try {
      this.schema = await buildSchema({
        resolvers: [
          HelloResolver,
          PostResolver, 
          TypeResolver,
          UserResolver
        ],
        validate: false,
      })
      this.apollo = new ApolloServer({
        schema: this.schema,
        context: ({ req, res }) => ({
          req,
          res,
          em: DI.em
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
    this.app.use(cors({
      origin: [
        'http://localhost:3000',
        'https://studio.apollographql.com',
      ],
      credentials: true,
    })); 
    this.app.use(express.static(path.join(__dirname,"../client/build")));
    /// this.app.set('trust proxy', '127.0.0.1');
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
          secure: process.env.NODE_ENV==='production' ? true : false,
          sameSite: 'none',
          domain: undefined,
        },
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET ?? [],
        resave: false,
        proxy: true,
      })
    );

    this.apollo.applyMiddleware({
      app: this.app,
      cors: false,
    });

    this.app.use(passport.initialize());
    //User object serialization is turned off. Have issues effectively implementing this in typescript
    //this.app.use(passport.session());

    /** Apollo no longer has it's own graphql playground.
      * Rather, it redirects you to Apollo's graphql studio.
      * Queries and Mutations that require authentication can only be tested here */
    this.app.use('/gql', graphqlHTTP((req, res) => ({
      schema: this.schema,
      context: {
        req,
        res,
        em: DI.em
      },
      graphiql: true,
    })));

    try {
      const port = process.env.PORT || 5000;

      this.app.get("/auth", (req, res) => {
        if(req.session.user_id) res.send(req.session);
        else res.send('Unauthenticated');
      });

      this.app.get("/auth/google", 
        passport.authenticate('google', {  scope: ['email'] })
      );

      this.app.get("/auth/google/redirect", 
        passport.authenticate('google', { session: false, failureRedirect: '/' }), 
        (req, res) => {
          res.redirect('/');
        });

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