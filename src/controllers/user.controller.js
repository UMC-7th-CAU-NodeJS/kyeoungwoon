export { handleUserSignUp, handleGetUserPoint };

import { StatusCodes } from "http-status-codes";
import { bodyToUser, bodyToUserId } from "../dtos/index.dto.js";
import { userSignUp, serviceGetUserPoint } from "../services/index.service.js";
import { NotExistError } from "../errors.js";

const handleUserSignUp = async (req, res, next) => {
  console.log("[LOG_handleUserSignUp] 회원가입을 요청했습니다!");
  console.log("[LOG_handleUserSignUp] body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const user = await userSignUp(bodyToUser(req.body));
  res.status(StatusCodes.OK).json({ result: user });
};

const handleGetUserPoint = async (req, res, next) => {
  try {
    const userPoint = await serviceGetUserPoint(req.body.user_id);
    return res.status(StatusCodes.OK).json({ result: userPoint });
  } catch (err) {
    if (err instanceof NotExistError) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ result: "사용자가 존재하지 않습니다." });
    }
    console.log("[LOG_ERR : handleGetUserPoint]", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ result: "포인트 조회에 실패했습니다." });
  }
};
