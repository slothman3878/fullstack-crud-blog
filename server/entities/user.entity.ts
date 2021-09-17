import {
  Entity,
  Property,
  Unique,
  OneToMany,
  Collection,
  Cascade,
} from '@mikro-orm/core';
import { ObjectType, Field } from "type-graphql";
import { Base, BaseType } from './base.entity';
import { Post } from './post.entity';
import { Draft } from './draft.entity';

class UserConstructor {
  email: string;
  isWriter?: boolean;
}

export type UserType = BaseType & {
  email: string,
  isAdmin: boolean,
  isWriter: boolean,
}

@ObjectType()
@Entity()
export class User extends Base<User> {
  @Field()
  @Property({nullable: true})
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

  @Field(()=>[Draft])
  @OneToMany(()=>Draft, (d: Draft) => d.writer, { cascade: [Cascade.ALL] })
  drafts: Collection<Draft> = new Collection<Draft>(this);

  constructor(input: UserConstructor) {
    super();
    this.email = input.email;
    this.isWriter = input.isWriter ?? false;
  }  
}