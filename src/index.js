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
} from "./controllers/index.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할W 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

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

// test : 10/28 00:00 ~ 00:21 (21분)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
