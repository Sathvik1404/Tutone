import express from 'express';
import { getUsers, deleteUser, createUsers, updateUser, userlogin, createInstitute, getInstitute, instituteLogin, verifyPayment, createOrder, sendKey, getEnrolledCourses } from '../controllers/user.controller.js';
import {
    addCourse,
    getCourse,
    getInstituteCourse,
    addRating,
    enrollStudent,
    getCourseAnalytics,
    getCourseReviews,
    deleteCourse
} from '../controllers/coures.controller.js';
const router = express.Router();
router.post('/course/add', addCourse);
router.get('/course', getCourse);
router.get('/course/:institute', getInstituteCourse);
router.delete('/course/:courseId', deleteCourse);
router.post('/course/:courseId/rating', addRating);
router.post('/course/:courseId/enroll', enrollStudent);
router.get('/course/:courseId/analytics', getCourseAnalytics);
router.get('/course/:courseId/reviews', getCourseReviews);
router.get('/users', getUsers)
router.get("/user/:userId/courses", getEnrolledCourses);
router.delete('/users/:id', deleteUser)
router.post('/users', createUsers)
router.post('/users/login', userlogin);
router.put('/users/:id', updateUser);
router.post('/institute', createInstitute)
router.get('/institute', getInstitute)
router.post('/institute/login', instituteLogin);
router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/getKey', sendKey);
export default router;