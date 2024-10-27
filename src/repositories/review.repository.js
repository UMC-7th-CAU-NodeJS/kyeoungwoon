export { addReviewToStore, getStoreReview };

import { pool } from "../db.config.js";
import { NotExistError } from "../errors.js";

const isExistStore = async (conn, storeId) => {
  const [confirm] = await conn.query(
    `SELECT EXISTS(SELECT 1 FROM store WHERE store_id = ?) as isExistStore;`,
    [storeId]
  );

  // 존재 시 1, 존재하지 않을 시 0
  return confirm[0].isExistStore;
};
// 2. 가게에 리뷰 추가하기 : 가게 존재여부 검증 필요 : store_id로 확인
const addReviewToStore = async (data) => {
  const conn = await pool.getConnection();

  try {
    // 리뷰를 등록할 가게가 존재하는지 확인 먼저
    if (!(await isExistStore(conn, data.store_id))) {
      throw new NotExistError(
        "[ERR : repo_addReviewToStore] 존재하지 않는 가게입니다."
      );
    }

    // 리뷰 등록
    const [result] = await conn.query(
      `INSERT INTO review (store_id, user_id, content, star) VALUES (?, ?, ?, ?);`,
      [data.store_id, data.user_id, data.content, data.star]
    );

    return result.insertId;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
};

const getStoreReview = async (data) => {
  const conn = await pool.getConnection();

  try {
    if (!(await isExistStore(conn, data.store_id))) {
      throw new NotExistError(
        "[ERR : getStoreReview] 존재하지 않는 가게입니다."
      );
    }

    const [review_list] = await conn.query(
      `SELECT * FROM review WHERE store_id = ?;`,
      [data.store_id]
    );

    return review_list;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
};
