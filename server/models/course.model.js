import mongoose from "mongoose";

const coursesSchema = new mongoose.Schema({
    // Basic Info (existing fields)
    name: { type: String, required: true },
    institute: { type: String, required: true },
    duration: { type: String, required: true },
    location: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    description: { type: String, required: true },
    category: {
        type: String,
        enum: ['programming', 'design', 'business', 'marketing', 'data-science', 'other'],
        default: 'programming'
    },
    schedule: { type: String },
    maxStudents: { type: Number },
    prerequisites: { type: String },
    courseLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'beginner'
    },
    courseType: {
        type: String,
        enum: ['online', 'offline', 'hybrid', 'live'],
        default: 'online'
    },

    // Professor Info
    professor: {
        name: { type: String, required: true },
        title: String,
        email: { type: String, required: true },
        bio: String,
        experience: Number
    },

    // Arrays
    meetingLinks: [{
        title: String,
        url: String,
        day: String,
        time: String
    }],
    syllabus: [{
        week: Number,
        topic: String,
        description: String
    }],
    features: [String],
    learningOutcomes: [String],

    // Additional Fields
    imageUrl: String,
    isLive: { type: Boolean, default: false },

    // Enhanced Analytics Fields
    enrolledStudents: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },

    // Student Ratings
    ratings: [{
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        studentName: String,
        rating: { type: Number, min: 1, max: 5 },
        review: String,
        date: { type: Date, default: Date.now }
    }],

    // Enrolled Students List
    enrolledList: [{
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        enrolledAt: { type: Date, default: Date.now },
        amountPaid: Number
    }]
}, {
    timestamps: true
});

const Course = mongoose.model("Course", coursesSchema);
export default Course;