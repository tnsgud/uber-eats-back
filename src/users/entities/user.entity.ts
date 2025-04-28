import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql'
import { CoreEntity } from 'src/common/entities/core.entity'
import { Column, Entity, BeforeInsert } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { InternalServerErrorException } from '@nestjs/common'
import { IsEmail, IsEnum } from 'class-validator'

enum UserRole {
  Client,
  Owner,
  Delivery,
}

registerEnumType(UserRole, { name: 'UserRole' })

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field(() => String)
  @IsEmail()
  email: string

  @Column()
  @Field(() => String)
  password: string

  @Column()
  @Field(() => UserRole)
  @IsEnum(UserRole)
  role: UserRole

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException()
    }
  }
}
