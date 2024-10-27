export { bodyToUser, responseFromUser, bodyToUserId };

const bodyToUser = (body) => {
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

const responseFromUser = ({ user, preferences }) => {
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

const bodyToUserId = (body) => {
  const ret = {
    user_id: body.user_id,
  };
  console.log("[LOG] bodyToUserId:", ret);
  return ret;
};
