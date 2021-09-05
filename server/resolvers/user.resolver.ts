// under the current user model, the user resolver is relevant, since the authentication is done via google oauth alone
import {
  Arg,
  Ctx,
  Resolver,
  Query,
  InputType,
  Field,
  Mutation,
  UseMiddleware
} from "type-graphql";
import { Type } from "../entities/type.entity";
import { Post } from "../entities/post.entity";
import { User } from "../entities/user.entity";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";

/*
@InputType()
class LoginRequest {
  @Field()
  email: string;
  @Field()
  password: string;
}*/

@InputType()
class UserQueryInput {
  @Field({nullable: true})
  id?: string;
  @Field({nullable: true})
  email?: string;
}

@Resolver()
export class UserResolver {
  /* This part is unnecssary, as authentication is done completely by passport.js
  @Mutation(() => Boolean)
  async login(
    @Arg("input") input: LoginRequest,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const repo = ctx.em.getRepository(User);
    return true;
  }*/
  @Query(()=>User)
  async user(
    @Arg('input') input: UserQueryInput,
    @Ctx() ctx: MyContext
  ): Promise<User|null> {
    return ctx.em.getRepository(User).findOneOrFail({...input})
  }

  @Query(()=>User)
  @UseMiddleware(isAuth)
  async me(
    @Ctx() ctx: MyContext
  ): Promise<User> {
    return ctx.em.getRepository(User).findOneOrFail({id: ctx.req.session.user_id});
  }
}