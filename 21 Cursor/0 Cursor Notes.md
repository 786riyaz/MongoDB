# MongoDB Cursor

---

## What Is a Cursor?

A **cursor** is a pointer to the **result set** of a `find()` query in MongoDB.
It allows MongoDB to return documents **incrementally**, rather than all at once.

---

## Create a Cursor

```js
const cursor = db.users.find({ age: { $gt: 20 } })
```

---

## Iterate Over Cursor Results

```js
cursor.forEach(doc => printjson(doc))
```

---

## Cursor Controls

You can control how documents are returned using cursor methods.

### Limit, Skip, and Sort

```js
cursor
  .limit(5)
  .skip(10)
  .sort({ age: -1 })
```

---

## Explanation

* `limit(5)` → returns only 5 documents
* `skip(10)` → skips the first 10 documents
* `sort({ age: -1 })` → sorts results by `age` in descending order
* Cursor operations are evaluated **lazily** (executed when iterated)

---

## Notes

* Cursors help handle **large result sets efficiently**
* Avoid large `skip()` values in production; prefer **range queries**
* Combine cursor methods to implement **pagination**
