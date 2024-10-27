export { serviceAddStore };

import { addStore } from "../repositories/index.repository.js";

const serviceAddStore = async (data) => {
  const store_id = await addStore(data);
  return store_id;
};
