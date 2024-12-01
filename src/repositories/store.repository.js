import { PrismaClient } from "@prisma/client";
import { AlreadyExistError } from "../errors.js";
const prisma = new PrismaClient();

// 1. 특정 지역에 가게 추가하기 : 이미 존재하는 가게인지 확인 (상호명과 주소로 확인))
export const addStore = async (data) => {
  try {
    // 가게가 이미 존재하는지 확인
    const confirm = await prisma.store.findFirst({
      where: {
        AND: [{ name: data.name }, { address: data.address }],
      },
    });
    // Original SQL: SELECT EXISTS(SELECT 1 FROM store WHERE name = ? AND address = ?) as isExistStore

    if (confirm) {
      throw new AlreadyExistError(
        "[ERR : repo_addStore] 이미 존재하는 가게입니다."
      );
    }

    const result = await prisma.store.create({
      data: {
        name: data.name,
        address: data.address,
        area: {
          connect: {
            id: data.area_id,
          },
        },
        type: data.type,
      },
    });
    // Original SQL: INSERT INTO store (name, address, area_id, type) VALUES (?, ?, ?, ?)

    return result.id;
  } catch (err) {
    throw err;
  }
};
