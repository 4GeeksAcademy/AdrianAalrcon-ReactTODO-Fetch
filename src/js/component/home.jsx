import React, { useEffect, useState } from "react";
import TaskItem from "./taskitem";
import UserItem from "./useritem";

const Home = () => {
    const [taskInput, setTaskInput] = useState("");
    const [tasks, setTasks] = useState([]);

    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState('');
    const [selectedUser, setselectedUser] = useState('');


    const getAllUsers = async () => {
        try {
            const response = await fetch('https://playground.4geeks.com/todo/users/');
            if (!response.ok) {
                throw new Error(`Error fetching users: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Datos obtenidos:", data);

            if (data.hasOwnProperty('users') && Array.isArray(data.users)) {
                setUsers(data.users);
            } else {
                console.error("La propiedad 'users' no es un array o no existe.");
            }

        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        }
    };

    // Execute at the beggining
    useEffect(() => {
        getAllUsers()
    }, [])

    // Create new user
    const createNewUser = async () => {
        if (newUser) {
            await fetch(`https://playground.4geeks.com/todo/users/${newUser}`, {
                method: 'POST'
            }).then(resp => {
                if (resp.ok) {
                    setNewUser('');
                    getAllUsers();
                } else {
                    alert('Error whle creating new user')
                }
            });
        }
    }
    // Delete  user
    const deleteUser = async (userName) => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${userName}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                getAllUsers();
            } else {
                alert("Error while deleting user: " + response.statusText);
            }
        } catch (error) {
            alert("Failed to fetch: " + error.message);
        }
    };

    const selectUser = (userName) => {
        setselectedUser(userName); // Guarda el nombre del usuario en selectedUser
        console.log("Usuario seleccionado:", selectedUser); // Para verificar la selección
    };

    // ........................
    const handleAddTask = () => {
        if (taskInput.trim() !== "") {
            setTasks([...tasks, taskInput]);
            setTaskInput("");
        }
    };

    const handleDeleteTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleAddTask();
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <div className="input-group mb-3">
                                <input placeholder="New user name ..." className="form-control" value={newUser} onChange={(e) => setNewUser(e.target.value)} />
                                <button className="btn btn-success" onClick={createNewUser} >
                                    Create User
                                </button>
                            </div>
                            <p className="mb-1 ms-1 fw-bold">Users List:</p>
                            <ul className="list-group">
                                {Array.isArray(users) ? (
                                    users.map((user, index) => (
                                        <UserItem
                                            key={index}
                                            index={index}
                                            name={user.name}
                                            id={user.id}
                                            onDelete={deleteUser}
                                            onSelect={selectUser} />
                                    ))) : (<li>No users found</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center mt-2">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <div className="d-flex flex-column justify-content-between align-items-center">
                                <h1 className="card-title text-center mb-0" style={{ flex: 1 }}>
                                    TODO LIST
                                </h1>
                                <p className="me-1 mb-3">
                                    {selectedUser === "" ? "" : "User: " + selectedUser}
                                </p>
                            </div>
                            <div className="input-group mb-3">
                                <input
                                    value={taskInput}
                                    type="text"
                                    className="form-control"
                                    placeholder="What needs to be done?"
                                    onChange={(e) => setTaskInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                />
                                <button className="btn btn-dark" onClick={handleAddTask}>
                                    Add
                                </button>
                            </div>
                            <ul className="list-group">
                                {tasks.map((task, index) => (
                                    <TaskItem
                                        key={index}
                                        index={index}
                                        task={task}
                                        onDelete={handleDeleteTask}
                                    />
                                ))}
                            </ul>
                        </div>
                        <p className="small text-left ms-3 mt-2">
                            {tasks.length === 0 ? "No tasks, add a task" : `${tasks.length} item(s) left`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
