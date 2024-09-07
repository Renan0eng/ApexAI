import { getServerSideSession } from "@/lib/session";
import { getAllAiConfigs } from "@/model/ai-config";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const user = await getServerSideSession();

  if (!user?.user) return NextResponse.json({ ret: "not found" });

  const ret = await getAllAiConfigs(user?.user.userId);

  return NextResponse.json(ret);
};
