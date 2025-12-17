import React, { useState, useEffect } from "react";
import UserService from "./UserService";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    id: null,
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  /* ===========================
     LOAD USERS (FIXED)
     =========================== */
  useEffect(() => {
    const loadUsers = () => {
      setLoading(true);
      UserService.getUsers()
        .then((response) => {
          setUsers(response.data);
          setLoading(false);
        })
        .catch(() => {
          showNotification("Error loading users", "error");
          setLoading(false);
        });
    };

    loadUsers();
  }, []);

  /* ===========================
     NOTIFICATION
     =========================== */
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  /* ===========================
     FORM HANDLERS
     =========================== */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentUser({ id: null, firstName: "", lastName: "", email: "" });
  };

  const scrollToForm = () => {
    document
      .getElementById("user-form")
      .scrollIntoView({ behavior: "smooth" });
  };

  /* ===========================
     CREATE / UPDATE USER
     =========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await UserService.updateUser(currentUser, currentUser.id);
        showNotification("User updated successfully!", "success");
      } else {
        await UserService.createUser(currentUser);
        showNotification("User created successfully!", "success");
      }
      resetForm();
      window.location.reload(); // simple reload to refresh list
    } catch {
      showNotification("Operation failed. Please try again.", "error");
    }
  };

  /* ===========================
     EDIT / DELETE
     =========================== */
  const handleEdit = (user) => {
    setIsEditing(true);
    setCurrentUser(user);
    scrollToForm();
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      try {
        await UserService.deleteUser(id);
        showNotification("User deleted successfully!", "success");
        window.location.reload();
      } catch {
        showNotification("Delete failed", "error");
      }
    }
  };

  /* ===========================
     FILTER USERS
     =========================== */
  const filteredUsers = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid p-0">
      {/* Notification */}
      {notification.show && (
        <div className={`notification-toast ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <nav className="navbar navbar-dark bg-primary mb-4">
        <div className="container">
          <span className="navbar-brand h1">
            👥 User Management System
          </span>
          <button className="btn btn-light" onClick={scrollToForm}>
            ➕ Add User
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="row">
          {/* USER LIST */}
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between">
                <h4>User List</h4>
                <input
                  className="form-control w-50"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="card-body">
                {loading ? (
                  <p>Loading...</p>
                ) : filteredUsers.length === 0 ? (
                  <p className="text-muted text-center">
                    No users found
                  </p>
                ) : (
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id}>
                          <td>
                            {u.firstName} {u.lastName}
                          </td>
                          <td>{u.email}</td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => handleEdit(u)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                handleDelete(
                                  u.id,
                                  `${u.firstName} ${u.lastName}`
                                )
                              }
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="col-lg-4" id="user-form">
            <div className="card shadow-sm">
              <div className="card-header">
                <h4>{isEditing ? "Edit User" : "Add User"}</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <input
                    className="form-control mb-3"
                    name="firstName"
                    placeholder="First Name"
                    value={currentUser.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    className="form-control mb-3"
                    name="lastName"
                    placeholder="Last Name"
                    value={currentUser.lastName}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    className="form-control mb-3"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={currentUser.email}
                    onChange={handleInputChange}
                    required
                  />

                  <button className="btn btn-primary w-100">
                    {isEditing ? "Update User" : "Create User"}
                  </button>

                  {isEditing && (
                    <button
                      type="button"
                      className="btn btn-secondary w-100 mt-2"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center mt-4 text-muted">
        User Management System • {users.length} users
      </footer>
    </div>
  );
}

export default App;
