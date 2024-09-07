import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import { NextResponse } from "next/server";
import { LuciaError } from "lucia";

import type { NextRequest } from "next/server";
import { loginSchema } from "@/lib/validations/user";
import { redirect } from "next/navigation";
import { isRedirectError } from "@/lib/utils";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const body = Object.fromEntries(formData.entries());

  const validatedLoginInput = loginSchema.safeParse(body);

  if (!validatedLoginInput.success) {
    return NextResponse.json(
      {
        field: validatedLoginInput.error.issues[0].path[0],
        message: validatedLoginInput.error.issues[0].message,
      },
      {
        status: 400,
      }
    );
  }

  let key;
  let session;

  try {
    key = await auth.useKey(
      "username",
      validatedLoginInput.data.username.toLowerCase(),
      validatedLoginInput.data.password
    );

    session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    });
  } catch (e) {
    if (isRedirectError(e)) throw e;
    if (
      e instanceof LuciaError &&
      (e.message === "AUTH_INVALID_KEY_ID" ||
        e.message === "AUTH_INVALID_PASSWORD")
    ) {
      return NextResponse.json(
        {
          field: "login",
          message: "Usuário ou senha inválidos",
        },
        {
          status: 400,
        }
      );
    }
    return NextResponse.json(
      {
        error: "An unknown error occurred",
      },
      {
        status: 500,
      }
    );
  }

  const authRequest = auth.handleRequest(request.method, context);
  authRequest.setSession(session);

  return NextResponse.json({
    status: 200,
  });

  // redirect("/");
}
