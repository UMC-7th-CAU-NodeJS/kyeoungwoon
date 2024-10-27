export {
  serviceAddMission,
  serviceAddMissionToUser,
  serviceGetCurrentAreaMission,
  serviceGetUserMissionByStatus,
  serviceSetUserMissionSuccess,
};

import {
  addMission,
  addMissionToUser,
  getCurrentAreaMission,
  getUserMissionByStatus,
  setUserMissionSuccess,
} from "../repositories/index.repository.js";

const serviceAddMission = async (data) => {
  const mission_id = await addMission(data);
  return mission_id;
};

const serviceAddMissionToUser = async (data) => {
  const user_mission_id = await addMissionToUser(data);
  return user_mission_id;
};

const serviceGetCurrentAreaMission = async (data) => {
  const mission_list = await getCurrentAreaMission(data);
  return mission_list;
};

const serviceGetUserMissionByStatus = async (data) => {
  const mission_list = await getUserMissionByStatus(data);
  return mission_list;
};

const serviceSetUserMissionSuccess = async (data) => {
  const result = await setUserMissionSuccess(data);
  return result;
};
