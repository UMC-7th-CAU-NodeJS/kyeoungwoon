export {
  handleAddMission,
  handleAddMissionToUser,
  handleGetUserCurrentAreaMission,
  handleGetUserMissionByStatus,
  handleSetUserMissionSuccess,
};

import {
  NotExistError,
  BadRequestError,
  AlreadyExistError,
} from "../errors.js";
import { StatusCodes } from "http-status-codes";
import {
  serviceAddMission,
  serviceAddMissionToUser,
  serviceGetCurrentAreaMission,
  serviceSetUserMissionSuccess,
} from "../services/index.service.js";
import {
  bodyToAddMission,
  bodyParseUserMissionID,
  bodyToUserId,
} from "../dtos/index.dto.js";

// #3 가게에 미션 추가하기
const handleAddMission = async (req, res, next) => {
  try {
    const store = await serviceAddMission(bodyToAddMission(req.body));
    return res.status(StatusCodes.OK).success({ result: store });
  } catch (err) {
    if (err instanceof NotExistError) {
      throw new NotExistError("가게가 존재하지 않습니다.", req.body);
      // return res
      //   .status(StatusCodes.NOT_FOUND)
      //   .json({ result: "가게가 존재하지 않습니다." });
    }
    console.log("[LOG_ERR : handleAddMission]", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .error({ reason: "미션 추가에 실패했습니다." });
  }
};

// #4 도전 중인 미션에 추가하기 : 미션 도전중인지 검증 필요
const handleAddMissionToUser = async (req, res, next) => {
  try {
    const store = await serviceAddMissionToUser(
      bodyParseUserMissionID(req.body)
    );
    return res.status(StatusCodes.OK).success({ result: store });
  } catch (err) {
    if (err instanceof NotExistError) {
      console.log("sdjkfhasklfkldsjflkasjdflksdajlf", req.body);
      throw new NotExistError("사용자가 존재하지 않습니다.", req.body);
      // return res
      //   .status(StatusCodes.NOT_FOUND)
      //   .json({ result: "사용자가 존재하지 않습니다." });
    }
    console.log("[LOG_ERR : handleAddMissionToUser]", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .error({ reason: "미션 추가에 실패했습니다." });
  }
};

const handleGetUserCurrentAreaMission = async (req, res, next) => {
  try {
    const missionList = await serviceGetCurrentAreaMission({
      user_id: bodyToUserId(req.body),
      area_id: req.body.area_id,
    });

    return res.status(StatusCodes.OK).success({ result: missionList });
  } catch (err) {
    if (err instanceof NotExistError) {
      throw new NotExistError("존재하지 않는 지역입니다.", req.body);
      // return res
      //   .status(StatusCodes.NOT_FOUND)
      //   .json({ result: "존재하지 않는 지역입니다." });
    }
    console.log("[LOG_ERR : handleGetCurrentAreaMission]", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .error({ reason: "미션 조회에 실패했습니다." });
  }
};

const handleGetUserMissionByStatus = async (req, res, next) => {
  try {
    if (req.body.status !== "in_progress" && req.body.status !== "success") {
      throw new BadRequestError("잘못된 status 값입니다.", req.body);
      // return res
      //   .status(StatusCodes.BAD_REQUEST)
      //   .json({ result: "잘못된 status 값입니다." });
    } // 도대체 DTO가 왜 필요한걸까 ..
    const missionList = await serviceGetUserMissionByStatus({
      status: req.body.status, // 그렇다고 이걸 DTO로 빼기엔 ...
      user_id: bodyToUserId(req.body), // 이것도 정말 억지스러운 ..
    });

    return res.status(StatusCodes.OK).success({ result: missionList });
  } catch (err) {
    if (err instanceof NotExistError) {
      throw new NotExistError("존재하지 않는 지역입니다.", req.body);
      // return res
      //   .status(StatusCodes.NOT_FOUND)
      //   .json({ result: "존재하지 않는 지역입니다." });
    }
    console.log("[LOG_ERR : handleGetCurrentAreaMission]", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .error({ reason: "미션 조회에 실패했습니다." });
  }
};

// TODO : 이미 미션이 완료된 상태인 경우 처리 필요
const handleSetUserMissionSuccess = async (req, res, next) => {
  try {
    const result = await serviceSetUserMissionSuccess(
      bodyParseUserMissionID(req.body)
    );
    return res.status(StatusCodes.OK).success({ result: result });
  } catch (err) {
    if (err instanceof NotExistError) {
      throw new NotExistError("존재하지 않는 미션입니다.", req.body);
      // return res
      //   .status(StatusCodes.NOT_FOUND)
      //   .json({ result: "미션을 완료할 수 없습니다." });
    }
    console.log("[LOG_ERR : handleRequestMissionComplete]", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .error({ reason: "미션 완료에 실패했습니다." });
  }
};
