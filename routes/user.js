var express = require('express');
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
var router = express.Router();
let verifyLogin = userHelpers.verifyLogin


/* GET home page. */
router.get('/', function(req, res, next) {

  let user = req.session.user;
 
  let cartCount = null

  if (req.session.user){
  
  cartCount = userHelpers.getCartCount(req.session.user._id)

  }
  productHelpers.getAllProducts().then((products)=>{
    res.render('users/view-products', {products,user,cartCount} )
  })
 
  
});

router.get('/login',(req,res)=>{  
  if(req.session.logged){
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

      req.session.logged = true
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
  userHelpers.getCartItems(req.session.user._id).then((response)=>{
    res.render('users/cart',{products:response})
    console.log(response)
  })
 
})

//add to cart button setting
router.get('/add-to-cart/:id',verifyLogin,(req,res)=>{
  console.log('vannoiruddd');
  
  userHelpers.addToCart(req.params.id,req.session.user._id).then((response)=>{
    
    res.redirect('/')
  })
})




module.exports = router;
