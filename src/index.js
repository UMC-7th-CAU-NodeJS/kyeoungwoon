import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import {
  handleAddMission,
  handleAddMissionToUser,
  handleStoreAdd,
  handleUserSignUp,
  handleAddReviewToStore,
  handleGetUserCurrentAreaMission,
  handleGetUserPoint,
  handleSetUserMissionSuccess,
  handleGetStoreReview,
  handleGetUserReview,
} from "./controllers/index.controller.js";

import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";

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
    writeOutputFile: false,
  };
  const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
  const routes = ["./src/index.js"];
  const doc = {
    info: {
      title: "UMC 7th",
      description: "UMC 7th Node.js 테스트 프로젝트입니다.",
    },
    host: "localhost:3000",
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
