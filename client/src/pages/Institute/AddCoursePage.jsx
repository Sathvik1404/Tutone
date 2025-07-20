import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './AddCoursePage.css';
import { toast, ToastContainer } from 'react-toastify';

const AddCoursePage = () => {
    const navigate = useNavigate();
    const instituteName = sessionStorage.getItem('instituteName');

    const [formData, setFormData] = useState({
        name: '',
        institute: instituteName || '',
        duration: '',
        location: '',
        startDate: '',
        endDate: '',
        price: '',
        originalPrice: '',
        description: '',
        category: 'programming',
        schedule: '',
        maxStudents: '',
        prerequisites: '',
        courseLevel: 'beginner',
        courseType: 'online',
        professor: {
            name: '',
            title: '',
            email: '',
            bio: '',
            experience: ''
        },
        meetingLinks: [{ title: '', url: '', day: '', time: '' }],
        syllabus: [{ week: 1, topic: '', description: '' }],
        imageUrl: '',
        features: [''],
        learningOutcomes: ['']
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState('basic');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('professor.')) {
            const professorField = name.split('.')[1];
            setFormData({
                ...formData,
                professor: {
                    ...formData.professor,
                    [professorField]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleArrayChange = (arrayName, index, value) => {
        const updatedArray = [...formData[arrayName]];
        updatedArray[index] = value;
        setFormData({
            ...formData,
            [arrayName]: updatedArray
        });
    };

    const addArrayItem = (arrayName, defaultItem = '') => {
        setFormData({
            ...formData,
            [arrayName]: [...formData[arrayName], defaultItem]
        });
    };

    const removeArrayItem = (arrayName, index) => {
        const updatedArray = formData[arrayName].filter((_, i) => i !== index);
        setFormData({
            ...formData,
            [arrayName]: updatedArray
        });
    };

    const handleMeetingLinkChange = (index, field, value) => {
        const updatedLinks = [...formData.meetingLinks];
        updatedLinks[index] = { ...updatedLinks[index], [field]: value };
        setFormData({
            ...formData,
            meetingLinks: updatedLinks
        });
    };

    const handleSyllabusChange = (index, field, value) => {
        const updatedSyllabus = [...formData.syllabus];
        updatedSyllabus[index] = { ...updatedSyllabus[index], [field]: value };
        setFormData({
            ...formData,
            syllabus: updatedSyllabus
        });
    };

    const validate = () => {
        const newErrors = {};

        // Basic validation
        if (!formData.name) newErrors.name = 'Course name is required';
        if (!formData.duration) newErrors.duration = 'Duration is required';
        if (!formData.location) newErrors.location = 'Location is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (!formData.price) newErrors.price = 'Price is required';
        if (!formData.description) newErrors.description = 'Description is required';
        if (!formData.professor.name) newErrors.professorName = 'Professor name is required';
        if (!formData.professor.email) newErrors.professorEmail = 'Professor email is required';

        // Date validation
        if (formData.startDate && formData.endDate) {
            if (new Date(formData.startDate) >= new Date(formData.endDate)) {
                newErrors.endDate = 'End date must be after start date';
            }
        }

        // Price validation
        if (formData.originalPrice && formData.price) {
            if (parseFloat(formData.originalPrice) <= parseFloat(formData.price)) {
                newErrors.originalPrice = 'Original price must be higher than current price';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        setIsSubmitting(true);

        try {
            // Clean up empty arrays and objects
            const cleanedData = {
                ...formData,
                meetingLinks: formData.meetingLinks.filter(link => link.url),
                syllabus: formData.syllabus.filter(item => item.topic),
                features: formData.features.filter(feature => feature.trim()),
                learningOutcomes: formData.learningOutcomes.filter(outcome => outcome.trim()),
                maxStudents: parseInt(formData.maxStudents) || null,
                enrolledStudents: 0,
                rating: 0,
                isLive: formData.courseType === 'live'
            };

            const response = await fetch('http://localhost:3000/api/course/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(cleanedData)
            });

            if (response.ok) {
                toast.success("Course Added Successfully!");
                setTimeout(() => {
                    navigate('/Course');
                }, 2000);
            } else {
                const data = await response.json();
                toast.error(`Failed to add course: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error adding course:', error);
            toast.error('Failed to add course. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderBasicInfo = () => (
        <div className="tab-content">
            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="name">Course Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? 'error' : ''}
                        placeholder="Enter course name"
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="programming">Programming</option>
                        <option value="design">Design</option>
                        <option value="business">Business</option>
                        <option value="marketing">Marketing</option>
                        <option value="data-science">Data Science</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="duration">Duration *</label>
                    <input
                        type="text"
                        id="duration"
                        name="duration"
                        placeholder="e.g., 12 weeks, 3 months"
                        value={formData.duration}
                        onChange={handleChange}
                        className={errors.duration ? 'error' : ''}
                    />
                    {errors.duration && <span className="error-text">{errors.duration}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="courseLevel">Course Level</label>
                    <select
                        id="courseLevel"
                        name="courseLevel"
                        value={formData.courseLevel}
                        onChange={handleChange}
                    >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="location">Location *</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        placeholder="e.g., Online, Campus, Hybrid"
                        value={formData.location}
                        onChange={handleChange}
                        className={errors.location ? 'error' : ''}
                    />
                    {errors.location && <span className="error-text">{errors.location}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="courseType">Course Type</label>
                    <select
                        id="courseType"
                        name="courseType"
                        value={formData.courseType}
                        onChange={handleChange}
                    >
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="live">Live Sessions</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="startDate">Start Date *</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className={errors.startDate ? 'error' : ''}
                    />
                    {errors.startDate && <span className="error-text">{errors.startDate}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="endDate">End Date *</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className={errors.endDate ? 'error' : ''}
                    />
                    {errors.endDate && <span className="error-text">{errors.endDate}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="schedule">Schedule</label>
                    <input
                        type="text"
                        id="schedule"
                        name="schedule"
                        placeholder="e.g., Mon-Wed-Fri 6:00 PM - 8:00 PM"
                        value={formData.schedule}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="maxStudents">Max Students</label>
                    <input
                        type="number"
                        id="maxStudents"
                        name="maxStudents"
                        placeholder="Maximum number of students"
                        value={formData.maxStudents}
                        onChange={handleChange}
                        min="1"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="price">Price *</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Course price"
                        value={formData.price}
                        onChange={handleChange}
                        className={errors.price ? 'error' : ''}
                        min="0"
                        step="0.01"
                    />
                    {errors.price && <span className="error-text">{errors.price}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="originalPrice">Original Price</label>
                    <input
                        type="number"
                        id="originalPrice"
                        name="originalPrice"
                        placeholder="Original price (for discounts)"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        className={errors.originalPrice ? 'error' : ''}
                        min="0"
                        step="0.01"
                    />
                    {errors.originalPrice && <span className="error-text">{errors.originalPrice}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="imageUrl">Course Image URL</label>
                    <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        placeholder="https://example.com/image.jpg"
                        value={formData.imageUrl}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group full-width">
                    <label htmlFor="description">Course Description *</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        className={errors.description ? 'error' : ''}
                        placeholder="Describe what students will learn in this course"
                    />
                    {errors.description && <span className="error-text">{errors.description}</span>}
                </div>

                <div className="form-group full-width">
                    <label htmlFor="prerequisites">Prerequisites</label>
                    <textarea
                        id="prerequisites"
                        name="prerequisites"
                        rows="3"
                        value={formData.prerequisites}
                        onChange={handleChange}
                        placeholder="What should students know before taking this course?"
                    />
                </div>
            </div>
        </div>
    );

    const renderProfessorInfo = () => (
        <div className="tab-content">
            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="professor.name">Professor Name *</label>
                    <input
                        type="text"
                        id="professor.name"
                        name="professor.name"
                        value={formData.professor.name}
                        onChange={handleChange}
                        className={errors.professorName ? 'error' : ''}
                        placeholder="Enter professor's full name"
                    />
                    {errors.professorName && <span className="error-text">{errors.professorName}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="professor.title">Professor Title</label>
                    <input
                        type="text"
                        id="professor.title"
                        name="professor.title"
                        value={formData.professor.title}
                        onChange={handleChange}
                        placeholder="e.g., PhD, Senior Developer, Lead Designer"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="professor.email">Professor Email *</label>
                    <input
                        type="email"
                        id="professor.email"
                        name="professor.email"
                        value={formData.professor.email}
                        onChange={handleChange}
                        className={errors.professorEmail ? 'error' : ''}
                        placeholder="professor@example.com"
                    />
                    {errors.professorEmail && <span className="error-text">{errors.professorEmail}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="professor.experience">Years of Experience</label>
                    <input
                        type="number"
                        id="professor.experience"
                        name="professor.experience"
                        value={formData.professor.experience}
                        onChange={handleChange}
                        min="0"
                        placeholder="Years of teaching/industry experience"
                    />
                </div>

                <div className="form-group full-width">
                    <label htmlFor="professor.bio">Professor Bio</label>
                    <textarea
                        id="professor.bio"
                        name="professor.bio"
                        rows="4"
                        value={formData.professor.bio}
                        onChange={handleChange}
                        placeholder="Brief bio about the professor's background and expertise"
                    />
                </div>
            </div>
        </div>
    );

    const renderMeetingLinks = () => (
        <div className="tab-content">
            <div className="section-header">
                <h3>Meeting Links & Schedule</h3>
                <button
                    type="button"
                    onClick={() => addArrayItem('meetingLinks', { title: '', url: '', day: '', time: '' })}
                    className="add-item-btn"
                >
                    Add Meeting Link
                </button>
            </div>

            {formData.meetingLinks.map((link, index) => (
                <div key={index} className="meeting-link-group">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Meeting Title</label>
                            <input
                                type="text"
                                value={link.title}
                                onChange={(e) => handleMeetingLinkChange(index, 'title', e.target.value)}
                                placeholder="e.g., Week 1 - Introduction"
                            />
                        </div>
                        <div className="form-group">
                            <label>Meeting URL</label>
                            <input
                                type="url"
                                value={link.url}
                                onChange={(e) => handleMeetingLinkChange(index, 'url', e.target.value)}
                                placeholder="https://zoom.us/j/..."
                            />
                        </div>
                        <div className="form-group">
                            <label>Day</label>
                            <select
                                value={link.day}
                                onChange={(e) => handleMeetingLinkChange(index, 'day', e.target.value)}
                            >
                                <option value="">Select Day</option>
                                <option value="monday">Monday</option>
                                <option value="tuesday">Tuesday</option>
                                <option value="wednesday">Wednesday</option>
                                <option value="thursday">Thursday</option>
                                <option value="friday">Friday</option>
                                <option value="saturday">Saturday</option>
                                <option value="sunday">Sunday</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Time</label>
                            <input
                                type="time"
                                value={link.time}
                                onChange={(e) => handleMeetingLinkChange(index, 'time', e.target.value)}
                            />
                        </div>
                    </div>
                    {formData.meetingLinks.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeArrayItem('meetingLinks', index)}
                            className="remove-item-btn"
                        >
                            Remove
                        </button>
                    )}
                </div>
            ))}
        </div>
    );

    const renderSyllabus = () => (
        <div className="tab-content">
            <div className="section-header">
                <h3>Course Syllabus</h3>
                <button
                    type="button"
                    onClick={() => addArrayItem('syllabus', { week: formData.syllabus.length + 1, topic: '', description: '' })}
                    className="add-item-btn"
                >
                    Add Week
                </button>
            </div>

            {formData.syllabus.map((item, index) => (
                <div key={index} className="syllabus-item">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Week</label>
                            <input
                                type="number"
                                value={item.week}
                                onChange={(e) => handleSyllabusChange(index, 'week', parseInt(e.target.value))}
                                min="1"
                            />
                        </div>
                        <div className="form-group">
                            <label>Topic</label>
                            <input
                                type="text"
                                value={item.topic}
                                onChange={(e) => handleSyllabusChange(index, 'topic', e.target.value)}
                                placeholder="Week topic/title"
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Description</label>
                            <textarea
                                value={item.description}
                                onChange={(e) => handleSyllabusChange(index, 'description', e.target.value)}
                                placeholder="What will be covered this week?"
                                rows="2"
                            />
                        </div>
                    </div>
                    {formData.syllabus.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeArrayItem('syllabus', index)}
                            className="remove-item-btn"
                        >
                            Remove Week
                        </button>
                    )}
                </div>
            ))}
        </div>
    );

    const renderAdditionalInfo = () => (
        <div className="tab-content">
            <div className="section-header">
                <h3>Course Features</h3>
                <button
                    type="button"
                    onClick={() => addArrayItem('features', '')}
                    className="add-item-btn"
                >
                    Add Feature
                </button>
            </div>

            {formData.features.map((feature, index) => (
                <div key={index} className="array-item">
                    <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleArrayChange('features', index, e.target.value)}
                        placeholder="e.g., Live Q&A sessions, Downloadable resources"
                    />
                    {formData.features.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeArrayItem('features', index)}
                            className="remove-item-btn-small"
                        >
                            ×
                        </button>
                    )}
                </div>
            ))}

            <div className="section-header">
                <h3>Learning Outcomes</h3>
                <button
                    type="button"
                    onClick={() => addArrayItem('learningOutcomes', '')}
                    className="add-item-btn"
                >
                    Add Learning Outcome
                </button>
            </div>

            {formData.learningOutcomes.map((outcome, index) => (
                <div key={index} className="array-item">
                    <input
                        type="text"
                        value={outcome}
                        onChange={(e) => handleArrayChange('learningOutcomes', index, e.target.value)}
                        placeholder="What will students be able to do after this course?"
                    />
                    {formData.learningOutcomes.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeArrayItem('learningOutcomes', index)}
                            className="remove-item-btn-small"
                        >
                            ×
                        </button>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="add-course-page">
            <nav className="course-nav">
                <div className="nav-logo">
                    <h1>TUTONE</h1>
                </div>
                <div className="nav-center">
                    <h2>Add New Course</h2>
                </div>
            </nav>

            <motion.div
                className="form-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="form-tabs">
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
                        onClick={() => setActiveTab('basic')}
                    >
                        Basic Info
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === 'professor' ? 'active' : ''}`}
                        onClick={() => setActiveTab('professor')}
                    >
                        Professor
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === 'meetings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('meetings')}
                    >
                        Meetings
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === 'syllabus' ? 'active' : ''}`}
                        onClick={() => setActiveTab('syllabus')}
                    >
                        Syllabus
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === 'additional' ? 'active' : ''}`}
                        onClick={() => setActiveTab('additional')}
                    >
                        Additional
                    </button>
                </div>

                <form className="course-form" onSubmit={handleSubmit}>
                    {activeTab === 'basic' && renderBasicInfo()}
                    {activeTab === 'professor' && renderProfessorInfo()}
                    {activeTab === 'meetings' && renderMeetingLinks()}
                    {activeTab === 'syllabus' && renderSyllabus()}
                    {activeTab === 'additional' && renderAdditionalInfo()}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => navigate('/Course')}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating Course...' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </motion.div>
            <ToastContainer position='top-right' />
        </div>
    );
};

export default AddCoursePage;