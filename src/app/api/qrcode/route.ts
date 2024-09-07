import prisma from "@/lib/db";
import { getServerSideSession } from "@/lib/session";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSideSession();

  if (!session) {
    return NextResponse.json({
    }, { status: 401 });
  }

  let whatsappClient = await prisma.whatsappClient.findFirst({
    where: {
      user_id: session.user.userId,
    },
  });

  if (!whatsappClient) {
    whatsappClient = await prisma.whatsappClient.create({
      data: {
        user_id: session.user.userId,
      },
    });
  } else if (whatsappClient.qrCode) {
    return NextResponse.json({
      qrCode: whatsappClient.qrCode,
      ready: whatsappClient.ready,
    });
  }

  const res = await axios.post("http://localhost:8000/whatsapp/qrcode", {
    clientId: whatsappClient.id,
  });

  if (res.data.message === "QrCode Generated") {
    return NextResponse.json({
      message: "Generating QrCode",
    });
  } else {
    return NextResponse.json({
      message: "Error generating QrCode",
    });
  }
}
