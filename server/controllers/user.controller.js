import User from "../models/form.model.js";
import bcrypt from "bcrypt";
import Institute from "../models/institute.model.js";
import Razorpay from 'razorpay';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
// import crypto from "crypto";
// import User from "../models/user.model.js";
import Course from "../models/course.model.js";

const createUsers = async (req, res) => {
    const { name, email, password, confirmpassword } = req.body;

    if (!name || !email || !password || !confirmpassword) {
        return res.status(400).json({ message: "Please enter all the fields", success: false });
    }

    if (password !== confirmpassword) {
        return res.status(400).json({ message: "Passwords do not match", success: false });
    }

    try {
        const existed = await User.findOne({ email });

        if (existed) {
            return res.status(400).json({ success: false, message: "The User Already Exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "New User has been Created", success: true });
    } catch (err) {
        console.error("Error in creating user:", err);
        res.status(500).json({ message: "Error in creating the user", success: false });
    }
};

const userlogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please enter both email and password", success: false });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found", success: false });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials", success: false });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "1h" });

        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                enrolledCourses: user.enrolledCourses,
            },
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "There was an error while logging in", success: false });
    }
};
const AuthChecker = (req, next, res) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(400).json({ success: false, message: "Token is not Provided" })
    }
    try {
        const res = jwt.verify(token, process.env.SECRET);
        req.user = res;
        next();
    } catch (err) {
        return res.status(400).json({ success: false, message: "Invalid Token" })
    }
};
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        res.status(200).json({ message: "User deleted Successfully", success: true });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ message: "Error in deleting the user", success: false });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ users, success: true });
    } catch (err) {
        console.error("Get Users Error:", err);
        res.status(500).json({ message: "Error retrieving users", success: false });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    let data = req.body;

    try {
        if (data.email) {
            const existingUser = await User.findOne({ email: data.email, _id: { $ne: id } });
            if (existingUser) {
                return res.status(400).json({ success: false, message: "The User with this email already exists" });
            }
        }
        if (data.password) {
            const salt = await bcrypt.genSalt(10);
            data.password = await bcrypt.hash(data.password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User Updated Successfully", data: updatedUser });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ success: false, message: "Error updating user" });
    }
};
const createInstitute = async (req, res) => {
    const { institute, email, password, confirmpassword } = req.body;
    if (!institute || !email || !password) {
        res.status(400).json({ success: false, message: "Please Fill The Details Properly" })
    }
    if (password !== confirmpassword) {
        return res.status(400).json({ message: "Passwords do not match", success: false });
    }
    try {
        const existed = await Institute.findOne({ email });
        if (existed) {
            return res.status(400).json({ success: true, message: "Institute with given credentials already consists" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashpass = await bcrypt.hash(password, salt);
        const newInstitute = new Institute({ institute, email, password: hashpass })
        await newInstitute.save();
        res.status(200).json({ success: true, message: "Institute With Given Credentials Created" })
    }
    catch (err) {
        res.status(400).json({ success: true, message: "Error in creating a Institute" })
    }
};
const getInstitute = async (req, res) => {
    try {
        const data = await Institute.find({});
        res.status(200).json(data)
    }
    catch (err) {
        res.status(400).json({ success: false, message: "There was an error in retreving the Institutes" })
    }
};
const instituteLogin = async (req, res) => {
    const { institute, email, password } = req.body;

    try {
        const response = await Institute.findOne({ $and: [{ email: email }, { institute: institute }] });

        if (!response) {
            return res.status(400).json({ message: "Institute not found", success: false });
        }

        const isMatch = await bcrypt.compare(password, response.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials", success: false });
        }

        res.status(200).json({ message: "Institute Login Successful", success: true });
    } catch (err) {
        console.error("Login Error:", err);
    }

};
const sendKey = async (req, res) => {
    res.status(200).json({ key: process.env.RAZORPAY_KEY_ID })
};
const createOrder = async (req, res) => {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
    });
    try {
        const options = {
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1,
        };

        const order = await razorpay.orders.create(options);
        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET); // ✅ use correct env var
        hmac.update(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id);
        const generatedSignature = hmac.digest("hex");
        const { userId, courseId } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        const course = await Course.findById(courseId);
        console.log(course);

        if (!user.enrolledCourses.includes(courseId)) {
            user.enrolledCourses.push(courseId);
            await user.save();
        }

        res.json({ success: true, message: "Payment verified and course enrolled!" });
    }
    catch (err) {
        console.error("Error during course enrollment:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getEnrolledCourses = async (req, res) => {
    try {

        const userId = req.params.userId;
        console.log(userId);
        const user = await User.findById(userId).populate("enrolledCourses");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, courses: user.enrolledCourses });
    } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export { getUsers, createUsers, deleteUser, updateUser, userlogin, createInstitute, getInstitute, instituteLogin, verifyPayment, createOrder, sendKey, getEnrolledCourses };
