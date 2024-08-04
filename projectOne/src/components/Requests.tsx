import React, { MouseEventHandler, useContext, useEffect, useState } from "react";
import { CurrentUser } from "./NavOne";
import { firebaseApp } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Loader from "./Loader";
import '../styles/requests.css';
import { useNavigate } from "react-router-dom";

interface RequestDetails {
    uid: string,
    display_name: string,
    email: string,
    profile_path: string,
    request_id: number,
    request_sender: string,
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void,
}

interface CurrentUser {
    uid: string,
    display_name?: string | null,
    email?: string | null,
    profile_path?: string | null,
}

const Requests = () => {
    // const getContext: {} = useContext(CurrentUser);
    // const [getCurrentUser, ] = useState(getContext);
    const [isLoad, setLoad] = useState<boolean>(false);
    const [getRequestsDetails, setRequestDetails] = useState<RequestDetails[]>([]);

    const auth = getAuth(firebaseApp);

    const useNav = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user !== null) {
                getRequests({uid: user.uid});
            } else {
                useNav('/', { replace: true });
            }
        });
    }, []);

    const getRequests = async ({uid}: CurrentUser): Promise<void> => {
        const getter = await fetch('http://localhost:2020/getRequests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({currentUser: uid})
        });

        const response = await getter.json();
        if (response) {
            setTimeout(() => {
                setRequestDetails(response.result);
                setLoad(true);
            }, 1200);
        }
    };

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
                    {isLoad ? '' : <Loader></Loader>}
                    {getRequestsDetails.length > 0 ? getRequestsDetails.map((element, index) => (
                        <div id='requestElementContainer' key={index}>
                            <div id='requestUpperContainer'>
                                <div id='requestProfilePhoto'></div>
                                <div id="usernameContainer">
                                    <div id='requestUsername'>{element.display_name}</div>
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