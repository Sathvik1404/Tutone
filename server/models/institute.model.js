import { mongoose } from 'mongoose';
const instituteSchema = new mongoose.Schema({
    institute: {
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
});
const Institute = mongoose.model("institute", instituteSchema);
export default Institute;