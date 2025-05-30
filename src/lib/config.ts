import type { Config } from "../types";

export const CONFIG = {
  download: {
    folder: '.download/',
  },
  files: {
    jmdict: {
      rawFilename: 'jmdict-raw.json',
      processedFilename: 'jmdict.json'
    }
  }
} satisfies Config