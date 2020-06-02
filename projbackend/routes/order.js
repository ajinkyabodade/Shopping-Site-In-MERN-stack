const express = require("express");
const router = express.Router();
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth")
const {getUserById,pushOrderInPurchaseList} = require("../controllers/user")
const {updateStock} = require("../controllers/product")
const {getOrderById, createOrder, getAllOrder, updateStatus, getOrderStatus} = require("../controllers/order")

//parms

router.param("userId",getUserById)
router.param("orderId",getOrderById)

//Routes
router.post("/order/create/:userId",isSignedIn,isAuthenticated,pushOrderInPurchaseList,updateStock,createOrder)
router.get("/order/all/:userId",isSignedIn,isAuthenticated,isAdmin,getAllOrder)

//Status of order
router.get("order/status/:userId",isSignedIn,isAuthenticated,isAdmin,getOrderStatus)
router.put("order/:orderId/status/:userId", isSignedIn,isAuthenticated,isAdmin,updateStatus)

module.exports = router;