export const bodyToStore = (body) => {
  const ret = {
    name: body.name,
    address: body.address,
    area_id: body.area_id,
    type: body.type,
  };
  console.log("[LOG] bodyToStore:", ret);
  return ret;
};
