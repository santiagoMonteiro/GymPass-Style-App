import { FastifyReply, FastifyRequest } from 'fastify'

export async function Profile(request: FastifyRequest, reply: FastifyReply) {
  return reply.status(200).send()
}
