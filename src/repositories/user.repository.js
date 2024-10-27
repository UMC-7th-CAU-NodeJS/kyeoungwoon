import { pool } from "../db.config.js";
import { AlreadyExistError, NotExistError } from "./errors.js";

const isExistStore = async (conn, storeId) => {
  const [confirm] = await conn.query(
    `SELECT EXISTS(SELECT 1 FROM store WHERE store_id = ?) as isExistStore;`,
    [storeId]
  );

  // 존재 시 1, 존재하지 않을 시 0
  return confirm[0].isExistStore;
};

const isUserExist = async (conn, userId) => {
  const [confirm] = await conn.query(
    `SELECT EXISTS(SELECT 1 FROM user WHERE user_id = ?) as isUserExist;`,
    [userId]
  );

  return confirm[0].isUserExist;
};

// User 데이터 삽입
export const addUser = async (data) => {
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
export const getUser = async (userId) => {
  const conn = await pool.getConnection();

  try {
    let [user] = await conn.query(`SELECT * FROM user WHERE user_id = ?;`, [
      userId,
    ]); // user 재할당을 위해 let 으로 선언하는 것으로 변경함.

    console.log("[LOG] User : ", user);

    if (user.length == 0) {
      return null;
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
export const setPreference = async (userId, foodCategoryId) => {
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
export const getUserPreferencesByUserId = async (userId) => {
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

// 1. 특정 지역에 가게 추가하기 : 이미 존재하는 가게인지 확인 (상호명과 주소로 확인))
export const addStore = async (data) => {
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

// 2. 가게에 리뷰 추가하기 : 가게 존재여부 검증 필요 : store_id로 확인
export const addReviewToStore = async (data) => {
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

// 3. 가게에 미션 추가 : 가게가 존재하는지, 해당 가게에 미션이 존재하는지
export const addMission = async (data) => {
  const conn = await pool.getConnection();

  try {
    // 1. 가게가 존재하는가?
    if (!(await isExistStore(conn, data.store_id))) {
      throw new NotExistError(
        "[ERR : repo_addMission] 존재하지 않는 가게입니다."
      );
    }

    // TODO : 2. 미션이 이미 존재하는가? : content로 비교? 비교방식 설계 필요.

    const [result] = await conn.query(
      `INSERT INTO mission (name, content, reward, store_id, area_id) VALUES (?, ?, ?, ?, ?);`,
      [data.name, data.content, data.reward, data.store_id, data.area_id]
    );

    return result.insertId;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
};

// 4. 미션을 사용자에게 할당하기,
//    사용자가 존재하는지, 미션을 이미 도전중인지 확인하기
export const addMissionToUser = async (data) => {
  const conn = await pool.getConnection();

  try {
    // 사용자가 존재하는지 확인
    // comment : 사실 밑에서 user_id를 함께 활용하기 때문에 DB에 무리만 가할 것 같음 ..
    if (!(await isUserExist(conn, data.user_id))) {
      throw new NotExistError(
        "[ERR : repo_addMissionToUser] 존재하지 않는 사용자입니다."
      );
    }
    // 미션 이미 도전중인지 확인
    const [confirm] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM user_mission WHERE user_id = ? AND mission_id = ?) as isExistUserMission;`,
      [data.user_id, data.mission_id]
    );

    if (confirm[0].isExistUserMission) {
      throw new Error(
        "[ERR : repo_addMissionToUser] 이미 도전중인 미션입니다."
      );
    }

    const [result] = await conn.query(
      `INSERT INTO user_mission (user_id, mission_id, status) VALUES (?, ?, ?);`,
      [data.user_id, data.mission_id, "in_progress"]
    );

    return result.insertId;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
};
