export {
  addMission,
  addMissionToUser,
  getCurrentAreaMission,
  getUserMissionByStatus,
  setUserMissionSuccess,
};

import { prisma } from "../db.config.js";
import { NotExistError } from "../errors.js";

const isExistStore = async (storeId) => {
  const store = await prisma.store.findUnique({
    where: {
      id: storeId,
    },
  });
  return store !== null;

  // Original SQL:
  // SELECT EXISTS(SELECT 1 FROM store WHERE store_id = ?) as isExistStore
};

const isUserExist = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  return user !== null;

  // Original SQL:
  // SELECT EXISTS(SELECT 1 FROM user WHERE user_id = ?) as isUserExist
};

const addMission = async (data) => {
  try {
    if (!(await isExistStore(data.store_id))) {
      throw new NotExistError(
        "[ERR : repo_addMission] 존재하지 않는 가게입니다."
      );
    }

    const result = await prisma.mission.create({
      data: {
        name: data.name,
        content: data.content,
        reward: data.reward,
        store: {
          connect: { id: data.store_id },
        },
        area: {
          connect: { id: data.area_id },
        },
      },
    });

    return result.mission_id;

    // Original SQL:
    // INSERT INTO mission (name, content, reward, store_id, area_id) VALUES (?, ?, ?, ?, ?)
  } catch (err) {
    throw err;
  }
};

const addMissionToUser = async (data) => {
  try {
    if (!(await isUserExist(data.user_id))) {
      throw new NotExistError(
        "[ERR : repo_addMissionToUser] 존재하지 않는 사용자입니다."
      );
    }

    const existingMission = await prisma.userMission.findFirst({
      where: {
        userId: data.user_id,
        missionId: data.mission_id,
      },
    });

    if (existingMission) {
      throw new Error(
        "[ERR : repo_addMissionToUser] 이미 도전중인 미션입니다."
      );
    }

    const result = await prisma.userMission.create({
      data: {
        // user_id: data.user_id,
        // mission_id: data.mission_id,
        status: "in_progress",
        user: {
          connect: { id: data.user_id },
        },
        mission: {
          connect: { id: data.mission_id },
        },
      },
    });

    return result.id;

    // Original SQL:
    // INSERT INTO user_mission (user_id, mission_id, status) VALUES (?, ?, ?)
  } catch (err) {
    throw err;
  }
};

const getCurrentAreaMission = async (data) => {
  try {
    const area = await prisma.area.findUnique({
      where: {
        id: data.area_id,
      },
    });

    if (!area) {
      throw new NotExistError(
        "[ERR : repo_getCurrentAreaMission] 존재하지 않는 지역입니다."
      );
    }

    const missions = await prisma.mission.findMany({
      where: {
        areaId: data.area_id,
      },
      select: {
        id: true,
      },
    });

    return missions;

    // Original SQL:
    // SELECT mission_id FROM mission WHERE area_id = ?
  } catch (err) {
    throw err;
  }
};

const getUserMissionByStatus = async (data) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: data.user_id,
      },
    });

    if (!user) {
      throw new NotExistError(
        "[ERR : repo_getUserMissionByStatus] 존재하지 않는 사용자입니다."
      );
    }

    const missions = await prisma.userMission.findMany({
      where: {
        userId: data.user_id,
        status: data.status,
      },
      select: {
        missionId: true,
      },
    });

    return missions;

    // Original SQL:
    // SELECT mission_id FROM user_mission WHERE user_id = ? AND status = ?
  } catch (err) {
    throw err;
  }
};

const setUserMissionSuccess = async (data) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: data.user_id,
      },
    });

    if (!user) {
      throw new NotExistError(
        "[ERR : repo_setUserMissionComplete] 존재하지 않는 사용자입니다."
      );
    }

    const existingMission = await prisma.userMission.findFirst({
      where: {
        userId: data.user_id,
        missionId: data.mission_id,
      },
    });

    if (!existingMission) {
      throw new Error(
        "[ERR : repo_setUserMissionComplete] 도전중인 미션을 찾을 수 없습니다."
      );
    }

    const result = await prisma.userMission.updateMany({
      where: {
        userId: data.user_id,
        missionId: data.mission_id,
      },
      data: {
        status: "success",
      },
    });

    return result ? 1 : 0;

    // Original SQL:
    // UPDATE user_mission SET status = 'success' WHERE user_id = ? AND mission_id = ?
  } catch (err) {
    throw err;
  }
};
