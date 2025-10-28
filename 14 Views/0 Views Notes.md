A view in MongoDB is a virtual collection defined by an aggregation pipeline. It stores no data and always reflects the current data from its source collection(s). Think of a view as a saved aggregation.

### Core definition
- A view is a virtual, read-only collection.
- Data comes from one or more source collections through an aggregation pipeline.
- It behaves like a saved query/aggregation and returns live results.

### Why use views
- Hide sensitive fields for security and least-privilege access.
- Simplify complex aggregations behind a stable interface.
- Provide read-only datasets to consumers (analytics/reporting).
- Enforce consistent schemas/transformations across teams and tools.
================================================================================================
### Types of views
- Standard views
    - Virtual only, no storage.
    - Always up to date.
    - Read-only.
    - Best for dynamic queries, data security, simplified access.
- Materialized views
    - Physical collection with precomputed results.
    - Requires manual refresh.
    - Fast queries, can be stale.
    - Best for analytics and heavy aggregations on large datasets.
- On-demand materialized views
    - Physical collection refreshed on command using \$merge or \$out.
    - Balances freshness and performance.
    - Best for periodic reporting and controlled snapshots.
================================================================================================
### Create views
Basic syntax (mongo shell):
db.createView(
  "<viewName>",
  "<sourceCollection>",
  [ /* aggregation pipeline */ ]
)

Advanced options (collation):
db.createView(
  "caseInsensitiveUsers",
  "users",
  [
    { $project: { username: 1, email: 1 } }
  ],
  { collation: { locale: "en", strength: 2 } } // optional
)

### Simple example
Source: employees
// Sample document
{ name: "Riyaz", age: 28, department: "IT", salary: 55000 }

Create a summary view:
db.createView(
  "employeeSummary",
  "employees",
  [
    { $project: { _id: 0, name: 1, department: 1 } }
  ]
)

// Query
db.employeeSummary.find()
// -> { name: "Riyaz", department: "IT" }
================================================================================================
### Advanced aggregation example
Average salary per department:

db.createView(
  "avgSalaryByDept",
  "employees",
  [
    { $match: { salary: { $gte: 30000 } } },
    { $group: { _id: "$department", avgSalary: { $avg: "$salary" } } },
    { $sort: { avgSalary: -1 } }
  ]
)

db.avgSalaryByDept.find()

### List and inspect views
- List all collections (and views):
show collections

- List only views:
db.getCollectionInfos({ type: "view" })

- Inspect a specific view’s definition:
db.getCollectionInfos({ name: "employeeSummary" })
// -> includes { type: "view", options: { viewOn, pipeline } }

### Update or recreate a view
MongoDB has no ALTER VIEW. Drop and recreate:

db.employeeSummary.drop()
db.createView("employeeSummary", "employees", [
  { $project: { _id: 0, name: 1, department: 1 } }
])
================================================================================================
### Layered views (views on views)
You can create a view on another view. Ensure downstream pipelines reference fields actually present in the upstream view.

Correct pattern:
// First view keeps salary for downstream filtering
db.createView(
  "employeeCore",
  "employees",
  [
    { $project: { name: 1, department: 1, salary: 1 } }
  ]
)

// Second view filters by salary
db.createView(
  "highPaidEmployees",
  "employeeCore",
  [
    { $match: { salary: { $gt: 60000 } } },
    { $project: { _id: 0, name: 1, department: 1, salary: 1 } }
  ]
)
================================================================================================
### Joins with \$lookup
Join orders with customers:

db.createView(
  "orderDetailsView",
  "orders",
  [
    {
      $lookup: {
        from: "customers",
        localField: "customerID",
        foreignField: "customerID",
        as: "customerInfo"
      }
    },
    { $unwind: "$customerInfo" },
    { $project: { orderID: 1, "customerInfo.name": 1, total: 1 } }
  ]
)

db.orderDetailsView.find()
================================================================================================
### Materialized views ($out)
Precompute and store results in a collection:

db.orders.aggregate([
  { $group: { _id: "$status", total: { $sum: "$amount" } } },
  { $out: "orderSummary" } // creates/replaces physical collection
])

db.orderSummary.find()

Notes:
- $out replaces the entire target collection atomically when done.
- Use when you want a fresh snapshot replacing prior content.
================================================================================================
### On-demand refresh ($merge)
Incremental/safe refresh of a materialized collection:

db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$customerID", totalSpent: { $sum: "$amount" } } },
  {
    $merge: {
      into: "completedOrdersSummary",
      whenMatched: "replace",
      whenNotMatched: "insert"
    }
  }
])

db.completedOrdersSummary.find()

Refresh strategies:
- Application cron/Job scheduler (e.g., Node.js cron).
- MongoDB Atlas Trigger or Ops job.
- Batch pipeline after load completes.
================================================================================================
### Security and RBAC
Use views to hide fields and grant least-privilege access.

db.createView(
  "publicEmployees",
  "employees",
  [
    { $project: { name: 1, department: 1, salary: 0 } }
  ]
)

// Example: grant read-only on the database
db.grantRolesToUser("reportUser", [ { role: "read", db: "companyDB" } ])

Tip:
- You can define a default collation on the view for case-insensitive access patterns.
================================================================================================
### Limitations and constraints
- Read-only: cannot insert/update/delete through a view.
- No indexes on views. Indexes on source collections still apply.
- Pipeline restrictions in views:
    - Disallowed: stages that write or need to create/modify collections like $out and $merge.
    - Allowed: typical read/compute stages ($match, $project, $group, $lookup, $unwind, $sort, etc.).
- Performance depends entirely on the underlying collections and their indexes.
- Collation can be set at view creation but cannot be altered; recreate the view to change it.
- Views can reference multiple collections via \$lookup. They are not limited to a single source.
================================================================================================
### Performance tips
- Push $match and $project as early as possible in the pipeline.
- Ensure source collections have appropriate indexes for predicates and join keys.
- Avoid wide $lookup fan-outs; consider cardinality and add selective $match before $lookup.
- For heavy/grouping analytics, prefer materialized/on-demand materialized views.
- Keep pipelines deterministic and avoid unnecessary $unwind/$group stages.
================================================================================================
### Hands-on lab: regular vs materialized vs on-demand
Seed data:

db.orders.insertMany([
  { orderID: 1, customerID: 101, amount: 500, status: "completed" },
  { orderID: 2, customerID: 102, amount: 300, status: "pending" },
  { orderID: 3, customerID: 101, amount: 200, status: "completed" },
  { orderID: 4, customerID: 103, amount: 400, status: "completed" },
  { orderID: 5, customerID: 102, amount: 700, status: "completed" }
])

Regular view:
db.createView(
  "completedOrdersView",
  "orders",
  [
    { $match: { status: "completed" } },
    { $project: { _id: 0, orderID: 1, customerID: 1, amount: 1 } }
  ]
)

db.completedOrdersView.find()

Materialized view:
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$customerID", totalSpent: { $sum: "$amount" } } },
  { $out: "completedOrdersSummary" }
])

db.completedOrdersSummary.find()

On-demand refresh ($merge):
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$customerID", totalSpent: { $sum: "$amount" } } },
  {
    $merge: {
      into: "completedOrdersSummary",
      whenMatched: "replace",
      whenNotMatched: "insert"
    }
  }
])

db.completedOrdersSummary.find()
================================================================================================
### Compass workflow (GUI)
- Build your pipeline in Aggregations.
- Click “Save as View,” choose name and source collection.
- View appears under Collections with a “View” badge.
- You can inspect the saved pipeline and run queries against the view.
================================================================================================
### Key differences
| Type | Storage | Updates Automatically | Best For |
| Regular View | Virtual | Yes | Dynamic queries, secure projections, simplified access |
| Materialized View | Physical | No | Fast analytics on large/complex aggregations |
| On-Demand Materialized | Physical | Manual refresh | Periodic reporting, snapshots with controlled freshness |
================================================================================================
### Best practices
- Standard views
    - Use for real-time access and security filtering.
    - Keep pipelines simple and selective.
    - Return limited result sets to avoid heavy scans.
- Materialized views
    - Use for complex/\$group-heavy analytics on big data.
    - Refresh during low-traffic windows.
    - Document refresh cadence and staleness expectations.
- On-demand materialized
    - Use when you need control over freshness and peak performance.
    - Choose \$merge for incremental updates or \$out for full replace.
    - Combine with schedulers or triggers.
================================================================================================
### Commands reference
// Create view
db.createView(name, source, pipeline, /* optional */ options)

// List views
db.getCollectionInfos({ type: "view" })

// Drop view
db.viewName.drop()

// Refresh materialized (full replace)
db.source.aggregate([ /* pipeline */, { $out: "materializedName" } ])

// Refresh materialized (upsert/replace)
db.source.aggregate([
  /* pipeline */,
  { $merge: { into: "materializedName", whenMatched: "replace", whenNotMatched: "insert" } }
])
================================================================================================
### Troubleshooting and gotchas
- If you project out a field in an upstream view, downstream views cannot filter/sort on it.
- \$out and \$merge are not allowed in view definitions; use them only in ad-hoc/materialization runs.
- You cannot index a view; index the source collections and join keys instead.
- To change pipeline or collation, drop and recreate the view.
- Be mindful of \$lookup fan-out and ensure join keys are indexed on both sides.
================================================================================================
### Application access (Node.js driver example)
// Views are queried like collections
const view = db.collection("employeeSummary")
const docs = await view.find({ department: "IT" }).toArray()
// For heavy analytics, query the materialized collection instead
================================================================================================
### Summary table
| Concept | Description |
| :-- | :-- |
| View | Virtual collection built from an aggregation pipeline |
| Command | db.createView() |
| Read/Write | Read-only |
| Based On | One or more collections (views allowed) |
| Use Cases | Simplify queries, hide data, reusable analytics pipelines |
| Limitations | No indexes on views, cannot write directly, pipeline cannot include $out/$merge |