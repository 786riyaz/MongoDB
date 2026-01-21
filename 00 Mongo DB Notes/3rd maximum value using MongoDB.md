Below are the **correct and interview-accepted MongoDB ways to find the 3rd maximum value**, with clear explanations and edge-case handling.

---

## Assumption

Collection: `employees`
Field: `salary`

---

## 1️⃣ Most Common & Clean (Aggregation Pipeline)

### **3rd Highest DISTINCT Salary**

```js
db.employees.aggregate([
  { $group: { _id: "$salary" } },      // distinct salaries
  { $sort: { _id: -1 } },              // descending
  { $skip: 2 },                         // skip top 2
  { $limit: 1 }
]);
```

### Output

```json
{ "_id": 75000 }
```

✔ Interview-preferred
✔ Handles duplicates correctly

---

## 2️⃣ If Duplicates DO NOT Matter (Simpler)

```js
db.employees
  .find({}, { salary: 1, _id: 0 })
  .sort({ salary: -1 })
  .skip(2)
  .limit(1);
```

⚠️ Wrong if multiple employees have the same salary

---

## 3️⃣ Using `$setWindowFields` (MongoDB 5.0+)

### Equivalent of SQL `DENSE_RANK()`

```js
db.employees.aggregate([
  {
    $setWindowFields: {
      sortBy: { salary: -1 },
      output: {
        rank: { $denseRank: {} }
      }
    }
  },
  { $match: { rank: 3 } },
  { $project: { _id: 0, salary: 1 } }
]);
```

✔ Most SQL-like
✔ Best conceptual explanation in interviews

---

## 4️⃣ Return `null` if 3rd Max Does Not Exist (Safe)

```js
db.employees.aggregate([
  { $group: { _id: "$salary" } },
  { $sort: { _id: -1 } },
  { $group: { _id: null, salaries: { $push: "$_id" } } },
  {
    $project: {
      thirdMax: { $arrayElemAt: ["$salaries", 2] }
    }
  }
]);
```

---

## Which One to Use in Interviews?

| Scenario        | Best Answer                     |
| --------------- | ------------------------------- |
| General MongoDB | `$group + sort + skip + limit`  |
| SQL comparison  | `$setWindowFields + $denseRank` |
| Simplicity      | `find + sort + skip`            |

---

## Interview One-Liner (Memorize)

> “In MongoDB, the 3rd maximum value can be found using an aggregation pipeline by grouping for distinct values, sorting descending, skipping the top two, and limiting to one result.”

---

## Common Interview Mistakes

❌ Forgetting duplicates
❌ Using `.find().skip()` blindly
❌ Not knowing `$group` creates DISTINCT values

---

If you want, I can next explain:

* Nth highest value in MongoDB (generic)
* SQL vs MongoDB ranking comparison
* Performance optimization with indexes
* Real interview questions on MongoDB aggregation

Tell me what to continue with.
