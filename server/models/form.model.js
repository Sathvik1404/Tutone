import { mongoose } from 'mongoose';
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true],
    },
    email: {
        type: String,
        required: [true],
    },
    password: {
        type: String,
        required: true
    },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
});
const User = mongoose.model("product", productSchema);
export default User;