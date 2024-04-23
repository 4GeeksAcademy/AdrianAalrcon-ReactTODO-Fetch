import React, { useEffect, useState, useCallback } from "react";
import TaskItem from "./taskitem";
import UserItem from "./useritem";

const Home = () => {

    const [taskInput, setTaskInput] = useState("");
    const [tasks, setTasks] = useState([]);

    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState("");
    const [selectedUser, setselectedUser] = useState("");

    // Take users list
    const getAllUsers = async () => {
        try {
            const response = await fetch("https://playground.4geeks.com/todo/users/");
            const data = await response.json();

            if (response.ok && Array.isArray(data.users)) {
                setUsers(data.users);
            } else {
                console.error("Error while geting users: Not valid response.");
            }
        } catch (error) {
            console.error("Error while geting users:", error);
        }
    };

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    // Create an user
    const createNewUser = async () => {
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
    };

    const handleUserInputKeyDown = (e) => {
        if (e.key === "Enter") {
            createNewUser();
        }
    };

    // Delete an user
    const deleteUser = async (userName) => {
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
    };

    // Take user tasks
    const getUserTasks = async (userName) => {
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
    };

    // Create new task
    const createTask = async () => {
        if (taskInput.trim() && selectedUser) {
            try {
                const response = await fetch(
                    `https://playground.4geeks.com/todo/todos/${selectedUser}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            label: taskInput.trim(),
                            is_done: false,
                        }),
                    }
                );

                if (response.ok) {
                    setTaskInput("");
                    await getUserTasks(selectedUser);
                } else {
                    console.error("Error while creating task:", response.statusText);
                }
            } catch (error) {
                console.error("Error while creating task:", error);
            }
        } else {
            alert("Select a user");
            console.error("Name task missing or user not selected");
        }
    };

    // Delete task by ID
    const deleteTask = async (taskId) => {
        if (selectedUser) {
            try {
                const response = await fetch(
                    `https://playground.4geeks.com/todo/todos/${taskId}`,
                    {
                        method: "DELETE",
                    }
                );

                if (response.ok) {
                    await getUserTasks(selectedUser);
                } else {
                    console.error("Error while deleting task:", response.statusText);
                }
            } catch (error) {
                console.error("Error while deleting task:", error);
            }
        }
    };

    const handleTaskInputKeyDown = (e) => {
        if (e.key === "Enter") {
            createTask();
        }
    };

    const selectUser = (userName) => {
        setselectedUser(userName);
        getUserTasks(userName);
    };

    return (
        <div className="container mt-5">
            <div className="row g-3">
                <div className="col-md-4">
                    <div className="card shadow">
                        <div className="card-body">
                            <div className="input-group mb-3">
                                <input
                                    placeholder="New user name..."
                                    className="form-control"
                                    value={newUser}
                                    onChange={(e) => setNewUser(e.target.value)}
                                    onKeyDown={handleUserInputKeyDown}
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
                                        onSelect={() => selectUser(user.name)}
                                    />
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-md-8 mb-4">
                    <div className="card shadow">
                        <div className="card-body">
                            <h1 className="card-title text-center mb-4">TODO LIST</h1>
                            {selectedUser === '' ? "" : <p className="small text-center ms-3 mt-2">User: {selectedUser}</p>}
                            <div className="input-group mb-3">
                                <input
                                    value={taskInput}
                                    type="text"
                                    className="form-control"
                                    placeholder="What needs to be done?"
                                    onChange={(e) => setTaskInput(e.target.value)}
                                    onKeyDown={handleTaskInputKeyDown}
                                />
                                <button className="btn btn-dark" onClick={handleTaskInputKeyDown}>
                                    Add
                                </button>
                            </div>
                            <ul className="list-group">
                                {tasks.map((task, index) => (
                                    <TaskItem
                                        key={task.id}
                                        label={task.label}
                                        isDone={task.is_done}
                                        onDelete={() => deleteTask(task.id)}
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
