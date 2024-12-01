import { StatusCodes } from "http-status-codes";
import { NotExistError } from "../errors.js";
import { serviceGetUserPoint, userSignUp } from "../services/user.service.js";
import { bodyToUser } from "../dtos/user.dto.js";

export const handleUserSignUp = async (req, res, next) => {
  // handleStoreAdd
  /*
    #swagger.tags = ['Store']
    #swagger.summary = '가게 추가 API'
    #swagger.description = '특정 지역에 새로운 가게를 추가합니다'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              store_name: {
                type: "string",
                description: "가게명"
              },
              area_id: {
                type: "number",
                description: "지역 ID"
              },
              address: {
                type: "string",
                description: "가게 주소"
              },
              detail_address: {
                type: "string",
                description: "가게 상세주소"
              },
              phone_number: {
                type: "string",
                description: "가게 전화번호"
              },
              category_id: {
                type: "number",
                description: "가게 카테고리 ID"
              }
            },
            required: ["store_name", "area_id", "address", "phone_number", "category_id"]
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: "가게 추가 성공 응답",
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
                      store_id: { type: "number" },
                      store_name: { type: "string" },
                      area_id: { type: "number" },
                      address: { type: "string" },
                      detail_address: { type: "string" },
                      phone_number: { type: "string" },
                      category_id: { type: "number" },
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

    #swagger.responses[409] = {
      description: "가게 중복 오류",
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
                  reason: { type: "string", example: "이미 존재하는 가게입니다." },
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
                  reason: { type: "string", example: "가게 추가에 실패했습니다." },
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
  console.log("[LOG_handleUserSignUp] 회원가입을 요청했습니다!");
  console.log("[LOG_handleUserSignUp] body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const user = await userSignUp(bodyToUser(req.body));
  res.status(StatusCodes.OK).success({ result: user });
};

export const handleGetUserPoint = async (req, res, next) => {
  // handleGetUserPoint
  /*
    #swagger.tags = ['User']
    #swagger.summary = '사용자 포인트 조회 API'
    #swagger.description = '사용자의 현재 포인트를 조회합니다'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_id: {
                type: "number",
                description: "사용자 ID"
              }
            },
            required: ["user_id"]
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: "포인트 조회 성공 응답",
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
                      user_id: { type: "number" },
                      total_point: { type: "number" },
                      available_point: { type: "number" },
                      used_point: { type: "number" }
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
              resultType: { type: "string", example: "ERROR" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U001" },
                  reason: { type: "string", example: "사용자가 존재하지 않습니다." },
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
                  reason: { type: "string", example: "포인트 조회에 실패했습니다." },
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
    const userPoint = await serviceGetUserPoint(req.body.user_id);
    return res.status(StatusCodes.OK).success({ result: userPoint });
  } catch (err) {
    if (err instanceof NotExistError) {
      throw new NotExistError("사용자가 존재하지 않습니다.", req.body);
      // return res
      //   .status(StatusCodes.NOT_FOUND)
      //   .json({ result: "사용자가 존재하지 않습니다." });
    }
    console.log("[LOG_ERR : handleGetUserPoint]", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .error({ result: "포인트 조회에 실패했습니다." });
  }
};
