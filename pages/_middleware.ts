import { NextResponse, NextMiddleware } from "next/server";
import { verifyToken } from "../lib/utils";

export const middleware: NextMiddleware = async (req, ev) => {
  const token = req ? req.cookies?.token : null;
  const userId = await verifyToken(token);
  const { pathname } = req.nextUrl;

  if (userId && pathname == "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  } else if (
    pathname.includes("/api/login") ||
    userId ||
    pathname.includes("/static")
  ) {
    return NextResponse.next();
  } else if ((!token || !userId) && pathname !== "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
};
