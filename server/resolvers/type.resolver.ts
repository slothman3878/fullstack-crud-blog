import {
  Arg,
  Ctx,
  Resolver,
  Query,
  InputType,
  Field,
  Mutation
} from "type-graphql";
import { Type, SubType } from "../entities/type.entity";
import { Post } from "../entities/post.entity";
import { MyContext } from "../types";

@InputType()
class TypeMutationInput {
  @Field()
  name: string;
}

@InputType()
class SubTypeMutationInput extends TypeMutationInput {
  @Field()
  suptypeId: string;
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
      populate: ['posts', 'subtypes']
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
      populate: ['posts', 'subtypes'],
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

@Resolver(()=>SubType)
export class SubTypeResolver {
  @Query(() => SubType, { nullable: true })
  async subtype(
    @Arg('input') input: TypeQueryInput,    
    @Ctx() ctx: MyContext
  ): Promise<SubType|null> {
    const repo = ctx.em.getRepository(SubType);
    return await repo.findOne({ ...input }, {
      populate: ['posts', 'suptype.posts', 'suptype.subtypes']
    });
  }

  @Query(() => [SubType], { nullable: true })
  async subtypes(
    @Arg('limit', { defaultValue: 10 }) limit: number,
    @Arg('offset', { defaultValue: 0 }) offset: number,
    @Ctx() ctx: MyContext
  ): Promise<SubType[]|null> {
    const repo = ctx.em.getRepository(SubType);
    return await repo.find({}, {
      populate: ['posts', 'suptype.posts', 'suptype.subtypes'],
      limit,
      offset
    });
  }

  @Mutation(() => SubType)
  async createSubType(
    @Arg("input") input: SubTypeMutationInput,
    @Ctx() ctx: MyContext
  ): Promise<SubType> {
    const subtype = new SubType();
    subtype.suptype = await ctx.em.findOneOrFail(Type, { id: input.suptypeId });
    subtype.name = input.name;
    ctx.em.persist(subtype);
    await ctx.em.flush();
    return subtype;
  }
}