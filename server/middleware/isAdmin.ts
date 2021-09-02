import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types";

export const isAdmin: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session.isAdmin) {
    throw new Error("not admin");
  }
  return next();
};