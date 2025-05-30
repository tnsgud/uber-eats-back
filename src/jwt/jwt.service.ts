import { Inject, Injectable } from '@nestjs/common'
import { JwtModuleOptions } from './jwt.interfaces'
import { CONFIG_OPTIONS } from './jwt.constants'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}

  sign(payload: object): string {
    return jwt.sign(payload, this.options.secretKey)
  }
  verify(token: string) {
    return jwt.verify(token, this.options.secretKey)
  }
}
