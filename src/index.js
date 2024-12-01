import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import {
  handleGetUserPoint,
  handleUserSignUp,
} from "./controllers/user.controller.js";
import { handleStoreAdd } from "./controllers/store.controller.js";
import {
  handleAddReviewToStore,
  handleGetStoreReview,
  handleGetUserReview,
} from "./controllers/review.controller.js";
import {
  handleAddMission,
  handleAddMissionToUser,
  handleGetUserCurrentAreaMission,
  handleSetUserMissionSuccess,
} from "./controllers/mission.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할W 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

const responseHandler = (req, res, next) => {
  res.success = (success) => {
    return res.json({
      resultType: "success",
      error: null,
      success,
    });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "error",
      error: {
        errorCode,
        reason,
        data,
      },
      success: null,
    });
  };

  next();
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
};

app.use(responseHandler);

const v1 = express.Router();
app.use("/api/v1", v1);

v1.get("/", (req, res) => {
  // #swagger.ignore = true
  res.send("Hello World!");
});

v1.post("/user/register", handleUserSignUp);
// week 5 mission
v1.post("/store", handleStoreAdd);
v1.post("/review", handleAddReviewToStore);
v1.post("/mission", handleAddMission);
v1.post("/mission/start", handleAddMissionToUser);

// week 3 API 작성분
v1.get("/mission", handleGetUserCurrentAreaMission);
v1.get("/user/point", handleGetUserPoint); // 10/27 23:10 ~ 23:21
v1.post("/mission/end", handleSetUserMissionSuccess); // 10/27 23:21 ~ 23:45
v1.get("/review/store/:store_id", handleGetStoreReview); // 10/27 23:45 ~ 23:59

v1.get("/review", handleGetUserReview);

// test : 10/28 00:00 ~ 00:21 (21분)

app.get("/", (req, res) => {
  // #swagger.ignore = true
  const ret = {
    hello: "world",
  };
  res.status(200).success(ret);
});

app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(
    {},
    {
      swaggerOptions: {
        url: "/openapi.json",
      },
    }
  )
);

app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: true,
  };

  const outputFile = "./src/swagger-output.json"; // 파일 출력은 사용하지 않습니다.
  const routes = ["./src/index.js"];
  const doc = {
    info: {
      title: "UMC 7th Node.js 하늘 / 박경운",
      description: "UMC 7th Node.js 하늘 / 박경운 의 워크북 프로젝트 입니다.",
      contact: {
        name: "박경운",
        email: "saveearth1@cau.ac.kr",
        url: "https://github.com/kyeoungwoon",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    // 서버 정보
    servers: [
      {
        url: "http://localhost:3000",
        description: "개발 서버",
      },
      {
        url: "https://heehee.fakeurl",
        description: "운영 서버",
      },
    ],

    // 보안 설정
    security: [
      {
        bearerAuth: [],
      },
    ],
    components: {
      // 인증 스키마
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      // 공통 응답 스키마
      schemas: {
        Success: {
          type: "object",
          properties: {
            resultType: {
              type: "string",
              description: "결과 타입",
            },
            success: {
              type: "object",
              description: "성공 데이터",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            errorCode: {
              type: "string",
              description: "에러 코드",
            },
            reason: {
              type: "string",
              description: "에러 사유",
            },
            data: {
              type: "object",
              description: "에러 데이터",
            },
          },
        },
      },
    },

    // 태그 분류
    tags: [
      {
        name: "User",
        description: "사용자 관련 API",
      },
      {
        name: "Store",
        description: "가게 관련 API",
      },
      {
        name: "Mission",
        description: "미션 관련 API",
      },
      {
        name: "Review",
        description: "리뷰 관련 API",
      },
    ],

    // 외부 문서
    externalDocs: {
      description: "GitHub Repository",
      url: "https://github.com/UMC-7th-CAU-NodeJS/umc-7-kyeoungwoon",
    },
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
