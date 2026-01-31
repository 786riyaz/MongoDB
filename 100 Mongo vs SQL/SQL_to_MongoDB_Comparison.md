# SQL to MongoDB Command Mapping

This document provides a **side-by-side mapping** of common **MySQL (SQL)** commands to their **MongoDB equivalents**, helping you transition from relational databases to MongoDB.

---

## Primary Key

**MySQL Query**

```sql
PRIMARY KEY id
```

**MongoDB Query**

```js
_id
```

* `_id` is the built-in primary key
* Automatically created for every document

---

## Create Database

**MySQL Query**

```sql
CREATE DATABASE appdb;
```

**MongoDB Query**

```js
use("appdb")
```

* Databases are created **on first write** to a collection

---

## Create Table / Collection

**MySQL Query**

```sql
CREATE TABLE people (...);
```

**MongoDB Query**

```js
db.createCollection("people")
```

* Collections are **schema-less**
* Created implicitly on first insert

---

## Add Column

**MySQL Query**

```sql
ALTER TABLE people ADD col;
```

**MongoDB Query**

```js
db.people.updateMany({}, { $set: { col: <value> } })
```

* Adds a field to existing documents

---

## Drop Column

**MySQL Query**

```sql
ALTER TABLE people DROP col;
```

**MongoDB Query**

```js
db.people.updateMany({}, { $unset: { col: "" } })
```

* Removes a field from existing documents

---

## Drop Table / Collection

**MySQL Query**

```sql
DROP TABLE people;
```

**MongoDB Query**

```js
db.people.drop()
```

---

## Create Index

**MySQL Query**

```sql
CREATE INDEX idx ON people(col ASC);
```

**MongoDB Query**

```js
db.people.createIndex({ col: 1 })
```

* Options include `{ unique: true }`

---

## Drop Index

**MySQL Query**

```sql
DROP INDEX idx;
```

**MongoDB Query**

```js
db.people.dropIndex("idx")
```

* Drop by **index name** or **key specification**

---

## Insert Single Row

**MySQL Query**

```sql
INSERT INTO people (...) VALUES (...);
```

**MongoDB Query**

```js
db.people.insertOne({ ... })
```

* Creates collection if missing

---

## Insert Multiple Rows

**MySQL Query**

```sql
INSERT multiple rows;
```

**MongoDB Query**

```js
db.people.insertMany([{ ... }, { ... }])
```

* Bulk insert

---

## Select All

**MySQL Query**

```sql
SELECT * FROM people;
```

**MongoDB Query**

```js
db.people.find({})
```

* Returns a cursor

---

## Select Specific Columns

**MySQL Query**

```sql
SELECT name, age FROM people;
```

**MongoDB Query**

```js
db.people.find({}, { name: 1, age: 1 })
```

* Projection to include only fields

---

## WHERE with Comparison

**MySQL Query**

```sql
SELECT ... WHERE age > 30;
```

**MongoDB Query**

```js
db.people.find({ age: { $gt: 30 } })
```

* Use `$gt`, `$gte`, `$lt`, `$lte`

---

## AND Condition

**MySQL Query**

```sql
WHERE a = 1 AND b = 2;
```

**MongoDB Query**

```js
db.people.find({ a: 1, b: 2 })
```

* Implicit AND

---

## OR Condition

**MySQL Query**

```sql
WHERE a = 1 OR b = 2;
```

**MongoDB Query**

```js
db.people.find({ $or: [{ a: 1 }, { b: 2 }] })
```

* Explicit `$or`

---

## IN Condition

**MySQL Query**

```sql
WHERE col IN (1,2,3);
```

**MongoDB Query**

```js
db.people.find({ col: { $in: [1, 2, 3] } })
```

---

## NOT IN Condition

**MySQL Query**

```sql
WHERE col NOT IN (1,2,3);
```

**MongoDB Query**

```js
db.people.find({ col: { $nin: [1, 2, 3] } })
```

---

## Between Range

**MySQL Query**

```sql
WHERE age BETWEEN 18 AND 65;
```

**MongoDB Query**

```js
db.people.find({ age: { $gte: 18, $lte: 65 } })
```

---

## LIKE Operator

**MySQL Query**

```sql
WHERE name LIKE 'A%';
```

**MongoDB Query**

```js
db.people.find({ name: { $regex: "^A" } })
```

---

## IS NULL Check

**MySQL Query**

```sql
WHERE col IS NULL;
```

**MongoDB Query**

```js
db.people.find({ col: null })
```

* Optionally:

```js
{ col: { $exists: false } }
```

---

## IS NOT NULL Check

**MySQL Query**

```sql
WHERE col IS NOT NULL;
```

**MongoDB Query**

```js
db.people.find({ col: { $ne: null } })
```

---

## Order By

**MySQL Query**

```sql
ORDER BY age DESC;
```

**MongoDB Query**

```js
db.people.find({}).sort({ age: -1 })
```

* Negative value for descending

---

## Pagination (Limit + Offset)

**MySQL Query**

```sql
LIMIT 5 OFFSET 10;
```

**MongoDB Query**

```js
db.people.find({}).skip(10).limit(5)
```

---

## Select Distinct

**MySQL Query**

```sql
SELECT DISTINCT status FROM people;
```

**MongoDB Query**

```js
db.people.distinct("status")
```

---

## Count Records

**MySQL Query**

```sql
SELECT COUNT(*) FROM people;
```

**MongoDB Query**

```js
db.people.aggregate([{ $count: "count" }])
```

---

## Group By

**MySQL Query**

```sql
GROUP BY status;
```

**MongoDB Query**

```js
db.people.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])
```

---

## Group By with HAVING

**MySQL Query**

```sql
GROUP BY status HAVING count > 5;
```

**MongoDB Query**

```js
db.people.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } },
  { $match: { count: { $gt: 5 } } }
])
```

---

## Sum by Group

**MySQL Query**

```sql
SUM(price) BY status;
```

**MongoDB Query**

```js
db.people.aggregate([
  { $group: { _id: "$status", total: { $sum: "$price" } } }
])
```

---

## Average / Min / Max by Group

**MySQL Query**

```sql
AVG / MIN / MAX BY status;
```

**MongoDB Query**

```js
Use $avg, $min, $max in $group accumulator expressions
```

---

## Join Tables

**MySQL Query**

```sql
JOIN (LEFT / INNER)
```

**MongoDB Query**

```js
Use $lookup in aggregation
```

* Left-outer join semantics

---

## Select Into New Table

**MySQL Query**

```sql
SELECT INTO NEW_TABLE ...;
```

**MongoDB Query**

```js
db.people.aggregate([
  ...,
  { $out: "NEW_TABLE" }
])
```

---

## Merge Into Table

**MySQL Query**

```sql
MERGE INTO TABLE ...;
```

**MongoDB Query**

```js
db.people.aggregate([
  ...,
  { $merge: { into: "collectionName" } }
])
```

---

## Union Queries

**MySQL Query**

```sql
UNION ALL query1 UNION ALL query2;
```

**MongoDB Query**

```js
db.people.aggregate([
  { $unionWith: "otherCollection" }
])
```

---

## Update Data

**MySQL Query**

```sql
UPDATE people SET status = 'C' WHERE ...;
```

**MongoDB Query**

```js
db.people.updateMany(
  { ... },
  { $set: { status: "C" } }
)
```

---

## Increment Field

**MySQL Query**

```sql
UPDATE people SET age = age + 1;
```

**MongoDB Query**

```js
db.people.updateMany({}, { $inc: { age: 1 } })
```

---

## Upsert (Update or Insert)

**MySQL Query**

```sql
UPSERT ...;
```

**MongoDB Query**

```js
db.people.updateMany(
  { ... },
  { $set: { ... } },
  { upsert: true }
)
```

---

## Delete Rows

**MySQL Query**

```sql
DELETE FROM people WHERE ...;
```

**MongoDB Query**

```js
db.people.deleteMany({ ... })
```

---

## Truncate Table

**MySQL Query**

```sql
TRUNCATE TABLE people;
```

**MongoDB Query**

```js
db.people.deleteMany({})
```

* Or drop the collection

---

## Transactions

**MySQL Query**

```sql
BEGIN;
COMMIT;
ROLLBACK;
```

**MongoDB Query**

```js
session.startTransaction()
session.commitTransaction()
session.abortTransaction()
```
