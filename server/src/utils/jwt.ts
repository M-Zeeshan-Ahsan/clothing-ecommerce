import jwt from "jsonwebtoken";

interface JwtUser {
  id: number;
  email: string;
}

export const generateAccessToken = (user: JwtUser): string => {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not defined");
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    secret,
    {
      expiresIn: "1d",
    },
  );
};

export const generateRefreshToken = (user: JwtUser): string => {
  const secret = process.env.JWT_REFRESH_SECRET;

  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is not defined");
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    secret,
    {
      expiresIn: "7d",
    },
  );
};
