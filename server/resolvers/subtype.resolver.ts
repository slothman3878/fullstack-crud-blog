import {
  Arg,
  Ctx,
  Resolver,
  Query,
  InputType,
  Field,
  Mutation
} from "type-graphql";
import { SubType, Type } from "../entities/type.entity";
import { Post } from "../entities/post.entity";
import { MyContext } from "../types";

@Resolver(()=>SubType)
export class SubTypeResolver {
  
}