const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const categorySchema=new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    doctors:[
        {
            type:Schema.Types.ObjectId,
            ref:'Doctor'
        }
    ],
    status:{
        type:String,
        enum:['active','inactive'],
        default:'active'
    }
},{
    timestamps:true
})
module.exports=mongoose.model('Category',categorySchema)