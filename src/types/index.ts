import type { GithubConfig } from "./github"
import type { Index } from "./indexes"

export type Download = {
  folder: string
}

export type File = {
  fallbackUrl: string
  processedFilename: string, 
  rawFilename: string
}

export type IndexSettings = {
  distinctAttribute: string;
  rankingRules: string[];
  searchableAttributes: string[]
  sortableAttributes?: string[]
}

export type Meilisearch = {
  indexes: {
    jmdict: {
      name: Index,
      settings: IndexSettings;
    },
    jmnedict: {
      name: Index,
      settings: IndexSettings
    }
  }
}

export type Config = {
  github: GithubConfig
  download: Download
  files: {
    jmdict: File,
    jmnedict: File
  },
  meilisearch: Meilisearch
}