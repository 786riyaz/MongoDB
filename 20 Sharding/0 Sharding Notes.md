# MongoDB Sharding

---

## Sharding

Sharding distributes data across **multiple servers** to achieve **horizontal scalability** and handle large datasets efficiently.

---

## Enable Sharding on a Database

```js
sh.enableSharding("shopDB")
```

---

## Choose and Configure a Shard Key

```js
sh.shardCollection(
  "shopDB.orders",
  { customerID: 1 }
)
```

---

## How Sharding Works

* Data is **horizontally partitioned** across shards
* Each shard stores **only a portion of the total data**
* Queries are routed to relevant shards using the **shard key**
* Improves **performance, scalability, and availability**

---

## Notes

* Choosing the right **shard key** is critical for performance
* Poor shard key selection can cause **hot spots**
* Common shard keys include:

  * User ID
  * Order ID
  * Customer ID
