import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { ObjectType, Field } from "type-graphql";
import { Post } from "./post.entity";
import { Base } from './base.entity';

// Create a BaseEntity with a @PrimaryKey as a number
@ObjectType()
@Entity()
export class Type extends Base<Type> {
  @Field()
  @Property({ length: 20 })
  @Unique()
  name: string;

  @Field()
  @Property({ length: 255, nullable: true })
  desc: string;

  @Field(()=>[Post])
  @OneToMany(()=>Post, (p: Post) => p.type,  { cascade: [Cascade.ALL] })
  posts: Collection<Post> = new Collection<Post>(this);

  @Field(()=>[SubType])
  @OneToMany(()=>SubType, (st: SubType)=>st.suptype, { cascade: [Cascade.ALL] })
  subtypes: Collection<SubType> = new Collection<SubType>(this);
}

@ObjectType()
@Entity()
export class SubType extends Base<SubType> {
  @Field()
  @Property({ length: 20 })
  @Unique()
  name: string;

  @Field()
  @Property({ length: 255, nullable: true })
  desc: string;

  @Field(()=>[Post])
  @OneToMany(()=>Post, (p: Post) => p.subtype,  { cascade: [Cascade.ALL] })
  posts: Collection<Post> = new Collection<Post>(this);

  @Field(()=>Type)
  @ManyToOne(()=>Type)
  suptype: Type;
}