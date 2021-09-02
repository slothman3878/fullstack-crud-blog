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
import { Post } from "../entities/post.entity";
import { Type } from "../entities/type.entity";
import { User } from "../entities/user.entity";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";

@ObjectType()
export class Posts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@InputType()
class PostMutationInput {
  @Field()
  title: string;
  @Field()
  slug: string;
  @Field({ nullable: true })
  body: string;
  @Field()
  type: string;
  @Field({ nullable: true })
  published?: boolean;
}

// Input for single post query
// Unique properties only
@InputType()
class PostQueryInput {
  @Field({ nullable: true })
  id?: string;
  @Field({ nullable: true })
  slug?: string;
  @Field({ nullable: true })
  title?: string;
}

// Input for multiple post query
// Non-Unique properties only
@InputType()
class PostsQueryInput {
  @Field({ nullable: true })
  type?: string;
  @Field({ nullable: true })
  published?: boolean;
}

// use middlware to add authentication
@Resolver(()=>Post)
export class PostResolver {
  @Query(() => Post, { nullable: true })
  async post(
    @Arg('input') input: PostQueryInput,
    @Ctx() ctx: MyContext
  ): Promise<Post|null> {
    const repo = ctx.em.getRepository(Post);
    return await repo.findOne({ ...input }, {
      populate: ['type.posts']
    });
  }

  @Query(() => [Post], { nullable: true })
  async posts(
    @Arg('input') input: PostsQueryInput,
    @Arg('limit', { defaultValue: 10 }) limit: number,
    @Arg('offset', { defaultValue: 0 }) offset: number,
    @Ctx() ctx: MyContext
  ): Promise<Post[]|null> {
    const repo = ctx.em.getRepository(Post);
    if(input.type) {
      let type: Type;
      type = await ctx.em.findOneOrFail(Type, { name: input.type });
      delete input.type;
      return await repo.find({ ...input, type },{
        populate: ['type.posts'],
        limit,
        offset
      })
    } else {
      return await repo.find({ ...input }, {
        populate: ['type.posts'],
        limit,
        offset
      });
    }
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostMutationInput,
    @Ctx() ctx: MyContext
  ): Promise<Post|null> {
    const user = await ctx.em.findOneOrFail(User, {id: ctx.req.session.userId});
    if(!user.isAdmin) return null;
    const { type, ...inputExPost } = input;
    const post = new Post({
      ...inputExPost,
      type: await ctx.em.getRepository(Type).findOneOrFail({name: type})
    });
    ctx.em.persist(post);
    await ctx.em.flush();
    return post;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id") id: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const user = await ctx.em.findOneOrFail(User, {id: ctx.req.session.userId});
    if(!user.isAdmin) return false;
    const repo = ctx.em.getRepository(Post);
    const post = await repo.findOneOrFail({id});
    await repo.remove(post).flush();
    return true;
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id") id: string,
    @Ctx() ctx: MyContext
  ): Promise<Post|null> {
    const user = await ctx.em.findOneOrFail(User, {id: ctx.req.session.userId});
    if(!user.isAdmin) return null;
    return null;
  }
}