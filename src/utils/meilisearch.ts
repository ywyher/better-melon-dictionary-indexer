import { meili } from "../lib/meilisearch";

export async function getIndexExists(index: 'jmdict') {
  try {
    await meili.getIndex(index);
    return true;
  } catch (error) {
    return false;
  }
}

export async function deleteIndex(index: 'jmdict') {
  try {
    await meili.deleteIndex('jmdict')
  } catch(error) {
    console.error(error)
  }
}