import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { GetNearbyGymsUseCase } from './get-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: GetNearbyGymsUseCase

describe('Get Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new GetNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to Get nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -3.094161,
      longitude: -60.0143956,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -2.9935374,
      longitude: -60.0135438,
    })

    const { gyms } = await sut.execute({
      userLatitude: -3.094161,
      userLongitude: -60.0143956,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
