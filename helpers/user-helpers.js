const async = require('hbs/lib/async');
var db=require('../config/connection');
const collections = require('../config/collections');
var collection=require('../config/collections');
const { ObjectId } = require('mongodb');
var objectId = require('mongodb').ObjectId


module.exports={
    doSignup:(userData)=>{
        return new Promise((resolve,rejest)=>{
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data)
            })
        })
        
    },

    doLogin:(loginData)=>{
        return new Promise(async(resolve,reject)=>{

            // let loginStatus = false;
            let response= {}
            let user =await db.get().collection(collection.USER_COLLECTION).findOne({Email:loginData.Email});

            if(user){
                if(user.Password === loginData.Password){
                    console.log('login success')
                    response.user=user;
                    response.status=true;
                    resolve(response)

                }else{
                    console.log('failed password');
                    response.status = false;
                    resolve(response)

                }
            }else{
                console.log('failed email');
                response.status = false;
                resolve(response)
            }
            
        })
        

    },

    verifyLogin:(req,res,next)=>{
        if(req.session.logged){
            next()
        }else{
            res.redirect('/login')
        }
    },
    addToCart:(proId,userId)=>{
        return new Promise(async(resolve,reject)=>{
            
            user = await db.get().collection(collections.CART_COLLECTION).findOne({user:objectId(userId)})

            if(user){
                db.get().collection(collections.CART_COLLECTION)
                .updateOne({user:objectId(userId)},
                    {
                        $push:{products:objectId(proId)}
                    }
                ).then(()=>{
                    resolve()
                })

            }else{
                let cartObj = {
                    user : objectId(userId),
                    products : [objectId(proId)]
                }
                db.get().collection(collections.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve(response)
                })
            }
        })
    },
    getCartItems:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems = await db.get().collection(collections.CART_COLLECTION).aggregate([
                
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $lookup:{
                        from:collections.PRODUCT_COLLECTION,
                        let:{prodList:'$products'},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id','$$prodList']
                                    }
                                }
                            }
                        ],
                        as:'cartItems'
                    }
                }

            ]).toArray()
            resolve(cartItems[0].cartItems)
        })
    },
    getCartCount:(userId)=>{
       return new Promise((resolve,reject)=>{
           cart = db.get().collection(collections.CART_COLLECTION).findOne({user:objectId(userId)})
           cartCount = cart.products.length
           resolve(cartCount)
       })
    }

}