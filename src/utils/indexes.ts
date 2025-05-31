import { meili } from "../lib/meilisearch";
import type { IndexSettings } from "../types";
import type { Index } from "../types/indexes";

export async function createIndex(indexName: Index, data: any[], settings: IndexSettings) {
  console.log(`Creating ${indexName} index...`)
  const index = meili.index(indexName)
  
  await index.updateSettings({
    distinctAttribute: "id",
    rankingRules: [
      "exactness",
      "typo",
      "words",
      "proximity",
      "attribute",
      "sort"
    ],
    searchableAttributes: [
      "kana.text",
      "kanji.text",
      "id"
    ],
  })
  console.log(`${indexName} index settings updated`)

  const addedDocument = await index.addDocuments(data)
  console.log("Documents added:", addedDocument)  
}

export async function getIndexExists(index: Index) {
  try {
    await meili.getIndex(index);
    return true;
  } catch (error) {
    return false;
  }
}

export async function deleteIndex(index: Index) {
  try {
    await meili.deleteIndex(index)
  } catch(error) {
    console.error(error)
  }
}