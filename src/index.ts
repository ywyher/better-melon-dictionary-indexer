import { deleteIndex } from "./utils/indexes";
import { setupIndex } from "./utils/setup";

await setupIndex('jmdict')
await setupIndex('jmnedict')
await setupIndex('kanjidic2')