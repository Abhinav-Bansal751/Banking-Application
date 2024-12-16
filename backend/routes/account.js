const express = require('express');
const { authMiddleware } = require('../middleware');
const { accountModel}= require('../db');
const { default: mongoose } = require('mongoose');
const router = require('.');



const router = express.Router();

router.post('/balance',authMiddleware,async(req,res) => {
   
    const account = await accountModel.findOne({
        userId:req.userId
    })


    res.json({
        balance:account.balance
    })
})

router.post('/transfer',authMiddleware, async(req,res) => {
    const session = await mongoose.startSession();

    session.startTransaction();

    const { amount,to } = req.body;

     // Fetch the accounts within the transaction
     const account = await accountModel.findOne({ userId: req.userId }).session(session);
     
     if(!account || account.balance < amount ){
        await session.abortTransaction();
        return res.json({
            message:"Insufficent Balance"
        })
     }

     
    const toAccount = await accountModel.findOne({ userId: to }).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.json({
            message:"Recievers account not found"
        })
    }


        

    // Perform the transfer
    await accountModel.updateOne({ userId : req.userId },{$inc :{ balance : -amount}}).session(session);
    await accountModel.updateOne({ userId : to }, { $inc : { balance: amount }}).session(session);

 // Commit the transaction
 await session.commitTransaction();
 res.json({
    message: "Transfer successful"
});

    })

    module.exports = router;