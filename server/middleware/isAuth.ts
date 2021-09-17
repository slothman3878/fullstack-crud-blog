import { MiddlewareFn } from "type-graphql";
import {
  AuthenticationError
} from 'apollo-server-errors'
import { MyContext } from "../types";
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';

/// We can consider multiple layers of authentication
/// jsonwebtoken and session. If a user closes a session, the have logged out, for instance.
export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const token = context.req.cookies.token;
  if(token) {
    jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET ?? 'secret',
      (err: any, data: any)=>{
        if(err) throw new AuthenticationError(err);
        context.req.user = data.user;
      });
  } else throw new AuthenticationError('no token cookie found');
  return next();
};

/// Partial Auth
export const partialAuth: MiddlewareFn<MyContext> = ({context},next)=>{
  const token = context.req.cookies.token;
  if(token) {
    jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET ?? 'secret',
      (err:any, data:any)=>{
        context.req.user = data.user
      });
  };
  return next();
}