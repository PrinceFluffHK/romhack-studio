import React from "react";
import { Link } from "react-router-dom";
import SignOutButton from "../authentication/SignOutButton";

const TopBar = ({ user }) => {
    const unauthenticatedListItems = [
        <li key="sign-in">
            <Link to="/user-sessions/new">Sign In</Link>
        </li>,
        <li key="sign-up">
            <Link to="/users/new" className="button">
                Sign Up
            </Link>
        </li>,
    ];

    const authenticatedListItems = [
        <li key="profile">
            <Link to="/profile">Profile</Link>
        </li>,
        <li key="sign-out">
            <SignOutButton />
        </li>,
    ];

    return (
        <div className="top-bar">
            <div className="top-bar-left">
                <ul className="menu">
                    <li >
                        <Link className="button" to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/search-projects">Browse</Link>
                    </li>
                    <li>
                        <Link to="/my-projects">My Projects</Link>
                    </li>
                </ul>
            </div>
            <div className="top-bar-right">
                <ul className="menu">{user ? authenticatedListItems : unauthenticatedListItems}</ul>
            </div>
        </div>
    );
};

export default TopBar;
