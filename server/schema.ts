import 'reflect-metadata';
import { buildSchema } from 'type-graphql';

import { HelloResolver } from "./resolvers/hello.resolver";
import { PostResolver } from "./resolvers/post.resolver";
import { TypeResolver } from "./resolvers/type.resolver";
import { UserResolver } from "./resolvers/user.resolver";
import { DraftResolver } from './resolvers/draft.resolver';

export default class GenerateSchema {
  public init=async()=>{
    return await buildSchema({
      resolvers: [
        HelloResolver,
        PostResolver,
        TypeResolver,
        UserResolver,
        DraftResolver,
      ],
    })
  }
}