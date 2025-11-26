// Add a new value to the "tags" array for the product with the name "Wireless Mouse".
db.products.updateOne(
{ name: "Wireless Mouse" },
{ $push: { tags: "Mouse" } }
)

