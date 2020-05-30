const User =require("../models/user");
const Order =require("../models/order");


exports.getUserById = (req,res,next,id)=>{
    User.findById(id).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error:"No user find...."
            })
        }
        req.profile=user;
        next();
    });
};  


exports.getUser = (req,res)=>{
    //TODO: get back here for password
    req.profile.salt=undefined;
    req.profile.encry_password=undefined;
    req.profile.createdAt=undefined;
    req.profile.updatedAt=undefined;
    return res.json(req.profile);
}

exports.updateUser = (req,res)=>{
    User.findByIdAndUpdate(
        {_id : req.profile._id},
        {$set:req.body},
        {new:true, useFindAndModify:false},
            (err,user)=>{
                if(err){
                    return res.status(400).json({
                        error:"Update unsuccesfull...."
                    })
                }

            user.salt=undefined;
            user.encry_password=undefined;
            user.createdAt=undefined;
            user.updatedAt=undefined;
            res.json(user);
            
            }
    );
};  


exports.userPurchaseList=(req,res)=>{
    Order.find({user:req.profile._id})
    .populate("user", "_id name")
    .exec((err,order)=>{
        if(err){
            return res.staus(400).json({
                error:"No orders found"
            })
        }
        return res.json(order);
    })
}


exports.pushOrderInPurchaseList = (req,res,next)=>{
    let purchases =[];
    req.body.order.products.forEach(product =>{
        purchases.push({
            _id: product._id,
            name: product.name,
            description:product.description,
            category: product.category,
            quantity:product.quantity,
            amount:req.body.order.amount,
            transaction_id:req.body.order.transaction_id
        })
    })

    //Store in DB
    User.findOneAndUpdate(
        {_id:req.profile._id},
        {$push:{purchases:purchases} },
        {new:true}, //Send me back the updated object form db
        (err,purchases)=>{
            if(err){
                return res.status(400).json({
                    error:"Unable to save purchase list"
                })
            }
            next();
        }
    ) 
};



//Example not used
// exports.getAllUsers = (req,res)=>{
//     User.find().exec((err,users)=>{
//         if(err || !users){
//             return res.status(400).json({
//                 error:"No users found...."
//             })
//         }
//         res.json(users);
//     });
// };  