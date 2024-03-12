import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const fastify = Fastify({ logger: true });

fastify.register(cors);

fastify.get('/api/country-status', async () => {
  const countryStatuses = await prisma.countryStatus.findMany();
  return countryStatuses;
});

fastify.post<{ Body: { iso_a2: string; status: string } }>('/api/country-status', async (request, reply) => {
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
    await fastify.listen(3000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();