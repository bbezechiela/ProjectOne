import React, { useContext, useEffect, useState } from "react";
import { CurrentUser } from "./NavOne";

interface myObj {
    resultOne: [
        {
            request_id: number,
            request_sender: number,
        }
    ],
    resultTwo: [
        {
            id: number,
            username: string,
            password: string,
            email: string,
        }
    ]
}

const Requests = () => {
    const getContext: {} = useContext(CurrentUser);
    const [getCurrentUser, ] = useState(getContext);
    const [getRequests, setRequests] = useState<myObj[]>([]);

    useEffect(() => {
        (async () => {
            const getter = await fetch('http://localhost:2020/getRequests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify(getCurrentUser)
            });

            const response = await getter.json();
        if (response) {
                setRequests(response.message);
                console.log('requests fetched', response);
            }
        })();
    }, []);

    console.log(getRequests);

    return (
        <>
            {getRequests.length > 0 && getRequests.map((element, index) => (
                <>
                    <div key={index}>
                        {element.resultTwo[0].username}
                    </div>   
                </>
            ))}
        </>
    );
}

export default Requests;