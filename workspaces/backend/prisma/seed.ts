import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "johndoe@example.com",
      avatarUrl: "https://github.com/rodrigopacheco100.png",
    },
  });

  await prisma.pool.create({
    data: {
      title: "Example Pool",
      code: "BOL123",
      ownerId: user.id,
      participants: {
        create: {
          userId: user.id,
          guesses: {
            create: {
              firstTeamPoints: 1,
              secondTeamPoints: 2,
              game: {
                create: {
                  firstTeamCountryCode: "US",
                  secondTeamCountryCode: "CA",
                  date: "2022-11-03T00:31:05.154Z",
                },
              },
            },
          },
        },
      },
    },
  });

  await prisma.pool.create({
    data: {
      title: "Example Pool2",
      code: "BOL124",
      ownerId: user.id,
      participants: {
        create: {
          userId: user.id,
          guesses: {
            create: {
              firstTeamPoints: 3,
              secondTeamPoints: 1,
              game: {
                create: {
                  firstTeamCountryCode: "BR",
                  secondTeamCountryCode: "DE",
                  date: "2022-11-03T00:31:05.154Z",
                },
              },
            },
          },
        },
      },
    },
  });
}

main();
