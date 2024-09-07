import prisma from "@/lib/db";
import { WhatsappClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const activeClients = await prisma.whatsappClient.findMany({
    where: {
      active: true,
    },
  });

  return NextResponse.json(
    activeClients.map((client: WhatsappClient) => client.id)
  );
}
