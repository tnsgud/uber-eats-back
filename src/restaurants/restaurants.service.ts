import { Injectable } from '@nestjs/common'
import { Restaurant } from './entities/restaurant.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateRestaurantDto } from './dto/create-restaurant.dto'
import { UpdateRestaurantDto } from './dto/update-restaurant.dto'

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}

  getAll(): Promise<Restaurant[]> {
    return this.restaurants.find()
  }

  createRestaurant(createRestaurantDto: CreateRestaurantDto) {
    const newRestaurant = this.restaurants.create(createRestaurantDto)

    return this.restaurants.save(newRestaurant)
  }

  updateRestaurant({ id, data }: UpdateRestaurantDto) {
    return this.restaurants.update(id, { ...data })
  }
}
