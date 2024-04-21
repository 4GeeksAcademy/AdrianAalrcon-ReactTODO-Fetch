import React from "react";

const UserItem = ({ name, index, id, onDelete, onSelect }) => {
    return (
        <li className="list-group-item d-flex justify-content-between align-items-center">
            <span>{name}</span>
            <div className="d-flex justify-content-between">
                <button className="btn btn-danger mx-2 btn-sm" onClick={() => onDelete(name)}>Delete</button>
                <button className="btn btn-success btn-sm" onClick={() => onSelect(name)}>Select</button>
            </div>
        </li>
    );
};

export default UserItem;
