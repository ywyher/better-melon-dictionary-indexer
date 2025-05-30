export type GitHubAsset = {
  name: string
  browser_download_url: string
}

export type GitHubRelease = {
  tag_name: string
  assets: GitHubAsset[]
}