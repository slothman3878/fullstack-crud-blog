import {
  Entity,
  Property,
  Unique,
} from '@mikro-orm/core';
import { ObjectType, Field } from "type-graphql";
import { Base } from './base.entity';

class UserConstructor {
  username: string;
  password: string;
  isWriter?: boolean;
}

@ObjectType()
@Entity()
export class User extends Base<User> {
  @Field()
  @Property()
  @Unique()
  username: string;

  @Field()
  @Property()
  password: string;

  @Field()
  @Property()
  isAdmin: boolean = false;

  @Field()
  @Property()
  isWriter: boolean;

  constructor(input: UserConstructor) {
    super();
    this.username = input.username;
    this.password = input.password;
    this.isWriter = input.isWriter ?? false;
  }  
}