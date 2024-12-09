const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSignUpSchema=new Schema({
     name:String,
     email: String,
     Password:String,
     DateOfBirth:String,
});
const SignUpModel=mongoose.model('SignUpModel',UserSignUpSchema);
module.exports = {
    SignUpModel,
}