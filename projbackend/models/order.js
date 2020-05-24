const mongoose = require("mongoose");
const { objectId } = mongoose.Schema;

const ProductCartSchema = new mongoose.Schema({
    product:{
        type: objectId,
        ref:"Product",
    },
    name:String,
    count:Number,
    price: Number,
});

const ProductCart = mongoose.model("ProductCart",ProductCartSchema);

const OrderSchema = mongoose.Schema({
    products :[ProductCartSchema],
    transaction_id:{},
    amount :{type: Number},
    address: String,
    updated: Date,
    user: {
        type:objectId,
        ref:"User"
    }
},{timestamps:true});

const Order = mongoose.model("Order",OrderSchema);

nodule.exports={Order,ProductCart};