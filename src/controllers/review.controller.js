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
  // handleAddReviewToStore
  // handleAddReviewToStore
  /*
    #swagger.tags = ['Review']
    #swagger.summary = '가게 리뷰 추가 API'
    #swagger.description = '특정 가게에 리뷰를 추가합니다'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              store_id: { 
                type: "number",
                description: "가게 ID"
              },
              user_id: {
                type: "number",
                description: "사용자 ID"
              },
              content: {
                type: "string",
                description: "리뷰 내용"
              },
              rating: {
                type: "number",
                description: "평점 (1-5)",
                minimum: 1,
                maximum: 5
              }
            },
            required: ["store_id", "user_id", "content", "rating"]
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: "리뷰 추가 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true },
              success: {
                type: "object",
                properties: {
                  result: {
                    type: "object",
                    properties: {
                      review_id: { type: "number" },
                      content: { type: "string" },
                      rating: { type: "number" },
                      created_at: { type: "string", format: "date-time" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: "가게를 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "ERROR" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "S001" },
                  reason: { type: "string", example: "가게가 존재하지 않습니다." },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true }
            }
          }
        }
      }
    }

    #swagger.responses[500] = {
      description: "서버 오류",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "ERROR" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "unknown" },
                  reason: { type: "string", example: "리뷰 추가에 실패했습니다." },
                  data: { type: "object", nullable: true }
                }
              },
              success: { type: "object", nullable: true }
            }
          }
        }
      }
    }
*/

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
  // handleGetStoreReview
  /*
    #swagger.tags = ['Review']
    #swagger.summary = '가게 리뷰 목록 조회 API'
    #swagger.description = '특정 가게의 모든 리뷰 목록을 조회합니다'

    #swagger.parameters['store_id'] = {
      in: 'path',
      description: '가게 ID',
      required: true,
      type: 'number'
    }

    #swagger.responses[200] = {
      description: "리뷰 목록 조회 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object", 
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true },
              success: {
                type: "object",
                properties: {
                  result: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        review_id: { type: "number" },
                        content: { type: "string" },
                        rating: { type: "number" },
                        created_at: { type: "string", format: "date-time" },
                        user_name: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: "가게를 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  reason: { type: "string", example: "가게가 존재하지 않습니다." }
                }
              }
            }
          }
        }
      }
    }
*/

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
  // handleGetUserReview
  /*
    #swagger.tags = ['Review']
    #swagger.summary = '사용자 리뷰 목록 조회 API'
    #swagger.description = '특정 사용자가 작성한 모든 리뷰 목록을 조회합니다'

    #swagger.parameters['user_id'] = {
      in: 'path',
      description: '사용자 ID',
      required: true,
      type: 'number'
    }

    #swagger.responses[200] = {
      description: "사용자 리뷰 목록 조회 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true },
              success: {
                type: "object",
                properties: {
                  result: {
                    type: "array",
                    items: {
                      type: "object", 
                      properties: {
                        review_id: { type: "number" },
                        store_name: { type: "string" },
                        content: { type: "string" },
                        rating: { type: "number" },
                        created_at: { type: "string", format: "date-time" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: "사용자를 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  reason: { type: "string", example: "사용자가 존재하지 않습니다." }
                }
              }
            }
          }
        }
      }
    }
*/
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
