import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
import { randomUUID } from 'crypto'
import { getDistanceBetweenTwoCoordinates } from '@/utils/get-distance-between-two-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
  private items: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    }

    this.items.push(gym)

    return gym
  }

  async findById(gymId: string) {
    const gym = this.items.find((item) => item.id === gymId)

    if (!gym) {
      return null
    }

    return gym
  }

  async searchMany(query: string, page: number) {
    const filteredGyms = this.items
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20)

    return filteredGyms
  }

  async findManyNearby(params: FindManyNearbyParams) {
    const MAX_DISTANCE_RADIUS_TO_NEARBY_GYMS_IN_KILOMETERS = 10

    return this.items.filter((gym) => {
      const distance = getDistanceBetweenTwoCoordinates(
        { latitude: params.userLatitude, longitude: params.userLongitude },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      )

      return distance < MAX_DISTANCE_RADIUS_TO_NEARBY_GYMS_IN_KILOMETERS
    })
  }
}
