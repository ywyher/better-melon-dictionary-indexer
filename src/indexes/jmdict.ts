import { CONFIG } from "../lib/config"
import { client } from "../lib/ky"
import { downloadAndExtractZip, extractWordsArray } from "../utils/file"
import { createIndex, getIndexExists } from "../utils/indexes"
import type { GitHubAsset, GitHubRelease } from "../types/github"
import type { IndexSetupResult } from "../types/indexes"

export async function setupJmdictIndex(): Promise<IndexSetupResult> {
  const { name: indexName } = CONFIG.meilisearch.indexes.jmdict
  
  try {
    if (await getIndexExists(indexName)) {
      console.log('Jmdict index already exists, skipping')
      return { success: true, indexName, documentCount: 0 }
    }

    const jmdictData = await downloadAndProcessJmdict()
    await createIndex(indexName, jmdictData, CONFIG.meilisearch.indexes.jmdict.settings)
    
    return { 
      success: true, 
      indexName,
      documentCount: jmdictData.length 
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Failed to setup JMDict index:', errorMessage)
    
    return { 
      success: false, 
      indexName,
      error: errorMessage 
    }
  }
}

async function getLatestJmdictUrl(): Promise<string> {
  const { 
    github: { apiBaseUrl: githubBaseUrl, repositories: { jmdictSimplified } },
    files: {
      jmdict: {
        fallbackUrl
      }
    }
  } = CONFIG
  try {
    const release: GitHubRelease = await client(`${githubBaseUrl}/${jmdictSimplified}`).json()

    const asset: GitHubAsset | undefined = release.assets.find(asset => 
      asset.name.includes('jmdict-examples-eng') && 
      asset.name.endsWith('.json.zip')
    )
    
    if (!asset) {
      throw new Error('Could not find jmdict-examples-eng JSON zip file in latest release')
    }
    
    console.log(`Found latest release: ${release.tag_name}`)
    console.log(`Asset: ${asset.name}`)
    
    return asset.browser_download_url
  } catch (error) {
    console.error('Failed to fetch latest release:', error)
    console.log('Falling back to hardcoded URL...')
    return fallbackUrl
  }
}

async function downloadAndProcessJmdict() {
  const { download: { folder }, files: { jmdict: { processedFilename, rawFilename } } } = CONFIG
  
  const url = await getLatestJmdictUrl()
  console.log(`Downloading from: ${url}`)
  
  const filePath = await downloadAndExtractZip(url, rawFilename)
  console.log(`File extracted to: ${filePath}`)
  
  await extractWordsArray(filePath, folder + processedFilename) 
  return await Bun.file(folder + processedFilename).json()
}