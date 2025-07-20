import { motion } from "framer-motion";
import './course.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Course = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOption, setSortOption] = useState("");
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [courseAnalytics, setCourseAnalytics] = useState({});

    const instituteName = sessionStorage.getItem("instituteName");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate('/UserLogin');
        }
    }, [token, navigate]);

    // Fetch course analytics for each course
    // Add this before the Course function (around line 10)
    const RatingComponent = ({ courseId, currentRating, onRatingUpdate }) => {
        const [rating, setRating] = useState(0);
        const [review, setReview] = useState('');
        const [isSubmitting, setIsSubmitting] = useState(false);

        const handleSubmit = async (e) => {
            e.preventDefault();
            if (rating === 0) return;

            setIsSubmitting(true);
            const result = await addRating(courseId, rating, review);
            if (result) {
                onRatingUpdate(result);
                setRating(0);
                setReview('');
            }
            setIsSubmitting(false);
        };

        return (
            <form onSubmit={handleSubmit} className="rating-form">
                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`star ${star <= rating ? 'filled' : ''}`}
                            onClick={() => setRating(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write a review (optional)"
                    rows="3"
                />
                <button
                    type="submit"
                    disabled={rating === 0 || isSubmitting}
                    className="submit-rating-btn"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                </button>
            </form>
        );
    };
    // Replace existing fetchCourseAnalytics function
    const fetchCourseAnalytics = async (courseId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/course/${courseId}/analytics`);
            const data = await response.json();
            if (data.success) {
                return {
                    enrolledStudents: data.data.enrolledStudents,
                    rating: data.data.rating,
                    totalRatings: data.data.totalRatings,
                    daysLeft: data.data.daysLeft,
                    status: data.data.status,
                    totalEarnings: data.data.totalEarnings
                };
            }
            return null;
        } catch (error) {
            console.error(`Error fetching analytics for course ${courseId}:`, error);
            return null;
        }
    };

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user) return;
                const res = await fetch(`http://localhost:3000/api/user/${user._id}/courses`);
                const data = await res.json();
                setEnrolledCourses(data.courses.map(course => course._id));
            } catch (error) {
                console.error("Failed to fetch enrolled courses:", error);
            }
        };

        fetchEnrolledCourses();
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                let data = "";
                if (instituteName && instituteName.length !== 0) {
                    const response = await fetch(`http://localhost:3000/api/course/${encodeURIComponent(instituteName)}`);
                    data = await response.json();
                } else {
                    const response = await fetch('http://localhost:3000/api/course');
                    data = await response.json();
                }

                if (Array.isArray(data)) {
                    setCourses(data);

                    // Fetch analytics for each course
                    const analyticsPromises = data.map(course => fetchCourseAnalytics(course._id));
                    const analyticsResults = await Promise.all(analyticsPromises);

                    const analyticsMap = {};
                    analyticsResults.forEach((analytics, index) => {
                        if (analytics) {
                            analyticsMap[data[index]._id] = analytics;
                        }
                    });

                    setCourseAnalytics(analyticsMap);
                } else {
                    console.error("API did not return an array:", data);
                    setCourses([]);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
                setCourses([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, [instituteName]);

    // Calculate days left for a course
    const getDaysLeft = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (now < start) {
            return Math.ceil((start - now) / (1000 * 60 * 60 * 24));
        } else if (now <= end) {
            return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
        }
        return 0;
    };

    // Get course status
    const getCourseStatus = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (now < start) return 'upcoming';
        if (now > end) return 'completed';
        return 'ongoing';
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'upcoming': return '#f39c12';
            case 'ongoing': return '#27ae60';
            case 'completed': return '#7f8c8d';
            default: return '#3498db';
        }
    };

    const handlePayment = async (amount, courseId) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return navigate('/UserLogin');

        const res = await fetch('http://localhost:3000/api/create-order', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount }),
        });

        const orderData = await res.json();
        const response = await fetch("http://localhost:3000/api/getKey");
        const data = await response.json();

        var options = {
            key: data.key,
            amount: amount * 100,
            currency: "INR",
            name: "TUTONE",
            description: "Course Enrollment",
            order_id: orderData.id,
            handler: async function (response) {
                const verifyRes = await fetch("http://localhost:3000/api/verify-payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        userId: user._id,
                        courseId
                    }),
                });

                if (verifyRes.ok) {
                    setEnrolledCourses(prev => [...prev, courseId]);
                    // Update enrolled students count
                    setCourses(prev => prev.map(course =>
                        course._id === courseId
                            ? { ...course, enrolledStudents: (course.enrolledStudents || 0) + 1 }
                            : course
                    ));
                } else {
                    alert("Payment succeeded but enrollment failed.");
                }
            },
            prefill: {
                name: user.name,
                email: user.email,
                contact: user.phone || "8247757158"
            },
            theme: { color: "#3399cc" }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };
    // Add this after handlePayment function (around line 120)
    const addRating = async (courseId, rating, review) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const response = await fetch(`http://localhost:3000/api/course/${courseId}/rating`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    studentId: user._id,
                    studentName: user.name,
                    rating,
                    review
                })
            });

            const data = await response.json();
            if (data.success) {
                console.log('Rating added successfully');
                return data.data;
            }
        } catch (error) {
            console.error('Error adding rating:', error);
        }
    };

    const handleDelete = async (courseId) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                const response = await fetch(`http://localhost:3000/api/course/${courseId}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    setCourses(prev => prev.filter(course => course._id !== courseId));
                }
            } catch (error) {
                console.error("Error deleting course:", error);
            }
        }
    };

    const handleSortOption = (option) => {
        setSortOption(option);
        let sortedCourses = [...courses];

        switch (option) {
            case "price":
                sortedCourses.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case "rating":
                sortedCourses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case "az":
                sortedCourses.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "duration":
                sortedCourses.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
                break;
            case "startDate":
                sortedCourses.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                break;
            case "enrolled":
                sortedCourses.sort((a, b) => (b.enrolledStudents || 0) - (a.enrolledStudents || 0));
                break;
            default:
                break;
        }

        setCourses(sortedCourses);
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.institute.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (course.professor && course.professor.name.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = filterCategory === "all" || course.category === filterCategory;

        return matchesSearch && matchesCategory;
    });

    const formatDate = (dateString) => {
        if (!dateString) return "TBD";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating || 0);
        const hasHalfStar = (rating || 0) % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={i} className="star filled">★</span>);
        }
        if (hasHalfStar) {
            stars.push(<span key="half" className="star half">☆</span>);
        }
        for (let i = stars.length; i < 5; i++) {
            stars.push(<span key={i} className="star empty">☆</span>);
        }
        return stars;
    };

    return (
        <div className="course-page">
            <nav className="course-nav">
                <div className="nav-logo">
                    <h1>TUTONE</h1>
                </div>
                <div className="search-container">
                    <input
                        type="search"
                        placeholder="Search courses, institutes, professors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="nav-actions">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Categories</option>
                        <option value="programming">Programming</option>
                        <option value="design">Design</option>
                        <option value="business">Business</option>
                        <option value="marketing">Marketing</option>
                        <option value="data-science">Data Science</option>
                    </select>

                    <select onChange={(e) => handleSortOption(e.target.value)} className="sort-select">
                        <option value="">Sort By</option>
                        <option value="price">Price</option>
                        <option value="rating">Rating</option>
                        <option value="enrolled">Most Enrolled</option>
                        <option value="az">Name (A-Z)</option>
                        <option value="duration">Duration</option>
                        <option value="startDate">Start Date</option>
                    </select>

                    {instituteName && (
                        <button onClick={() => navigate('/AddCourse')} className="add-course-btn">
                            Add Course
                        </button>
                    )}

                    {!instituteName && (
                        <button onClick={() => navigate('/MyCourses')} className="my-courses-btn">
                            My Courses
                        </button>
                    )}
                </div>
            </nav>

            <main className="course-content">
                <div className="content-header">
                    <h2 className="section-title">
                        {instituteName ? `${instituteName} Courses` : "Available Courses"}
                    </h2>
                    <p className="section-subtitle">
                        {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
                    </p>
                </div>

                {isLoading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading courses...</p>
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="no-courses">
                        <h3>No courses found</h3>
                        <p>Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="course-grid">
                        {filteredCourses.map((course, index) => {
                            const analytics = courseAnalytics[course._id];
                            const daysLeft = getDaysLeft(course.startDate, course.endDate);
                            const status = getCourseStatus(course.startDate, course.endDate);
                            const enrolledCount = analytics?.enrolledStudents || course.enrolledStudents || 0;
                            const rating = analytics?.rating || course.rating || 0;

                            return (
                                <motion.div
                                    className="course-card enhanced-card"
                                    key={course._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => navigate(`/course/${course._id}`)}
                                >
                                    <div className="course-header">
                                        {course.imageUrl && (
                                            <img src={course.imageUrl} alt={course.name} className="course-image" />
                                        )}
                                        <div className="course-badges">
                                            <div className="rating-badge">
                                                {renderStars(rating)}
                                                <span className="rating-text">({rating.toFixed(1)})</span>
                                            </div>
                                            {course.isLive && <span className="live-badge">LIVE</span>}
                                            <span
                                                className="status-badge"
                                                style={{ backgroundColor: getStatusColor(status) }}
                                            >
                                                {status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="course-details">
                                        <div className="course-title-row">
                                            <h4 className="course-title">{course.name}</h4>
                                            {instituteName && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(course._id);
                                                    }}
                                                    className="delete-btn"
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                        </div>

                                        <p className="course-institute">{course.institute}</p>

                                        {course.professor && (
                                            <div className="professor-info">
                                                <span className="professor-label">Instructor:</span>
                                                <span className="professor-name">{course.professor.name}</span>
                                                <span className="professor-title">{course.professor.title}</span>
                                            </div>
                                        )}

                                        <p className="course-description">{course.description}</p>

                                        {/* Enhanced Analytics Section */}
                                        <div className="course-analytics">
                                            <div className="analytics-row">
                                                <div className="analytics-item">
                                                    <span className="analytics-value">{daysLeft}</span>
                                                    <span className="analytics-label">
                                                        {status === 'upcoming' ? 'Days to Start' :
                                                            status === 'ongoing' ? 'Days Left' : 'Days Since End'}
                                                    </span>
                                                </div>
                                                <div className="analytics-item">
                                                    <span className="analytics-value">{enrolledCount}</span>
                                                    <span className="analytics-label">Students Enrolled</span>
                                                </div>
                                                {instituteName && (
                                                    <div className="analytics-item">
                                                        <span className="analytics-value">
                                                            ${(parseFloat(course.price) * enrolledCount).toLocaleString()}
                                                        </span>
                                                        <span className="analytics-label">Total Earnings</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="course-info-grid">
                                            <div className="info-item">
                                                <span className="info-label">Duration</span>
                                                <span className="info-value">{course.duration}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Location</span>
                                                <span className="info-value">{course.location}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Start Date</span>
                                                <span className="info-value">{formatDate(course.startDate)}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">End Date</span>
                                                <span className="info-value">{formatDate(course.endDate)}</span>
                                            </div>
                                            {course.schedule && (
                                                <div className="info-item">
                                                    <span className="info-label">Schedule</span>
                                                    <span className="info-value">{course.schedule}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="course-footer">
                                            <div className="price-section">
                                                <span className="course-price">${course.price}</span>
                                                {course.originalPrice && course.originalPrice !== course.price && (
                                                    <span className="original-price">${course.originalPrice}</span>
                                                )}
                                            </div>

                                            {instituteName ? (
                                                <div className="institute-actions">
                                                    <button
                                                        className="analytics-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/institute/course/${course._id}/analytics`);
                                                        }}
                                                    >
                                                        View Analytics
                                                    </button>
                                                </div>
                                            ) : enrolledCourses.includes(course._id) ? (
                                                <button className="enrolled-btn" disabled>
                                                    Enrolled
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePayment(parseFloat(course.price), course._id);
                                                    }}
                                                    className="enroll-btn"
                                                >
                                                    Enroll Now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Course;