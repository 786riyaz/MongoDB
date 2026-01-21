# 2. What is an ODM?

**ODM (Object–Document Mapping)** is similar to ORM, but it is used with **document-based (NoSQL) databases**, not relational databases.

> **ORM → SQL databases**
> **ODM → NoSQL document databases**

---

![Image](https://miro.medium.com/1%2A2Luxwh7aqd0c1lHDjR5sqQ.png)

![Image](https://miro.medium.com/1%2A8Y93n5QaEzMdj2j0R_BbFg.png)

![Image](https://media.licdn.com/dms/image/v2/D4E22AQHOM7Ywt5tWCA/feedshare-shrink_800/B4EZgniWnQHEAg-/0/1753009976260?e=2147483647\&t=Y-duudnzO0n5CuqUBsCC0Kvy3iFggQfkVh4LnqMDFeg\&v=beta)

---

## How ODM Works

### MongoDB Document

```json
{
  "_id": "123",
  "name": "Riyaz",
  "orders": [
    { "total": 100 },
    { "total": 200 }
  ]
}
```

### Application Object

```js
User {
  name: "Riyaz",
  orders: [...]
}
```

ODM maps:

* Documents ↔ objects
* Collections ↔ models

---

## Example ODM (Node.js – Mongoose)

```js
const UserSchema = new mongoose.Schema({
  name: String,
  orders: [{ total: Number }]
});

const User = mongoose.model("User", UserSchema);
```

---

## ODM vs ORM (Clear Comparison)

| Aspect        | ORM               | ODM                     |
| ------------- | ----------------- | ----------------------- |
| Database      | Relational (SQL)  | Document (NoSQL)        |
| Data model    | Tables / rows     | Documents (JSON-like)   |
| Relationships | Joins             | Embedding / referencing |
| Example DB    | MySQL, PostgreSQL | MongoDB                 |
| Example Tool  | Sequelize         | Mongoose                |

---

## Does N+1 Exist in ODM?

Yes — but differently.

### Example (MongoDB References)

```js
const posts = await Post.find();

for (const post of posts) {
  const user = await User.findById(post.userId);
}
```

This creates **N+1 queries**.

### Solution

```js
Post.find().populate("userId");
```

---

## Interview One-Liner (ODM)

> “An ODM is a mapping layer that allows developers to interact with document-based databases using objects, similar to ORM but for NoSQL systems.”

---

## Final Summary

* **N+1 problem** = query explosion due to lazy loading
* Solve using:

  * Eager loading
  * Joins
  * Batch queries
* **ORM** → SQL databases
* **ODM** → NoSQL document databases
* N+1 can happen in **both**