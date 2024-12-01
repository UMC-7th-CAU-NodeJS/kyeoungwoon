import { addStore } from "../repositories/store.repository.js";

export const serviceAddStore = async (data) => {
  const store_id = await addStore(data);
  return store_id;
};
