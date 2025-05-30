import { CONFIG } from "../lib/config"
import { client } from "../lib/ky"
import { meili } from "../lib/meilisearch"
import type { GitHubRelease } from "../types/github"
import { downloadAndExtractZip, extractWordsArray } from "../utils/file"
import { getIndexExists } from "../utils/meilisearch"

async function getLatestJmdictUrl(): Promise<string> {
  const apiUrl = "https://api.github.com/repos/scriptin/jmdict-simplified/releases/latest"
  
  try {
    const response = await client(apiUrl)
    if (!response.ok) {
      throw new Error(`GitHub API request failed: ${response.status}`)
    }
    
    const release: GitHubRelease = await response.json()
    
    // Find the English examples JSON zip file
    const asset = release.assets.find(asset => 
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
    return "https://github.com/scriptin/jmdict-simplified/releases/download/3.6.1%2B20250526122839/jmdict-examples-eng-3.6.1+20250526122839.json.zip"
  }
}

export async function setupJmdictIndex() {
  const indexName = 'jmdict'
  const {
    download: {
      folder
    },
    files: { 
      jmdict: { 
        processedFilename, 
        rawFilename
      } 
    } 
  } = CONFIG
  
  try {
    const url = await getLatestJmdictUrl()
    console.log(`Using URL: ${url}`)
    
    const filePath = await downloadAndExtractZip(
      url,
      rawFilename
    )
    console.log(`File extracted to: ${filePath}`)
    
    await extractWordsArray(
      filePath,
      folder + processedFilename
    )
    
    const jmdictData = await Bun.file(folder + processedFilename).json()
    
    const exists = await getIndexExists(indexName)
    if (exists) {
      console.log("JMDict index already exists")
      return
    }

    console.log("Creating JMDict index...")
    const index = meili.index(indexName)

    const addedDocument = await index.addDocuments(jmdictData)
    console.log("Documents added:", addedDocument)

    await index.updateSettings({
      distinctAttribute: "id",
      rankingRules: [
        "words",
        "typo", 
        "proximity",
        "attribute",
        "sort",
        "exactness"
      ],
      searchableAttributes: [
        "id",
        "kanji.text",
        "kana.text", 
        "sense.gloss.text"
      ]
    })

    console.log("JMDict index settings updated")
    console.log("JMDict setup completed successfully")
    
  } catch (error) {
    console.error(error)
  }
}