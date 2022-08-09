import jwt from "jsonwebtoken";

export const verifyToken = (token: string | null) => {
  try {
    if (token) {
      const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);

      const userId = decodedToken?.issuer;
      return userId;
    }
    return null;
  } catch (error: any) {
    console.error(error.message);
  }
};
