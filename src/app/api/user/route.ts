import { getServerSideSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const user = await getServerSideSession();

  if (!user || !user.user) {
    return NextResponse.json({ ret: "not found" }, { status: 401 });
  }

  return NextResponse.json(user.user);
};
