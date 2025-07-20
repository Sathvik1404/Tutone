import React, { useState } from 'react';
import './UserProfile.css'; // You'll need to convert the CSS to a separate file

const UserProfile = ({ userData }) => {
    // Default user data if none is provided
    const defaultUser = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        studentId: 'ST12345',
        profileImage: 'https://via.placeholder.com/150',
        ongoingCourses: [
            {
                id: 1,
                name: 'Web Development Masterclass',
                thumbnail: 'https://via.placeholder.com/60',
                progress: 65,
                hoursRemaining: 12
            },
            {
                id: 2,
                name: 'Python for Data Science',
                thumbnail: 'https://via.placeholder.com/60',
                progress: 30,
                hoursRemaining: 20
            },
            {
                id: 3,
                name: 'UI/UX Design Fundamentals',
                thumbnail: 'https://via.placeholder.com/60',
                progress: 80,
                hoursRemaining: 5
            }
        ],
        skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Python', 'Data Analysis', 'UI Design', 'Figma', 'Responsive Design'],
        stats: {
            coursesCompleted: 7,
            coursesInProgress: 3,
            hoursLearned: 152,
            certificates: 12
        }
    };

    // Use provided user data or default to sample data
    const user = userData || defaultUser;

    // State for handling profile edit functionality
    const [isEditing, setIsEditing] = useState(false);

    const handleEditProfile = () => {
        setIsEditing(!isEditing);
        // Additional edit functionality would go here
    };

    return (
        <div className="course-page">
            {/* Navigation Bar */}
            <nav className="course-nav">
                <div className="nav-logo">
                    <h1>EduLearn</h1>
                </div>
                <div className="search-container">
                    <input type="text" placeholder="Search for courses..." />
                </div>
                <button className="add-course-button">
                    <i className="fas fa-plus"></i> Add Course
                </button>
            </nav>

            {/* Main Content */}
            <div className="course-content">
                {/* User Profile Container */}
                <div className="profile-container">
                    {/* Profile Header */}
                    <div className="profile-header">
                        <div className="profile-image">
                            <img src={user.profileImage} alt="User Profile" />
                        </div>
                        <div className="profile-info">
                            <h1 className="profile-name">{user.name}</h1>
                            <div className="profile-email">
                                <i className="fas fa-envelope"></i> {user.email}
                            </div>
                            <div className="profile-email">
                                <i className="fas fa-user-graduate"></i> Student ID: {user.studentId}
                            </div>
                        </div>
                        <button className="edit-profile-button" onClick={handleEditProfile}>
                            <i className="fas fa-edit"></i> {isEditing ? 'Save Profile' : 'Edit Profile'}
                        </button>
                    </div>

                    {/* Profile Body */}
                    <div className="profile-body">
                        {/* Ongoing Courses Section */}
                        <div className="profile-section">
                            <h2 className="section-title">
                                <i className="fas fa-book-open"></i> Ongoing Courses
                            </h2>
                            <div className="ongoing-courses">
                                {user.ongoingCourses.map(course => (
                                    <div className="course-item" key={course.id}>
                                        <div className="course-thumbnail">
                                            <img src={course.thumbnail} alt="Course Thumbnail" />
                                        </div>
                                        <div className="course-info">
                                            <h3 className="course-name">{course.name}</h3>
                                            <div className="course-progress">
                                                <div
                                                    className="progress-bar"
                                                    style={{ width: `${course.progress}%` }}
                                                ></div>
                                            </div>
                                            <div className="course-details">
                                                <span>{course.progress}% Completed</span>
                                                <span>{course.hoursRemaining} hours remaining</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Skills Section */}
                        <div className="profile-section">
                            <h2 className="section-title">
                                <i className="fas fa-code"></i> Skills
                            </h2>
                            <div className="skills-container">
                                {user.skills.map((skill, index) => (
                                    <div className="skill-tag" key={index}>{skill}</div>
                                ))}
                            </div>

                            <h2 className="section-title" style={{ marginTop: '2rem' }}>
                                <i className="fas fa-chart-line"></i> Stats
                            </h2>
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <div className="stat-value">{user.stats.coursesCompleted}</div>
                                    <div className="stat-label">Courses Completed</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">{user.stats.coursesInProgress}</div>
                                    <div className="stat-label">In Progress</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">{user.stats.hoursLearned}</div>
                                    <div className="stat-label">Hours Learned</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">{user.stats.certificates}</div>
                                    <div className="stat-label">Certificates</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;