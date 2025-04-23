import { Query, Args, Resolver, Mutation } from '@nestjs/graphql'
import { Restaurant } from './entities/restaurant.entity'
import { CreateRestaurantDto } from './dto/create-restaurant.dto'
import { RestaurantService } from './restaurants.service'

@Resolver(() => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Query(() => Restaurant)
  restaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getAll()
  }

  @Mutation(() => Boolean)
  createRestaurant(@Args() createRestaurantDto: CreateRestaurantDto): boolean {
    console.log(createRestaurantDto)
    return true
  }
}
