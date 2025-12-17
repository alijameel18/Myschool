import React, { useState, useEffect } from 'react';
import UserService from './UserService';
import './App.css';

function App() {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState({ id: null, firstName: '', lastName: '', email: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        setLoading(true);
        UserService.getUsers()
            .then(response => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch(() => {
                showNotification('Error loading users', 'error');
                setLoading(false);
            });
    };

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCurrentUser({ ...currentUser, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            if (isEditing) {
                await UserService.updateUser(currentUser, currentUser.id);
                showNotification('User updated successfully!', 'success');
            } else {
                await UserService.createUser(currentUser);
                showNotification('User created successfully!', 'success');
            }
            loadUsers();
            resetForm();
        } catch (error) {
            showNotification('Operation failed. Please try again.', 'error');
        }
    };

    const handleEdit = (user) => {
        setIsEditing(true);
        setCurrentUser({ ...user });
        scrollToForm();
    };

    const handleDelete = async (id, userName) => {
        if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
            try {
                await UserService.deleteUser(id);
                showNotification('User deleted successfully!', 'success');
                loadUsers();
            } catch (error) {
                showNotification('Delete failed. Please try again.', 'error');
            }
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentUser({ id: null, firstName: '', lastName: '', email: '' });
    };

    const scrollToForm = () => {
        document.getElementById('user-form').scrollIntoView({ behavior: 'smooth' });
    };

    const filteredUsers = users.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container-fluid p-0">
            {/* Notification Toast */}
            {notification.show && (
                <div className={`notification-toast ${notification.type}`}>
                    {notification.message}
                </div>
            )}

            {/* Header */}
            <nav className="navbar navbar-dark bg-primary mb-4">
                <div className="container">
                    <span className="navbar-brand mb-0 h1">
                        <i className="fas fa-users me-2"></i>
                        User Management System
                    </span>
                    <button 
                        className="btn btn-light" 
                        onClick={scrollToForm}
                        title="Add new user"
                    >
                        <i className="fas fa-user-plus me-2"></i>
                        Add User
                    </button>
                </div>
            </nav>

            <div className="container">
                <div className="row">
                    {/* Main Content - User List */}
                    <div className="col-lg-8">
                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                <h3 className="mb-0">
                                    <i className="fas fa-list me-2 text-primary"></i>
                                    User List
                                </h3>
                                <div className="search-box">
                                    <i className="fas fa-search"></i>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Search users..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="card-body">
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-3 text-muted">Loading users...</p>
                                    </div>
                                ) : filteredUsers.length === 0 ? (
                                    <div className="text-center py-5">
                                        <i className="fas fa-user-slash fa-3x text-muted mb-3"></i>
                                        <h5 className="text-muted">No users found</h5>
                                        <p className="text-muted">
                                            {searchTerm ? 'Try a different search' : 'Add your first user to get started'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Status</th>
                                                    <th className="text-end">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredUsers.map(user => (
                                                    <tr key={user.id} className="user-row">
                                                        <td>
                                                            <div className="user-avatar">
                                                                <div className="avatar-circle bg-primary text-white">
                                                                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                                </div>
                                                                <div className="user-info">
                                                                    <strong>{user.firstName} {user.lastName}</strong>
                                                                    <small className="text-muted d-block">ID: {user.id}</small>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <a href={`mailto:${user.email}`} className="text-decoration-none">
                                                                <i className="fas fa-envelope me-2 text-primary"></i>
                                                                {user.email}
                                                            </a>
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-success">
                                                                <i className="fas fa-circle me-1"></i>
                                                                Active
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex justify-content-end gap-2">
                                                                <button 
                                                                    className="btn btn-outline-primary btn-sm"
                                                                    onClick={() => handleEdit(user)}
                                                                    title="Edit user"
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </button>
                                                                <button 
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    onClick={() => handleDelete(user.id, `${user.firstName} ${user.lastName}`)}
                                                                    title="Delete user"
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {filteredUsers.length > 0 && (
                                    <div className="mt-3 text-muted">
                                        <small>
                                            <i className="fas fa-info-circle me-1"></i>
                                            Showing {filteredUsers.length} of {users.length} users
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - User Form */}
                    <div className="col-lg-4" id="user-form">
                        <div className="card shadow-sm sticky-sidebar">
                            <div className="card-header bg-white">
                                <h3 className="mb-0">
                                    {isEditing ? (
                                        <>
                                            <i className="fas fa-user-edit me-2 text-warning"></i>
                                            Edit User
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-user-plus me-2 text-success"></i>
                                            Add New User
                                        </>
                                    )}
                                </h3>
                                {isEditing && (
                                    <small className="text-muted">Editing: {currentUser.firstName} {currentUser.lastName}</small>
                                )}
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            <i className="fas fa-user me-2 text-primary"></i>
                                            First Name
                                        </label>
                                        <input 
                                            type="text" 
                                            name="firstName" 
                                            className="form-control form-control-lg"
                                            placeholder="Enter first name"
                                            value={currentUser.firstName}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            <i className="fas fa-user me-2 text-primary"></i>
                                            Last Name
                                        </label>
                                        <input 
                                            type="text" 
                                            name="lastName" 
                                            className="form-control form-control-lg"
                                            placeholder="Enter last name"
                                            value={currentUser.lastName}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            <i className="fas fa-envelope me-2 text-primary"></i>
                                            Email Address
                                        </label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            className="form-control form-control-lg"
                                            placeholder="Enter email address"
                                            value={currentUser.email}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>
                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-primary btn-lg">
                                            {isEditing ? (
                                                <>
                                                    <i className="fas fa-save me-2"></i>
                                                    Update User
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-plus-circle me-2"></i>
                                                    Create User
                                                </>
                                            )}
                                        </button>
                                        {isEditing && (
                                            <button 
                                                type="button" 
                                                className="btn btn-outline-secondary"
                                                onClick={resetForm}
                                            >
                                                <i className="fas fa-times me-2"></i>
                                                Cancel Edit
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                            <div className="card-footer bg-light">
                                <small className="text-muted">
                                    <i className="fas fa-lightbulb me-1"></i>
                                    {isEditing 
                                        ? 'Update user information and save changes' 
                                        : 'Fill in the form to add a new user to the system'
                                    }
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-5 py-3 bg-light text-center">
                <div className="container">
                    <p className="mb-0 text-muted">
                        <i className="fas fa-code me-1"></i>
                        User Management System v1.0 • {users.length} users registered
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;