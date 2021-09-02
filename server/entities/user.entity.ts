import {
  Entity,
  Property,
  Unique,
} from '@mikro-orm/core';
import { ObjectType, Field } from "type-graphql";
import { Base } from './base.entity';

@ObjectType()
@Entity()
export class User extends Base<User> {
  @Property()
  isAdmin: boolean = true;

  @Property()
  isWriter: boolean = true;
}