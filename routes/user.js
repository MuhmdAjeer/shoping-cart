var express = require('express');
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
var router = express.Router();
let verifyLogin = userHelpers.verifyLogin


/* GET home page. */
router.get('/', function(req, res, next) {

  let user = req.session.user;
  
 
  productHelpers.getAllProducts().then((products)=>{
    res.render('users/view-products', {products,user} )
  })
 
  
});

router.get('/login',(req,res)=>{  
  if(req.session.loggedIn){
    res.render('/')
  }else{
    res.render('users/login',{logginErr : req.session.logginErr})
    req.session.logginErr=false
  }
  
})

router.get('/signup',(req,res)=>{
  res.render('users/signup')
})

router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response)
  })
})

router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){

      req.session.loggedIn = true
      req.session.user=response.user      
      res.redirect('/')
    }else{
      req.session.logginErr = true
      res.redirect('/login')
    }
  })
})

router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/')
})

//Checking if loginned in by using a middleware 
router.get('/cart',verifyLogin,(req,res)=>{
  res.render('users/cart')
 
})

module.exports = router;
