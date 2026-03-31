import React from "react";

function EditUser({ editUser, setEditUser, handleUpdateUser }) {
  if (!editUser) return null;

  return (
    <div className="edit-container">
      <h2>Edit User</h2>

      <input
        value={editUser.username}
        onChange={(e) =>
          setEditUser({ ...editUser, username: e.target.value })
        }
      />

      <input
        value={editUser.email}
        onChange={(e) =>
          setEditUser({ ...editUser, email: e.target.value })
        }
      />

      <input
        value={editUser.phone}
        onChange={(e) =>
          setEditUser({ ...editUser, phone: e.target.value })
        }
      />
      <input
        value={editUser?.address?.street}
        onChange={(e) =>
          setEditUser({ ...editUser, address: { ...editUser.address, street: e.target.value }, })
        }
      />

      <button onClick={handleUpdateUser} className="upd-btn">Update</button>
      <button onClick={() => setEditUser(null)} className="can-btn">Cancel</button>
    </div>
  );
}

export default EditUser;