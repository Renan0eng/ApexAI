import prisma from "@/lib/db";
import { createWhatsappClientSchema } from "@/lib/schema/whatsapp/client";
import { getServerSideSession } from "@/lib/session";
import axios from "axios";
import { QrCode } from "lucide-react";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSideSession();

  if (!session) {
    return NextResponse.json({}, { status: 401 });
  }

  const unsafeBody = await req.json();

  const body = createWhatsappClientSchema.safeParse(unsafeBody);

  if (body.success === false) {
    return NextResponse.json(
      {
        message: "Invalid Inputs",
      },
      { status: 400 }
    );
  }

  const whatsappConfig = await prisma.whatsappClient.update({
    data: {
      ai_config_id: body.data.configId,
      name: body.data.name,
    },
    where: {
      user_id: session.user.userId,
    },
  });

  return NextResponse.json({
    message: "Whatsapp Client Created",
    whatsappConfig,
  });
}

export async function GET(req: NextRequest) {
  const session = await getServerSideSession();

  if (!session) {
    return NextResponse.json({}, { status: 401 });
  }

  const whatsappConfig = await prisma.whatsappClient.findFirst({
    where: {
      user_id: session.user.userId,
    },
    include: {
      ai_config: true,
    },
  });

  return NextResponse.json({
    whatsappConfig,
  });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSideSession();

  console.log("session: ", session.user.userId);

  if (!session) {
    return NextResponse.json({}, { status: 401 });
  }

  const record = await prisma.whatsappClient.findUnique({
    where: {
      user_id: session.user.userId,
    },
  });
  if (!record) {
    throw new Error("Registro não encontrado");
  }

  const whatsappConfig = await prisma.whatsappClient.update({
    where: {
      id: record.id,
    },
    data: {
      ready: false,
      qrCode: null,
    },
  });

  const delet = await axios.post(
    "http://localhost:8000/whatsapp/deleteSession",
    {
      clientId: record.id,
    }
  );

  if (delet.data.message === "Client Disconnected") {
    return NextResponse.json({
      message: delet.data.message,
      whatsappConfig,
    });
  } else {
    return NextResponse.json({
      message: "Error Deleting Whatsapp Client",
    });
  }

  return NextResponse.json({
    message: "Whatsapp Client Deleted",
    whatsappConfig,
  });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSideSession();

  console.log("session: ", session.user.userId);

  if (!session) {
    return NextResponse.json({}, { status: 401 });
  }

  const record = await prisma.whatsappClient.findUnique({
    where: {
      user_id: session.user.userId,
    },
  });
  if (!record) {
    throw new Error("Registro não encontrado");
  }

  const body = await req.json();

  if (typeof body.active !== "boolean") {
    return NextResponse.json(
      {
        message: "Invalid Inputs",
      },
      { status: 400 }
    );
  }

  const whatsappConfig = await prisma.whatsappClient.update({
    where: {
      id: record.id,
    },
    data: {
      active: body.active,
    },
  });

  if (!body.active) {
    console.log("Disabling Whatsapp Client");

    const disable = await axios.post(
      "http://localhost:8000/whatsapp/disconnect",
      {
        clientId: record.id,
      }
    );

    if (disable.data.message === "Client Disconnected") {
      return NextResponse.json({
        message: disable.data.message,
        whatsappConfig,
      });
    } else {
      return NextResponse.json({
        message: "Error Disabling Whatsapp Client",
      });
    }
  }
  if (body.active) {
    console.log("Enabling Whatsapp Client");

    const enable = await axios.post("http://localhost:8000/whatsapp/connect", {
      clientId: record.id,
    });

    if (enable.data.message === "Client Connected") {
      return NextResponse.json({
        message: enable.data.message,
        whatsappConfig,
      });
    } else {
      return NextResponse.json({
        message: "Error Enabling Whatsapp Client",
      });
    }
  }

  return NextResponse.json({
    message: "Whatsapp Client Deleted",
    whatsappConfig,
  });
}
