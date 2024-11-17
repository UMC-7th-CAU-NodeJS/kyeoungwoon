export { serviceAddReviewToStore, serviceGetStoreReview, serviceGetUserReview };

import {
  addReviewToStore,
  getStoreReview,
  getUserReview,
} from "../repositories/index.repository.js";

const serviceAddReviewToStore = async (data) => {
  const review_id = await addReviewToStore(data);
  return review_id;
};

const serviceGetStoreReview = async (data) => {
  const review_list = await getStoreReview(data);
  return review_list;
};

const serviceGetUserReview = async (data) => {
  const review_list = await getUserReview(data);
  return review_list;
};
