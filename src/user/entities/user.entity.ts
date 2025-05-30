import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql'
import { CoreEntity } from 'src/common/entities/core.entity'
import { Column, Entity, BeforeInsert, BeforeUpdate } from 'typeorm'
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
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException()
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(password, this.password)
      return ok
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException()
    }
  }
}
