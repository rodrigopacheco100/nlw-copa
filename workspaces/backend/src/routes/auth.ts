import { FastifyInstance } from "fastify";
import { z } from "zod";

import { googleApi } from "../lib/googleApi";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export const authRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/me", { onRequest: [authenticate] }, async (request) => {
    return { user: request.user };
  });

  fastify.post("/auth/google", async (request) => {
    const createUserBody = z.object({
      accessToken: z.string(),
    });

    const { accessToken } = createUserBody.parse(request.body);

    const { data } = await googleApi.get("/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(data);

    const userInfoSchema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      picture: z.string().url(),
    });

    const { id, email, name, picture } = userInfoSchema.parse(data);

    let user = await prisma.user.findUnique({
      where: {
        googleId: id,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          avatarUrl: picture,
          googleId: id,
        },
      });
    }

    const token = fastify.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      {
        sub: user.id,
        expiresIn: "7 days",
      }
    );

    return { token };
  });
};
