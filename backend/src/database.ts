import { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import fastifySqlite from 'fastify-sqlite';

interface Country {
  id: number;
  name: string;
  status: string;
}

const dbConnector: FastifyPluginAsync = async (fastify, options) => {
  fastify.register(fastifySqlite, {
    dbFile: 'countries.db',
    promise: true,
  });

  fastify.get('/countries', async (request, reply) => {
    const countries: Country[] = await fastify.sqlite.all('SELECT * FROM countries');
    return countries;
  });
};

export default fastifyPlugin(dbConnector);