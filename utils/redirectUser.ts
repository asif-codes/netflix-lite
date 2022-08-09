import type { GetServerSidePropsContext } from "next";
import { verifyToken } from "../lib/utils";

export const redirectUser = async (context: GetServerSidePropsContext) => {
  const token = context.req ? context.req?.cookies.token : null;
  const userId = (await verifyToken(token)) as string;

  return {
    userId,
    token,
  };
};
