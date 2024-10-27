export { addStore };

import { pool } from "../db.config.js";

// 1. 특정 지역에 가게 추가하기 : 이미 존재하는 가게인지 확인 (상호명과 주소로 확인))
const addStore = async (data) => {
  const conn = await pool.getConnection();

  try {
    // 가게가 이미 존재하는지 확인
    const [confirm] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM store WHERE name = ? AND address = ?) as isExistStore;`,
      [data.name, data.address]
    );

    if (confirm[0].isExistStore) {
      throw new AlreadyExistError(
        "[ERR : repo_addStore] 이미 존재하는 가게입니다."
      );
    }

    const [result] = await conn.query(
      `INSERT INTO store (name, address, area_id, type) VALUES (?, ?, ?, ?);`,
      [data.name, data.address, data.area_id, data.type]
    );

    return result.insertId;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
};
