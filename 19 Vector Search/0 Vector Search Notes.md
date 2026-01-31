# MongoDB Atlas Vector Search

---

## Vector Search (MongoDB Atlas Vector Search)

Vector Search is used for **AI / semantic search** using **vector embeddings**.
It enables similarity search based on **meaning and context**, not just exact text matching.

---

## Create a Vector Search Index

```js
db.movies.createIndex({
  plotEmbedding: "vectorSearch"
})
```

---

## Perform a Vector Search Query

```js
db.movies.find({
  plotEmbedding: {
    $vectorSearch: {
      queryVector: [0.12, 0.45, 0.89, ...],
      numCandidates: 50,
      limit: 5
    }
  }
})
```

---

## Parameters Explained

* `queryVector`
  Vector embedding generated from AI models (e.g., OpenAI, Hugging Face)

* `numCandidates`
  Number of candidate vectors MongoDB evaluates internally

* `limit`
  Final number of most similar documents returned

---

## Use Cases

* Semantic movie or product recommendations
* AI-powered search engines
* Similar document matching
* Chatbots and RAG (Retrieval-Augmented Generation)
* Image, text, or audio similarity search

---

## Notes

* Available only on **MongoDB Atlas**
* Requires pre-generated **vector embeddings**
* Results are ranked by **vector similarity**
* Enables **meaning-based search**, not keyword-based search