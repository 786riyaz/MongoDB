# MongoDB Update Operations Guide

---

## 1) Basic: Update a Single Document (`updateOne`)

### Example — Update a Single User by Name

```js
db.users.updateOne(
  { name: "Riyaz" },
  { $set: { age: 31 } }
)
```

### Example — Update One Inventory Item (Nested Field, Status, Last Modified Date)

```js
db.inventory.updateOne(
  { item: "paper" },
  {
    $set: { "size.uom": "cm", status: "P" },
    $currentDate: { lastModified: true }
  }
)
```

---

## 2) Multi-Document Updates (`updateMany`)

### Example — Update Many Users (Change City)

```js
db.users.updateMany(
  { city: "Delhi" },
  { $set: { city: "New Delhi" } }
)
```

### Example — Update Inventory Documents Where `qty < 50`

```js
db.inventory.updateMany(
  { qty: { $lt: 50 } },
  {
    $set: { "size.uom": "in", status: "P" },
    $currentDate: { lastModified: true }
  }
)
```

---

## 3) Replace a Document (`replaceOne`)

### Example — Replace the Document for Item `"paper"`

```js
db.inventory.replaceOne(
  { item: "paper" },
  {
    item: "paper",
    instock: [
      { warehouse: "A", qty: 60 },
      { warehouse: "B", qty: 40 }
    ]
  }
)
```

---

## 4) Bulk Updates Affecting All Documents (Match All `{}`)

### Set a New Field on All Documents

```js
db.users.updateMany(
  {},     // Match all documents
  { $set: { status: "active" } }
)
```

### Remove a Field from All Documents

```js
db.users.updateMany(
  {},     // Match all documents
  { $unset: { status: "" } }   // empty string or true removes the field
)
```

### Increment a Numeric Field on All Documents

```js
db.users.updateMany(
  {},     // Match all documents
  { $inc: { loginCount: 1 } }
)
```

### Increment a Field in a Single Document

```js
db.products.updateOne(
  { _id: 1 },
  { $inc: { stock: -2 } }
)
```

### Alternate Examples (Same Intent)

```js
db.people.updateMany({}, { $set: { join_date: new Date() } })
db.people.updateMany({}, { $unset: { join_date: "" } })
```

---

## 5) Update a Nested Field in a Single Document

### Example — Nested Path Update with `$currentDate`

```js
db.users.updateOne(
  { productName: "US Polo Shirt" },
  {
    $set: { "size.oum": "cm", status: "available" },
    $currentDate: { lastModified: true }
  }
)
```

---

## 6) Remove a Field (`$unset`) — Not the Whole Document

### Unset (Remove) a Temporary Field from All Documents

```js
db.users.updateMany(
  {},
  { $unset: { temporaryField: "" } }
)
```

### Notes on `$unset`

* `$unset` removes the field entirely from matched documents
* `{ field: "" }` or `{ field: 1 }` — both remove the field

---

## 7) Increment Operator (`$inc`)

### Increment a Field for Matched Documents

```js
db.users.updateMany(
  {},
  { $inc: { loginCount: 1 } }
)
```

### Repeated Example (from Notes)

```js
db.users.updateMany(
  {},
  { $inc: { loginCount: 1 } }
)
```

---

## 8) Upsert Examples (Create If No Match)

### `updateOne` with Upsert

```js
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { name: "New User", city: "Vadodara" } },
  { upsert: true }
)
```

### `updateMany` with Upsert (Runs Once If No Match)

```js
db.users.updateMany(
  { city: "Unknown" },
  { $set: { city: "Ahmedabad" } },
  { upsert: true }
)
```

### `findOneAndUpdate` with Upsert and Return Updated Document

```js
db.users.findOneAndUpdate(
  { username: "riju" },
  { $set: { lastLogin: new Date() } },
  { upsert: true, returnDocument: "after" }
)
```

### `findOneAndReplace` with Upsert

```js
db.users.findOneAndReplace(
  { username: "temp" },
  {
    username: "temp",
    role: "guest",
    createdAt: new Date()
  },
  { upsert: true, returnDocument: "after" }
)
```

### Legacy `findAndModify` with Upsert

```js
db.runCommand({
  findAndModify: "users",
  query: { email: "someone@example.com" },
  update: { $set: { active: true } },
  upsert: true,
  new: true
})
```

---

## 9) `findOneAndUpdate` / `findOneAndReplace` / `returnDocument`

* `findOneAndUpdate` returns a document (before or after update)
* Use `returnDocument: "after"` to get the updated document
* `findOneAndReplace` replaces the entire document (unless using upsert)

---

## 10) Bulk Write Operations (`bulkWrite`)

### Example — Mix Insert, Update, Delete Operations

```js
db.users.bulkWrite([
  {
    insertOne: {
      document: { name: "BulkUser1", age: 30 }
    }
  },
  {
    updateOne: {
      filter: { name: "Riyaz" },
      update: { $set: { city: "Gandhinagar" } },
      upsert: false
    }
  },
  {
    updateOne: {
      filter: { username: "new_user" },
      update: { $set: { username: "new_user", active: true } },
      upsert: true
    }
  },
  {
    deleteOne: {
      filter: { name: "Some Obsolete User" }
    }
  }
], { ordered: true })
```

### Notes

* `bulkWrite` returns a summary result object
* `ordered: true` → stops on first error
* `ordered: false` → continues execution even after errors

---

## 11) `updateMany()` and `$unset` — Explanation & Examples

### `updateMany` Syntax

```js
db.collection.updateMany(
  filter,
  update,
  options
)
```

### Examples

```js
db.users.updateMany({}, { $set: { status: "active" } })
db.users.updateMany({}, { $inc: { loginCount: 1 } })
```

### `$unset` Operator

```js
db.collection.updateMany({}, { $unset: { field1: "", field2: "" } })
```

**Before**

```json
{ "_id": 1, "name": "Alice", "temporaryField": "to be removed" }
```

**After**

```json
{ "_id": 1, "name": "Alice" }
```

### When to Use `$unset`

* Remove obsolete fields
* Clean up documents
* Avoid storing unnecessary data

---

## 12) Reminders

* `upsert: true` inserts a new document if no match is found
* Common update operators: `$set`, `$inc`, `$unset`, `$currentDate`
* `$currentDate: { field: true }` sets current date
  Use `{ $type: "timestamp" }` for timestamps
* `replaceOne` replaces the entire document (keeps `_id` unless changed)
* Test updates using `find()` before executing large updates
* Always back up data before bulk updates in production

---

## Date Conversion Update Example

```js
db.orders.updateMany(
  {},
  [
    {
      $set: {
        orderDate: { $toDate: "$orderDate" }
      }
    }
  ]
)
```