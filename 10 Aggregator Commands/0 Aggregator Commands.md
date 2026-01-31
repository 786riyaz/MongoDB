# MongoDB Aggregation Framework Guide

---

## Basic Aggregation Syntax

```js
db.collection.aggregate([
  { stage1 },
  { stage2 },
  { stage3 }
])
```

---

## Basic `$match` and `$group` Example

### Example — Find Total Sales by Category

```js
db.sales.aggregate([
  {
    $match: { status: "completed" }
  },
  {
    $group: {
      _id: "$category",
      totalSales: { $sum: "$amount" }
    }
  }
])
```

---

## `$lookup` Example (Basic Join)

### Join Orders with Customers

```js
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customerInfo"
    }
  },
  {
    $unwind: "$customerInfo"
  },
  {
    $project: {
      orderId: 1,
      amount: 1,
      customerName: "$customerInfo.name",
      email: "$customerInfo.email"
    }
  }
])
```

---

### Multiple `$lookup` Joins

```js
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customerID",
      foreignField: "customerID",
      as: "customerInfo"
    }
  },
  {
    $lookup: {
      from: "products",
      localField: "productID",
      foreignField: "productID",
      as: "productInfo"
    }
  }
])
```

---

### `$lookup` with `$unwind` and `$project`

```js
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customerID",
      foreignField: "customerID",
      as: "customerInfo"
    }
  },
  {
    $lookup: {
      from: "products",
      localField: "productID",
      foreignField: "productID",
      as: "productInfo"
    }
  },
  { $unwind: "$customerInfo" },
  { $unwind: "$productInfo" },
  {
    $project: {
      _id: 0,
      orderID: 1,
      "customerInfo.name": 1,
      "productInfo.productName": 1,
      "productInfo.price": 1,
      quantity: 1
    }
  }
])
```

---

### `$lookup` + `$group` (Customer Order Summary)

```js
db.orders.aggregate([
  // 1️⃣ Join customers
  {
    $lookup: {
      from: "customers",
      localField: "customerID",
      foreignField: "customerID",
      as: "customerInfo"
    }
  },

  // 2️⃣ Join products
  {
    $lookup: {
      from: "products",
      localField: "productID",
      foreignField: "productID",
      as: "productInfo"
    }
  },

  // 3️⃣ Unwind arrays
  { $unwind: "$customerInfo" },
  { $unwind: "$productInfo" },

  // 4️⃣ Group by customer
  {
    $group: {
      _id: "$customerInfo.name",
      totalOrders: { $sum: 1 },
      totalAmount: {
        $sum: {
          $multiply: ["$productInfo.price", "$quantity"]
        }
      },
      orders: {
        $push: {
          orderID: "$orderID",
          product: "$productInfo.productName",
          price: "$productInfo.price",
          quantity: "$quantity"
        }
      }
    }
  },

  // 5️⃣ Rename _id to customerName
  {
    $project: {
      _id: 0,
      customerName: "$_id",
      totalOrders: 1,
      totalAmount: 1,
      orders: 1
    }
  }
])
```

---

## Date Grouping Example

### Group Sales by Date

```js
db.sales.aggregate([
  {
    $group: {
      _id: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$date"
        }
      },
      dailyTotal: { $sum: "$amount" },
      numberOfTransactions: { $count: {} }
    }
  }
])
```

---

## `$bucket` Examples

### Group Products by Price Ranges

```js
db.products.aggregate([
  {
    $bucket: {
      groupBy: "$price",
      boundaries: [0, 50, 100, 500, 1000],
      default: "1000+",
      output: {
        count: { $sum: 1 },
        items: { $push: "$name" },
        avgPrice: { $avg: "$price" }
      }
    }
  }
])
```

---

### Detailed `$bucket` Example

```js
db.products.aggregate([
  {
    $bucket: {
      groupBy: "$price",
      boundaries: [0, 500, 1000, 5000, 10000],
      default: "10000+",
      output: {
        count: { $sum: 1 },
        products: { $push: "$productName" },
        avgPrice: { $avg: "$price" }
      }
    }
  }
])
```

---

### `$bucketAuto` Example

```js
db.products.aggregate([
  {
    $bucketAuto: {
      groupBy: "$price",
      buckets: 5,
      output: {
        count: { $sum: 1 },
        avgPrice: { $avg: "$price" },
        products: { $push: "$productName" }
      }
    }
  }
])
```

---

## Advanced `$graphLookup` Examples

### Employee Hierarchy

```js
db.employees.aggregate([
  {
    $graphLookup: {
      from: "employees",
      startWith: "$managerId",
      connectFromField: "managerId",
      connectToField: "_id",
      as: "reportingHierarchy",
      maxDepth: 5
    }
  }
])
```

---

### Customer → Orders → Products

```js
db.customers.aggregate([
  {
    $match: { name: "RiyazKhan" }
  },
  {
    $graphLookup: {
      from: "orders",
      startWith: "$customerID",
      connectFromField: "customerID",
      connectToField: "customerID",
      as: "relatedOrders",
      restrictSearchWithMatch: {},
      maxDepth: 1
    }
  },
  {
    $lookup: {
      from: "products",
      localField: "relatedOrders.productID",
      foreignField: "productID",
      as: "relatedProducts"
    }
  }
])
```

---

### Find Similar Purchases

```js
db.customers.aggregate([
  {
    $match: { name: "RiyazKhan" }
  },
  {
    $graphLookup: {
      from: "orders",
      startWith: "$customerID",
      connectFromField: "productID",
      connectToField: "productID",
      as: "similarPurchases",
      restrictSearchWithMatch: {},
      maxDepth: 3
    }
  },
  {
    $lookup: {
      from: "products",
      localField: "similarPurchases.productID",
      foreignField: "productID",
      as: "relatedProducts"
    }
  }
])
```

---

## Complex `$unionWith` Examples

### Combine Current and Archived Orders

```js
db.currentOrders.aggregate([
  {
    $unionWith: {
      coll: "archivedOrders",
      pipeline: [
        {
          $match: {
            date: {
              $gte: new Date("2024-01-01")
            }
          }
        }
      ]
    }
  },
  {
    $sort: { date: -1 }
  }
])
```

---

### Union Customers and Orders into a Single Stream

```js
db.customers.aggregate([
  {
    $project: {
      _id: 0,
      type: "Customer",
      name: 1,
      emailID: 1,
      city: 1,
      balance: 1
    }
  },
  {
    $unionWith: {
      coll: "orders",
      pipeline: [
        {
          $project: {
            _id: 0,
            type: "Order",
            orderID: 1,
            customerID: 1,
            productID: 1,
            quantity: 1,
            orderDate: 1
          }
        }
      ]
    }
  },
  { $sort: { type: 1 } }
])
```