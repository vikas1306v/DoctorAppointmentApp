var express = require('express');
var app = express();
const dotenv = require('dotenv');
dotenv.config(); 
const connectToDB = require('./db/connection');
connectToDB();
app.use(express.json());

// Routes
app.use('/api/auth',require("./routes/auth.js"));
app.use('/api/doctor', require('./routes/doctor.js'));
app.use('/api/category', require('./routes/categoryRoutes.js'));
// app.use('/api/slot', require('./routes/slotRoutes.js'));
app.use('/api/booking', require('./routes/bookingRoutes.js'));
app.use('/api/user', require('./routes/userRoutes.js'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});