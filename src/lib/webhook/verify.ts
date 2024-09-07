import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { WebhookResponse } from "../types/response";

export async function verifyWebhook(req: NextRequest) {
  const signatureHeader = req.headers.get("x-signature");

  if (!signatureHeader) {
    throw new Error("No signature header provided");
  }

  const valid = await bcrypt.compare(
    process.env.SECRET_WEBHOOK_KEY ?? "",
    signatureHeader
  );

  const body: WebhookResponse = await req.json();

  return { valid, body };
}
