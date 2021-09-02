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
import argon2 from "argon2";

@InputType()
class LoginRequest {
  @Field()
  username: string;
  @Field()
  password: string;
}

@InputType()
class SignupRequest {
  @Field()
  username: string;
  @Field()
  password1: string;
  @Field()
  password2: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => Boolean)
  async login(
    @Arg("input") input: LoginRequest,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const repo = ctx.em.getRepository(User);
    const user = await repo.findOneOrFail({ username: input.username });
    if(await argon2.verify(input.password, user.password)) return false;
    ctx.req.session.userId = user.id;
    return true;
  }

  @Mutation(() => Boolean)
  async signup(
    @Arg("input") input: SignupRequest,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    if(input.password1!==input.password2) return false;
    const user = new User({
      username: input.username,
      password: await argon2.hash(input.password1)
    });
    await ctx.em.persist(user).flush();
    ctx.req.session.userId = user.id;
    return true;
  }
}