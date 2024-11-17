export { handleAddReviewToStore, handleGetStoreReview, handleGetUserReview };

import { NotExistError } from "../errors.js";
import { StatusCodes } from "http-status-codes";

import {
  serviceAddReviewToStore,
  serviceGetStoreReview,
  serviceGetUserReview,
} from "../services/index.service.js";
import { bodyToReview } from "../dtos/index.dto.js";

// #2 가게에 리뷰 추가하기 : 가게 존재여부 검증 필요
const handleAddReviewToStore = async (req, res, next) => {
  try {
    const store = await serviceAddReviewToStore(bodyToReview(req.body));
    return res.status(StatusCodes.OK).success({ result: store });
  } catch (err) {
    if (err instanceof NotExistError) {
      throw new NotExistError("가게가 존재하지 않습니다.", req.body);
      // return res
      //   .status(StatusCodes.NOT_FOUND)
      //   .json({ result: "가게가 존재하지 않습니다." });
    }
    console.log("[LOG_ERR : handleAddReviewToStore]", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .error({ reason: "리뷰 추가에 실패했습니다." });
  }
};

const handleGetStoreReview = async (req, res, next) => {
  const { store_id } = req.params;
  try {
    const review_list = await serviceGetStoreReview({
      store_id: parseInt(store_id),
    });
    return res.status(StatusCodes.OK).success({ result: review_list });
  } catch (err) {
    if (err instanceof NotExistError) {
      throw new NotExistError("가게가 존재하지 않습니다.", req.body);
      // return res
      //   .status(StatusCodes.NOT_FOUND)
      //   .json({ result: "가게가 존재하지 않습니다." });
    }
    console.log("[LOG_ERR : handleGetStoreReview]", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .error({ reason: "리뷰 조회에 실패했습니다." });
  }
};

const handleGetUserReview = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    const review_list = await serviceGetUserReview({ user_id: user_id });
    return res.status(StatusCodes.OK).success({ result: review_list });
  } catch (err) {
    if (err instanceof NotExistError) {
      throw new NotExistError("사용자가 존재하지 않습니다.", req.body);
      // return res
      //   .status(StatusCodes.NOT_FOUND)
      //   .json({ result: "사용자가 존재하지 않습니다." });
    }
    console.log("[LOG_ERR : handleGetUserReview]", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .error({ success: "리뷰 조회에 실패했습니다." });
  }
};
