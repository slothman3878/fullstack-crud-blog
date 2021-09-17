import {
  Entity,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { 
  ObjectType, 
  Field 
} from "type-graphql";
import { Draft } from './draft.entity';
import { Type } from './type.entity';
import { User } from './user.entity';
import { Base } from './base.entity';

@ObjectType()
@Entity()
export class Post extends Base<Post> {
  @Field()
  @Property({ length: 255 })
  @Unique()
  title: string;

  @Field()
  @Property({ length: 50 })
  @Unique()
  slug: string;

  @Field()
  @Property({ columnType: 'text', nullable: true })
  body: string;

  @Field()
  @Property({ columnType: 'bigint', unsigned: true })
  views: number = 0;

  @Field(()=>Type)
  @ManyToOne(()=>Type)
  type: Type;

  @Field(()=>User)
  @ManyToOne(()=>User)
  writer: User;

  constructor (draft: Draft) {
    super();
    this.title = draft.title;
    this.body = draft.body;
    this.type = draft.type;
    this.writer = draft.writer;
  }
}