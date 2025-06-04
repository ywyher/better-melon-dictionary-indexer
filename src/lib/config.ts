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
      fallbackUrl: "https://github.com/scriptin/jmdict-simplified/releases/download/3.6.1%2B20250526122839/jmdict-examples-eng-3.6.1+20250602123110.json.zip",
      match: "jmdict-examples-eng",
      rawFilename: 'jmdict-raw.json',
      processedFilename: 'jmdict.json',
      arrayToExtract: 'words',
    },
    jmnedict: {
      fallbackUrl: "https://github.com/scriptin/jmdict-simplified/releases/download/3.6.1%2B20250526122839/jmnedict-all-3.6.1+20250602123110.json.zip",
      match: "jmnedict-all",
      rawFilename: 'jmnedict-raw.json',
      processedFilename: 'jmnedict.json',
      arrayToExtract: 'words',
    },
    kanjidic2: {
      fallbackUrl: "https://github.com/scriptin/jmdict-simplified/releases/download/3.6.1%2B20250602123110/kanjidic2-en-3.6.1+20250602123110.json.zip",
      match: "kanjidic2-en",
      rawFilename: 'kanjidic2-raw.json',
      processedFilename: 'kanjidic2.json',
      arrayToExtract: 'characters',
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
            "words",
            "typo",
            "sort",
            "proximity",
            "attribute"
          ],
          searchableAttributes: [
            "kana.text",
            "kanji.text", 
            "id"
          ],
          filterableAttributes: [
            "kana",
            "kanji",
            "kana.text",
            "kanji.text",
            "isKana",
            "id",
          ],
          sortableAttributes: [
            "kana.text",
            "kanji.text",
            "isKana",
            "kana.common",
            "kanji.common",
          ],
          typoTolerance: {
            "enabled": true,
            "minWordSizeForTypos": {
              "oneTypo": 4,
              "twoTypos": 8
            }
          },
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
            "exactness",
            "sort"
          ],
          searchableAttributes: [
            "id",
            "kanji.text", 
            "kana.text",
            "translation.translation.text"
          ]
        }
      },
      kanjidic2: {
        name: 'kanjidic2',
        settings: {
          distinctAttribute: "literal",
          rankingRules: [
            "exactness",
            "typo", 
            "words",
            "proximity",
            "attribute",
            "sort",
          ],
          searchableAttributes: [
            "literal", 
            "readingMeaning.groups.meaning.value",
          ],
          filterableAttributes: [
            "literal",
            "readingMeaning"
          ]
        }
      }
    }
  }
} satisfies Config