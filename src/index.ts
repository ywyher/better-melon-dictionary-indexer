import { setupJmdictIndex } from "./indexes/jmdict";
import { setupJMnedictIndex } from "./indexes/jmnedict";
import { deleteIndex } from "./utils/indexes";

// await deleteIndex('jmdict')
await setupJmdictIndex()