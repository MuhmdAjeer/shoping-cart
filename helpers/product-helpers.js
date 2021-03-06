const async = require('hbs/lib/async');
var db=require('../config/connection');
const collections = require('../config/collections');
var objectId = require('mongodb').ObjectId


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
        
    },
    deleteProduct:(proId)=>{
        return new Promise ((resolve,reject)=>{
             db.get().collection(collections.PRODUCT_COLLECTION).deleteOne({_id:objectId(proId)}).then((response)=>{
                console.log('deleted');
                resolve()
            })
        })
    },
    getProductDetails:(proId)=>{
        return new Promise ((resolve,reject)=>{
            db.get().collection(collections.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    updateProduct:(proId,proDetails)=>{
        return new Promise ((resolve,reject)=>{
            db.get().collection(collections.PRODUCT_COLLECTION)
            .updateOne({_id:objectId(proId)},{
                $set:{
                    Name:proDetails.Name,
                    Price:proDetails.Price,
                    Description:proDetails.Description
                }
            }).then((response)=>{
                resolve()
            })
        })
    }
    

}

