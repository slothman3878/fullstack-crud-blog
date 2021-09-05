import {
  Entity,
  Property,
  Unique,
  OneToMany,
  Collection,
  Cascade,
} from '@mikro-orm/core';
import { ObjectType, Field } from "type-graphql";
import { Base } from './base.entity';
import { Post } from './post.entity';

class UserConstructor {
  email: string;
  isWriter?: boolean;
}

@ObjectType()
@Entity()
export class User extends Base<User> {
  @Field()
  @Property()
  @Unique()
  email: string;

  @Field()
  @Property()
  isAdmin: boolean = false;

  @Field()
  @Property()
  isWriter: boolean;

  @Field(()=>[Post])
  @OneToMany(()=>Post, (p: Post) => p.writer,  { cascade: [Cascade.ALL] })
  posts: Collection<Post> = new Collection<Post>(this);

  constructor(input: UserConstructor) {
    super();
    this.email = input.email;
    this.isWriter = input.isWriter ?? false;
  }  
}