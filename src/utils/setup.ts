import { CONFIG } from "../lib/config"
import { client } from "../lib/ky"
import { addExtraJMdictInfo, addIncrementalIds, downloadFile, extractArray, extractZip } from "./file"
import { createIndex, getIndexExists } from "./indexes"
import type { GitHubAsset, GitHubRelease } from "../types/github"
import type { Index, IndexSetupResult } from "../types/indexes"

export async function setupIndex(index: Index): Promise<IndexSetupResult> {
  const { name: indexName } = CONFIG.meilisearch.indexes[index]
  
  try {
    if (await getIndexExists(indexName)) {
      console.log(`${index} index already exists, skipping`)
      return { success: true, indexName, documentCount: 0 }
    }

    const indexData = await downloadAndProcessIndex(index)
    await createIndex(indexName, indexData, CONFIG.meilisearch.indexes[index].settings)
    
    return { 
      success: true, 
      indexName,
      documentCount: indexData.length 
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`Failed to setup ${index} index:`, errorMessage)
    
    return { 
      success: false, 
      indexName,
      error: errorMessage 
    }
  }
}