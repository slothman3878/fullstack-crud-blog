import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { 
  ObjectType, 
  Field,
} from "type-graphql";
import {
  Length,
} from 'class-validator';
import { Post } from "./post.entity";
import { Base } from './base.entity';
import { Draft } from './draft.entity';

// Create a BaseEntity with a @PrimaryKey as a number
@ObjectType()
@Entity()
export class Type extends Base<Type> {
  @Field()
  @Property({ length: 20 })
  @Unique()
  name: string;

  @Field({ nullable: true })
  @Property({ length: 255, nullable: true })
  desc?: string;

  @Field(()=>[Post])
  @OneToMany(()=>Post, (p: Post) => p.type,  { cascade: [Cascade.ALL] })
  posts: Collection<Post> = new Collection<Post>(this);

  @Field(()=>[Draft])
  @OneToMany(()=>Draft, (d: Draft) => d.type, { cascade: [Cascade.ALL] })
  drafts: Collection<Draft> = new Collection<Draft>(this);

  @Field()
  @Property()
  isRoot: boolean = false;

  @Field(()=>Type, { nullable: true })
  @ManyToOne(()=>Type, { nullable: true })
  suptype?: Type;

  @Field(()=>[Type])
  @OneToMany(()=>Type, (st: Type)=>st.suptype, { cascade: [Cascade.ALL] })
  subtypes: Collection<Type> = new Collection<Type>(this);
}