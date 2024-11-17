export { addReviewToStore, getStoreReview, getUserReview };

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const isExistStore = async (storeId) => {
  const store = await prisma.store.findUnique({
    where: {
      id: storeId,
    },
  });
  return store ? 1 : 0;
  // Original SQL:
  // SELECT EXISTS(SELECT 1 FROM store WHERE store_id = ?) as isExistStore
};

const addReviewToStore = async (data) => {
  try {
    // 리뷰를 등록할 가게가 존재하는지 확인
    if (!(await isExistStore(data.store_id))) {
      throw new NotExistError(
        "[ERR : repo_addReviewToStore] 존재하지 않는 가게입니다."
      );
    }

    const result = await prisma.review.create({
      data: {
        content: data.content,
        star: data.star,
        user: {
          connect: {
            id: data.user_id,
          },
        },
        store: {
          connect: {
            id: data.store_id,
          },
        },
      },
    });
    // Original SQL:
    // INSERT INTO review (store_id, user_id, content, star) VALUES (?, ?, ?, ?)

    return result.review_id;
  } catch (err) {
    throw err;
  }
};

const getStoreReview = async (data) => {
  try {
    if (!(await isExistStore(data.store_id))) {
      throw new NotExistError(
        "[ERR : getStoreReview] 존재하지 않는 가게입니다."
      );
    }

    const review_list = await prisma.review.findMany({
      where: {
        storeId: data.store_id,
      },
    });
    // Original SQL:
    // SELECT * FROM review WHERE store_id = ?

    return review_list;
  } catch (err) {
    throw err;
  }
};

const getUserReview = async (data) => {
  try {
    const review_list = await prisma.review.findMany({
      where: {
        userId: data.user_id,
      },
    });
    // Original SQL:
    // SELECT * FROM review WHERE user_id = ?

    return review_list;
  } catch (err) {
    throw err;
  }
};
