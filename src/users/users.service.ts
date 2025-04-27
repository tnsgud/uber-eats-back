import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { CreateAccountInput } from './dto/create-account.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
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
}
