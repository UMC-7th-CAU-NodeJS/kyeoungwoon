export { handleStoreAdd };

import { NotExistError, AlreadyExistError } from "../errors.js";
import { StatusCodes } from "http-status-codes";

import { serviceAddStore } from "../services/index.service.js";
import { bodyToStore } from "../dtos/index.dto.js";

// #1 특정 지역에 가게 추가하기
const handleStoreAdd = async (req, res, next) => {
  try {
    const store = await serviceAddStore(bodyToStore(req.body));
    return res.status(StatusCodes.OK).success({ result: store });
  } catch (err) {
    if (err instanceof AlreadyExistError) {
      throw new AlreadyExistError("이미 존재하는 가게입니다.", req.body);
      // return res
      //   .status(StatusCodes.CONFLICT)
      //   .json({ result: "이미 존재하는 가게입니다." });
    }
    console.log("[LOG_ERR : handleStoreAdd]", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .error({ reason: "가게 추가에 실패했습니다." });
  }
};
