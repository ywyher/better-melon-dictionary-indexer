import { initializeJMdict } from "./indexes/jmdict";
import { initializeJMnedict } from "./indexes/jmnedict";
import { initializeKanjidic2 } from "./indexes/kanjidic2";
import { initializeNHK } from "./indexes/nkh";

await initializeJMdict()
await initializeKanjidic2()
await initializeJMnedict()

// await initializeNHK()