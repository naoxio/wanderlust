import Fastify from 'fastify';
import cors from '@fastify/cors';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: 'https://traveltint.me',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});


fastify.get('/country-statuses', async () => {
  const countryStatuses = await prisma.countryStatus.findMany();
  return countryStatuses;
});

fastify.post<{ Body: { iso_a2: string; status: string } }>('/country-status', async (request, reply) => {
  const { iso_a2, status } = request.body;
  await prisma.countryStatus.upsert({
    where: { iso_a2 },
    update: { status },
    create: { iso_a2, status },
  });
  reply.send({ message: 'Country status updated' });
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();