import { Resolver, Query, Ctx, UseMiddleware } from "type-graphql";
import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../types';
import { User, UserType } from '../entities/user.entity';

@Resolver()
export class HelloResolver {
  @Query(() => String)
  @UseMiddleware(isAuth)
  async hello(
    @Ctx() ctx: MyContext
  ): Promise<string> {
    if(!ctx.req.user) throw new Error('undefined user in server request');
    return `hello ${(await ctx.em.getRepository(User).findOneOrFail(
      { id: (ctx.req.user as UserType).id }
    )).email}`;
  }
}