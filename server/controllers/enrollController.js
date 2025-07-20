import User from '../models/form.model.js';

export const enrollCourse = async (req, res) => {
    const { userId, courseId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ message: "Already enrolled" });
        }

        user.enrolledCourses.push(courseId);
        await user.save();

        res.status(200).json({ message: "Enrolled successfully" });
    } catch (err) {
        res.status(500).json({ message: "Enrollment failed", error: err.message });
    }
};
