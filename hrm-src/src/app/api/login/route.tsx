import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY is not defined in environment variables.");
}

const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET_KEY, {
    expiresIn: "1m",
  });
};

const generateRefreshToken = (userId: string, name: string, imgsrc: string) => {
  return jwt.sign({ userId, name, imgsrc }, JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
};

export async function POST(request: Request) {
  const res = await request.json();
  const sessionToken = res.payload?.data?.token;
  if (!sessionToken) {
    return Response.json(
      {
        message: "Không nhận được token",
      },
      {
        status: 400,
      }
    );
  }
  return Response.json(res.payload, {
    status: 200,
    headers: {
      "Set-Cookie": `sessionToken = ${sessionToken}; Path=/; HttpOnly`,
    },
  });
}
