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
import { UserProfileInput, userProfileOutput } from './dto/user-profile.dto'
import { EditProfileInput, EditProfileOutput } from './dto/edit-profile.dto'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

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

  @Query(() => userProfileOutput)
  @UseGuards(AuthGuard)
  async userProfile(
    @Args() UserProfileInput: UserProfileInput,
  ): Promise<userProfileOutput> {
    const output: userProfileOutput = {
      ok: false,
    }
    try {
      const user = await this.userService.findById(UserProfileInput.userId)

      if (!user) throw Error()

      output.ok = true
      output.user = user
    } catch (error) {
      output.error = error
    }

    return output
  }

  @UseGuards(AuthGuard)
  @Mutation(() => EditProfileOutput)
  async editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    const output: EditProfileOutput = { ok: false }
    try {
      await this.userService.editProfile(authUser.id, editProfileInput)

      output.ok = true
    } catch (error) {
      output.error = error
    }

    return output
  }
}
