import React from "react";

const UserName = ({ name, index }) => {
    return (
        <li className="list-group-item d-flex justify-content-between align-items-center">{name}</li>
    );
};

export default UserName;
