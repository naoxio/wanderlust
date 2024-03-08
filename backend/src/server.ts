import Fastify from 'fastify';
import dbConnector from './database';

const fastify = Fastify({ logger: true });

fastify.register(dbConnector);

fastify.post<{ Params: { id: string } }>('/api/countries/:id/been', async (request, reply) => {
  const countryId = request.params.id;
  await fastify.sqlite.run('UPDATE countries SET status = "been" WHERE id = ?', [countryId]);
  return { message: 'Country marked as been' };
});

fastify.post<{ Params: { id: string } }>('/api/countries/:id/lived', async (request, reply) => {
  const countryId = request.params.id;
  await fastify.sqlite.run('UPDATE countries SET status = "lived" WHERE id = ?', [countryId]);
  return { message: 'Country marked as lived' };
});

fastify.post<{ Params: { id: string } }>('/api/countries/:id/want', async (request, reply) => {
  const countryId = request.params.id;
  await fastify.sqlite.run('UPDATE countries SET status = "want" WHERE id = ?', [countryId]);
  return { message: 'Country marked as want' };
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