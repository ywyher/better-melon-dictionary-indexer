import type { Config } from "../types";

export const CONFIG = {
  github: {
    apiBaseUrl: 'https://api.github.com',
    repositories: {
      jmdictSimplified: 'repos/scriptin/jmdict-simplified/releases/latest'
    }
  },
  folders: {
    downloads: '.downloads/',
    extracts: '.extracts/',
    dictionaries: '.dictionaries/',
    dict: 'dict/'
  },
  files: {
    jmdict: {
      source: 'remote',
      fallbackUrl: "https://github.com/scriptin/jmdict-simplified/releases/download/3.6.1%2B20250526122839/jmdict-examples-eng-3.6.1+20250602123110.json.zip",
      match: "jmdict-examples-eng",
      filename: 'jmdict',
      arrayToExtract: 'words',
    },
    jmnedict: {
      source: 'remote',
      fallbackUrl: "https://github.com/scriptin/jmdict-simplified/releases/download/3.6.1%2B20250526122839/jmnedict-all-3.6.1+20250602123110.json.zip",
      match: "jmnedict-all",
      filename: 'jmnedict',
      arrayToExtract: 'words',
    },
    kanjidic2: {
      source: 'remote',
      fallbackUrl: "https://github.com/scriptin/jmdict-simplified/releases/download/3.6.1%2B20250602123110/kanjidic2-en-3.6.1+20250602123110.json.zip",
      match: "kanjidic2-en",
      filename: 'kanjidic2',
      arrayToExtract: 'characters',
    },
    nhk: {
      source: "local" as const,
      filename: 'nhk',
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
      },
      nhk: {
        name: 'nhk',
        settings: {
          distinctAttribute: "text",
          rankingRules: [
            "exactness",
            "typo", 
            "words",
            "proximity",
            "attribute",
            "sort",
          ],
          searchableAttributes: [
            "text", 
            "pitch",
          ],
        }
      }
    }
  }
} satisfies Config