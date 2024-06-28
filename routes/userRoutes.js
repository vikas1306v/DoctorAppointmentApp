const express = require('express');
const User = require('../modals/user.js');
const router = express.Router();
const Booking = require('../modals/booking.js');
const Doctor=require("../modals/doctor.js")
const Category=require('../modals/category.js')

router.get('/all', async (req, res) => {
    try {
        const users = await User.find();
        if (!users) {
            return res.status(404).json({
                message: "No users found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Users found successfully",
            users: users,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to find users",
            error: error.message,
            success: false
        });
    }
})
router.put("/update/:id", async (req, res) => {
    const { mobileNumber,name,expoToken,profileImage, address, longitude,latitude } = req.body;
    try{
        const user=await User
        .findByIdAndUpdate(req.params.id,{
            mobileNumber:mobileNumber,
            name:name,
            profileImage:profileImage,
            address:address,
            longitude:longitude,
            latitude:latitude,
            expoToken:expoToken
        },{new:true});
        if(!user){
            return res.status(404).json({
                message:"User not found",
                success:false
            });
        }
        return res.status(200).json({
            message:"User updated successfully",
            user:user,
            success:true
        });
    }catch(error){
        return res.status(400).json({message:error.message});
    }
});


router.get('/findNearestDoctors', async (req, res) => {
    const { userLongitude, userLatitude, categoryId } = req.query;
  
    try {
      if (!userLongitude || !userLatitude || !categoryId) {
        return res.status(400).json({
          message: "Longitude, latitude, and categoryId are required",
          success: false
        });
      }
  
      const parsedLongitude = parseFloat(userLongitude);
      const parsedLatitude = parseFloat(userLatitude);
  
      if (isNaN(parsedLongitude) || isNaN(parsedLatitude)) {
        return res.status(400).json({
          message: "Invalid longitude or latitude. Please provide numerical values.",
          success: false
        });
      }
      const category= await Category.findById({_id:categoryId}).populate('doctors')
      
      
      const nearestDoctorsMap={}
      category.doctors.forEach((doctor)=>{
        const doctorLongitude=doctor.longitude;
        const doctorLatitude=doctor.latitude;
        const distance=calculateDistance(doctorLatitude,userLatitude,doctorLongitude,userLongitude)
        nearestDoctorsMap[doctor]=distance
      })
      const sortedDoctors = Object.entries(nearestDoctorsMap)
        .sort((a, b) => a[1] - b[1]);

      return res.status(200).json({
        message: "Nearest doctors found successfully",
        doctors: sortedDoctors,
        success: true
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to find nearest doctors",
        error: error.message,
        success: false
      });
    }
  });
  const  calculateDistance=(lat1, lon1, lat2, lon2)=> {
    const RADIUS_OF_EARTH = 6371; 
  
    const latDistance = Math.radians(lat2 - lat1);
    const lonDistance = Math.radians(lon2 - lon1);
  
    const a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
              + Math.cos(Math.radians(lat1)) * Math.cos(Math.radians(lat2))
              * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
  
    const formula = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = RADIUS_OF_EARTH * formula;
  
    return distance;
  }
  Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
}


router.get("/bookings/all/:userId", async (req, res) => {
    const { userId } = req.params;
    //find  booking then make pending and approval
    try {
        const bookings = await Booking.find({ user: userId }).populate('doctor');
        if (!bookings) {
            return res.status(404).json({
                message: "No bookings found",
                success: false
            });
        }
        const pending=bookings.filter(booking=>booking.status==="pending");
        const approved=bookings.filter(booking=>booking.status==="approved");
        return res.status(200).json({
            message: "Bookings found successfully",
            pending:pending,
            approved:approved,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to find bookings",
            error: error.message,
            success: false
        });
    }
});

module.exports = router;