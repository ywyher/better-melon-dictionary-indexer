import { setupJmdictIndex } from "./indexes/jmdict";
import { deleteIndex } from "./utils/meilisearch";

deleteIndex('jmdict')
setupJmdictIndex()