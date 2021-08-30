import {
  Arg,
  Ctx,
  Resolver,
  Query,
  InputType,
  Field,
  Mutation
} from "type-graphql";
import { Type } from "../entities/type.entity";
import { Post } from "../entities/post.entity";
import { MyContext } from "../types";

@InputType()
class TypeMutationInput {
  @Field()
  name: string;
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
      populate: ['posts']
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
      populate: ['posts'],
      limit,
      offset
    });
  }

  @Mutation(() => Type)
  async createType(
    @Arg("input") input: TypeMutationInput,
    @Ctx() ctx: MyContext
  ): Promise<Type> {
    const type = new Type();
    type.name = input.name;
    ctx.em.persist(type);
    await ctx.em.flush();
    return type;
  }
}