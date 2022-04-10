const async = require('hbs/lib/async');
var db=require('../config/connection');
const collections = require('../config/collections');
var collection=require('../config/collections');


module.exports={

    addProducts:(product,callback)=>{
        console.log(product);

        db.get().collection('product').insertOne(product).then((data)=>{
            console.log(data.insertedId);
            callback(data.insertedId)
            
        })
    },
    getAllProducts:()=>{
        return new Promise (async(resolve,reject)=>{
            let products =await db.get().collection(collections.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
        
    }

}

