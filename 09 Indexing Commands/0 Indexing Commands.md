# MongoDB Indexes Guide

Indexes enable **efficient query execution** in MongoDB.
Without appropriate indexes, queries require **collection scans**.

* Indexes **speed up read queries**
* Indexes add **overhead to writes and storage**
* Use indexes **selectively**, based on **query patterns** and **cardinality**

---

## Quick Summary / Recommendations

* Add indexes for fields used in **filters, sorts, and joins**
* Avoid excessive indexes on **high-write collections**
* Use **compound indexes** to match query shapes (**prefix order matters**)
* Use **partial / sparse indexes** to reduce index size when many documents lack the field
* Use **TTL indexes** for expiring data (sessions, caches)
* Use `explain()` and `$indexStats` to verify index usage and performance

---

## Common Commands (Basic)

### Create a Single-Field Index

```js
db.collection.createIndex({ fieldName: 1 })   // ascending
db.collection.createIndex({ fieldName: -1 })  // descending

db.users.createIndex({ name: 1 })
```

---

### Create Multiple Indexes

```js
db.users.createIndexes([
  { key: { name: 1 }, name: "name_index" },
  { key: { age: 1 }, name: "age_index" },
  { key: { email: 1 }, unique: true }
])
```

---

### Create Indexes Using `runCommand`

```js
db.runCommand({
  createIndexes: "customers",
  indexes: [
    {
      key: { name: 1 },
      name: "nameIndex"
    },
    {
      key: { emailID: -1 },
      name: "emailIndexDesc",
      unique: true
    }
  ]
})
```

---

## Advanced Indexing

---

### 1. Compound Indexes

```js
db.users.createIndex({ name: 1, age: -1 })   // name ascending, age descending
db.users.createIndex({ name: 1, age: 1 })    // name ascending, age ascending
```

---

### 2. Unique Indexes

```js
db.users.createIndex({ email: 1 }, { unique: true })
```

---

### 3. Text Indexes

```js
db.products.createIndex({ description: "text" })
db.products.find({ $text: { $search: "gaming laptop" } })
```

---

### 4. Hashed Indexes

```js
db.users.createIndex({ userId: "hashed" })
```

---

### 5. Wildcard Indexes

```js
db.inventory.createIndex({ "$**": 1 })
```

---

### 6. Partial Indexes

```js
db.orders.createIndex(
  { customerId: 1 },
  { partialFilterExpression: { status: "active" } }
)
```

---

### 7. Sparse Indexes

```js
db.users.createIndex({ phone: 1 }, { sparse: true })
```

---

### 8. TTL (Time-To-Live) Indexes

```js
db.sessions.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 }
)
```

---

### 9. View All Indexes

```js
db.users.getIndexes()
```

---

### 10. Drop Indexes

```js
db.users.dropIndex("name_1")
db.users.dropIndexes()
```

---

### 11. Explain Query (Check Index Usage)

```js
db.users.find({ name: "Riyaz" }).explain("executionStats")
```

---

### 12. Hint (Force MongoDB to Use a Specific Index)

```js
db.users.find({ name: "Riyaz" }).hint({ name: 1 })
```

---

### 13. Rename Index

```js
db.users.renameIndex("oldIndexName", "newIndexName")
```

```js
db.runCommand({
  collMod: "customers",
  index: {
    name: "name_1",
    newName: "customerNameIndex"
  }
})
```

---

### 14. Background Indexing (Legacy)

```js
db.users.createIndex({ age: 1 }, { background: true })
```

---

### 15. Index Statistics

```js
db.orders.aggregate([
  { $indexStats: {} }
])
```

---

### 16. Partial Filters

```js
db.users.createIndex(
  { username: 1 },
  {
    unique: true,
    partialFilterExpression: { age: { $gte: 21 } }
  }
)

db.contacts.createIndex(
  { name: 1 },
  { partialFilterExpression: { name: { $exists: true } } }
)
```

---

### 17. Hide Index (MongoDB 5.0+)

`hideIndex()` temporarily hides an index from the **query planner**.

* Hidden indexes are **not used by queries**
* Can still be used with `hint()`
* Useful for testing the impact of removing an index **without dropping it**

```js
db.restaurants.hideIndex({ borough: 1, ratings: 1 })
```

```js
db.restaurants.find({
  cuisine: "Italian",
  rating: { $gte: 8 }
})
```

---

## Summary Example

```js
db.users.createIndex({ name: 1 })
db.users.createIndex({ name: 1, age: -1 })
db.users.createIndex({ email: 1 }, { unique: true })
db.products.createIndex({ description: "text" })
db.logs.createIndex({ timestamp: 1 }, { expireAfterSeconds: 600 })
```

---

## MongoDB Indexing Best Practices

* **Use indexes for queries, not for data storage**
* **Avoid indexes on low-cardinality fields** (e.g., `status` with few values)
* **Use compound indexes to match query patterns**
* **Use partial/sparse indexes** when many documents lack the field
* **Use TTL indexes** for expiring data (sessions, caches)
* **Always verify index usage** with `explain()` and `$indexStats`