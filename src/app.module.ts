import { Module } from '@nestjs/common'
import * as Joi from 'joi'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { RestaurantsModule } from './restaurants/restaurants.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { Restaurant } from './restaurants/entities/restaurant.entity'
import { UsersModule } from './users/users.module'
import { CommonModule } from './common/common.module'
import { User } from './users/entities/user.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        SECRET_KEY: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      // just for develop
      playground: {
        settings: {
          'request.credentials': 'same-origin',
        },
      },
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      synchronize: process.env.NODE_ENV !== 'prod',
      logging: true,
      entities: [User],
    }),
    UsersModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
