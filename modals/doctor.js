const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const doctorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  role:{
    type:String,
    enum:["DOCTOR"],
    default:"DOCTOR",
    required:true,
  },
  email: {
    type: String,
    required: true,
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
  categoryId:{
    type:String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
