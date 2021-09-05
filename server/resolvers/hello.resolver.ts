
import { Resolver, Query, Ctx } from "type-graphql";
import { MyContext } from '../types';

@Resolver()
export class HelloResolver {
  @Query(() => String)
  hello(
    @Ctx() ctx: MyContext
  ) {
    if(!ctx.req.session.user_id) return 'no hello for you'
    return `${ctx.req.session.user_id}, hello`;
  }
}