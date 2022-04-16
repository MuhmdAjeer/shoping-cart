var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    // console.log(products)
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

router.get('/delete-product',(req,res)=>{
  let proId = req.query.id
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin')
  })
})

router.get('/edit-products',async(req,res)=>{
  let product =await productHelpers.getProductDetails(req.query.id)
  console.log(product);
  res.render('admin/edit-products',{product})
})

router.post('/edit-product/:id',(req,res)=>{
  
  
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    let id = req.params.id
    res.redirect('/admin')

    if(req.files.Image){
      
      let image = req.files.Image;
      
      image.mv('../SHOPPING CART/public/product-images/'+id+'.png')
      
    }
  })

})



module.exports = router;
