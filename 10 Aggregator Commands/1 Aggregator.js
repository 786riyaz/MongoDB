db.sales.aggregate([
    { $group: { _id: "$category", 
        totalSales: {$sum: {$multiply: ["$price", "$quantity"]}}
     } }, 

]);