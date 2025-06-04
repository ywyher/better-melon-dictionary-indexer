import path from 'path'
import yauzl from 'yauzl-promise'
import { createWriteStream } from 'fs'
import { mkdir } from 'fs/promises'
import { pipeline } from 'stream/promises'
import { CONFIG } from '../lib/config'
import { clearLine, client, colors, createProgressBar, formatBytes } from '../lib/ky'
import type { JMdictWord } from '@scriptin/jmdict-simplified-types'
import { isHiragana, isKatakana } from 'wanakana'

const { download: { folder } } = CONFIG

export async function downloadAndExtractZip(
  url: string,
  filename: string
): Promise<string> {
  if (!url || !filename) {
    throw new Error('URL and filename are required')
  }
  
  try {
    const fileExist = await Bun.file(folder + filename).exists()
    if(fileExist) {
      console.log('File exists using cached version')
      return folder + filename
    }

    console.log('Downloading zip file...')
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
  
    const uint8Array = new Uint8Array(await response.arrayBuffer())
    const zipBuffer = Buffer.from(uint8Array)
  
    const zip = await yauzl.fromBuffer(zipBuffer)
    let extractedFilePath: string | null = null

    for await (const entry of zip) {
      const fullPath = path.join(folder, filename)
      await mkdir(path.dirname(fullPath), { recursive: true })
      const readStream = await entry.openReadStream()
      const writeStream = createWriteStream(fullPath)
      await pipeline(readStream, writeStream)

      extractedFilePath = fullPath
      console.log(`fullPath`, fullPath)
    }
    if (!extractedFilePath) {
      throw new Error('No files were extracted from the zip archive')
    }
    
    await zip.close()
    return extractedFilePath
  } catch(error) {
    if (error instanceof Error) {
      throw new Error(`Download failed: ${error.message}`)
    }
    throw error
  }
}

export async function extractArray(array: string, inputFilePath: string, outputFilePath: string) {
  try {
    const fileExists = await Bun.file(outputFilePath).exists()
    if(fileExists) {
      console.log('File exists. nothing will be extracted')
      return await Bun.file(outputFilePath).json();
    }

    const jsonData = await Bun.file(inputFilePath).json()
    
    const extractedArray = jsonData[array]
    if (!Array.isArray(extractedArray)) {
      throw new Error('No words array found in the JSON file')
    }
    
    console.log(`Extracted ${extractedArray.length} words`)
    return extractedArray;
  } catch (error) {
    console.error('Error extracting words array:', error)
    throw error
  }
}

export function addIncrementalIds<T>(data: T[], idField: string = 'id', startFrom: number = 1): (T & Record<string, number>)[] {
  return data.map((item, index) => ({
    ...item,
    [idField]: startFrom + index
  }))
}

export function addExtraJMdictInfo(data: JMdictWord[]) {
  return data.map((item) => {
    const isKana = (!item.kanji.length && item.kana.length) ? true : false
    
    return {
      ...item,
      isKana,
    }
  })
}