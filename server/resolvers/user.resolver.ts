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
import { isAdmin } from "../middleware/isAdmin"

@InputType()
class LoginRequest {
  @Field()
  username: string;
  @Field()
  password: string;
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
    ctx.req.session.isAdmin = true;
    return true;
  }
}