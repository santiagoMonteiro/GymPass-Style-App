import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-get-user-check-ins-history-use-cases'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInHistoryQuerySchema.parse(request.query)

  const getCheckInsHistoryUseCase = makeGetUserCheckInsHistoryUseCase()

  const { checkIns } = await getCheckInsHistoryUseCase.execute({
    userId: request.user.sub,
    page,
  })

  return reply.status(200).send({
    checkIns,
  })
}
