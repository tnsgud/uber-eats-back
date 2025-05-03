import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from './entities/user.entity'
import { UserService } from './user.service'
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-account.dto'
import { LoginInput, LoginOutput } from './dto/login.dto'
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/auth/auth.guard'
import { AuthUser } from 'src/auth/auth-user.decorator'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => Boolean)
  hi() {
    return true
  }

  @Mutation(() => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      return this.userService.createAccount(createAccountInput)
    } catch (error) {
      return {
        ok: false,
        error,
      }
    }
  }

  @Mutation(() => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      return this.userService.login(loginInput)
    } catch (error) {
      console.log(error)
    }
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser) {
    return authUser
  }
}
