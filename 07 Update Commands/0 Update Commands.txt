--------------------------------------------------------------------------------
1) Basic: Update a single document (updateOne)
--------------------------------------------------------------------------------
Example — update a single user by name:
db.users.updateOne(
  { name: "Riyaz" },
  { $set: { age: 31 } }
)

Example — update one inventory item, set nested field, set status, update last modified date:
db.inventory.updateOne(
  { item: "paper" },
  {
    $set: { "size.uom": "cm", status: "P" },
    $currentDate: { lastModified: true }
  }
)
--------------------------------------------------------------------------------
2) Multi-document: Update many documents (updateMany)
--------------------------------------------------------------------------------
Example — update many users changing city:
db.users.updateMany(
  { city: "Delhi" },
  { $set: { city: "New Delhi" } }
)

Example — update many inventory docs matching qty < 50:
db.inventory.updateMany(
  { qty: { $lt: 50 } },
  {
    $set: { "size.uom": "in", status: "P" },
    $currentDate: { lastModified: true }
  }
)
--------------------------------------------------------------------------------
3) Replace a document (replaceOne)
--------------------------------------------------------------------------------
Replace example — replace the document for item "paper":
db.inventory.replaceOne(
  { item: "paper" },
  { item: "paper", instock: [ { warehouse: "A", qty: 60 }, { warehouse: "B", qty: 40 } ] }
)
--------------------------------------------------------------------------------
4) Bulk updates affecting all documents (match all: {})
--------------------------------------------------------------------------------
Set a new field on all documents:
db.users.updateMany(
  {},     // Match all documents
  { $set: { status: "active" } }
)

Remove a field from all documents:
db.users.updateMany(
  {},     // Match all documents
  { $unset: { status: "" } }   // use empty string or true; field name removed
)

Increment a numeric field on all documents:
db.users.updateMany(
  {},     // Match all documents
  { $inc: { loginCount: 1 } }
)

db.products.updateOne(
  { _id: 1 },
  { $inc: { stock: -2 } }
)

Alternate example (same intent):
db.people.updateMany( { }, { $set: { join_date: new Date() } } )
db.people.updateMany( { }, { $unset: { join_date: "" } } )
--------------------------------------------------------------------------------
5) Update a nested field in a single document (nested paths)
--------------------------------------------------------------------------------
Example — update nested field and $currentDate:
db.users.updateOne(
  { productName: "US Polo Shirt" },
  {
    $set: { "size.oum": "cm", status: "available" },
    $currentDate: { lastModified: true }
  }
)
--------------------------------------------------------------------------------
6) Remove a field (unset) — not the whole document
--------------------------------------------------------------------------------
Unset (remove) a temporary field from all documents:
db.users.updateMany(
  {},
  { $unset: { temporaryField: "" } }   // removes temporaryField
)

Notes on $unset:
- $unset removes the field entirely from matched documents.
- Use { field: "" } or { field: 1 } — both remove the field.
--------------------------------------------------------------------------------
7) Increment operator ($inc)
--------------------------------------------------------------------------------
Increment a field for matched documents (example: all docs):
db.users.updateMany(
  {},
  { $inc: { loginCount: 1 } }
)

(Another repeated example from notes:)
db.users.updateMany(
  {},
  { $inc: { loginCount: 1 } }
)
--------------------------------------------------------------------------------
8) Upsert examples (create if no match)
--------------------------------------------------------------------------------
updateOne with upsert — create if not found:
db.users.updateOne(
  { email: "user@example.com" },            // filter
  { $set: { name: "New User", city: "Vadodara" } }, // update
  { upsert: true }                          // options
)

updateMany with upsert (applies once when no docs match):
db.users.updateMany(
  { city: "Unknown" },
  { $set: { city: "Ahmedabad" } },
  { upsert: true }
)

findOneAndUpdate with upsert and return new/updated document:
db.users.findOneAndUpdate(
  { username: "riju" },
  { $set: { lastLogin: new Date() } },
  { upsert: true, returnDocument: "after" }  // "after" returns updated/inserted doc
)

findOneAndReplace with upsert:
db.users.findOneAndReplace(
  { username: "temp" },
  { username: "temp", role: "guest", createdAt: new Date() },
  { upsert: true, returnDocument: "after" }
)

Legacy findAndModify with upsert:
db.runCommand({
  findAndModify: "users",
  query: { email: "someone@example.com" },
  update: { $set: { active: true } },
  upsert: true,
  new: true
})
--------------------------------------------------------------------------------
9) findOneAndUpdate / findOneAndReplace / returnDocument
--------------------------------------------------------------------------------
- findOneAndUpdate returns a document (before or after update depending on options).
- Use returnDocument: "after" to get the updated document.
- findOneAndReplace replaces the entire matched document (unless upsert).
--------------------------------------------------------------------------------
10) Bulk write (mix operations, ordered/ unordered)
--------------------------------------------------------------------------------
Example using bulkWrite to mix insert/update/delete in a batch:
db.users.bulkWrite([
  { insertOne: { document: { name: "BulkUser1", age: 30 } } },
  { updateOne: {
      filter: { name: "Riyaz" },
      update: { $set: { city: "Gandhinagar" } },
      upsert: false
    }
  },
  { updateOne: {
      filter: { username: "new_user" },
      update: { $set: { username: "new_user", active: true } },
      upsert: true
    }
  },
  { deleteOne: { filter: { name: "Some Obsolete User" } } }
], { ordered: true })

Notes:
- bulkWrite returns a summary result object with counts for inserted/updated/deleted.
- Use ordered: true to stop on first error, ordered: false to continue.
--------------------------------------------------------------------------------
11) MongoDB UpdateMany() and $unset Operator — explanation & examples
--------------------------------------------------------------------------------
UpdateMany syntax:
db.collection.updateMany(
  filter,        // e.g., {}
  update,        // e.g., { $set: { ... } }
  options        // e.g., { upsert: true }
)

Examples:
- Set a field for all documents:
  db.users.updateMany({}, { $set: { status: "active" } })

- Increment a field in all documents:
  db.users.updateMany({}, { $inc: { loginCount: 1 } })

$unset operator:
- Removes fields: db.collection.updateMany({}, { $unset: { field1: "", field2: "" } })
- Before: { "_id": 1, "name": "Alice", "temporaryField": "to be removed" }
- After:  { "_id": 1, "name": "Alice" }

When to use $unset:
- Remove obsolete fields
- Clean up documents
- Avoid storing unnecessary data
--------------------------------------------------------------------------------
12) Reminders
--------------------------------------------------------------------------------
- upsert: true inserts a new document when the filter finds no matches.
- $set, $inc, $unset, $currentDate are common update operators.
- $currentDate: { field: true } sets field to current date; use { $type: "timestamp" } for timestamp.
- Use replaceOne when you want to replace the entire document (keeps _id unless changed).
- Test updates first with a filter that matches known documents; consider a find() query to confirm results.
- Back up data before running large bulk updates on production.


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