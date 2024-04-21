import React, { useEffect, useState, useCallback } from "react";
import TaskItem from "./taskitem";
import UserItem from "./useritem";

const Home = () => {
    const [taskInput, setTaskInput] = useState("");
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState("");
    const [selectedUser, setselectedUser] = useState("");

    // Obtener la lista de usuarios
    const getAllUsers = useCallback(async () => {
        try {
            const response = await fetch("https://playground.4geeks.com/todo/users/");
            const data = await response.json();

            if (response.ok && Array.isArray(data.users)) {
                setUsers(data.users);
            } else {
                console.error("Error al obtener usuarios: la respuesta no es válida.");
            }
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        }
    }, []);

    // Obtener las tareas del usuario seleccionado
    const getUserTasks = useCallback(async (userName) => {
        try {
            const response = await fetch(
                `https://playground.4geeks.com/todo/users/${userName}`
            );
            if (response.ok) {
                const data = await response.json();
                setTasks(data.todos);
            } else {
                console.error("Error fetching tasks:", response.statusText);
            }
        } catch (error) {
            console.error("Error while fetching user tasks:", error);
        }
    }, []);

    useEffect(() => {
        getAllUsers(); // Obtener la lista de usuarios al principio
    }, [getAllUsers]);

    // Crear un nuevo usuario
    const createNewUser = useCallback(async () => {
        if (newUser) {
            try {
                const response = await fetch(`https://playground.4geeks.com/todo/users/${newUser}`, {
                    method: "POST",
                });

                if (response.ok) {
                    setNewUser("");
                    getAllUsers();
                } else {
                    console.error("Error while creating new user:", response.statusText);
                }
            } catch (error) {
                console.error("Error while creating new user:", error);
            }
        }
    }, [newUser, getAllUsers]);

    // Eliminar un usuario
    const deleteUser = useCallback(async (userName) => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${userName}`, {
                method: "DELETE",
            });

            if (response.ok) {
                getAllUsers();
                if (userName === selectedUser) {
                    setselectedUser("");
                }
            } else {
                console.error("Error while deleting user:", response.statusText);
            }
        } catch (error) {
            console.error("Failed to delete user:", error);
        }
    }, [selectedUser, getAllUsers]);

    // Seleccionar un usuario y obtener sus tareas
    const selectUser = useCallback((userName) => {
        setselectedUser(userName);
        getUserTasks(userName); // Obtener las tareas del usuario seleccionado
    }, [getUserTasks]);

    return (
        <div className="container mt-5">
            <div className="row g-3">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <div className="input-group mb-3">
                                <input
                                    placeholder="New user name..."
                                    className="form-control"
                                    value={newUser}
                                    onChange={(e) => setNewUser(e.target.value)}
                                />
                                <button className="btn btn-success" onClick={createNewUser}>
                                    Create User
                                </button>
                            </div>
                            <p className="mb-1 ms-1 fw-bold">Users List:</p>
                            <ul className="list-group">
                                {users.map((user, index) => (
                                    <UserItem
                                        key={user.id}
                                        name={user.name}
                                        onDelete={deleteUser}
                                        onSelect={() => selectUser(user.name)} // Seleccionar usuario
                                    />
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card shadow">
                        <div class="card-body">
                            <h1 className="card-title text-center mb-4">TODO LIST</h1>
                            {selectedUser === '' ? "" : <p className="small text-center ms-3 mt-2">User: {selectedUser}</p>}
                            <div className="input-group mb-3">
                                <input
                                    value={taskInput}
                                    type="text"
                                    className="form-control"
                                    placeholder="What needs to be done?"
                                    onChange={(e) => setTaskInput(e.target.value)}
                                    onKeyDown={""}
                                />
                                <button className="btn btn-dark" onClick={""}>
                                    Add
                                </button>
                            </div>
                            <ul className="list-group">
                                {tasks.map((task, index) => (
                                    <TaskItem
                                        key={task.id}
                                        label={task.label}
                                        isDone={task.is_done}
                                    />
                                ))}
                            </ul>
                        </div>
                        <p className="small text-left ms-3">
                            {tasks.length === 0 ? "No tasks, add a task" : `${tasks.length} item(s) left`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
