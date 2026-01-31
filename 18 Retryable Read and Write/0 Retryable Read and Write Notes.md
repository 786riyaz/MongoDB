# MongoDB Retryable Reads & Retryable Writes

---

## Retryable Read

Retryable reads **automatically retry a read operation** if a **transient network error** occurs.

### Example

```js
db.orders.find(
  { status: "pending" },
  { retryReads: true }
)
```

### Notes

* Helps improve **read reliability** in distributed systems
* Automatically handles **temporary network failures**
* Especially useful in **replica set** and **sharded cluster** environments

---

## Retryable Write

Retryable writes ensure a write operation is **idempotent** and **retried automatically** in case of **transient errors**.

### Example

```js
db.orders.updateOne(
  { orderId: 100 },
  { $set: { status: "shipped" } },
  { retryWrites: true }
)
```

### Notes

* Prevents **duplicate writes**
* Improves **write reliability**
* Enabled by default in most modern MongoDB drivers
* Requires **replica set** or **sharded cluster**

---

## Summary

* Retryable reads handle **temporary read failures**
* Retryable writes safely retry **idempotent write operations**
* Ideal for **high-availability** and **fault-tolerant systems**
