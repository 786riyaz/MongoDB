# MongoDB Collections Guide

## Creating a Collection

### Automatic Collection Creation

Collections are **automatically created** when the **first document is inserted**.

---

### Create a Collection (Basic)

```js
db.createCollection("<Collection Name>")
```

---

### Create a Capped Collection

```js
db.createCollection("products", {
  capped: true,
  size: 1000000,
  max: 100
})
```

---

### Another Example of a Capped Collection

```js
db.createCollection("log2", {
  capped: true,
  size: 5242880,
  max: 5000
})
```

> **Note:**
> The `size` field is **always required**, even when you specify the `max` number of documents.

---

### `autoIndexId` (Deprecated)

```js
// autoIndexId Deprecated in MongoDB version 3 or 4
db.createCollection(
  "products",
  { capped: true, size: 1000000, max: 100 },
  { autoIndexId: false }
)
```

---

## Show List of Collections

```js
show collections
```

---

## Drop a Collection

```js
db.<Collection Name>.drop()
```

---

## Check if a Collection is Capped

```js
db.nonCappedCollection1.isCapped()
db.cappedCollection1.isCapped()
```

---

## Convert a Collection to Capped

```js
db.runCommand({
  convertToCapped: "log2",
  size: 100000
})
```

---

## Modify a Capped Collection

### Change the Size of a Capped Collection

```js
db.runCommand({
  collMod: "log",
  cappedSize: 5242880
})
```

---

### Change Maximum Documents in a Capped Collection

```js
db.runCommand({
  collMod: "log",
  cappedMax: 5000
})
```

---

## Important Notes

* Capped collections **preserve insertion order**
* They have **fixed size**
* Old documents are **automatically overwritten**
* Ideal for **logs, events, and streaming data**