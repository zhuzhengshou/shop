var express = require('express');
var goodsRouter = express.Router();
var Goods = require('../models/Goods');
var User = require('../models/User');
goodsRouter.get('/list',(req,res,next)=>{
    var pageNum = parseInt(req.query.pageNum);
    var pageSize = parseInt(req.query.pageSize);
    var isSort = req.query.isSort; //为字符串true或false
    var sortType = req.query.sortType;
    var skip = (pageNum -1) * pageSize;
    var priceLimit = {};
    if (req.query.priceRange !== 'All') {
           var priceMin = 0;
           var priceMax = 0;
        switch (parseInt(req.query.priceRange)) {
            case 0 :
                priceMin = 0;
                priceMax = 100;
                break;
            case 1 :
                priceMin = 100;
                priceMax = 500;
                break;
            case 2 :
                priceMin = 500;
                priceMax = 1000;
                break;
            case 3 :
                priceMin = 1000;
                priceMax = 5000;
                break;
        }
        priceLimit = {
            salePrice: {
              $gt: priceMin,
              $lte: priceMax
            }
        }
    }
    var base =Goods.find(priceLimit).skip(skip).limit(pageSize);
    var working = isSort === 'false' ? base : base.sort({salePrice:sortType});
    working.exec((err,data)=>{
        if(err) next(err)
        else{
            res.json(data);
        }
    })
    
})
goodsRouter.post('/addCart',(req,res,next)=>{
    var id = req.body.id;
    var userId = req.session.user.userId;
    function findUser(){
        return new Promise((resolved,reject)=>{
            User.findOne({
              userId: userId
            })
            .exec((err,user)=>{
                if(err) reject(err)
                else{
                    if(user){
                        resolved(user);
                    }
                }
            })
        })
    }
    function addProduct(user){
        return new Promise((resolved,reject)=>{
            Goods.findById(id).exec((err,goods)=>{
                if(err) reject(err)
                else{
                    if(goods){
                        if (goods.productNum > 0) {
                            //将查询到的Document类型转为Object对象，才可添加Schema没有的字段
                        var obj = goods.toObject();
                        
                          //记录商品里初始的数量,等商品加入购物车后从商品仓库数量减一
                          var flag = true;
                          //查看已有的购物车有没有一样的商品,如果有，则数量加一，如果没有，加入新商品
                          if(user.cartList.length!==0){
                            for (var i = 0, len = user.cartList.length; i < len; i++) {
                                //因为mongdb数据库中的_id类型是Object,想要实现比较，需要String()获取对象的值
                              if (String(user.cartList[i]._id) === id) {
                                user.cartList[i].productNum++;
                                //修改数组字段需要的,如果为数组字段再指定了子文档，则可不用加
                                //user.markModified('cartList');
                                flag = false;
                              } 
                            }
                          }
                          if(flag){
                            obj.productNum = 1;
                            //因为仓库中的商品是没有是否被选中属性的，所以要添加，默认是被选中的
                            obj.checked = true;
                            user.cartList.push(obj);
                          }
                          user.save((err,result)=>{
                              if(err) reject(err)
                              else{
                                  resolved([result,goods]);
                              }
                          });
                        }
                    }
                }
            })
        })
    }
    function end([result, goods]) {
        //运行到此，商品已经加入购物车，需要将仓库中商品减一
        goods.productNum  --;
        goods.save();
        res.json('已经加入购物车');
    }
    findUser()
    .then(addProduct)
    .then(end)
    .catch((err)=>{next(err)})
    
})
module.exports =goodsRouter;