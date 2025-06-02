# What is it ?
An API made using meilisearch to search required dictionaries for [Better Melon](https://github.com/ywyher/better-melon) at high speed

# Roadmap

## Supported dictionaries
- JMdict

# Quick Start

## 1. Clone this repo
```sh
git clone https://github.com/ywyher/better-melon-dictionary-indexer ./better-melon-dictionary-indexer
cd ./better-melon-dictionary-indexer
```

## 2. Setup enviroment variables
```.env
HOST=http://localhost:7700
PORT=7700
API_KEY= # master key for meilisearch -> 16 bytes or more
```

## 3. Build the indexes
```bash
bun run build
```


# Credit
- [Better Melon](https://github.com/ywyher/better-melon) -> what is the purpose of better-melon-dictionary-indexer without better-melon am i right ??
- [Electronic Dictionary Research and Development Group](https://www.edrdg.org/) -> all dictionaries used belongs to them
- [ywyh (Me)](https://github.com/ywyher) – for being goated ig
