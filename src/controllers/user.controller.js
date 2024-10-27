import { StatusCodes } from "http-status-codes";
import {
  bodyToUser,
  bodyToStore,
  bodyToMission,
  bodyToReview,
  bodyToAddMissionToUser,
} from "../dtos/user.dto.js";
import {
  serviceAddMission,
  serviceAddMissionToUser,
  serviceAddReviewToStore,
  serviceAddStore,
  userSignUp,
} from "../services/user.service.js";

import { NotExistError, AlreadyExistError } from "../repositories/errors.js";

export const handleUserSignUp = async (req, res, next) => {
  console.log("[LOG_handleUserSignUp] 회원가입을 요청했습니다!");
  console.log("[LOG_handleUserSignUp] body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const user = await userSignUp(bodyToUser(req.body));
  res.status(StatusCodes.OK).json({ result: user });
};

// TODO : Error code 세분화

// #1 특정 지역에 가게 추가하기
export const handleStoreAdd = async (req, res, next) => {
  try {
    const store = await serviceAddStore(bodyToStore(req.body));
    return res.status(StatusCodes.OK).json({ result: store });
  } catch (err) {
    if (err instanceof AlreadyExistError) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ result: "이미 존재하는 가게입니다." });
    }
    console.log("[LOG_ERR : handleStoreAdd]", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ result: "가게 추가에 실패했습니다." });
  }
};

// #2 가게에 리뷰 추가하기 : 가게 존재여부 검증 필요
export const handleAddReviewToStore = async (req, res, next) => {
  try {
    const store = await serviceAddReviewToStore(bodyToReview(req.body));
    return res.status(StatusCodes.OK).json({ result: store });
  } catch (err) {
    if (err instanceof NotExistError) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ result: "가게가 존재하지 않습니다." });
    }
    console.log("[LOG_ERR : handleAddReviewToStore]", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ result: "리뷰 추가에 실패했습니다." });
  }
};

// #3 가게에 미션 추가하기
export const handleAddMission = async (req, res, next) => {
  try {
    const store = await serviceAddMission(bodyToMission(req.body));
    return res.status(StatusCodes.OK).json({ result: store });
  } catch (err) {
    if (err instanceof NotExistError) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ result: "가게가 존재하지 않습니다." });
    }
    console.log("[LOG_ERR : handleAddMission]", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ result: "미션 추가에 실패했습니다." });
  }
};

// #4 도전 중인 미션에 추가하기 : 미션 도전중인지 검증 필요
export const handleAddMissionToUser = async (req, res, next) => {
  try {
    const store = await serviceAddMissionToUser(
      bodyToAddMissionToUser(req.body)
    );
    return res.status(StatusCodes.OK).json({ result: store });
  } catch (err) {
    if (err instanceof NotExistError) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ result: "사용자가 존재하지 않습니다." });
    }
    console.log("[LOG_ERR : handleAddMissionToUser]", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ result: "미션 추가에 실패했습니다." });
  }
};
