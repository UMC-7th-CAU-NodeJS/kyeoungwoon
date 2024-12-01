export const bodyToAddMission = (body) => {
  const ret = {
    name: body.name,
    content: body.content,
    reward: body.reward,
    store_id: body.store_id,
    area_id: body.area_id,
  };
  console.log("[DTO : bodyToAddMission] : ", ret);
  return ret;
};

export const bodyParseUserMissionID = (body) => {
  const ret = {
    user_id: body.user_id,
    mission_id: body.mission_id,
  };
  console.log("[DTO : bodyParseUserMissionID] : ", ret);
  return ret;
};
