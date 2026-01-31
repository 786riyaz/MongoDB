# MongoDB Aggregation: Count Grouped by City

---

## Count Documents Grouped by City (Generic Example)

```js
db.<CollectionName>.aggregate([
  {
    $group: {
      _id: "$city",
      total: { $sum: 1 }
    }
  }
])
```

---

## Count Customers Grouped by City (With Sorting)

```js
db.customers.aggregate([
  {
    $group: {
      _id: "$city",
      totalCustomers: { $sum: 1 }
    }
  },
  {
    $sort: { totalCustomers: -1 }
  }
])
```

---

## Explanation

* `$group` groups documents by the `city` field
* `$sum: 1` counts the number of documents in each group
* `$sort` orders the result by total count in **descending order**
* Useful for **analytics**, **reporting**, and **data insights**

---