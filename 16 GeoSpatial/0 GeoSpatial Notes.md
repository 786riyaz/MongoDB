# MongoDB Geospatial Queries

---

## Overview

Geospatial queries are used for **location-based searches** using **geographic coordinates** in MongoDB.

---

## Create a Geospatial Index

MongoDB requires a **`2dsphere` index** to perform geospatial queries on GeoJSON data.

```js
db.places.createIndex({ location: "2dsphere" })
```

---

## Insert Sample Location Data

```js
db.places.insertMany([
  {
    name: "Coffee Shop",
    location: {
      type: "Point",
      coordinates: [77.5946, 12.9716]
    }
  },
  {
    name: "Mall",
    location: {
      type: "Point",
      coordinates: [77.5999, 12.9789]
    }
  }
])
```

---

## Find Nearby Locations

### Find Locations Within 1000 Meters

```js
db.places.find({
  location: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [77.5946, 12.9716]
      },
      $maxDistance: 1000
    }
  }
})
```

---

## Notes

* Coordinates are in **longitude, latitude** order
* `$near` returns results **sorted by distance**
* `$maxDistance` is specified in **meters**
* A `2dsphere` index is **mandatory** for `$near` queries
* Useful for **maps, delivery apps, nearby search features**