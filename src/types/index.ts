import type { extensions } from "../lib/constants";
import type { GithubConfig } from "./github"
import type { Index } from "./indexes"

export type SupportedExtension = typeof extensions[number]

export type Folders = {
  downloads: string;
  extracts: string;
  dictionaries: string;
  dict: string
}

export type RemoteFile = {
  source: "remote";
  fallbackUrl: string;
  match: string;
  filename: string;
  arrayToExtract: string;
}

export type LocalFile = {
  source: "local";
  filename: string;
}

export type File = RemoteFile | LocalFile;

export type IndexSettings = {
  distinctAttribute: string;
  rankingRules: string[];
  searchableAttributes: string[]
  sortableAttributes?: string[]
  filterableAttributes?: string[]
  typoTolerance?: {
    enabled: boolean;
    minWordSizeForTypos: {
      oneTypo: number,
      twoTypos: number
    }
  }
}

export type Meilisearch = {
  indexes: Record<Index, {
    name: Index,
    settings: IndexSettings;
  }>,
}

export type Config = {
  github: GithubConfig
  folders: Folders;
  files: Record<Index, File>
  meilisearch: Meilisearch
}

export type ProcessingResult<T = unknown> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
  code?: string;
}