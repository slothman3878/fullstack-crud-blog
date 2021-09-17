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
import { Type } from './type.entity';
import { User } from './user.entity';
import { Base } from './base.entity';

@ObjectType()
@Entity()
export class Draft extends Base<Draft> {
  @Field()
  @Property({ length: 255 })
  @Unique()
  title: string = '';

  @Field()
  @Property({ columnType: 'text' })
  body: string = '';

  @Field(()=>Type, { nullable: true })
  @ManyToOne(()=>Type, { nullable: true })
  type: Type;

  @Field(()=>User)
  @ManyToOne(()=>User)
  writer: User;
}