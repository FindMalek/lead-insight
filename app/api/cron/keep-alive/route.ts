import { database } from "@/database/client"

export const GET = async () => {
  const newPage = await database.page.create({
    data: {
      name: "cron-temp",
    },
  })

  await database.page.delete({
    where: {
      id: newPage.id,
    },
  })

  return new Response("OK", { status: 200 })
}
