var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shop');
var Schema = mongoose.Schema;
var GoodsSchema = new Schema({
    productId:String,
    productName:String,
    salePrice:Number,
    productNum:Number,
    productImage:String,
    
});
var Goods = mongoose.model('Goods',GoodsSchema);
 //模拟数据
/*var arr = [
    ['001', '平衡车', 1999, false, 30, 'pingheng.jpg'],
    ['002', '头戴耳机', 80, false, 30, '2.jpg'],
    ['003', '小米笔记本', 3549, false, 30, 'note.jpg'],
    ['004', '小米6', 2499, false, 30, 'mi6.jpg'],
    ['005', '智能插线板', 59, false, 30, '6.jpg'],
    ['006', '自拍杆', 39, false, 30, 'zipai.jpg'],
    ['007', '小米净水器', 1999, false, 30, '8.jpg'],
    ['008', '电饭煲', 999, false, 30, '9.jpg'],
    ['009', '小米电视 4A', 2099, false, 30, '10.jpg'],
    ['0010', 'Ear1000', 1000, false, 30, '11.jpg'],
    ['0011', 'Ear1100', 1100, false, 30, '12.jpg'],
    ['0012', 'Ear2000', 2000, false, 30, '13.jpg'],
    ['0013', 'Ear1600', 1600, false, 30, '14.jpg'],
    ['0014', '小钢炮蓝牙音箱', 129, false, 30, '1.jpg'],
    ['0015', '智能摄像机', 389, false, 30, 'photo.jpg'],
    ['0016', 'Ear2000', 2000, false, 30, '3.jpg'],
]
for(var i = 0;i<arr.length;i++){
    var g1 = new Goods({
      productId: arr[i][0],
      productName: arr[i][1],
      salePrice: arr[i][2],
      productNum: arr[i][4],
      productImage: arr[i][5]
    });
    g1.save();
}*/


module.exports = Goods;