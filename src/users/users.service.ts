import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-account.dto'
import { LoginInput, LoginOutput } from './dto/login.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exists = await this.users.findOne({ where: { email } })

      if (exists)
        return { ok: false, error: 'There is a user with that email already' }

      await this.users.save(this.users.create({ email, password, role }))
      return { ok: true }
    } catch (error) {
      console.log(error)
      return { ok: false, error: `Couldn't create account ${error}` }
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    // create output object
    const output: LoginOutput = {
      ok: false,
    }

    try {
      // find user with email
      const user = await this.users.findOne({ where: { email } })

      if (!user) {
        output.error = 'User not found'
        return output
      }

      // check user password
      const passwordCorrect = await user.checkPassword(password)

      if (!passwordCorrect) {
        output.error = 'Wrong password'
        return output
      }

      // change `ok` to true
      // add `token` value
      output.ok = true
      output.token = 'lalalalala'

      return output
    } catch (error) {
      console.log(error)
      output.error = error
      return output
    }
  }
}
