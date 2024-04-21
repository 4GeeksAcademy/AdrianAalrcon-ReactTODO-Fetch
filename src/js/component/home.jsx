import React, { useEffect, useState } from "react";
import TaskItem from "./taskitem";
import UserName from "./username";

const Home = () => {
    const [taskInput, setTaskInput] = useState("");
    const [tasks, setTasks] = useState([]);

    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState('');


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

    console.log(users);
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
                            <h5>User List: </h5>
                            <ul className="list-group">
                                {Array.isArray(users) ? (
                                    users.map((user, index) => (
                                        <UserName key={index} index={index} name={user.name} />
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
                            <h1 className="card-title text-center mb-4">TODO LIST</h1>
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
