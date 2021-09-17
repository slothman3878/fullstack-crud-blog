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
import {
  Length,
  MaxLength,
} from 'class-validator';
import {
  AuthenticationError,
  UserInputError,
  ForbiddenError,
} from 'apollo-server-errors';
import { Type } from "../entities/type.entity";
import { Post } from "../entities/post.entity";
import { User } from "../entities/user.entity";
import { MyContext } from "../types";
import { isAuth, partialAuth } from "../middleware/isAuth"

@InputType()
class TypeMutationInput {
  @Field()
  @Length(1,20)
  name: string;
  @Field({ nullable: true })
  suptype?: string;
  @Field({ nullable: true })
  @MaxLength(255)
  desc?: string;
}

@InputType()
class TypeQueryInput {
  @Field({ nullable: true })
  id?: string;
  @Field({ nullable: true })
  name?: string;
}

@InputType()
class TypesQueryInput {
  @Field({nullable: true})
  suptype?: string;
  @Field({nullable: true})
  isRoot?: boolean;
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
    const populate = ['posts', 'subtypes.posts', 'suptype.posts'];
    return await repo.findOne({ ...input }, {
      populate,
    });
  }

  @Query(() => [Type], { nullable: true })  
  async types(
    @Arg('input') input: TypesQueryInput,
    @Arg('limit', { defaultValue: 10 }) limit: number,
    @Arg('offset', { defaultValue: 0 }) offset: number,
    @Ctx() ctx: MyContext
  ): Promise<Type[]|null> {
    const repo = ctx.em.getRepository(Type);
    const populate = ['posts', 'subtypes.posts', 'suptype.posts'];
    if(input.suptype) {
      const { suptype, ...inputExSuptype } = input;
      let parenttype;
      try {
        parenttype = await repo.findOneOrFail({id: suptype})
      } catch (err) { throw new UserInputError(err) }
      return await repo.find({suptype: parenttype, ...inputExSuptype}, {
        populate,
        limit,
        offset
      })
    }
    return await repo.find({ ...input }, {
      populate,
      limit,
      offset
    });
  }

  @Mutation(() => Type)
  @UseMiddleware(isAuth)
  async createType(
    @Arg("input") input: TypeMutationInput,
    @Ctx() ctx: MyContext
  ): Promise<Type> {
    let user: User;
    try {
      user = 
        await ctx.em.getRepository(User)
          .findOneOrFail({id: ctx.req.user});
    } catch (err) { throw new AuthenticationError(err) }
    if(!user.isAdmin) 
      throw new ForbiddenError('User not admin');
    const repo = ctx.em.getRepository(Type);
    const type = new Type();
    type.name = input.name;
    type.desc = input.desc;
    if(input.suptype) try{
      type.suptype =
        await repo.findOneOrFail({id: input.suptype, isRoot: true});
    } catch(err) { throw new UserInputError(err) }
    type.isRoot = type.suptype ? false : true;
    try{
      await ctx.em.persist(type).flush();
    } catch (err) { throw new UserInputError(err); }
    return type;
  }

  @Mutation(()=>Type)
  @UseMiddleware(isAuth)
  async updateType(
    @Arg("id") id: string,
    @Arg("input") input: TypeMutationInput,
    @Ctx() ctx: MyContext
  ): Promise<Type> {
    let user: User;
    try {
      user = 
        await ctx.em.getRepository(User)
          .findOneOrFail({id: ctx.req.user});
    } catch (err) { throw new AuthenticationError(err) }
    if(!user.isAdmin) 
      throw new ForbiddenError('User not admin');
    const repo = ctx.em.getRepository(Type);
    let type: Type;
    try {
      type = await repo.findOneOrFail({id});
    } catch (err) { throw new UserInputError(err) }
    type.name = input.name;
    type.desc = input.desc;
    if(input.suptype) try{
      type.suptype =
        await repo.findOneOrFail({id: input.suptype, isRoot: true});
    } catch(err) { throw new UserInputError(err) }
    type.isRoot = type.suptype ? false : true;
    try{
      await ctx.em.persist(type).flush();
    } catch (err) { throw new UserInputError(err); }
    return type;
  }
}