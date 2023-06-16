import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CheckInUseCase } from './check-in'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'JavaScript academy',
      description: '',
      phone: '',
      latitude: new Decimal(-3.094161),
      longitude: new Decimal(-60.0143956),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check-in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -3.094161,
      userLongitude: -60.0143956,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check-in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 5, 15, 8))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -3.094161,
      userLongitude: -60.0143956,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -3.094161,
        userLongitude: -60.0143956,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to check-in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 5, 15, 8))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -3.094161,
      userLongitude: -60.0143956,
    })

    vi.setSystemTime(new Date(2023, 5, 16, 8))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -3.094161,
      userLongitude: -60.0143956,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be not able to check-in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript academy',
      description: '',
      phone: '',
      latitude: new Decimal(-3.0771483),
      longitude: new Decimal(-60.014975),
    })

    await expect(
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -3.094161,
        userLongitude: -60.0143956,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
