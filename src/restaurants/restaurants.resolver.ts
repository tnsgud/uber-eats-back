import { Query, Args, Resolver, Mutation } from '@nestjs/graphql'
import { Restaurant } from './entities/restaurant.entity'
import { CreateRestaurantDto } from './dto/create-restaurant.dto'

@Resolver(() => Restaurant)
export class RestaurantResolver {
  @Query(() => Restaurant)
  restaurants(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
    if (veganOnly) {
      return []
    }
    return []
  }

  @Mutation(() => Boolean)
  createRestaurant(@Args() createRestaurantDto: CreateRestaurantDto): boolean {
    console.log(createRestaurantDto)
    return true
  }
}
