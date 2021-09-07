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
import passport from 'passport';
import cors from 'cors';
import { Server } from 'http';
import path from 'path';
import jwt from 'express-jwt';
import jsonwebtoken from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

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
        'http://127.0.0.1:3000',
        'https://studio.apollographql.com',
      ],
      credentials: true,
    }));

    //this.app.use(express.static(path.join(__dirname,"../client/build")));
    this.app.use(bodyParser.urlencoded({
      extended: true,
    }));
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use(jwt({ 
      secret: process.env.JWT_SECRET ?? 'secret', 
      algorithms: ['HS256'],
      getToken: req => req.cookies.token,
    }).unless({path: [
        /graphql/,
        /\/auth*/,
      ]}));

    this.app.use(passport.initialize());

    this.apollo.applyMiddleware({
      app: this.app,
    });


    try {
      const port = process.env.PORT || 5000;

      this.app.get("/auth/google", 
        passport.authenticate('google', { scope: ['email'] })
      );

      this.app.get("/auth/google/redirect", 
        passport.authenticate('google', { session: false, failureRedirect: '/' }), 
        (req, res) => {
          const token = jsonwebtoken.sign(
            { user: req.user },
            process.env.JWT_SECRET ?? 'secret',
            { expiresIn: 2000 }
          );
          res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV==='production'
          });
          res.redirect('http://localhost:3000/');
        });

      this.app.get('/auth', (req, res)=>{
        res.send(jsonwebtoken.verify(
          req.cookies.token,
          process.env.JWT_SECRET ?? 'secret'
        ))})

      this.app.get('/hello', (req, res) => {
        res.send('hello');
      })

      /*this.app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname,"../client/build/index.html"));
      });*/

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