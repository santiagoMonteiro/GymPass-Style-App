import { GymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'

interface GetNearbyGymsUseCaseRequest {
  userLatitude: number
  userLongitude: number
}

interface GetNearbyGymsUseCaseResponse {
  gyms: Gym[]
}

export class GetNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: GetNearbyGymsUseCaseRequest): Promise<GetNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      userLatitude,
      userLongitude,
    })

    return { gyms }
  }
}
