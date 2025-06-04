import { deleteIndex } from "./utils/indexes";
import { setupIndex } from "./utils/setup";

await deleteIndex('jmdict')

setTimeout(async () => {
  await setupIndex('jmdict')
}, 2000);