import { motion } from "framer-motion";
import './course.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const RatingComponent = ({ courseId, currentUserRating, onRatingUpdate }) => {
    const [rating, setRating] = useState(currentUserRating?.rating || 0);
    const [review, setReview] = useState(currentUserRating?.review || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return;

        setIsSubmitting(true);
        const result = await onRatingUpdate(courseId, rating, review);
        setIsSubmitting(false);

        if (result) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
        }
    };

    return (
        <div className="rating-section">
            <h3>Rate This Course</h3>
            {showSuccess && (
                <div style={{
                    padding: '10px',
                    backgroundColor: '#d4edda',
                    color: '#155724',
                    borderRadius: '4px',
                    marginBottom: '10px'
                }}>
                    Rating submitted successfully!
                </div>
            )}
            <form onSubmit={handleSubmit} className="rating-form">
                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`star ${star <= rating ? 'filled' : ''}`}
                            onClick={() => setRating(star)}
                            style={{ cursor: 'pointer', fontSize: '24px', color: star <= rating ? '#ffd700' : '#ddd' }}
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
                    style={{ width: '100%', margin: '10px 0', padding: '8px' }}
                />
                <button
                    type="submit"
                    disabled={rating === 0 || isSubmitting}
                    className="submit-rating-btn"
                    style={{
                        padding: '8px 16px',
                        backgroundColor: rating === 0 ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: rating === 0 ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isSubmitting ? 'Submitting...' : (currentUserRating ? 'Update Rating' : 'Submit Rating')}
                </button>
            </form>
        </div>
    );
};
const MyCourses = () => {
    const [myCourses, setMyCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showCourseDetails, setShowCourseDetails] = useState(false);
    const [userRatings, setUserRatings] = useState({});

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate('/UserLogin');
        }
    }, [token, navigate]);

    useEffect(() => {
        const fetchMyCourses = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user._id) {
                console.error("User not found in localStorage");
                setMyCourses([]);
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/user/${user._id}/courses`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                setMyCourses(data.courses || []);
            } catch (error) {
                console.error("Error fetching enrolled courses:", error);
                setMyCourses([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyCourses();
    }, [token]);

    const getCourseStatus = (course) => {
        const now = new Date();
        const startDate = new Date(course.startDate);
        const endDate = new Date(course.endDate);

        if (now < startDate) return 'upcoming';
        if (now > endDate) return 'completed';
        return 'ongoing';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'upcoming': return '#f39c12';
            case 'ongoing': return '#27ae60';
            case 'completed': return '#7f8c8d';
            default: return '#3498db';
        }
    };

    const filteredCourses = myCourses.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.institute.toLowerCase().includes(searchTerm.toLowerCase());

        const status = getCourseStatus(course);
        const matchesFilter = filterStatus === "all" || status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const formatDate = (dateString) => {
        if (!dateString) return "TBD";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const calculateProgress = (course) => {
        const now = new Date();
        const startDate = new Date(course.startDate);
        const endDate = new Date(course.endDate);

        if (now < startDate) return 0;
        if (now > endDate) return 100;

        const totalDuration = endDate - startDate;
        const elapsed = now - startDate;
        return Math.round((elapsed / totalDuration) * 100);
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

    const openCourseDetails = (course) => {
        setSelectedCourse(course);
        setShowCourseDetails(true);
    };

    const closeCourseDetails = () => {
        setSelectedCourse(null);
        setShowCourseDetails(false);
    };
    const addRating = async (courseId, rating, review) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const response = await fetch(`http://localhost:3000/api/course/${courseId}/rating`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
                setUserRatings(prev => ({ ...prev, [courseId]: { rating, review } }));
                return data.data;
            }
        } catch (error) {
            console.error('Error adding rating:', error);
        }
    };


    const CourseDetailsModal = ({ course, onClose }) => {
        if (!course) return null;

        const status = getCourseStatus(course);
        const progress = calculateProgress(course);

        return (
            <div className="modal-overlay" onClick={onClose}>
                <motion.div
                    className="course-details-modal"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                >
                    <div className="modal-header">
                        <h2>{course.name}</h2>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>

                    <div className="modal-content">
                        <div className="course-overview">
                            {course.imageUrl && (
                                <img src={course.imageUrl} alt={course.name} className="course-detail-image" />
                            )}

                            <div className="course-meta">
                                <div className="status-progress">
                                    <div className="status-badge" style={{ backgroundColor: getStatusColor(status) }}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </div>
                                    <div className="progress-container">
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                        <span className="progress-text">{progress}% Complete</span>
                                    </div>
                                </div>

                                <div className="rating-section">
                                    {renderStars(course.rating)}
                                    <span className="rating-text">({course.rating || 0})</span>
                                </div>
                            </div>
                        </div>

                        <div className="course-info-detailed">
                            <div className="info-section">
                                <h3>Course Information</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="label">Institute:</span>
                                        <span className="value">{course.institute}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Duration:</span>
                                        <span className="value">{course.duration}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Location:</span>
                                        <span className="value">{course.location}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Schedule:</span>
                                        <span className="value">{course.schedule || 'Flexible'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Start Date:</span>
                                        <span className="value">{formatDate(course.startDate)}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">End Date:</span>
                                        <span className="value">{formatDate(course.endDate)}</span>
                                    </div>
                                </div>
                            </div>

                            {course.professor && (
                                <div className="info-section">
                                    <h3>Instructor</h3>
                                    <div className="professor-details">
                                        <h4>{course.professor.name}</h4>
                                        {course.professor.title && <p className="professor-title">{course.professor.title}</p>}
                                        {course.professor.bio && <p className="professor-bio">{course.professor.bio}</p>}
                                        {course.professor.experience && (
                                            <p className="professor-experience">
                                                {course.professor.experience} years of experience
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {course.description && (
                                <div className="info-section">
                                    <h3>Description</h3>
                                    <p>{course.description}</p>
                                </div>
                            )}

                            {course.learningOutcomes && course.learningOutcomes.length > 0 && (
                                <div className="info-section">
                                    <h3>Learning Outcomes</h3>
                                    <ul className="learning-outcomes">
                                        {course.learningOutcomes.filter(outcome => outcome).map((outcome, index) => (
                                            <li key={index}>{outcome}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {course.syllabus && course.syllabus.length > 0 && (
                                <div className="info-section">
                                    <h3>Course Syllabus</h3>
                                    <div className="syllabus">
                                        {course.syllabus.filter(item => item.topic).map((item, index) => (
                                            <div key={index} className="syllabus-item">
                                                <h5>Week {item.week}: {item.topic}</h5>
                                                {item.description && <p>{item.description}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {course.meetingLinks && course.meetingLinks.length > 0 && (
                                <div className="info-section">
                                    <h3>Meeting Links</h3>
                                    <div className="meeting-links">
                                        {course.meetingLinks.filter(link => link.url).map((link, index) => (
                                            <div key={index} className="meeting-link-item">
                                                <a href={link.url} target="_blank" rel="noopener noreferrer">
                                                    {link.title || `Meeting ${index + 1}`}
                                                </a>
                                                {link.day && link.time && (
                                                    <span className="meeting-schedule">
                                                        {link.day} at {link.time}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {course.features && course.features.length > 0 && (
                                <div className="info-section">
                                    <h3>Course Features</h3>
                                    <ul className="course-features">
                                        {course.features.filter(feature => feature).map((feature, index) => (
                                            <li key={index}>{feature}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <RatingComponent
                                courseId={course._id}
                                currentUserRating={userRatings[course._id]}
                                onRatingUpdate={addRating}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    };

    return (
        <div className="course-page">
            <nav className="course-nav">
                <div className="nav-logo">
                    <button className="browse-courses-btn" onClick={() => navigate(-1)}  >Back</button>
                    <h1>TUTONE</h1>
                </div>
                <div className="search-container">
                    <input
                        type="search"
                        placeholder="Search your courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="nav-actions">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Courses</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button onClick={() => navigate('/Course')} className="browse-courses-btn">
                        Browse Courses
                    </button>
                </div>
            </nav>

            <main className="course-content">
                <div className="content-header">
                    <h2 className="section-title">My Enrolled Courses</h2>
                    <p className="section-subtitle">
                        {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
                    </p>
                </div>

                {isLoading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading enrolled courses...</p>
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="no-courses">
                        <h3>No enrolled courses found</h3>
                        <p>
                            {myCourses.length === 0
                                ? "You haven't enrolled in any courses yet."
                                : "No courses match your current filters."}
                        </p>
                        <button
                            onClick={() => navigate('/Course')}
                            className="browse-btn"
                        >
                            Browse Available Courses
                        </button>
                    </div>
                ) : (
                    <div className="course-grid">
                        {filteredCourses.map((course, index) => {
                            const status = getCourseStatus(course);
                            const progress = calculateProgress(course);

                            return (
                                <motion.div
                                    className="course-card my-course-card"
                                    key={course._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => openCourseDetails(course)}
                                >
                                    <div className="course-header">
                                        {course.imageUrl && (
                                            <img src={course.imageUrl} alt={course.name} className="course-image" />
                                        )}
                                        <div className="course-badges">
                                            <span
                                                className="status-badge"
                                                style={{ backgroundColor: getStatusColor(status) }}
                                            >
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </span>
                                            {course.isLive && <span className="live-badge">LIVE</span>}
                                        </div>
                                    </div>

                                    <div className="course-details">
                                        <h4 className="course-title">{course.name}</h4>
                                        <p className="course-institute">{course.institute}</p>

                                        {course.professor && (
                                            <div className="professor-info">
                                                <span className="professor-label">Instructor:</span>
                                                <span className="professor-name">{course.professor.name}</span>
                                            </div>
                                        )}

                                        <div className="progress-section">
                                            <div className="progress-header">
                                                <span>Progress</span>
                                                <span>{progress}%</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="course-info-grid">
                                            <div className="info-item">
                                                <span className="info-label">Duration</span>
                                                <span className="info-value">{course.duration}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Start Date</span>
                                                <span className="info-value">{formatDate(course.startDate)}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">End Date</span>
                                                <span className="info-value">{formatDate(course.endDate)}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Rating</span>
                                                <div className="rating-display">
                                                    {renderStars(course.rating)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="course-footer">
                                            <div className="course-price">Enrolled - {course.price}</div>
                                            <button
                                                className="view-details-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openCourseDetails(course);
                                                }}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {showCourseDetails && (
                    <CourseDetailsModal
                        course={selectedCourse}
                        onClose={closeCourseDetails}
                    />
                )}
            </main>
        </div>
    );
};

export default MyCourses;