import { CONFIG } from "../lib/config"
import { downloadFile, extractArray, extractZip, getLatestIndexUrl } from "../utils/file"
import { createIndex, getIndexExists } from "../utils/indexes"
import { isLocalFile, isRemoteFile } from "../utils/utils";

export async function initializeNHK() {
  const index = 'nhk'

  const { 
    folders: { dict, extracts, dictionaries },
    files,
    meilisearch: { indexes }
  } = CONFIG;
  
  const fileConfig = files[index];
  const indexConfig = indexes[index];

  if (!fileConfig || !indexConfig) {
    return {
      success: false,
      indexName: index,
      error: `Configuration not found for index: ${index}`
    };
  }

  try {
    const { name: indexName, settings } = indexConfig;

    if (await getIndexExists(indexName)) {
      console.log(`${index} index already exists, skipping`)
      return { success: true, indexName, documentCount: 0 }
    }

    if (!isLocalFile(fileConfig)) {
      return {
        success: false,
        indexName: index,
        error: `Expected remote file configuration for ${index}`
      };
    }

    const { filename } = fileConfig;

    const extractResult = await extractZip({
      zipFilePath: `${dict}${filename}.zip`,
      outputFilename: filename, 
      extension: 'json'
    });

    if (!extractResult.success) {
      throw new Error(extractResult.error || 'Extraction failed');
    }
    return { 
      success: true, 
      indexName,
      // documentCount: processedData.length 
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`Failed to setup ${index} index:`, errorMessage)
    
    return { 
      success: false, 
      indexName: index,
      error: errorMessage 
    }
  }
}