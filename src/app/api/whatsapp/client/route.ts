import prisma from "@/lib/db";
import { createWhatsappClientSchema } from "@/lib/schema/whatsapp/client";
import { getServerSideSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSideSession();

  if (!session) {
    return NextResponse.json({
    }, { status: 401 });
  }

  const unsafeBody = await req.json();

  const body = createWhatsappClientSchema.safeParse(unsafeBody);

  if (body.success === false) {
    return NextResponse.json({
      message: "Invalid Inputs"
    }, { status: 400 })
  }

  const whatsappConfig = await prisma.whatsappClient.update({
    data: {
      ai_config_id: body.data.configId,
      name: body.data.name,
    },
    where: {
      user_id: session.user.userId,
    }
  })

  return NextResponse.json({
    message: "Whatsapp Client Created",
    whatsappConfig
  })
}

export async function GET(req: NextRequest) {
  const session = await getServerSideSession();

  if (!session) {
    return NextResponse.json({
    }, { status: 401 });
  }

  const whatsappConfig = await prisma.whatsappClient.findFirst({
    where: {
      user_id: session.user.userId,
    },
    include: {
      ai_config: true,
    }
  })

  return NextResponse.json({
    whatsappConfig
  })
}