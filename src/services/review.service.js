export { serviceAddReviewToStore, serviceGetStoreReview };

import {
  addReviewToStore,
  getStoreReview,
} from "../repositories/index.repository.js";

const serviceAddReviewToStore = async (data) => {
  const review_id = await addReviewToStore(data);
  return review_id;
};

const serviceGetStoreReview = async (data) => {
  const review_list = await getStoreReview(data);
  return review_list;
};
