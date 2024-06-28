const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../modals/user.js');
const Doctor = require('../modals/doctor.js');
const router = express.Router();
const transporter = require('../service/mailService.js');
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/logout', async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    })
})

router.post('/googleauth', async (req, res) => {
    const { role } = req.body;
    if (role == "DOCTOR") {
        return createDoctor(req, res,role);
    } else if(role == "USER") {
        return createUser(req, res,role);
    }

})

const createUser = async (req, res,role) => {
    const { email, name, profileImage } = req.body;
    if (!email) {
        return res.status(400).json({
            success: false,
            error: "Fields are empty",
            message: "Please enter all the fields"
        })
    }
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            const token = jwt.sign({ user_id: user._id, user_role: user.role }, JWT_SECRET, { expiresIn: '1d' });
            return res.status(200).json({
                success: true,
                message: "User logged in successfully",
                token: token,
                user: user
            })
        } else {
            const salt = await bcrypt.genSalt(10);
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(generatedPassword, salt);
            const user = await User.create({
                name: name,
                profileImage: profileImage ,
                role:role,
                email: email,
                password: hashedPassword,

            })
            const token = jwt.sign({ user_id: user._id, user_role: user.role }, JWT_SECRET, { expiresIn: '1d' });
            return res.status(200).json({
                success: true,
                message: "User logged in successfully",
                token: token,
                user: user
            })
        }

    } catch (e) {
        return res.status(500).json({
            success: false,
            error: e,
            message: "Internal Server Error"
        })

    }
}
const createDoctor = async (req, res,role) => {
    const { email, name, profileImage } = req.body;
    if (!email) {
        return res.status(400).json({
            success: false,
            error: "Fields are empty",
            message: "Please enter all the fields"
        })
    }
    try {
        const doctor = await Doctor.findOne({ email: email });
        if (doctor) {
            const token = jwt.sign({ user_id: doctor._id, user_role: doctor.role }, JWT_SECRET, { expiresIn: '1d' });
            return res.status(200).json({
                success: true,
                message: "Doctor logged in successfully",
                token: token,
                doctor: doctor
            })
        } else {
            const salt = await bcrypt.genSalt(10);
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(generatedPassword, salt);
            const doctor = await Doctor.create({
                name: name,
                profileImage: profileImage,
                email: email,
                password: hashedPassword,
                role:role

            })
            const token = jwt.sign({ user_id: doctor._id, user_role: doctor.role }, JWT_SECRET, { expiresIn: '1d' });
            return res.status(200).json({
                success: true,
                message: "User logged in successfully",
                token: token,
                doctor: doctor
            })
        }
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            error: e,
            message: "Internal Server Error"
        })

    }
}

//create a user
router.post("/register", async (req, res) => {
    const { email, name, category, password, profileImage, role, categoryId } = req.body.email;
    const user = await User.find({ email: email });
    if (user != null) {
        return res.status(500).json({
            success: false,
            message: user.role + " Already Exist"
        })
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = bcrypt.hash(password, salt);
    user = await User.create({
        name: name,
        email: email,
        password: hashPassword,
        role: role,
        categoryId: categoryId,
        profileImage: profileImage

    })
    const token = jwt.sign({ user_id: user._id, user_role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token: token,
        user: user
    })

})
module.exports = router;