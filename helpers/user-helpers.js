const async = require('hbs/lib/async');
var db=require('../config/connection');
const collections = require('../config/collections');
var collection=require('../config/collections');


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
    }

}