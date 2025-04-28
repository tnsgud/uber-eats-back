import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-account.dto'
import { LoginInput, LoginOutput } from './dto/login.dto'
import { JwtService } from 'src/jwt/jwt.service'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    const output: CreateAccountOutput = {
      ok: false,
    }
    try {
      // check exists email
      const exists = await this.users.findOne({ where: { email } })

      if (exists) {
        output.error = 'There is a user with that email already'
        return output
      }

      // create `user` data and save
      await this.users.save(this.users.create({ email, password, role }))

      output.ok = true
      return output
    } catch (error) {
      console.log(error)
      output.error = error
      return output
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

      // create token
      const token = this.jwtService.sign({ id: user.id })

      // change output data for success
      output.ok = true
      output.token = token

      return output
    } catch (error) {
      console.log(error)
      output.error = error
      return output
    }
  }
}
