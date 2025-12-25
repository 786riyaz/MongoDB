# MongoDB Backup and Restore – Complete Command Notes

This document contains **ONLY MongoDB-related commands** for backup and restore.
It is written as a **clean text reference** for learning, interviews, and real usage.

---

## 1. MongoDB Tools Overview

| Tool         | Purpose                       |
| ------------ | ----------------------------- |
| mongosh      | MongoDB shell (queries, CRUD) |
| mongodump    | Take MongoDB backups          |
| mongorestore | Restore MongoDB backups       |
| mongoexport  | Export data to JSON / CSV     |
| mongoimport  | Import data from JSON / CSV   |

> IMPORTANT RULE:
>
> * `mongodump` and `mongorestore` are **OS terminal commands**
> * They NEVER run inside `mongosh`

---

## 2. Check MongoDB Tools Installation

```cmd
mongodump --version
mongorestore --version
```

If not recognized, install **MongoDB Database Tools** and add them to PATH.

---

## 3. MongoDB Backup Commands

### 3.1 Backup a Single Database (Directory Format)

```cmd
mongodump --db fixify --out C:\backup\mongo
```

Backup will be created at:

```
C:\backup\mongo\fixify
```

---

### 3.2 Backup All Databases

```cmd
mongodump --out C:\backup\mongo
```

---

### 3.3 Backup a Specific Collection

```cmd
mongodump --db fixify --collection users --out C:\backup\mongo
```

---

### 3.4 Compressed Backup (Recommended – Single File)

```cmd
mongodump --db fixify --archive=C:\backup\fixify.gz --gzip
```

---

## 4. MongoDB Restore Commands

### 4.1 Restore from Directory (All Databases)

```cmd
mongorestore C:\backup\mongo
```

---

### 4.2 Restore a Single Database

```cmd
mongorestore C:\backup\mongo\fixify
```

---

### 4.3 Restore into a Different Database Name

```cmd
mongorestore --nsFrom="fixify.*" --nsTo="mydb.*" C:\backup\mongo\fixify
```

---

### 4.4 Restore from Compressed Archive

```cmd
mongorestore --gzip --archive=C:\backup\fixify.gz
```

---

### 4.5 Restore Archive into a Different Database Name

```cmd
mongorestore --gzip --archive=C:\backup\fixify.gz --nsFrom="fixify.*" --nsTo="mydb.*"
```

---

## 5. MongoDB Export / Import (Optional)

### Export Collection to JSON

```cmd
mongoexport --db fixify --collection users --out users.json
```

### Import JSON into Collection

```cmd
mongoimport --db fixify --collection users --file users.json
```

---

## 6. Authentication-Based Backup (If Enabled)

```cmd
mongodump --db fixify --username admin --password secret --authenticationDatabase admin --out C:\backup\mongo
```

---

## 7. Common Errors and Meaning

| Error                          | Reason                                       |
| ------------------------------ | -------------------------------------------- |
| mongodump not recognized       | Database tools not installed or PATH missing |
| SyntaxError: Missing semicolon | Command run inside mongosh                   |
| unknown option                 | Wrong path format on Windows                 |
| 0 documents restored           | Wrong folder or wrong restore type           |

---

## 8. Best Practices (MongoDB)

* Prefer **compressed backups (.gz)**
* Store backups outside MongoDB server
* Automate using Task Scheduler / cron
* Test restore periodically
* Do not store backups in GitHub

---

## 9. Quick Command Cheat Sheet

```text
Backup DB (folder):   mongodump --db fixify --out C:\backup\mongo
Backup DB (gzip):     mongodump --db fixify --archive=fixify.gz --gzip
Restore folder:       mongorestore C:\backup\mongo\fixify
Restore gzip:         mongorestore --gzip --archive=fixify.gz
Rename DB restore:    mongorestore --nsFrom="fixify.*" --nsTo="mydb.*" ...
```

---

END OF MONGODB COMMAND NOTES
