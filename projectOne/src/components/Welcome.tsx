import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { CurrentUser } from "./NavOne";

const Welcome = () => {
    const currentUserData = useContext(CurrentUser);

    useEffect(() => {
        console.log(currentUserData);
    }, []);

    return (
        <>
            <h1>Welcome home</h1>
            <div>{ currentUserData.email }</div>
        </>
    );
}

export default Welcome;