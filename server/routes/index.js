var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',(req,res)=>{
    // if(req.session.user){
    //     console.log(1);
    // }
    console.log(1);
})

module.exports = router;
