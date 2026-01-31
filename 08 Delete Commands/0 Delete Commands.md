# MongoDB Delete Operations Guide

---

## Delete One Document

```js
db.<Collection Name>.deleteOne({ name: "Shraddha" })
```

---

## Delete Many Documents

### Delete All Documents in a Collection

```js
db.inventory.deleteMany({})
```

---

### Delete Documents Matching a Condition

```js
db.inventory.deleteMany({ status: "A" })
```

```js
db.<Collection Name>.deleteMany({ city: "Pune" })
```

---

## `findOneAndDelete()`

```js
db.collection.findOneAndDelete()
```

**Notes:**

* `findOneAndDelete()` provides a **sort option**
* The sort option allows deletion of the **first document** based on the specified order

---

## `findAndModify()`

```js
db.collection.findAndModify()
```

**Notes:**

* `findAndModify()` provides a **sort option**
* The sort option allows deletion of the **first document** based on the specified order

---

## Important Notes

* `deleteOne()` removes **only the first matched document**
* `deleteMany()` removes **all matched documents**
* `deleteMany({})` removes **all documents in a collection**
* Always verify documents with `find()` before deleting
* Prefer using filters to avoid accidental mass deletions

---