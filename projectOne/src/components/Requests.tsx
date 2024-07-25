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
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void,
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

    const acceptRequest = async (e: RequestDetails, index: number): Promise<void> => {
        console.log('clicked', JSON.stringify(e));
        const setter = await fetch('http://localhost:2020/acceptRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(e),
        });

        const response = await setter.json();
        if (response.message) {
            console.log('accept request response', response.message);
            const allRequest = [...getRequestsDetails];
            allRequest.splice(index, 1);
            setRequestDetails(allRequest);
        }
    }

    const declineRequest = async (e: RequestDetails, index: number): Promise<void> => {
        const setter = await fetch('http://localhost:2020/declineRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(e),
        });

        const response = await setter.json();
        if (response.success) {
            const allRequest = [...getRequestsDetails];
            allRequest.splice(index, 1);
            setRequestDetails(allRequest);
        }
    }

    return (
        <>
            <div id='requestOuterContainer'>
                <div id="requestInnerContainer">
                    <div id="requestHeaderText">Request List</div>
                    {getRequestsDetails.length > 0 ? getRequestsDetails.map((element, index) => (
                        <div id='requestElementContainer' key={index}>
                            <div id='requestUpperContainer'>
                                <div id='requestProfilePhoto'></div>
                                <div id="usernameContainer">
                                    <div id='requestUsername'>{element.username}</div>
                                </div>
                            </div>
                            <div id='requestLowerContainer'>
                                <div className='requestLowerButton' onClick={() => {
                                    acceptRequest(element, index);
                                }}>Accept</div>
                                <div className='requestLowerButton' onClick={() => {
                                    declineRequest(element, index);   
                                }}>Decline</div>
                            </div>
                        </div>   
                    )): <div id="noRequest">no request :)</div> }
                </div>
            </div>
        </>
    );
}

export default Requests;