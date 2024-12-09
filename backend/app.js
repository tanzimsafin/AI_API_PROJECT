require('dotenv').config()
const express = require('express');
const {userRouter} = require('./router/signIn');
const mongoose  = require('mongoose');
const app=express();
app.use(express.json());
app.use('/app/v1/user',userRouter);
const PORT=8080;
async function main(){
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(PORT,()=>{
        console.log(`Your server is running on port ${PORT}`);
    });
}
main();
