export { addUser, getUser, setPreference, getUserPreferencesByUserId };

import { pool } from "../db.config.js";
import { AlreadyExistError, NotExistError } from "../errors.js";

// User 데이터 삽입
const addUser = async (data) => {
  const conn = await pool.getConnection();

  try {
    const [confirm] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) as isExistEmail;`,
      [data.email]
    );

    if (confirm[0].isExistEmail) {
      return null;
    }

    const [result] = await conn.query(
      `INSERT INTO user (email, name, gender, birthdate, address) VALUES (?, ?, ?, ?, ?);`,
      [data.email, data.name, data.gender, data.birthdate, data.address]
    );

    console.log("[LOG] addUserResult : ", result.insertId);

    return result.insertId;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 사용자 정보 얻기
const getUser = async (userId) => {
  const conn = await pool.getConnection();

  try {
    let [user] = await conn.query(`SELECT * FROM user WHERE user_id = ?;`, [
      userId,
    ]); // user 재할당을 위해 let 으로 선언하는 것으로 변경함.

    console.log("[repo : getUser] User : ", user);

    if (user.length == 0) {
      throw new NotExistError("[ERR : getUser] 존재하지 않는 사용자입니다.");
    } else {
      user = user[0];
    }

    return user;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 음식 선호 카테고리 매핑
const setPreference = async (userId, foodCategoryId) => {
  const conn = await pool.getConnection();

  try {
    await conn.query(
      `INSERT INTO user_prefer (prefer_id, user_id) VALUES (?, ?);`,
      [foodCategoryId, userId]
    );

    return;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 사용자 선호 카테고리 반환
const getUserPreferencesByUserId = async (userId) => {
  const conn = await pool.getConnection();

  try {
    const [preferences] = await conn.query(
      `SELECT prefer_id FROM user_prefer WHERE user_id = ?;`,
      [userId]
    );

    return preferences;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};
