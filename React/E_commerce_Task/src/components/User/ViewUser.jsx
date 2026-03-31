import React from "react";

function ViewUser({ selectedUser, setSelectedUser }) {
  if (!selectedUser) return null;

  return (
    <div className="view-container">
      <h2>User Details</h2>

      <p>UserName : {selectedUser.username}</p>
      <p>Email : {selectedUser.email}</p>
      <p>Phone : {selectedUser.phone}</p>
      <p>Street : {selectedUser.address.street}</p>

      <button onClick={() => setSelectedUser(null)}>Close</button>
    </div>
  );
}

export default ViewUser;