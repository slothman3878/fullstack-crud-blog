import {
  Entity,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { ObjectType, Field, InputType } from "type-graphql";
import { Type, SubType } from './type.entity';
import { Base } from './base.entity';

class PostConstructor {
  title: string;
  slug: string;
  body: string;
  type: Type;
  subtype?: SubType;
  published?: boolean;
}

@ObjectType()
@Entity()
export class Post extends Base<Post> {
  @Field()
  @Property({ length: 255 })
  @Unique()
  title!: string;

  @Field()
  @Property({ length: 50 })
  @Unique()
  slug!: string;

  @Field()
  @Property({ columnType: 'text', nullable: true })
  body?: string;

  @Field()
  @Property()
  published: boolean;

  @Field()
  @Property({ columnType: 'bigint' })
  views: number = 0;

  @Field(()=>Type)
  @ManyToOne(()=>Type)
  type!: Type;

  @Field(()=>SubType)
  @ManyToOne(()=>SubType, { nullable: true })
  subtype: SubType;

  constructor(input: PostConstructor) {
    super();
    this.title = input.title;
    this.slug = input.slug;
    this.body = input.body;
    this.type = input.type;
    if(input.subtype) this.subtype = input.subtype;
    if(input.published) this.published = true;
  }
}