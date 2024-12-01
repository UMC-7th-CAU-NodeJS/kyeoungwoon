import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
} from "../repositories/user.repository.js";

export const userSignUp = async (data) => {
  const joinUserId = await addUser({
    email: data.email,
    name: data.name,
    gender: data.gender,
    birthdate: data.birthdate,
    address: data.address,
  }); // returns result.insertId

  if (joinUserId === null) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  for (const prefers of data.prefer_food) {
    console.log("[LOG] 25 prefers: ", prefers);
    if (prefers.selected === true) {
      await setPreference(joinUserId, prefers.prefer_id);
    }
  } // DB insert ...

  const user = await getUser(joinUserId); // 이게 JSON 배열을 반환함
  const preferences = await getUserPreferencesByUserId(joinUserId);
  // user_id에 따른 preference id 배열을 반환

  console.log("[LOG] 28 user, prefs: ", user, preferences);

  return responseFromUser({ user, preferences });
  // 이걸 다시 user 랑 preference_id를 주어준다.. ?
  /*
  {"result":{"email":"test@example.com","name":"엘빈","preferCategory":["한식","중식","치킨"]}}
  그냥 이렇게 가입 결과 삼아서 반환해주는 것 같음
  */
};

// 현재는 데이터 insert 및 검증을 repository에서 처리하고 있음
// 입력단에서의 데이터 검증은 service 에서 처리하는게 나아보임
// ex) not null 이 아닌 data는 ""라도 넣어주기

export const serviceGetUserPoint = async (data) => {
  const user = await getUser(data);
  const user_point = user.point;

  return user_point;
};
