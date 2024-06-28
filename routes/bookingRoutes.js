const { default: mongoose } = require('mongoose');
const Booking=require('../modals/booking');
const router=require('express').Router();
const User=require('../modals/user');


router.post('/book', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId, doctorId, date, slotId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(doctorId)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                message: "Invalid userId or doctorId",
                success: false
            });
        }
        const currentDate = new Date();
        const queryDate = new Date(date);
       
        if (queryDate < currentDate.setHours(0, 0, 0, 0)) {
            return res.status(400).json({
                message: "Invalid date. Date should be today or in the future.",
                success: false
            });
        }
        const booking = await Booking.create(
            [{
                user: userId,
                doctor: doctorId,
                date: queryDate,
                slot: slotId,
                status: "pending",
                isBooked: false
            }],
            { session: session }
        );
        await User.findByIdAndUpdate(userId, { $push: { bookings: booking[0]._id } }, { session: session });

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            message: "Booking successful",
            booking: booking[0], 
            success: true
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({
            message: "Failed to book appointment",
            error: error.message,
            success: false
        });
    }
});

router.put('/confirmBooking/:id',async(req,res)=>{
    try{
        const booking=await Booking.findByIdAndUpdate(req.params.id,{
            status:"approved",
            isBooked:true
        },{new:true});
        sendNotification(booking);
        if(!booking){
            return res.status(404).json({
                message:"Booking not found",
                success:false
            });
        }
        return res.status(200).json({
            message:"Booking confirmed",
            booking:booking,
            success:true
        });
        
    }catch(e){
        return res.status(400).json({message:e.message});
    }
}
)
const sendNotification=async (booking)=>{
    const user=await User.findById(booking.user);
    const expoToken=user.expoToken;
    sendImmediateNotification(expoToken)
    userLocation.latitude=user.latitude;
    userLocation.longitude=user.longitude;
    const doctor=await User.findById(booking.doctor);
    doctorLocation.latitude=doctor.latitude;
    doctorLocation.longitude=doctor.longitude;
    scheduleNotification(booking.date,expoToken,userLocation,doctorLocation)
    
}
const sendImmediateNotification = async (token) => {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: token,
        sound: 'default',
        title: 'Appointment Confirmed',
        body: 'Your appointment has been successfully booked.',
        data: { someData: 'goes here' },
      }),
    });
  };
  const userLocation={
        latitude:0,
        longitude:0
  }
const doctorLocation={
        latitude:0,
        longitude:0
}
  const scheduleNotification = async (appointmentTime, token,userLocation,doctorLocation) => {
    const appointmentDate = new Date(appointmentTime);
    const notificationTime = new Date(appointmentDate.getTime() - 60 * 60 * 1000); // 1 hour before
  
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Appointment Reminder",
        body: "Your appointment is in 1 hour."+
        "This is a reminder for your appointment with Dr."+
        "Here attached map link for your appointment location"+
        `https://www.google.com/maps/dir/?api=1&origin=${userLocation.longitude},${userLocation.latitude}&destination=${doctorLocation.longitude},${doctorLocation.latitude}`,
        sound: "default",
      },
      trigger: notificationTime,
    });
  };
router.get('/all/:doctorId',async(req,res)=>{
    try{
        const bookings=await Booking.find({
            doctor:req.params.doctorId
        });
        const pending = bookings.filter(booking => booking.status === "pending");
        const approved = bookings.filter(booking => booking.status === "approved");
        return res.status(200).json({
            pending:pending,
            approved:approved,
            success:true
        });
    }catch(e){
        return res.status(400).json({message:e.message});
    }
}
)
module.exports=router;