export type Index = 'jmdict' | 'jmnedict'

export type IndexSetupResult =  {
  success: boolean
  indexName: string
  documentCount?: number
  error?: string
}