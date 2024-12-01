export const bodyToReview = (body) => {
  const ret = {
    store_id: body.store_id,
    user_id: body.user_id,
    content: body.content,
    star: body.star,
    // photo_url_1 ~ 3 도 있음
  };
  console.log("[LOG] bodyToReview:", ret);
  return ret;
};
