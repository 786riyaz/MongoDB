# MongoDB Insert Operations

## Insert a Single Document

```js
// Example: insert a single document into the "users" collection
db.users.insertOne({
  name: "Riyaz",
  age: 25,
  city: "Ahmedabad"
})
```

---

## Insert Multiple Documents

```js
// Example: insert multiple documents into the "users" collection
db.users.insertMany([
  { name: "Riyaz", age: 25, city: "Ahmedabad" },
  { name: "Arbaz", age: 24, city: "Ahmedabad" },
  { name: "Neha", age: 27, city: "Surat" }
])
```

---

## Insert Many Documents (Unordered Insert)

```js
// Option: unordered insert so other inserts continue on error
db.users.insertMany([
  { name: "A", age: 20 },
  { _id: 1, name: "B" } // suppose _id conflict
], { ordered: false })
```

---

## Notes

* `insertOne()` inserts **a single document**
* `insertMany()` inserts **multiple documents**
* When `ordered: false` is used:

  * MongoDB continues inserting remaining documents even if one fails
  * Useful for bulk imports where partial success is acceptable