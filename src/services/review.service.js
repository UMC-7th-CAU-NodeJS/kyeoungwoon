import {
  addReviewToStore,
  getStoreReview,
  getUserReview,
} from "../repositories/review.repository.js";

export const serviceAddReviewToStore = async (data) => {
  const review_id = await addReviewToStore(data);
  return review_id;
};

export const serviceGetStoreReview = async (data) => {
  const review_list = await getStoreReview(data);
  return review_list;
};

export const serviceGetUserReview = async (data) => {
  const review_list = await getUserReview(data);
  return review_list;
};
