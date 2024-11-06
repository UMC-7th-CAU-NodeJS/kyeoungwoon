import { prisma } from "./db.config.js";

const ret = async () => {
  const r = await prisma.user.findFirst({});
  console.log(r);
  return r;
};

ret();
