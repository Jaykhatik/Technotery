import React from "react";

function AddUserForm({ showForm, handleUserSubmit, uservalues, setuserValues }) {
    if (!showForm) return null;

    return (
        <form onSubmit={handleUserSubmit} className="form-container">
            <h2 className="form-title">Add User</h2>

            <div className="form-group">
                <label>Name</label>
                <input
                    type="text"
                    value={uservalues.name}
                    onChange={(e) =>
                        setuserValues({ ...uservalues, name: e.target.value })
                    }
                />
            </div>

            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    value={uservalues.email}
                    onChange={(e) =>
                        setuserValues({ ...uservalues, email: e.target.value })
                    }
                />
            </div>

            <div className="form-group">
                <label>Phone</label>
                <input
                    type="number"
                    value={uservalues.phone}
                    onChange={(e) =>
                        setuserValues({ ...uservalues, phone: e.target.value })
                    }
                />
            </div>

            <div className="form-group">
                  <label>Street</label>
                <input
                    value={uservalues.street}
                    onChange={(e) =>
                        setuserValues({ ...uservalues, street: e.target.value })
                    }

                />
            </div>

                <button type="submit" className="submit-btn">Submit</button>
        </form>
    );
}

export default AddUserForm;