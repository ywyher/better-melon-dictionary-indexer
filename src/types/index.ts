export type Config = {
  download: { 
    folder: string
  },
  files: { 
    jmdict: { 
      processedFilename: string, 
      rawFilename: string
    } 
  }
}