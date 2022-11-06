import { FastifyInstance } from "fastify";
import { z } from "zod";

import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export const guessRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/guesses/count", async () => {
    const count = await prisma.guess.count();

    return { count };
  });

  fastify.post(
    "/pools/:poolId/games/:gameId/guesses",
    { onRequest: [authenticate] },
    async (request, reply) => {
      const { gameId, poolId } = z
        .object({
          poolId: z.string(),
          gameId: z.string(),
        })
        .parse(request.params);

      const { firstTeamPoints, secondTeamPoints } = z
        .object({
          firstTeamPoints: z.number(),
          secondTeamPoints: z.number(),
        })
        .parse(request.body);

      const game = await prisma.game.findUnique({
        where: {
          id: gameId,
        },
      });

      if (!game) {
        return reply.status(400).send({
          message: "Game not found",
        });
      }

      if (game.date < new Date()) {
        return reply.status(400).send({
          message: "You cannot send a guess after the game started",
        });
      }

      const participant = await prisma.participant.findUnique({
        where: {
          userId_poolId: {
            poolId,
            userId: request.user.sub,
          },
        },
      });

      if (!participant) {
        return reply.status(400).send({
          message: "You are not allowed to create a guess inside this pool",
        });
      }

      const guess = await prisma.guess.findUnique({
        where: {
          participantId_gameId: {
            participantId: participant.id,
            gameId,
          },
        },
      });

      if (guess) {
        return reply.status(400).send({
          message: "You already have a guess on this pool",
        });
      }

      await prisma.guess.create({
        data: {
          gameId,
          participantId: participant.id,
          firstTeamPoints,
          secondTeamPoints,
        },
      });

      return reply.status(201).send();
    }
  );
};