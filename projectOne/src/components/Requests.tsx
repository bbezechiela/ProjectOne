import React, { MouseEventHandler, useContext, useEffect, useState } from "react";
import { CurrentUser } from "./NavOne";
import '../styles/requests.css';

interface RequestDetails {
    id: number,
    username: string,
    password: string,
    email: string,
    request_id: number,
    request_sender: number,
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void
}

const Requests = () => {
    const getContext: {} = useContext(CurrentUser);
    const [getCurrentUser, ] = useState(getContext);
    const [getRequestsDetails, setRequestDetails] = useState<RequestDetails[]>([]);

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
                setRequestDetails(response.result);
                console.log(response.result);
            }
        })();
    }, []);

    const acceptRequest = (e: RequestDetails): void => {
        console.log(e);
    }

    return (
        <>
            <div id='requestOuterContainer'>
                {getRequestsDetails.length > 0 && getRequestsDetails.map((element, index) => (
                    <div id='requestInnerContainer' key={index}>
                        <div id='requestUpperContainer'>
                            <div id='username'>{element.username}</div>
                            <div id='username'>{element.request_sender}</div>
                        </div>
                        <div id='requestLowerContainer'>
                            <div className='requestLowerButton' onClick={() => (
                                acceptRequest(element)
                            )}>Accept</div>
                            <div className='requestLowerButton'>Decline</div>
                        </div>
                    </div>   
                ))}
            </div>
        </>
    );
}

export default Requests;