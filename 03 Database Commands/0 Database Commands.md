# Local MongoDB Instance

**Connection String**
```text
mongodb://localhost:27017/
```

---

## MongoDB Shell Commands

### Show List of Databases

```js
show dbs
```

---

### Select a Database

```js
use <database_name>
```

> ⚠️ Replace `<database_name>` with the actual database name.

---

### Show Current Database

```js
db
```

---

### Drop the Current Database

```js
db.dropDatabase()
```

---

## Notes

* The `use` command **creates the database implicitly** when data is inserted.
* `db.dropDatabase()` **permanently deletes** the selected database. Use with caution.