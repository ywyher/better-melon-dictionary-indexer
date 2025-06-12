import { CONFIG } from "../lib/config"
import { downloadFile, extractArray, extractZip, getLatestIndexUrl } from "../utils/file"
import { createIndex, getIndexExists } from "../utils/indexes"
import { isRemoteFile } from "../utils/utils";

export async function initializeJMnedict() {
  const index = 'jmnedict'

  const { 
    folders: { downloads, extracts, dictionaries },
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

    if (!isRemoteFile(fileConfig)) {
      return {
        success: false,
        indexName,
        error: `Expected remote file configuration for ${index}`
      };
    }

    const { arrayToExtract, filename } = fileConfig;

    const url = await getLatestIndexUrl(index);
    const downloadResult = await downloadFile({
      url, 
      filename, 
      extension: 'zip'
    });
    
    if (!downloadResult.success) {
      throw new Error(downloadResult.error || 'Download failed');
    }

    const extractResult = await extractZip({
      zipFilePath: `${downloads}${filename}.zip`,
      outputFilename: filename, 
      extension: 'json'
    });

    if (!extractResult.success) {
      throw new Error(extractResult.error || 'Extraction failed');
    }

    const extractedArray = await extractArray({
      arrayKey: arrayToExtract, 
      jsonFilePath: `${extracts}${filename}.json`,
    });

    await Bun.write(
      `${dictionaries}${filename}.json`, 
      JSON.stringify(extractedArray)
    );

    await createIndex('jmnedict', extractedArray, settings)
    
    return { 
      success: true, 
      indexName,
      documentCount: extractedArray.length 
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