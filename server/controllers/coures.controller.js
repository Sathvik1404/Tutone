import Course from "../models/course.model.js";

// Existing functions (keeping them simple)
const addCourse = async (req, res) => {
    try {
        const courseData = req.body;

        // Basic validation
        if (!courseData.name || !courseData.institute || !courseData.price) {
            return res.status(400).json({
                success: false,
                message: "Name, institute, and price are required"
            });
        }

        const newCourse = new Course(courseData);
        const savedCourse = await newCourse.save();

        res.status(201).json({
            success: true,
            message: "Course added successfully",
            data: savedCourse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding course",
            error: error.message
        });
    }
};

const getCourse = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.status(200).json(courses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getInstituteCourse = async (req, res) => {
    try {
        const { institute } = req.params;
        const courses = await Course.find({ institute: institute });
        res.status(200).json(courses);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Couldn't get courses"
        });
    }
};

// NEW FUNCTIONS FOR RATINGS AND ANALYTICS

// Add/Update Student Rating
const addRating = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { studentId, studentName, rating, review } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Check if student already rated
        const existingRatingIndex = course.ratings.findIndex(
            r => r.studentId.toString() === studentId
        );

        if (existingRatingIndex >= 0) {
            // Update existing rating
            course.ratings[existingRatingIndex].rating = rating;
            course.ratings[existingRatingIndex].review = review;
            course.ratings[existingRatingIndex].date = new Date();
        } else {
            // Add new rating
            course.ratings.push({
                studentId,
                studentName,
                rating,
                review
            });
            course.totalRatings++;
        }

        // Recalculate average rating
        const totalScore = course.ratings.reduce((sum, r) => sum + r.rating, 0);
        course.rating = parseFloat((totalScore / course.ratings.length).toFixed(1));

        await course.save();

        res.status(200).json({
            success: true,
            message: "Rating added successfully",
            data: {
                newRating: course.rating,
                totalRatings: course.totalRatings
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding rating",
            error: error.message
        });
    }
};

// Enroll Student (called after payment)
const enrollStudent = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { studentId, amountPaid } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Check if already enrolled
        const alreadyEnrolled = course.enrolledList.some(
            enrollment => enrollment.studentId.toString() === studentId
        );

        if (alreadyEnrolled) {
            return res.status(400).json({
                success: false,
                message: "Student already enrolled"
            });
        }

        // Add to enrolled list
        course.enrolledList.push({
            studentId,
            amountPaid: amountPaid || course.price
        });

        // Update counters
        course.enrolledStudents++;
        course.totalEarnings += (amountPaid || course.price);

        await course.save();

        res.status(200).json({
            success: true,
            message: "Student enrolled successfully",
            data: {
                enrolledStudents: course.enrolledStudents,
                totalEarnings: course.totalEarnings
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error enrolling student",
            error: error.message
        });
    }
};

// Get Course Analytics
const getCourseAnalytics = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Calculate days left
        const now = new Date();
        const start = new Date(course.startDate);
        const end = new Date(course.endDate);

        let daysLeft = 0;
        let status = 'completed';

        if (now < start) {
            daysLeft = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
            status = 'upcoming';
        } else if (now <= end) {
            daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
            status = 'ongoing';
        }

        const analytics = {
            enrolledStudents: course.enrolledStudents,
            totalEarnings: course.totalEarnings,
            rating: course.rating,
            totalRatings: course.totalRatings,
            daysLeft,
            status,
            recentReviews: course.ratings
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5) // Last 5 reviews
        };

        res.status(200).json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error getting analytics",
            error: error.message
        });
    }
};

// Get Course Reviews
const getCourseReviews = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Paginate reviews
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const reviews = course.ratings
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(startIndex, endIndex);

        res.status(200).json({
            success: true,
            data: {
                reviews,
                totalReviews: course.ratings.length,
                averageRating: course.rating,
                currentPage: parseInt(page),
                totalPages: Math.ceil(course.ratings.length / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error getting reviews",
            error: error.message
        });
    }
};

// Delete Course
const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const deletedCourse = await Course.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting course",
            error: error.message
        });
    }
};

export {
    addCourse,
    getCourse,
    getInstituteCourse,
    addRating,
    enrollStudent,
    getCourseAnalytics,
    getCourseReviews,
    deleteCourse
};