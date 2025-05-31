my meilisearch settings and indexer
```ts
export async function createIndex(indexName: Index, data: any[], settings: IndexSettings) {
  console.log(`Creating ${indexName} index...`)
  const index = meili.index(indexName)
  
  await index.updateSettings({
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
  })
  console.log(`${indexName} index settings updated`)

  const addedDocument = await index.addDocuments(data)
  console.log("Documents added:", addedDocument)  
}
```

my search function
```ts
export default async function searchJmdict(query: string): Promise<MeiliSearchResponse> {
  try {
    const index = await meili.getIndex('jmdict');
    const result: MeiliSearchResponse = await index.search(query);
    return result;
  } catch (error) {
    console.error('Error in searchJmdict:', error);
    throw new Error(`${error instanceof Error ? error.message : 'Failed to search jmdict: Unknown error'}`);
  }
}
```

my search query is simply か

i have these two entries in the jmdict dictionary that contains か in the `kana.text`
```ts
[
  {
  "id": "2220800",
  "kanji": [
    {
      "common": false,
      "text": "我",
      "tags": []
    }
  ],
  "kana": [
    {
      "common": false,
      "text": "が",
      "tags": [],
      "appliesToKanji": [
        "*"
      ]
    }
  ],
  "sense": [
    {
      "partOfSpeech": [
        "n"
      ],
      "appliesToKanji": [
        "*"
      ],
      "appliesToKana": [
        "*"
      ],
      "related": [],
      "antonym": [],
      "field": [
        "Buddh"
      ],
      "dialect": [],
      "misc": [],
      "info": [],
      "languageSource": [],
      "gloss": [
        {
          "lang": "eng",
          "gender": null,
          "type": null,
          "text": "obstinacy"
        }
      ],
      "examples": []
    },
    {
      "partOfSpeech": [
        "n"
      ],
      "appliesToKanji": [
        "*"
      ],
      "appliesToKana": [
        "*"
      ],
      "related": [],
      "antonym": [],
      "field": [],
      "dialect": [],
      "misc": [],
      "info": [],
      "languageSource": [],
      "gloss": [
        {
          "lang": "eng",
          "gender": null,
          "type": null,
          "text": "atman"
        },
        {
          "lang": "eng",
          "gender": null,
          "type": null,
          "text": "the self"
        },
        {
          "lang": "eng",
          "gender": null,
          "type": null,
          "text": "the ego"
        }
      ],
      "examples": []
    }
  ]
  },
  {
    "id": "2028930",
    "kanji": [],
    "kana": [
      {
        "common": true,
        "text": "が",
        "tags": [],
        "appliesToKanji": [
          "*"
        ]
      },
      {
        "common": false,
        "text": "ヶ",
        "tags": [
          "sk"
        ],
        "appliesToKanji": [
          "*"
        ]
      },
      {
        "common": false,
        "text": "ケ",
        "tags": [
          "sk"
        ],
        "appliesToKanji": [
          "*"
        ]
      }
    ],
    "sense": [
      {
        "partOfSpeech": [
          "prt"
        ],
        "appliesToKanji": [
          "*"
        ],
        "appliesToKana": [
          "*"
        ],
        "related": [],
        "antonym": [],
        "field": [],
        "dialect": [],
        "misc": [],
        "info": [],
        "languageSource": [],
        "gloss": [
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "indicates the subject of a sentence"
          }
        ],
        "examples": [
          {
            "source": {
              "type": "tatoeba",
              "value": "4995"
            },
            "text": "が",
            "sentences": [
              {
                "land": "jpn",
                "text": "「あの音で考え事ができないわ」と、彼女はタイプライターを見つめながら言った。"
              },
              {
                "land": "eng",
                "text": "\"I can't think with that noise,\" she said, staring at the typewriter."
              }
            ]
          }
        ]
      },
      {
        "partOfSpeech": [
          "prt"
        ],
        "appliesToKanji": [
          "*"
        ],
        "appliesToKana": [
          "*"
        ],
        "related": [],
        "antonym": [],
        "field": [],
        "dialect": [],
        "misc": [],
        "info": [
          "literary in modern Japanese; usu. written as ヶ in place names"
        ],
        "languageSource": [],
        "gloss": [
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "indicates possession"
          }
        ],
        "examples": []
      },
      {
        "partOfSpeech": [
          "conj",
          "prt"
        ],
        "appliesToKanji": [
          "*"
        ],
        "appliesToKana": [
          "*"
        ],
        "related": [],
        "antonym": [],
        "field": [],
        "dialect": [],
        "misc": [],
        "info": [],
        "languageSource": [],
        "gloss": [
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "but"
          },
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "however"
          },
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "(and) yet"
          },
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "though"
          },
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "although"
          },
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "while"
          }
        ],
        "examples": [
          {
            "source": {
              "type": "tatoeba",
              "value": "174777"
            },
            "text": "が",
            "sentences": [
              {
                "land": "jpn",
                "text": "言うまでもないことだがローマは１日にしては成らず。"
              },
              {
                "land": "eng",
                "text": "It goes without saying that Rome was not built in a day."
              }
            ]
          }
        ]
      },
      {
        "partOfSpeech": [
          "prt"
        ],
        "appliesToKanji": [
          "*"
        ],
        "appliesToKana": [
          "*"
        ],
        "related": [],
        "antonym": [],
        "field": [],
        "dialect": [],
        "misc": [],
        "info": [],
        "languageSource": [],
        "gloss": [
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "and"
          }
        ],
        "examples": []
      },
      {
        "partOfSpeech": [
          "prt"
        ],
        "appliesToKanji": [
          "*"
        ],
        "appliesToKana": [
          "*"
        ],
        "related": [],
        "antonym": [],
        "field": [],
        "dialect": [],
        "misc": [],
        "info": [],
        "languageSource": [],
        "gloss": [
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "used after an introductory remark or explanation"
          }
        ],
        "examples": []
      },
      {
        "partOfSpeech": [
          "prt"
        ],
        "appliesToKanji": [
          "*"
        ],
        "appliesToKana": [
          "*"
        ],
        "related": [],
        "antonym": [],
        "field": [],
        "dialect": [],
        "misc": [],
        "info": [
          "after the volitional or -まい form of a verb"
        ],
        "languageSource": [],
        "gloss": [
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "regardless of ..."
          },
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "whether ... (or not)"
          },
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "no matter ..."
          }
        ],
        "examples": []
      },
      {
        "partOfSpeech": [
          "prt"
        ],
        "appliesToKanji": [
          "*"
        ],
        "appliesToKana": [
          "*"
        ],
        "related": [],
        "antonym": [],
        "field": [],
        "dialect": [],
        "misc": [],
        "info": [],
        "languageSource": [],
        "gloss": [
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "indicates a desire or hope"
          }
        ],
        "examples": []
      },
      {
        "partOfSpeech": [
          "prt"
        ],
        "appliesToKanji": [
          "*"
        ],
        "appliesToKana": [
          "*"
        ],
        "related": [],
        "antonym": [],
        "field": [],
        "dialect": [],
        "misc": [],
        "info": [
          "at sentence end"
        ],
        "languageSource": [],
        "gloss": [
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "softens a statement"
          }
        ],
        "examples": []
      },
      {
        "partOfSpeech": [
          "prt"
        ],
        "appliesToKanji": [
          "*"
        ],
        "appliesToKana": [
          "*"
        ],
        "related": [],
        "antonym": [],
        "field": [],
        "dialect": [],
        "misc": [],
        "info": [
          "at sentence end"
        ],
        "languageSource": [],
        "gloss": [
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "indicates doubt"
          }
        ],
        "examples": []
      },
      {
        "partOfSpeech": [
          "prt"
        ],
        "appliesToKanji": [
          "*"
        ],
        "appliesToKana": [
          "*"
        ],
        "related": [],
        "antonym": [],
        "field": [],
        "dialect": [],
        "misc": [],
        "info": [
          "after a noun at the end of an interjection"
        ],
        "languageSource": [],
        "gloss": [
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "indicates scorn"
          }
        ],
        "examples": []
      }
    ]
  }
]
```

the result iam getting, these are just 2 i got 20
```JSON
  {
    "id": "2220800",
    "kanji": [
      {
        "common": false,
        "text": "我",
        "tags": []
      }
    ],
    "kana": [
      {
        "common": false,
        "text": "が",
        "tags": [],
        "appliesToKanji": [
          "*"
        ]
      }
    ],
    "sense": [
      {
        "partOfSpeech": [
          "n"
        ],
        "appliesToKanji": [
          "*"
        ],
        "appliesToKana": [
          "*"
        ],
        "related": [],
        "antonym": [],
        "field": [
          "Buddh"
        ],
        "dialect": [],
        "misc": [],
        "info": [],
        "languageSource": [],
        "gloss": [
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "obstinacy"
          }
        ],
        "examples": []
      },
      {
        "partOfSpeech": [
          "n"
        ],
        "appliesToKanji": [
          "*"
        ],
        "appliesToKana": [
          "*"
        ],
        "related": [],
        "antonym": [],
        "field": [],
        "dialect": [],
        "misc": [],
        "info": [],
        "languageSource": [],
        "gloss": [
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "atman"
          },
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "the self"
          },
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "the ego"
          }
        ],
        "examples": []
      }
    ]
  },
  {
    "id": "2224630",
    "kanji": [
      {
        "common": false,
        "text": "雅",
        "tags": []
      }
    ],
    "kana": [
      {
        "common": false,
        "text": "が",
        "tags": [],
        "appliesToKanji": [
          "*"
        ]
      }
    ],
    "sense": [
      {
        "partOfSpeech": [
          "n",
          "adj-na"
        ],
        "appliesToKanji": [
          "*"
        ],
        "appliesToKana": [
          "*"
        ],
        "related": [],
        "antonym": [
          [
            "俗",
            "ぞく・4",
            4
          ]
        ],
        "field": [],
        "dialect": [],
        "misc": [],
        "info": [],
        "languageSource": [],
        "gloss": [
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "elegance"
          },
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "grace"
          }
        ],
        "examples": []
      },
      {
        "partOfSpeech": [
          "n"
        ],
        "appliesToKanji": [
          "*"
        ],
        "appliesToKana": [
          "*"
        ],
        "related": [
          [
            "六義",
            1
          ]
        ],
        "antonym": [],
        "field": [],
        "dialect": [],
        "misc": [],
        "info": [],
        "languageSource": [],
        "gloss": [
          {
            "lang": "eng",
            "gender": null,
            "type": null,
            "text": "festal song (genre of the Shi Jing)"
          }
        ],
        "examples": []
      }
    ]
  },
```

my issue is i simply searched for が which contains no kanji
why did it prioritaize entries that contains kanji and it didn't even provide the one without the kanji that i needed !!

we need to fix this