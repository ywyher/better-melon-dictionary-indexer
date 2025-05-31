import type { Config } from "../types";

export const CONFIG = {
  github: {
    apiBaseUrl: 'https://api.github.com',
    repositories: {
      jmdictSimplified: 'repos/scriptin/jmdict-simplified/releases/latest'
    }
  },
  download: {
    folder: '.download/',
  },
  files: {
    jmdict: {
      fallbackUrl: "https://github.com/scriptin/jmdict-simplified/releases/download/3.6.1%2B20250526122839/jmdict-examples-eng-3.6.1+20250526122839.json.zip",
      rawFilename: 'jmdict-raw.json',
      processedFilename: 'jmdict.json'
    },
    jmnedict: {
      fallbackUrl: "https://github.com/scriptin/jmdict-simplified/releases/download/3.6.1%2B20250526122839/jmnedict-all-3.6.1+20250526122839.json.zip",
      rawFilename: 'jmnedict-raw.json',
      processedFilename: 'jmnedict.json'
    },
  },
  meilisearch: {
    indexes: {
      jmdict: {
        name: 'jmdict',
        settings: {
          distinctAttribute: "id",
          rankingRules: [
            "exactness",
            "typo",
            "words",
            "proximity",
            "attribute",
            "sort"
          ],
          searchableAttributes: [
            "kana.text",
            "kanji.text",
            "id"
          ],
        }
      },
      jmnedict: {
        name: 'jmnedict',
        settings: {
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
            "translation.translation.text"
          ]
        }
      }
    }
  }
} satisfies Config