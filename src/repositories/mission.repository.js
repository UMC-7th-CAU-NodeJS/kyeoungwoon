export {
  addMission,
  addMissionToUser,
  getCurrentAreaMission,
  getUserMissionByStatus,
  setUserMissionSuccess,
};

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

const isUserExist = async (conn, userId) => {
  const [confirm] = await conn.query(
    `SELECT EXISTS(SELECT 1 FROM user WHERE user_id = ?) as isUserExist;`,
    [userId]
  );

  return confirm[0].isUserExist;
};

// 3. 가게에 미션 추가 : 가게가 존재하는지, 해당 가게에 미션이 존재하는지
const addMission = async (data) => {
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
const addMissionToUser = async (data) => {
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

// area id 검증
const getCurrentAreaMission = async (data) => {
  const conn = await pool.getConnection();

  try {
    const [confirm] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM area WHERE area_id = ?) as isExistArea;`,
      [data.area_id]
    );

    if (!confirm[0].isExistArea) {
      throw new NotExistError(
        "[ERR : repo_getCurrentAreaMission] 존재하지 않는 지역입니다."
      );
    }

    const [result] = await conn.query(
      `SELECT mission_id FROM mission WHERE area_id = ?;`,
      [data.area_id]
    );

    return result;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
};

const getUserMissionByStatus = async (data) => {
  const conn = await pool.getConnection();

  try {
    // 사용자가 존재하는지 확인
    const [confirm] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM user WHERE user_id = ?) as isExistUser;`,
      [data.user_id]
    );

    if (!confirm[0].isExistUser) {
      throw new NotExistError(
        "[ERR : repo_getUserMissionByStatus] 존재하지 않는 사용자입니다."
      );
    }

    const [result] = await conn.query(
      `SELECT mission_id FROM user_mission WHERE user_id = ? AND status = ?;`,
      [data.user_id, data.status]
    );

    return result;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
};

const setUserMissionSuccess = async (data) => {
  const conn = await pool.getConnection();

  try {
    // 사용자가 존재하는지 확인
    const [confirmUser] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM user WHERE user_id = ?) as isExistUser;`,
      [data.user_id]
    );

    if (!confirmUser[0].isExistUser) {
      throw new NotExistError(
        "[ERR : repo_setUserMissionComplete] 존재하지 않는 사용자입니다."
      );
    }

    // 미션을 도전중인지 확인
    const [confirmMission] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM user_mission WHERE user_id = ? AND mission_id = ?) as isExistUserMission;`,
      [data.user_id, data.mission_id]
    );

    if (!confirmMission[0].isExistUserMission) {
      throw new Error(
        "[ERR : repo_setUserMissionComplete] 도전중인 미션을 찾을 수 없습니다."
      );
    }

    const [result] = await conn.query(
      `UPDATE user_mission SET status = 'success' WHERE user_id = ? AND mission_id = ?;`,
      [data.user_id, data.mission_id]
    );

    return result.affectedRows;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
};
