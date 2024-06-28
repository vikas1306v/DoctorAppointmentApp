const express = require('express');
const router = express.Router();
const Category = require('../modals/category');
const Doctor = require('../modals/doctor');
const Booking=require('../modals/booking');
const slots=require('../utils/slot.js');

//get all doctors
router.get('/all', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        if (!doctors) {
            return res.status(404).json({
                message: "No doctors found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Doctors found successfully",
            doctors: doctors,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to find doctors",
            error: error.message,
            success: false
        });
    }
})

//find all doctor of a category 
router.get('/getAllByCategory/:id', async (req, res) => {
    
    try {
        const category = await Category.findById(req.params.id).populate('doctors');
        
        if (!category) {
            return res.status(404).json({
                message: "Category not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Category found successfully",
            category: category,
            success: true
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});


//asign doctor to category
router.put('/assignDoctorToCategory', async (req, res) => {
    try {
        const doctor= await Doctor.findById(req.body.doctorId);
        if(!doctor){
            return res.status(400).json({
                message:"Doctor not found",
                success:false
            });
        }
        const category = await Category.findByIdAndUpdate(req.body.categoryId, { $push: { doctors:doctor} }, { new: true });
        return res.status(200).json({
            message: "Doctor assigned successfully",
            category: category,
            success: true
        });
    } catch (error) {
        res.status(400).json({ message: error });
    }
});
//delete doctor from category
router.put('/deleteDoctorFromCategory', async (req, res) => {
    try {
        const doctor= await Doctor.findById(req.body.doctorId);
        if(!doctor){
            return res.status(400).json({
                message:"Doctor not found",
                success:false
            });
        }
        const category = await Category.findByIdAndUpdate(req.body.categoryId, { $pull: { doctors:doctor._id} }, { new: true });
        return res.status(200).json({
            message: "Doctor deleted successfully",
            category: category,
            success: true
        });
    } catch (error) {
        res.status(400).json({ message: error });
    }
});

//get free slot of doctor of a day
router.get('/getFreeSlot/:doctorId', async (req, res) => {
    const {date}=req.query;
    try {
        const currentDate = new Date();
        const queryDate = new Date(date);
       
        if (queryDate < currentDate.setHours(0, 0, 0, 0)) {
            return res.status(400).json({
                message: "Invalid date. Date should be today or in the future.",
                success: false
            });
        }
        const doctor = await Doctor.findById(req.params.doctorId);
        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found",
                success: false
            });
        }
        const bookings = await Booking.find({
            doctor: req.params.doctorId,
            date: { $gte: new Date(date) }, 
            status: "approved",
            isBooked: true
        });
        let freeSlots = [];
        slots.forEach(slot => {
            let isBooked = false;
            bookings.forEach(booking => {
                if (booking.slot === slot.id) {
                    isBooked = true;
                }
            });
            if (!isBooked) {
                freeSlots.push(slot);
            }
        });
        
        return res.status(200).json({
            message: "Free slots found successfully",
            freeSlots: freeSlots,
            success: true,
            doctor: doctor
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
})

//update doctor profile
router.put('/updateProfile/:id', async (req, res) => {
    const { mobileNumber,name,profileImage, address, longitude,latitude } = req.body;
    try{
        const doctor=await Doctor.findByIdAndUpdate(req.params.id,{
            mobileNumber:mobileNumber,
            name:name,
            profileImage:profileImage,
            address:address,
            longitude:longitude,
            latitude:latitude
        },{new:true});
        if(!doctor){
            return res.status(404).json({
                message:"Doctor not found",
                success:false
            });
        }
        return res.status(200).json({
            message:"Doctor updated successfully",
            doctor:doctor,
            success:true
        });
    }catch(error){
        return res.status(400).json({message:error.message});
    }

})


module.exports = router;
