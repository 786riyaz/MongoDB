Below is a **practical, interview-ready guide** to creating **users**, **views**, and **access control (roles & privileges)** in **MongoDB**.

---

## 1️⃣ Creating Users in MongoDB

MongoDB uses **role-based access control (RBAC)**. Users are created **inside a database** and permissions are granted via **roles**.

### 🔹 Create an Admin User (first step)

```js
use admin

db.createUser({
  user: "adminUser",
  pwd: "Admin@123",
  roles: ["userAdminAnyDatabase", "readWriteAnyDatabase"]
})
```

👉 This user can create other users and manage databases.

---

### 🔹 Create a Normal User (Read Only)

```js
use myAppDB

db.createUser({
  user: "readUser",
  pwd: "Read@123",
  roles: [
    { role: "read", db: "myAppDB" }
  ]
})
```

---

### 🔹 Create a Read + Write User

```js
db.createUser({
  user: "rwUser",
  pwd: "RW@123",
  roles: [
    { role: "readWrite", db: "myAppDB" }
  ]
})
```

---

## 2️⃣ Creating Views in MongoDB

A **view** is a **read-only virtual collection** created using an aggregation pipeline.

### 🔹 Example Collection

```js
db.users.insertMany([
  { name: "Riyaz", role: "admin", age: 28 },
  { name: "Aman", role: "user", age: 22 }
])
```

---

### 🔹 Create a View

```js
db.createView(
  "userView",
  "users",
  [
    { $project: { _id: 0, name: 1, age: 1 } }
  ]
)
```

📌 `userView`:

* Shows **only name and age**
* **Cannot be written to**
* Acts like a collection for reads

---

### 🔹 Query the View

```js
db.userView.find()
```

---

## 3️⃣ Giving Access to Views

Views **inherit permissions** from the source collection **unless restricted**.

### 🔹 Give Read Access to View Only

```js
db.createUser({
  user: "viewUser",
  pwd: "View@123",
  roles: [
    { role: "read", db: "myAppDB" }
  ]
})
```

⚠️ This still allows reading the base collection.

---

## 4️⃣ Restrict Access Using Custom Roles (IMPORTANT)

To allow access **only to the view**, create a **custom role**.

### 🔹 Create Custom Role

```js
use admin

db.createRole({
  role: "viewOnlyRole",
  privileges: [
    {
      resource: { db: "myAppDB", collection: "userView" },
      actions: ["find"]
    }
  ],
  roles: []
})
```

---

### 🔹 Assign Custom Role to User

```js
use myAppDB

db.createUser({
  user: "secureViewUser",
  pwd: "Secure@123",
  roles: ["viewOnlyRole"]
})
```

✅ This user:

* ✔ Can read `userView`
* ❌ Cannot read `users`
* ❌ Cannot insert/update/delete

---

## 5️⃣ Common Built-in Roles (Interview Gold)

| Role        | Permission    |
| ----------- | ------------- |
| `read`      | Read only     |
| `readWrite` | Read + Write  |
| `dbAdmin`   | Index & stats |
| `userAdmin` | Create users  |
| `root`      | Full access   |

---

## 6️⃣ Login with a Specific User

```bash
mongosh -u readUser -p --authenticationDatabase myAppDB
```

---

## 7️⃣ Quick Summary

* ✅ **Users** → created using `db.createUser()`
* ✅ **Views** → created using `db.createView()`
* ✅ **Permissions** → controlled via **roles**
* ✅ **Fine-grained security** → use **custom roles**
* ❌ Views are **read-only**
* ❌ Permissions are **never given directly**, always via roles

---

If you want, I can also provide:

* 📄 **MongoDB commands in `.txt` format** (as you prefer)
* 🔐 **Real-world access design (admin / analyst / viewer)**
* 🧠 **Interview Q&A on MongoDB security**

Just tell me 👍
