import { useEffect, useState } from "react";

export default function UserList() {
    const [users, setUsers] = useState([]);

    // State for the Edit Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // State for Adding a New User (Backend requires username!)
    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
        firstname: "",
        lastname: ""
    });

    const API_URL = import.meta.env.VITE_API_URL;

    // --- 1. FETCH USERS ---
    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            const res = await fetch(`${API_URL}/api/user`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setUsers(data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    // --- 2. DELETE USER ---
    async function handleDelete(id) {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await fetch(`${API_URL}/api/user?id=${id}`, { method: "DELETE" });
            setUsers(users.filter(u => u._id !== id));
        } catch (error) {
            alert("Failed to delete user");
        }
    }

    // --- 3. EDIT MODAL FUNCTIONS ---
    function openEditModal(user) {
        setEditingUser(user);
        setIsModalOpen(true);
    }

    function handleEditInputChange(e) {
        const { name, value } = e.target;
        setEditingUser({ ...editingUser, [name]: value });
    }

    async function saveUser() {
        try {
            const res = await fetch(`${API_URL}/api/user`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    _id: editingUser._id,
                    firstname: editingUser.firstname,
                    lastname: editingUser.lastname,
                    email: editingUser.email
                }),
            });
            if (res.ok) {
                setUsers(users.map(u => (u._id === editingUser._id ? editingUser : u)));
                setIsModalOpen(false);
                alert("User updated successfully!");
            } else {
                alert("Failed to update.");
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    }

    // --- 4. ADD NEW USER FUNCTIONS (NEW) ---
    function handleNewUserChange(e) {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    }

    async function handleAddUser() {
        // Validation: Backend strictly requires username, email, and password
        if (!newUser.username || !newUser.email || !newUser.password) {
            alert("Please fill in all required fields (Username, Email, Password)");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            });

            if (res.ok) {
                alert("User added successfully!");
                // Clear the form
                setNewUser({ username: "", email: "", password: "", firstname: "", lastname: "" });
                // Refresh the list to show the new user
                fetchUsers();
            } else {
                const errorData = await res.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            alert("Failed to connect to server");
        }
    }

    // --- HTML DISPLAY ---
    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2>User Management</h2>

            {/* Existing Table */}
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <thead style={{ backgroundColor: "#f4f4f4" }}>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td style={{ fontSize: "0.9em", color: "#555" }}>{user._id}</td>
                            <td>{user.email}</td>
                            <td>{user.firstname}</td>
                            <td>{user.lastname}</td>
                            <td>
                                <button onClick={() => openEditModal(user)} style={{ marginRight: "5px" }}>Edit</button>
                                <button onClick={() => handleDelete(user._id)} style={{ color: 'white', backgroundColor: '#ff4d4d', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* --- NEW ADD USER FORM --- */}
            <div style={{ padding: "20px", backgroundColor: "#f9f9f9", border: "1px solid #ddd", borderRadius: "8px" }}>
                <h3>Add New User</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginBottom: "15px" }}>

                    {/* Username is REQUIRED by your backend logic */}
                    <input type="text" name="username" placeholder="Username *" value={newUser.username} onChange={handleNewUserChange} style={{ padding: "8px" }} />

                    <input type="email" name="email" placeholder="Email *" value={newUser.email} onChange={handleNewUserChange} style={{ padding: "8px" }} />

                    <input type="password" name="password" placeholder="Password *" value={newUser.password} onChange={handleNewUserChange} style={{ padding: "8px" }} />

                    <input type="text" name="firstname" placeholder="First Name" value={newUser.firstname} onChange={handleNewUserChange} style={{ padding: "8px" }} />

                    <input type="text" name="lastname" placeholder="Last Name" value={newUser.lastname} onChange={handleNewUserChange} style={{ padding: "8px" }} />
                </div>
                <button onClick={handleAddUser} style={{ backgroundColor: "#28a745", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}>
                    Add User
                </button>
            </div>

            {/* --- EDIT POPUP WINDOW (Unchanged) --- */}
            {isModalOpen && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
                }}>
                    <div style={{
                        backgroundColor: "white", padding: "20px", borderRadius: "8px", width: "300px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
                    }}>
                        <h3>Edit User</h3>
                        <label>First Name:</label><br />
                        <input type="text" name="firstname" value={editingUser.firstname || ""} onChange={handleEditInputChange} style={{ width: "100%", marginBottom: "10px" }} /><br />

                        <label>Last Name:</label><br />
                        <input type="text" name="lastname" value={editingUser.lastname || ""} onChange={handleEditInputChange} style={{ width: "100%", marginBottom: "10px" }} /><br />

                        <label>Email:</label><br />
                        <input type="email" name="email" value={editingUser.email || ""} onChange={handleEditInputChange} style={{ width: "100%", marginBottom: "20px" }} /><br />

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <button onClick={saveUser} style={{ backgroundColor: "green", color: "white", padding: "5px 10px", border: "none", cursor: "pointer" }}>Save</button>
                            <button onClick={() => setIsModalOpen(false)} style={{ backgroundColor: "gray", color: "white", padding: "5px 10px", border: "none", cursor: "pointer" }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}