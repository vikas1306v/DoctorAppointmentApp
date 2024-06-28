const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  role:{
    type:String,
    enum:["USER"],
    default:"USER",
    required:true,

  },
  password: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  latitude:{
    type:Number,
  },
  longitude:{
    type:Number,
  },
  expoToken:{
    type:String,
  },
  bookings:[{
    type:Schema.Types.ObjectId,
    ref:'Booking'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
