import React, { useEffect, useState } from 'react';
import '../styles/user.css';
import AddUserForm from '../components/User/addUserForm';
import EditUser from '../components/User/EditUser';
import ViewUser from '../components/User/ViewUser';
import UserTable from '../components/User/UserTable';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, deleteUser, fetchUsers, updateUser } from '../redux/features/userSlice';
import { getUsers } from '../services/UserServices';

function Users() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);

  // const [users, setUsers] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);

  const [uservalues, setuserValues] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
  });

  useEffect(() => {
    getUsers()
     dispatch(fetchUsers());
  }, [dispatch]);
  // console.log(users)

  const handleUserSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      id: Date.now(),
      username: uservalues.name,
      email: uservalues.email,
      phone: uservalues.phone,
      address: {
        city: uservalues.city,
        street: uservalues.street,
        zipcode: uservalues.zipcode
      }
    };

    dispatch(addUser(newUser));

    setuserValues({
      name: '',
      email: '',
      phone: '',
      street: '',
    });

    setShowForm(false);
  };

 
  const handleUpdateUser=()=>{
    dispatch(updateUser(editUser));
    setEditUser(null);
  }

  const handleDeleteUser = (id) => {
   if(!window.confirm("are you sure?")) return;
   dispatch(deleteUser(id))
  };
   if (loading) return <h2>Loading...</h2>;


  return (
    <div className="table-container">

      <div className="addButton" onClick={() => setShowForm(!showForm)}>
        +ADD
      </div>

      <AddUserForm
        showForm={showForm}
        handleUserSubmit={handleUserSubmit}
        uservalues={uservalues}
        setuserValues={setuserValues}
      />

      <EditUser
        editUser={editUser}
        setEditUser={setEditUser}
        handleUpdateUser={handleUpdateUser}
      />

      <ViewUser
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      <UserTable
        users={users}
        setEditUser={setEditUser}
        handleDeleteUser={handleDeleteUser}
        setSelectedUser={setSelectedUser}
      />

    </div>
  );
}

export default Users;