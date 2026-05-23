export const config = {
  jwt: {
    secret: process.env.NEXTAUTH_SECRET!,
    expiresIn: "7d",
  },
  bcrypt: {
    saltRounds: 12,
  },
  app: {
    name: "TaskFlow",
    url: process.env.NEXTAUTH_URL!,
  },
};