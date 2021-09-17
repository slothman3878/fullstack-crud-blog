import {
  Arg,
  Ctx,
  Resolver,
  Query,
  Mutation,
  ObjectType,
  InputType,
  Field,
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
import { Post } from '../entities/post.entity';
import { Draft } from '../entities/draft.entity';
import { Type } from "../entities/type.entity";
import { User } from "../entities/user.entity";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";

@InputType()
class DraftMutationInput {
  @Field()
  @MaxLength(255)
  title: string;
  @Field({ nullable: true })
  body: string;
  @Field()
  type: string;
}

// Input for single post query
// Unique properties only
@InputType()
class DraftQueryInput {
  @Field({ nullable: true })
  id?: string;
  @Field({ nullable: true })
  title?: string;
}

// Input for multiple post query
// Non-Unique properties only
@InputType()
class DraftsQueryInput {
  @Field({ nullable: true })
  type?: string;
}

@Resolver(()=>Draft)
export class DraftResolver {
  @Query(() => Draft, { nullable: true })
  @UseMiddleware(isAuth)
  async draft(
    @Arg('input') input: DraftQueryInput,
    @Ctx() ctx: MyContext
  ): Promise<Draft|null> {
    let user: User;
    try {
      user = 
        await ctx.em.getRepository(User)
          .findOneOrFail({id: ctx.req.user});
    } catch(err) { throw new AuthenticationError(err) }
    const repo = ctx.em.getRepository(Draft);
    const populate = ['writer.drafts','writer.posts'];
    const draft = await repo.findOne({ ...input }, {
      populate
    });
    if(draft&&draft.writer!==user)
      throw new ForbiddenError('User is not the writer of this Draft')
    return draft;
  }

  // for paginated posts
  @Query(() => [Draft], { nullable: true })
  @UseMiddleware(isAuth)
  async Drafts(
    @Arg('input') input: DraftsQueryInput,
    @Arg('limit', { defaultValue: 10 }) limit: number,
    @Arg('offset', { defaultValue: 0 }) offset: number,
    @Ctx() ctx: MyContext
  ): Promise<Draft[]|null> {
    const repo = ctx.em.getRepository(Draft);
    const populate = ['writer.drafts','writer.posts'];
    const filter={} as {
      type: Type, //writer: User
    };
    if(input.type) {
      try {
        const type =
          await ctx.em.getRepository(Type)
            .findOneOrFail({id: input.type});
        filter.type = type;
      } catch(err) { throw new UserInputError(err) };
    }
    return await repo.find({ ...filter }, {
      populate,
      limit,
      offset,
    });
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createDraft(
    @Ctx() ctx: MyContext
  ): Promise<Draft> {
    let user: User;
    try {
      user = 
        await ctx.em.getRepository(User)
          .findOneOrFail({id: ctx.req.user});
    } catch (err) { throw new AuthenticationError(err) };
    if(!user.isWriter) 
      throw new ForbiddenError('User is not a writer');
    const draft = new Draft();
    draft.writer = user;
    await ctx.em.getRepository(Draft).persist(draft).flush();
    return draft;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteDraft(
    @Arg("id") id: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    let user: User;
    try {
      user = 
        await ctx.em.getRepository(User)
          .findOneOrFail({id: ctx.req.user});
    } catch(err) { throw new AuthenticationError(err) }
    const repo = ctx.em.getRepository(Draft);
    let draft;
    try {
      draft = await repo.findOneOrFail({id});
    } catch(err) { throw new UserInputError(err); }
    if(user!==draft.writer) 
      throw new ForbiddenError('User is not the writer of this post');
    await repo.remove(draft).flush();
    return true;
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async saveDraft(
    @Arg("id") id: string,
    @Arg("input") input: DraftMutationInput,
    @Ctx() ctx: MyContext
  ): Promise<Draft> {
    let user: User;
    try {
      user = 
        await ctx.em.getRepository(User)
          .findOneOrFail({id: ctx.req.user});
    } catch(err) { throw new AuthenticationError(err); }
    const repo = ctx.em.getRepository(Draft);
    let draft;
    try {
      draft = await repo.findOneOrFail({id});
    } catch (err) { throw new UserInputError(err) }
    if(user!==draft.writer) 
      throw new ForbiddenError('User is not the writer of the post');
    draft.title = input.title;
    draft.body = input.body;
    try {
      draft.type = 
        await ctx.em.getRepository(Type)
          .findOneOrFail({id: input.type})
    } catch(err) { throw new UserInputError(err) }
    try {
      await ctx.em.flush();
    } catch(err) { throw new UserInputError(err) }
    return draft;
  }
}