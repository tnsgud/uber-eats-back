import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-account.dto'
import { LoginInput, LoginOutput } from './dto/login.dto'

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
      const { ok, error } =
        await this.usersService.createAccount(createAccountInput)

      return {
        ok,
        error,
      }
    } catch (error) {
      return {
        ok: false,
        error,
      }
    }
  }

  @Mutation(() => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    console.log(loginInput)

    return {
      ok: true,
      token: 'test-token',
    }
  }
}
