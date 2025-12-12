import React, { useState, useEffect } from 'react';
import UserService from './UserService';
import './App.css';

function App() {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState({ id: null, firstName: '', lastName: '', email: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        UserService.getUsers().then(response => {
            setUsers(response.data);
        });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCurrentUser({ ...currentUser, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isEditing) {
            UserService.updateUser(currentUser, currentUser.id).then(() => {
                loadUsers();
            });
        } else {
            UserService.createUser(currentUser).then(() => {
                loadUsers();
            });
        }
        resetForm();
    };

    const handleEdit = (user) => {
        setIsEditing(true);
        setCurrentUser(user);
    };

    const handleDelete = (id) => {
        UserService.deleteUser(id).then(() => {
            loadUsers();
        });
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentUser({ id: null, firstName: '', lastName: '', email: '' });
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center">User Management System</h1>
            
            <div className="row">
                <div className="col-md-8">
                    <h2>User List</h2>
                    <table className="table table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(user)}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="col-md-4">
                    <h2>{isEditing ? 'Edit User' : 'Add User'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" name="firstName" className="form-control" value={currentUser.firstName} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" name="lastName" className="form-control" value={currentUser.lastName} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" className="form-control" value={currentUser.email} onChange={handleInputChange} required />
                        </div>
                        <button type="submit" className="btn btn-primary mt-3">{isEditing ? 'Update' : 'Create'}</button>
                        {isEditing && <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={resetForm}>Cancel</button>}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;