import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-account.dto'

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => Boolean)
  hi() {
    return true
  }

  @Mutation(() => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      const error = await this.usersService.createAccount(createAccountInput)

      if (error) {
        return {
          ok: false,
          error,
        }
      }
      return {
        ok: true,
      }
    } catch (error) {
      return {
        ok: false,
        error,
      }
    }
  }
}
