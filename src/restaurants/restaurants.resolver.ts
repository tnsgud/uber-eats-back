import { Query, Args, Resolver, Mutation } from '@nestjs/graphql'
import { Restaurant } from './entities/restaurant.entity'
import { CreateRestaurantDto } from './dto/create-restaurant.dto'
import { RestaurantService } from './restaurants.service'
import { UpdateRestaurantDto } from './dto/update-restaurant.dto'

@Resolver(() => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Query(() => Restaurant)
  restaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getAll()
  }

  @Mutation(() => Boolean)
  async createRestaurant(
    @Args('input') createRestaurantDto: CreateRestaurantDto,
  ): Promise<boolean> {
    try {
      await this.restaurantService.createRestaurant(createRestaurantDto)
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  @Mutation(() => Boolean)
  async updateRestaurant(
    @Args('input') updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<boolean> {
    try {
      await this.restaurantService.updateRestaurant(updateRestaurantDto)
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}
