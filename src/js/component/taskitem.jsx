import React from "react";

const TaskItem = ({ label, isDone, index, onDelete }) => {
    return (
        <li className="list-group-item d-flex justify-content-between align-items-center">
            <div className="task-content">
                <span>{label} - {isDone ? "Done" : "Not Done"}</span>
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(index)}>
                Delete
            </button>
        </li>
    );
};

export default TaskItem;
