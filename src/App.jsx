import axios from "axios"
import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [userData, setUserData] = useState({name: "", age: "", city: ""})

  const getAllUsers = async () => {
    await axios.get("http://localhost:8000/users").then((res)=> {
      console.log(res.data)
      setUsers(res.data)
      setFilteredUsers(res.data)
    })
  };

  useEffect(() => {
    getAllUsers(); 
  }, [])

  const getFilteredUsers = (e) => {
    let searchTest = e.target.value.toLowerCase();
    let filteredUsers = users.filter((user) => 
      user.name.toLowerCase().includes(searchTest))
    setFilteredUsers(filteredUsers);
  }

  const handleDelete = async (id) => {
    let isConfirmed = window.confirm("Are You sure you want to delete this User ?");
    if(isConfirmed){
      await axios.delete(`http://localhost:8000/users/${id}`).then((res)=>{
        setUsers(res.data)
        setFilteredUsers(res.data)
      })
    }
    
  }

  const handleAddUser = () => {
    setUserData({name: "", age: "", city: ""});
    setIsModelOpen(true);
  }

  const modelClose = () => {
    setIsModelOpen(false);
    getAllUsers();
  }

  const handleUserData = (e) => {
    setUserData({ ...userData, [e.target.name]:e.target.value})
    console.log(e.target.value) 
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(userData.id)
    {
      await axios.patch(`http://localhost:8000/users/${userData.id}`, userData).then((res)=>{
        // console.log(res.data);
        alert(res.data.message)
      })
      console.log(userData.id)

    }
    else{
      await axios.post("http://localhost:8000/users", userData).then((res)=>{
        // console.log(res.data);
        alert(res.data.message)
      })
    }

    // alert("User Added Successfully");
    modelClose()
  }

  const handleUpdateData = (user) => {
    setUserData(user);
    setIsModelOpen(true);
    
  }

  return (

    <>
      <div className="container">
        <h2 className="heading">User Details Application using React.js</h2>
        <div className="input-search">
          <input type="search" onChange={getFilteredUsers} placeholder="Search by Name here"/>
          <button className='btn' onClick={handleAddUser}>Add Record</button>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers && filteredUsers.map((user, index) => {
                return(
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.age}</td>
                    <td>{user.city}</td>
                    <td><button className='btn green' onClick={()=> handleUpdateData(user)}>Edit</button></td>
                    <td><button className='btn red' onClick={()=> handleDelete(user.id)}>Delete</button></td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        {isModelOpen && (
          <div className="model">
            <div className="model-content">
              <span className="close" onClick={modelClose}>&times;</span>
              <h2>Add/Update User Record </h2>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" value={userData.name} onChange={handleUserData}/>
              </div>
              <div className="input-group">
                <label htmlFor="age">Age</label>
                <input type="number" id="age" name="age" value={userData.age} onChange={handleUserData}/>
              </div>
              <div className="input-group">
                <label htmlFor="city">City</label>
                <input type="text" id="city" name="city" value={userData.city} onChange={handleUserData}/>
              </div>
              <button className="btn green" onClick={handleSubmit}>Add/Update User</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
