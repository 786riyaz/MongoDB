# MongoDB Read Concern & Write Concern

---

## Read Concern

Read Concern controls the **isolation and consistency** of **read operations** in MongoDB.

### Example

```js
db.orders.find().readConcern("majority")
```

### Read Concern Levels

| Level      | Description                                                |
| ---------- | ---------------------------------------------------------- |
| `local`    | Returns data from the node without waiting for replication |
| `majority` | Returns only data acknowledged by a majority of replicas   |

---

## Write Concern

Write Concern ensures the **reliability of write operations** by controlling acknowledgment behavior.

### Example

```js
db.orders.insertOne(
  { orderId: 101, amount: 500 },
  { writeConcern: { w: "majority", j: true, wtimeout: 1000 } }
)
```

### Write Concern Options

| Option     | Description                                        |
| ---------- | -------------------------------------------------- |
| `w`        | Number of replicas that must acknowledge the write |
| `j`        | Journaling acknowledgment                          |
| `wtimeout` | Timeout for acknowledgment                         |

---

## Notes

* `readConcern: "majority"` guarantees reading **replicated and durable data**
* Higher write concern levels increase **data safety** but may impact **performance**
* Use stronger concerns for **financial, transactional, or critical data**
* Use lower concerns for **high-throughput, non-critical workloads**