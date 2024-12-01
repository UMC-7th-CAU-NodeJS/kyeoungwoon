import { NotExistError, AlreadyExistError } from "../errors.js";
import { StatusCodes } from "http-status-codes";
import { serviceAddStore } from "../services/store.service.js";
import { bodyToStore } from "../dtos/store.dto.js";

// #1 특정 지역에 가게 추가하기
export const handleStoreAdd = async (req, res, next) => {
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
  // try {
  //   const store = await serviceAddStore(bodyToStore(req.body));
  //   return res.status(StatusCodes.OK).success({ result: store });
  // } catch (err) {
  //   if (err instanceof AlreadyExistError) {
  //     throw new AlreadyExistError("이미 존재하는 가게입니다.", req.body);
  //     // return res
  //     //   .status(StatusCodes.CONFLICT)
  //     //   .json({ result: "이미 존재하는 가게입니다." });
  //   }
  //   console.log("[LOG_ERR : handleStoreAdd]", err);
  //   return res
  //     .status(StatusCodes.INTERNAL_SERVER_ERROR)
  //     .error({ reason: "가게 추가에 실패했습니다." });
  // }

  const store = await serviceAddStore(bodyToStore(req.body));
  return res.status(StatusCodes.OK).success({ result: store });
};
