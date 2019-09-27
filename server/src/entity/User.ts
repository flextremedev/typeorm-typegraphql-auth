import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
// explicit table name in brackets
@ObjectType()
@Entity("users")
export class User extends BaseEntity {
    // can infer string but not number
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    email: string;
    // don't expose password
    @Column()
    password: string;
}
