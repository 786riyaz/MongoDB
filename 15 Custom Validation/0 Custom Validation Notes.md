# MongoDB Custom Validation Using `$jsonSchema`

---

## Custom Validation

You can define **validation rules** on a collection to **restrict data formats** and enforce schema-like constraints in MongoDB.

---

## Create a Collection with Validation Rules

```js
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "age"],
      properties: {
        name: {
          bsonType: "string",
          description: "must be a string"
        },
        age: {
          bsonType: "int",
          minimum: 18,
          description: "must be an integer >= 18"
        }
      }
    }
  }
})
```

---

## Try Inserting Documents

```js
db.users.insertOne({ name: "Riyaz", age: 25 }) // ✅ Works
```

```js
db.users.insertOne({ name: "Ali", age: 15 })   // ❌ Validation fails
```

---

## Notes

* `$jsonSchema` allows MongoDB to **validate documents** at insert and update time
* `required` enforces mandatory fields
* `bsonType` ensures correct data types
* Validation failures **prevent document insertion**
* Useful for **data integrity**, especially in large or shared databases
