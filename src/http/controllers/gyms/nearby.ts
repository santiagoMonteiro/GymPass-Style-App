import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetNearbyGymsUseCase } from '@/use-cases/factories/make-get-nearby-gyms-use-case'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.body)

  const getNearbyGymsUseCase = makeGetNearbyGymsUseCase()

  const { gyms } = await getNearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({
    gyms,
  })
}
