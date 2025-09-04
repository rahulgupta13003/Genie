import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const projectData = [
  {
    name: "Demo Project",
    messages: {
      create: [
        {
          content: "Seed message: welcome",
          role: "USER",
          type: "RESULT",
        },
      ],
    },
  },
];

export async function main() {
  for (const p of projectData) {
    await prisma.project.create({ data: p as any });
  }
  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });