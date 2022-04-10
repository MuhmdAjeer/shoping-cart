var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    console.log(products)
    res.render('admin/admin-products',{products,admin : true })
  })
  
  
});

router.get('/add-product',function(req,res){
  
    res.render('admin/add-products')
  
})

router.post('/add-product',(req,res)=>{
  
  productHelpers.addProducts(req.body,(id)=>{

    let image = req.files.Image
    image.mv('../SHOPPING CART/public/product-images/'+id+'.png',(err,done)=>{
      if(!err){
        res.render('admin/add-products')
      }else{
        console.log('couldnt add the product')
      }
    })

    
  })
})


module.exports = router;
