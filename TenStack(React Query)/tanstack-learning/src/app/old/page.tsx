"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

type User = { id: number; name: string; email: string; username: string };

export default function OldPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get('/api/users');
      setUsers(res.data);
      setIsLoading(false);
    };
    fetchUsers();
  }, []);

  const resetForm = () => {
    setName(''); setUsername(''); setEmail(''); setEditingId(null);
  };

  const handleEditClick = (user: User) => {
    setEditingId(user.id);
    setName(user.name);
    setUsername(user.username);
    setEmail(user.email);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // UPDATE Logic
        const res = await axios.put('/api/users', { id: editingId, name, username, email });
        // Manually update the state array
        setUsers(users.map(u => (u.id === editingId ? res.data : u)));
      } else {
        // CREATE Logic
        const res = await axios.post('/api/users', { name, username, email });
        // Manually add to array
        setUsers([res.data, ...users]); 
      }
      resetForm();
    } catch (err) {
      alert("Action failed");
    }
  };

  // DELETE Logic
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/users?id=${id}`);
      // Manually remove from state array
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  if (isLoading) return <div className="loading-container"><div className="loading-text">Loading users...</div></div>;

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-title">Old Page (React State Full CRUD)</h1>
        
        {/* Create/Update Form */}
        <div className="form-container">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit User' : 'Add User'} (Old Way)</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" required />
            <input className="form-input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
            <input className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
            <div className="flex gap-2" style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update User' : 'Create User'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Display Users */}
        <div className="user-grid">
          {users.map(u => (
            <div key={u.id} className="user-card">
              <div className="user-card-content">
                <h2 className="user-name">{u.name}</h2>
                <p className="user-username">@{u.username}</p>
                <p className="text-sm mt-2 text-gray-500">{u.email}</p>

                <div className="card-actions mt-4 flex gap-2">
                  <button onClick={() => handleEditClick(u)} className="btn btn-secondary flex-1">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(u.id)} className="btn btn-danger flex-1">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
