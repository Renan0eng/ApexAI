import { getServerSideSession } from "@/lib/session";
import { createManyProdutos, getProdutoByGrupOrName } from "@/model/produto";
import { NextRequest, NextResponse } from "next/server";

type RequestBody = {
  name: string;
  link: string;
  price: number;
  group: string[];
  description: string;
};

export const POST = async (request: Request) => {
  const body = (await request.json()) as RequestBody[];

  console.log("body", body);

  // const user = await getServerSideSession();

  const ret = await createManyProdutos(
    body.map((item) => ({
      ...item,
      user_id: "qcyyu2asftqewt7",
      group: item.group.map((item) => ({ name: item })),
    }))
  );

  console.log("ret", ret);

  return NextResponse.json(ret);
};

// export const GET = async (request: NextRequest) => {
//   // const user = await getServerSideSession();

//   // if (!user.user) return NextResponse.json({ ret: "not found" });

//   // const produtos = await getProdutoByGrupOrName("sup va", undefined);

//   // return NextResponse.json({ ret: produtos });
// };
