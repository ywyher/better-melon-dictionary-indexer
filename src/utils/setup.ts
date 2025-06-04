import { CONFIG } from "../lib/config"
import { client } from "../lib/ky"
import { addExtraJMdictInfo, addIncrementalIds, downloadAndExtractZip, extractArray } from "./file"
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

async function getLatestIndexUrl(index: Index): Promise<string> {
  const { 
    github: { apiBaseUrl: githubBaseUrl, repositories: { jmdictSimplified } },
    files: {
      [index]: {
        fallbackUrl,
        match
      }
    }
  } = CONFIG
  try {
    const release: GitHubRelease = await client(`${githubBaseUrl}/${jmdictSimplified}`).json()

    const asset: GitHubAsset | undefined = release.assets.find(asset => 
      asset.name.includes(match) && 
      asset.name.endsWith('.json.zip')
    )
    
    if (!asset) {
      throw new Error(`Could not find ${match} JSON zip file in latest release`)
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

async function downloadAndProcessIndex(index: Index) {
  try {
    const { download: { folder }, files: { [index]: { processedFilename, rawFilename, arrayToExtract } } } = CONFIG
    
    const url = await getLatestIndexUrl(index)
    console.log(`Downloading from: ${url}`)
    
    const filePath = await downloadAndExtractZip(url, rawFilename)
    console.log(`File extracted to: ${filePath}`)
    
    let data;
    if(index == 'kanjidic2') {
      const extractedData = await extractArray(arrayToExtract, filePath, folder + processedFilename) 
      if(!extractedData) return;
      
      data = addIncrementalIds(extractedData, 'id', 1)
    }else if(index == 'jmdict') {
      const extractedData = await extractArray(arrayToExtract, filePath, folder + processedFilename) 
      if(!extractedData) return;
      
      data = addExtraJMdictInfo(extractedData)
    }else {
      data = await extractArray(arrayToExtract, filePath, folder + processedFilename) 
    }

    if(!data) throw new Error(`Failed to download and process ${index}`)

    console.log(data)
    
    const fileToWrite = await Bun.write(folder + processedFilename, JSON.stringify(data))
    if(!fileToWrite) throw new Error(`Failed to create ${processedFilename}`)

    return await Bun.file(folder + processedFilename).json()
  } catch (error) {
    console.error('Error extracting words array:', error)
    throw error
  }
}