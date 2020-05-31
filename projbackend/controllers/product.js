const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")

exports.getProductById = (req,res,next,id)=>{
    Product.findById(id).exec((err,product)=>{
        if(err){
            return res.status(400).json({
                error:"Product not found"
            })
        }
        req.product=product;
        next();
    })
}

exports.createProduct = (req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions=true;

    form.parse(req,(err,fields,file)=>{
        if(err){
            res.status(400).json({
                error:"problem with image"
            })
        }
         
        //destructure the fields
        const {name,description,price,category,stock} = fields

        if(
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ){
            return res.status(400),json({
                error:"Please include all fields"
            })
        }

        let product = new Product(fields)

        //handel the file
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    "error":"File size too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type;
        }   

        //save to the DB

        product.save((err,product)=>{
            if(err){
                res.status(400).json({
                    error:"Saving product in DB Failed"
                })
            }
            res.json(product)
        })

    })
}


exports.getProduct = (req,res) =>{
    req.product.photo = undefined;
    return res.json(req.product);
}

//miiddleware
exports.photo = (req,res,next)=>{
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType)
        return res.send(req.product.photo.data);
    }
    next();
}


exports.deleteProduct = (req,res) =>{
    let product = req.product;
    product.remove((err,deletedProduct)=>{
        if(err){
            return res.status(400).json({
                error:"Failed to delete the product"
            })
        }
        res.json({
            message:"Deletion was a success",
            deletedProduct
        });
    })
}


exports.updateProduct = (req,res) =>{
    let form = new formidable.IncomingForm();
    form.keepExtensions=true;

    form.parse(req,(err,fields,file)=>{
        if(err){
            res.status(400).json({
                error:"problem with image"
            })
        }
         
        let product = req.product;
        //updation code

        product = _.extend(product,fields)//update fields in product

        //handel the file
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    "error":"File size too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type;
        }   

        //save to the DB

        product.save((err,product)=>{
            if(err){
                res.status(400).json({
                    error:"Updation of product Failed"
                })
            }
            res.json(product)
        })
    })
}
