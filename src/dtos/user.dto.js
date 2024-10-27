export const bodyToUser = (body) => {
  const ret = {
    email: body.email,
    name: body.name,
    gender: body.gender,
    birthdate: new Date(body.birthdate),
    address: body.address,
    terms: body.terms, // json 배열 형식임, parsing 필요
    prefer_food: body.prefer_food, // 이하 동일
  };
  console.log("[LOG] bodyToUser:", ret);
  return ret;
};

export const responseFromUser = ({ user, preferences }) => {
  const ret = {
    result: {
      email: user.email,
      name: user.name,
      gender: user.gender,
      birthdate: user.birthdate,
      address: user.address,
      prefer_food: preferences,
    },
  };
  console.log("[LOG] responseFromUser:", ret);
  return ret;
};

/*
{
  "login_id" : "{user_id}",
  "password" : "{password}",
  "name": "{user_name}",
  "gender": "{user_gender}",
  "birthdate": "{user_birthdate}",
  "address": "{user_address}",
  "terms": [
    {
      "term_id": "{term_id_1}",
      "accepted": "{bool}"
    },
    {
      "term_id": "{term_id_2}",
      "accepted": "{bool}"
    }
  ],
  "prefer_food": "{user_prefer_food}"
}
*/

export const bodyToStore = (body) => {
  const ret = {
    name: body.name,
    address: body.address,
    area_id: body.area_id,
    type: body.type,
  };
  console.log("[LOG] bodyToStore:", ret);
  return ret;
};

export const bodyToReview = (body) => {
  const ret = {
    store_id: body.store_id,
    user_id: body.user_id,
    content: body.content,
    star: body.star,
    // photo_url_1 ~ 3 도 있음
  };
  console.log("[LOG] bodyToReview:", ret);
  return ret;
};

export const bodyToMission = (body) => {
  const ret = {
    name: body.name,
    content: body.content,
    reward: body.reward,
    store_id: body.store_id,
    area_id: body.area_id,
  };
  console.log("[LOG] bodyToMission:", ret);
  return ret;
};

export const bodyToAddMissionToUser = (body) => {
  const ret = {
    user_id: body.user_id,
    mission_id: body.mission_id,
  };
  console.log("[LOG] bodyToAddMissionToUser:", ret);
  return ret;
};
