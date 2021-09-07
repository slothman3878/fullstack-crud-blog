import { Resolver, Query, Ctx, UseMiddleware } from "type-graphql";
import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../types';

@Resolver()
export class HelloResolver {
  @Query(() => String)
  @UseMiddleware(isAuth)
  hello(
    @Ctx() ctx: MyContext
  ) {
    return 'hello';
  }
}