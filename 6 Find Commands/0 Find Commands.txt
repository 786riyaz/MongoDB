## 1. Basic Find

Find all documents:
db.<CollectionName>.find()
db.inventory.find({ "size.uom": "in" })
db.inventory.find({ "size.h": { $lt: 15 } })
db.inventory.find({ "size.h": { $lt: 15 }, "size.uom": "in", status: "D" })

Find null / missing values:
db.inventory.find({ item: { $type: 10 } })
db.inventory.find({ item: null })
db.inventory.find({ item: { $ne: null } })
db.inventory.find({ item: { $exists: false } })

Single document:
db.<CollectionName>.findOne({ name: "Riyaz" })
db.<CollectionName>.findOne({ price: { $gt: 25 } })

---

## 2. Pretty Output
db.<CollectionName>.find().pretty()

---

## 3. Comparison Operators

{ field: value }               (default / $eq)
{ field: { $ne: value } }      (not equal)
{ field: { $gt: value } }      (greater than)
{ field: { $gte: value } }     (greater than or equal)
{ field: { $lt: value } }      (less than)
{ field: { $lte: value } }     (less than or equal)
{ field: { $in: [v1, v2] } }   (in list)
{ field: { $nin: [v1, v2] } }  (not in list)

Examples:
db.products.find({ status: { $in: ["A", "D"] } })
db.products.find({ status: { $nin: ["A", "D"] } })

---

## 4. Logical Operators
{ $and: [cond1, cond2] }
{ $or: [cond1, cond2] }
{ $nor: [cond1, cond2] }
{ $not: { <condition> } }

Examples:
db.users.find({ $and: [ { age: { $gt: 18 } }, { city: "Delhi" } ] })
db.users.find({ $or: [ { age: { $gt: 18 } }, { city: "Delhi" } ] })
db.products.find({ $and: [ { category: "Laptop" }, { brandName: "Asus" }, { price: { $lt: 2000 } } ] })

---

## 5. Element Operators
{ field: { $exists: true } }
{ field: { $exists: false } }
{ field: { $type: "string" } }

Example:
db.users.find({ email: { $exists: true } })

---

## 6. Array Operators
{ field: { $size: 3 } }
{ field: { $all: [val1, val2] } }
{ field: { $elemMatch: { $gt: 10, $lt: 50 } } }

Examples:
db.inventory.find({ tags: "red" })
db.inventory.find({ tags: ["red", "blank"] })
db.inventory.find({ tags: { $all: ["red", "blank"] } })
db.inventory.find({ dim_cm: { $elemMatch: { $gt: 22, $lt: 30 } } })
db.inventory.find({ "dim_cm.1": { $gt: 25 } })

---

## 7. Regex / Pattern Matching
db.collection.find({ field: { $regex: /pattern/, $options: 'i' } })
{ name: { $regex: /^R/i } }
{ email: { $regex: /gmail\.com$/ } }
db.users.find({ name: { $regex: /^A/ } })
db.employee.find({ position: { $regex: "developer" } })
db.employee.find({ name: { $regex: "^B" } })
db.employee.find({ name: { $regex: "e$" } })

---

## 8. Text Search (requires text index)
db.<Collection>.find({ $text: { $search: "laptop" } })
Use quotes for exact phrases.
Use minus to exclude words.

---

## 9. Projection (select fields)
db.inventory.find({ status: "A" }, { item: 1, status: 1 })
db.<Collection>.find({}, { name: 1, age: 1, _id: 0 })
db.inventory.find({ status: "A" }, { status: 0, instock: 0 })
db.inventory.find({ status: "A" }, { item: 1, status: 1, "size.uom": 1 })
db.inventory.find({ status: "A" }, { "size.uom": 0 })
db.inventory.find({ status: "A" }, { item: 1, status: 1, instock: { $slice: -1 } })

Examples using brandName:
db.products.find({ brandName: "Asus" }, { brandName: 1 })
db.products.find({ brandName: "Asus" }, { brandName: 1, _id: 0 })
db.products.find({ brandName: "Asus" }, { brandName: 0 })
db.products.find({ brandName: "Asus" }, { brandName: 0 }).pretty()

---

## 10. Sorting, Limiting, Skipping
db.<Collection>.find().sort({ age: 1 })
db.<Collection>.find().sort({ age: -1 })
db.<Collection>.find().limit(5)
db.<Collection>.find().skip(5)
db.<CollectionName>.find().limit(2).skip(2)

Examples:
db.<CollectionName>.find().limit(2)
db.<CollectionName>.find().skip(2)
db.<CollectionName>.find().limit(2).skip(2)

---

## 11. Count Documents
db.<CollectionName>.countDocuments()
db.<CollectionName>.countDocuments({ age: { $gte: 30 } })

---

## 12. Aggregation
db.<CollectionName>.aggregate([
  { $group: { _id: "$city", total: { $sum: 1 } } }
])

---

## 13. Deprecated projection Commands
db.<Collection Name>.find({ mno: { $not: { $gt: 124 } } }).select({ name: 1, _id: 0 })
db.<Collection Name>.find({ mno: { $not: { $gt: 124 } } }).select({ name: 1, _id: 0 }).limit(1)

---

db.logs.find({
  createdAt: { $gte: new Date("2025-10-24T00:00:00Z") }
})

// Documents from a specific date
db.logs.find({
  createdAt: { $eq: ISODate("2025-10-20T00:00:00Z") }
})
---
db.products.distinct("category")
---
✅ Count Documents
    db.<CollectionName>.countDocuments()

👉 With condition:
    db.<CollectionName>.countDocuments({ age: { $gte: 30 } })