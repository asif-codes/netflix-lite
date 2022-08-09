// import jwt from "jsonwebtoken";

// export const verifyToken = (token: string | null) => {
//   try {
//     if (token) {
//       const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);

//       const userId = decodedToken?.issuer;
//       return userId;
//     }
//     return null;
//   } catch (error: any) {
//     console.error(error.message);
//   }
// };

import { jwtVerify } from "jose";

export const verifyToken = async (token: string | null) => {
  try {
    if (token) {
      const verified = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      return verified.payload && verified.payload?.issuer;
    }
    return null;
  } catch (err) {
    console.error({ err });
    return null;
  }
};
