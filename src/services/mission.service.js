import {
  addMission,
  addMissionToUser,
  getCurrentAreaMission,
  getUserMissionByStatus,
  setUserMissionSuccess,
} from "../repositories/mission.repository.js";

export const serviceAddMission = async (data) => {
  const mission_id = await addMission(data);
  return mission_id;
};

export const serviceAddMissionToUser = async (data) => {
  const user_mission_id = await addMissionToUser(data);
  return user_mission_id;
};

export const serviceGetCurrentAreaMission = async (data) => {
  const mission_list = await getCurrentAreaMission(data);
  return mission_list;
};

export const serviceGetUserMissionByStatus = async (data) => {
  const mission_list = await getUserMissionByStatus(data);
  return mission_list;
};

export const serviceSetUserMissionSuccess = async (data) => {
  const result = await setUserMissionSuccess(data);
  return result;
};
