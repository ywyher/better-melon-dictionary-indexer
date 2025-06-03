import type { GithubConfig } from "./github"
import type { Index } from "./indexes"

export type Download = {
  folder: string
}

export type File = {
  fallbackUrl: string
  match: string
  processedFilename: string, 
  rawFilename: string
  arrayToExtract: string
}

export type IndexSettings = {
  distinctAttribute: string;
  rankingRules: string[];
  searchableAttributes: string[]
  sortableAttributes?: string[]
  filterableAttributes?: string[]
}

export type Meilisearch = {
  indexes: Record<Index, {
    name: Index,
    settings: IndexSettings;
  }>,
}

export type Config = {
  github: GithubConfig
  download: Download
  files: Record<Index, File>
  meilisearch: Meilisearch
}