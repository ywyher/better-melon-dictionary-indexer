import path from 'path'
import yauzl from 'yauzl-promise'
import { createWriteStream } from 'fs'
import { mkdir } from 'fs/promises'
import { pipeline } from 'stream/promises'
import { CONFIG } from '../lib/config'
import { clearLine, client, colors, createProgressBar, formatBytes } from '../lib/ky'
import type { JMdictWord } from '@scriptin/jmdict-simplified-types'
import type { Index } from '../types/indexes'
import type { GitHubAsset, GitHubRelease } from '../types/github'
import { fileExists, getFilePath, isRemoteFile, validateExtension, validateRequiredParams } from './utils'
import type { ProcessingResult } from '../types'

const { folders: { downloads, extracts } } = CONFIG

export async function downloadFile({ url, filename, extension } :{
  url: string,
  filename: string,
  extension: string,
}): Promise<ProcessingResult<string>> {
  validateRequiredParams({ url, filename, extension });
  validateExtension(extension)
  
  try {
    const filePath = getFilePath(downloads, filename, extension)
    if (await fileExists(filePath)) {
      console.log('File exists, using cached version');
      return {
        success: true,
        data: filePath
      };
    }

    console.log(`Downloading ${filename}.${extension}...`)
    const response = await client(url, {
      onDownloadProgress(progress) {
        const percent = Math.round(progress.percent * 100);
        const downloaded = formatBytes(progress.transferredBytes);
        const total = formatBytes(progress.totalBytes);
        const progressBar = createProgressBar(percent);
        
        // Clear the current line and write the progress
        clearLine();
        process.stdout.write(
          `${colors.cyan}Downloading:${colors.reset} ` +
          `${progressBar} ` +
          `${colors.bright}${percent}%${colors.reset} ` +
          `${colors.dim}(${downloaded} / ${total})${colors.reset}`
        );
        
        // Add a newline when download is complete
        if (percent === 100) {
          console.log(`\n${colors.green}✓ Download completed!${colors.reset}`);
        }
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.arrayBuffer()
    await Bun.write(filePath, data)

    return {
      success: true,
      data: filePath
    }
  } catch(error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Download failed: ${message}`,
      code: 'DOWNLOAD_ERROR'
    };
  }
}

export async function extractZip({ zipFilePath, extension, outputFilename }: {
  zipFilePath: string, 
  outputFilename: string, 
  extension: string
}): Promise<ProcessingResult<string>> {
  validateRequiredParams({ zipFilePath, outputFilename, extension });
  validateExtension(extension)

  try {
    const outputPath = getFilePath(extracts, outputFilename, extension);
    if (await fileExists(outputPath)) {
      console.log('Extracted file exists, using cached version');
      return {
        success: true,
        data: outputPath
      };
    }

    const fileBuffer = await Bun.file(zipFilePath).arrayBuffer()
    const zipBuffer = Buffer.from(new Uint8Array(fileBuffer));
  
    const zip = await yauzl.fromBuffer(zipBuffer)
    let extractedFilePath: string | null = null

    for await (const entry of zip) {
      const fullPath = path.join(outputPath)
      await mkdir(path.dirname(fullPath), { recursive: true })
      const readStream = await entry.openReadStream()
      const writeStream = createWriteStream(fullPath)
      await pipeline(readStream, writeStream)

      extractedFilePath = fullPath
    }
    
    if (!extractedFilePath) {
      throw new Error('No files were extracted from the zip archive')
    }
    
    await zip.close()
    return {
      success: true,
      data: extractedFilePath
    }
  } catch(error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Extraction failed: ${message}`,
      code: 'EXTRACTION_ERROR'
    };
  }
}

export async function extractArray({ arrayKey, jsonFilePath }: {
  arrayKey: string,
  jsonFilePath: string,
}): Promise<unknown[]> {
  validateRequiredParams({ arrayKey, jsonFilePath });

  try {
    if (!(await fileExists(jsonFilePath))) {
      throw new Error(`File not found: ${jsonFilePath}`);
    }
    
    const jsonData = await Bun.file(jsonFilePath).json()
    
    const extractedArray = jsonData[arrayKey];
    if (!Array.isArray(extractedArray)) {
      throw new Error(`Property '${arrayKey}' is not an array or doesn't exist in the JSON file`);
    }
    
    console.log(`Extracted ${extractedArray.length} items`);
    return extractedArray;
    
  } catch (error) {
    console.error('Error extracting array:', error);
    throw error;
  }
}

export async function getLatestIndexUrl(index: Index): Promise<string> {
  const { 
    github: { apiBaseUrl: githubBaseUrl, repositories: { jmdictSimplified } },
    files
  } = CONFIG;

  const fileConfig = files[index];
  
  if (!isRemoteFile(fileConfig)) {
    throw new Error(`Cannot get URL for local file: ${index}`);
  }

  const { fallbackUrl, match } = fileConfig;
  
  try {
    const release: GitHubRelease = await client(`${githubBaseUrl}/${jmdictSimplified}`).json();

    const asset: GitHubAsset | undefined = release.assets.find(asset => 
      asset.name.includes(match) && 
      asset.name.endsWith('.json.zip')
    );
    
    if (!asset) {
      console.warn(`Could not find ${match} JSON zip file in latest release, using fallback`);
      return fallbackUrl;
    }
    
    console.log(`Found latest release: ${release.tag_name}`);
    console.log(`Asset: ${asset.name}`);
    
    return asset.browser_download_url;
    
  } catch (error) {
    console.error('Failed to fetch latest release:', error);
    console.log('Falling back to hardcoded URL...');
    return fallbackUrl;
  }
}