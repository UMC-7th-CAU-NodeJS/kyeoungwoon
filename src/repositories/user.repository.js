export { addUser, getUser, setPreference, getUserPreferencesByUserId };

import { NotExistError } from "../errors.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// User 데이터 삽입
const addUser = async (data) => {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });
    // `SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) as isExistEmail`

    if (existingUser) {
      return null;
    }

    const result = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        gender: data.gender,
        birthdate: data.birthdate,
        address: data.address,
      },
    });
    // `INSERT INTO user (email, name, gender, birthdate, address) VALUES (?, ?, ?, ?, ?)`

    console.log("[LOG] addUserResult : ", result.id);
    return result.id;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};

// 사용자 정보 얻기
const getUser = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
    });
    // `SELECT * FROM user WHERE user_id = ?`

    console.log("[repo : getUser] User : ", user);

    if (!user) {
      throw new NotExistError("[ERR : getUser] 존재하지 않는 사용자입니다.");
    }

    return user;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};

// 음식 선호 카테고리 매핑
const setPreference = async (userId, foodCategoryId) => {
  try {
    await prisma.userPrefer.create({
      data: {
        prefer: {
          connect: {
            id: foodCategoryId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    }); // `INSERT INTO user_prefer (prefer_id, user_id) VALUES (?, ?)`

    return;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};

// 사용자 선호 카테고리 반환
const getUserPreferencesByUserId = async (userId) => {
  try {
    const preferences = await prisma.userPrefer.findMany({
      where: {
        userId: userId,
      },
      select: {
        preferId: true,
      },
    });
    // `SELECT prefer_id FROM user_prefer WHERE user_id = ?`

    return preferences;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};
