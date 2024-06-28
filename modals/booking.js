const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const bookingSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    doctor:{
        type:Schema.Types.ObjectId,
        ref:'Doctor'
    },
    date:{
        type:Date,
        required:true
    },
    slot:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['pending','approved','rejected'],
        default:'pending'
    },
    isBooked:{
        type:Boolean,
        default:false
    
    }
},{
    timestamps:true
})
module.exports=mongoose.model('Booking',bookingSchema);