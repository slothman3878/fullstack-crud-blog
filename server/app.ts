import express from 'express';
import passport from 'passport';
import cors from 'cors';
import { Server } from 'http';
import path from 'path';
import jsonwebtoken from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import {ApolloServer} from 'apollo-server-express';

import {InitOptions} from './types';

/// Move these to .env file in the future
const PORT = process.env.PORT!;
const JWT_SECRET = process.env.JWT_SECRET!;
const GRAPHQL_PATH = '/graphql';
const TOKEN_EXPIRATION = 3000;
const CLIENT_URL = process.env.CLIENT_URL!;

export default class Application {
  public init=async({ em, schema }: InitOptions)=>{
    const app = express();
    const corsOptions = {
      origin: [
        CLIENT_URL,
        'https://studio.apollographql.com',
      ],
      credentials: true,
    }
    app.use(cors(corsOptions));
    app.use(cookieParser());

    app.use(passport.initialize());

    try {
      const apollo = new ApolloServer({
        schema,
        context: ({ req, res }) => ({
          req,
          res,
          em,
        }),
      });
      await apollo.start();
      apollo.applyMiddleware({
        app,
        cors: corsOptions
      });
    } catch(err) { console.log('Failed to initialize Apollo Server'); throw Error(err); }

    // Token Refresh
    app.use((req,res,next)=>{
      try{
        const token = jsonwebtoken.verify(
          req.cookies.token,
          JWT_SECRET
        ) as jsonwebtoken.JwtPayload;
        const expiresIn = (token.exp as number)-(Date.now()/1000);
        if(expiresIn>0&&expiresIn<300) {
          res.cookie('token', 
            jsonwebtoken.sign(
              { user: token.user },
              JWT_SECRET,
              { expiresIn: TOKEN_EXPIRATION }
            ), {
              httpOnly: true,
              sameSite: 'lax',
              secure: process.env.NODE_ENV==='production'
          });
        }
      } catch(err) {
        // No token cookie
        console.log(err.message);
      }
      next();
    })

    // Authentication Middleware
    app.get("/auth/google", 
      passport.authenticate('google', { scope: ['email'] }));
    app.get("/auth/google/redirect", 
      passport.authenticate('google', { 
        session: false, 
        failureRedirect: CLIENT_URL }), 
      (req, res) => {
        const token = jsonwebtoken.sign(
          { user: req.user },
          JWT_SECRET ?? 'secret',
          { expiresIn: TOKEN_EXPIRATION }
        );
        res.cookie('token', token, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV==='production'
        });
        res.redirect(CLIENT_URL);
      });

    // For testing
    app.get('/hello', (req, res) => {
      res.send('hello');
    })

    app.listen(PORT, () => {
      console.log('=================================================')
      console.log(` server started on ${PORT}`);
      console.log(` api endpoint is "http://localhost:${PORT}/graphql"`);
      console.log('=================================================');
    });
  }
}