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
import { isAuth } from "../middleware/isAuth"

@InputType()
class TypeMutationInput {
  @Field()
  name: string;
  @Field({ nullable: true })
  suptype?: string;
}

@InputType()
class TypeQueryInput {
  @Field({ nullable: true })
  id?: string;
  @Field({ nullable: true })
  name?: string;
}

// use middlware to add authentication
@Resolver(()=>Type)
export class TypeResolver {
  @Query(() => Type, { nullable: true })
  async type(
    @Arg('input') input: TypeQueryInput,    
    @Ctx() ctx: MyContext
  ): Promise<Type|null> {
    const repo = ctx.em.getRepository(Type);
    return await repo.findOne({ ...input }, {
      populate: ['posts', 'subtypes.posts', 'suptype.posts']
    });
  }

  @Query(() => [Type], { nullable: true })
  async types(
    @Arg('limit', { defaultValue: 10 }) limit: number,
    @Arg('offset', { defaultValue: 0 }) offset: number,
    @Ctx() ctx: MyContext
  ): Promise<Type[]|null> {
    const repo = ctx.em.getRepository(Type);
    return await repo.find({}, {
      populate: ['posts', 'subtypes.posts', 'suptype.posts'],
      limit,
      offset
    });
  }

  @Mutation(() => Type)
  @UseMiddleware(isAuth)
  async createType(
    @Arg("input") input: TypeMutationInput,
    @Ctx() ctx: MyContext
  ): Promise<Type|null> {
    const user = await ctx.em.findOneOrFail(User, {id: ctx.req.session.userId});
    if(!user.isAdmin) return null;
    const type = new Type();
    type.name = input.name;
    if(input.suptype){
      type.suptype = await ctx.em.findOneOrFail(Type, {name: input.suptype});
    }
    ctx.em.persist(type);
    await ctx.em.flush();
    return type;
  }
}