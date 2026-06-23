"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import axios from "axios";

type User = { id: number; name: string; email: string; username: string };

const fetchUsers = async (): Promise<User[]> => {
  const res = await axios.get("/api/users");
  return res.data;
};

export default function NewPage() {
  const queryClient = useQueryClient();

  // Form state
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // 1. READ Data
  const { data, isLoading } = useQuery<User[]>({
    queryKey: ["users", "new"],
    queryFn: fetchUsers,
  });

  // 2. CREATE Mutation
  const createMutation = useMutation({
    mutationFn: async (newUser: any) => axios.post("/api/users", newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "new"] });
      resetForm();
    },
  });

  // 3. UPDATE Mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedUser: any) => axios.put("/api/users", updatedUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "new"] });
      resetForm();
    },
  });

  // 4. DELETE Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => axios.delete(`/api/users?id=${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "new"] });
    },
  });

  const resetForm = () => {
    setName("");
    setUsername("");
    setEmail("");
    setEditingId(null);
  };

  const handleEditClick = (user: User) => {
    setEditingId(user.id);
    setName(user.name);
    setUsername(user.username);
    setEmail(user.email);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, name, username, email });
    } else {
      createMutation.mutate({ name, username, email });
    }
  };

  if (isLoading)
    return (
      <div className="loading-container">
        <div className="loading-text">Loading users...</div>
      </div>
    );

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-title">New Page (React Query Full CRUD)</h1>

        {/* Create/Update Form */}
        <div className="form-container">
          <h2 className="text-xl font-bold mb-4">{editingId ? "Edit User" : "Add User"} (TanStack Way)</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            <input
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
            />
            <input
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
            <input
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <div className="flex gap-2" style={{ gridColumn: "1 / -1" }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingId ? "Update User" : "Create User"}
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
          {data?.map((u) => (
            <div key={u.id} className="user-card">
              <div className="user-card-content">
                <h2 className="user-name">{u.name}</h2>
                <p className="user-username">@{u.username}</p>
                <p className="text-sm mt-2 text-gray-500">{u.email}</p>
                
                <div className="card-actions mt-4 flex gap-2">
                  <button onClick={() => handleEditClick(u)} className="btn btn-secondary flex-1">
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteMutation.mutate(u.id)} 
                    className="btn btn-danger flex-1"
                    disabled={deleteMutation.isPending}
                  >
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
