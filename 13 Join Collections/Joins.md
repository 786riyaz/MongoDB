## Introduction
MongoDB, being a document-oriented database, handles relationships between data differently than traditional SQL databases. Instead of using traditional JOIN operations, MongoDB uses the aggregation pipeline with `$lookup` to combine related data at query time.

## $lookup Operator
The `$lookup` stage is MongoDB's primary tool for joining collections in an aggregation pipeline.

### Basic Syntax

db.collection.aggregate([
  {
    $lookup: {
      from: "<collection_to_join>",
      localField: "<field_from_input>",
      foreignField: "<field_from_foreign_collection>",
      as: "<output_array_field>"
    }
  }
])


### Key Components
- **from**: Specifies the collection to join with
- **localField**: Field from the input collection
- **foreignField**: Field from the 'from' collection
- **as**: Name for the output array field

## Types of Joins

### 1. Left Join
Returns all documents from the input collection with matching documents from the foreign collection.

db.books.aggregate([
  {
    $lookup: {
      from: "authors",
      localField: "authorId",
      foreignField: "_id",
      as: "author"
    }
  }
])

### 2. Right Join
Implemented by reversing the collections in a left join operation.

db.authors.aggregate([
  {
    $lookup: {
      from: "books",
      localField: "_id",
      foreignField: "authorId",
      as: "books"
    }
  }
])

### 3. Inner Join
Combines `$lookup` with `$match` to filter out unmatched documents.

db.books.aggregate([
  {
    $lookup: {
      from: "authors",
      localField: "authorId",
      foreignField: "_id",
      as: "author"
    }
  },
  {
    $match: { 
      author: { $ne: [] } 
    }
  }
])

### 4. Full Join
Combines both collections using `$lookup` and `$unionWith`.

db.books.aggregate([
  {
    $lookup: {
      from: "authors",
      localField: "authorId",
      foreignField: "_id",
      as: "author"
    }
  },
  {
    $unionWith: {
      coll: "authors",
      pipeline: [
        {
          $lookup: {
            from: "books",
            localField: "_id",
            foreignField: "authorId",
            as: "books"
          }
        }
      ]
    }
  }
])


## Join Types Comparison Table

| Join Type | Implementation | Result |
|-----------|---------------|---------|
| Left Join | Basic `$lookup` | All documents from input collection |
| Right Join | Reversed `$lookup` | All documents from foreign collection |
| Inner Join | `$lookup` + `$match` | Only matching documents |
| Full Join | `$lookup` + `$unionWith` | All documents from both collections |

## Best Practices
1. Index the join fields for better performance
2. Consider document size limits when joining collections
3. Use projection to limit returned fields when necessary
4. Monitor memory usage during large join operations

## Notes
- The `$lookup` stage always returns an array field
- Empty arrays indicate no matches were found
- Join operations in MongoDB are generally more expensive than in SQL databases