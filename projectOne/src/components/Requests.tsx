import React, { useEffect, useState } from "react";
import { firebaseApp } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { Props, RequestDetails } from "./Interfaces";
import '../styles/requests.css';

const Requests: React.FC<Props> = ({ isLoggedIn }) => {
    // const getContext: {} = useContext(CurrentUser);
    // const [getCurrentUser, ] = useState(getContext);
    const [isLoad, setLoad] = useState<boolean>(false);
    const [getRequestsDetails, setRequestDetails] = useState<RequestDetails[]>([]);

    const auth = getAuth(firebaseApp);

    const useNav = useNavigate();
    console.log(window.innerWidth);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user !== null) {
                isLoggedIn(true);
                getRequests(user.uid);
            } else {
                useNav('/', { replace: true });
            }
        });
    }, []);

    // express done
    const getRequests = async (uid: string): Promise<void> => {
        //https://justforabeapi.onrender.com/getRequests 
        const getter = await fetch(`http://localhost:2020/getRequests?current_user=${uid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }, 
        });

        const response = await getter.json();
        if (response) {
            // console.log(response);
            setTimeout(() => {
                setRequestDetails(response.result);
                setLoad(true);
                console.log(response);
            }, 1200);
        }
    };

    // express done
    const acceptRequest = async (e: RequestDetails, index: number): Promise<void> => {
        // console.log('clicked', JSON.stringify(e));
        //https://justforabeapi.onrender.com/acceptRequest
        const setter = await fetch('http://localhost:2020/acceptRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(e),
        });

        const response = await setter.json();
        if (response.message) {
            // console.log('accept request response', response.message);
            const allRequest = [...getRequestsDetails];
            allRequest.splice(index, 1);
            setRequestDetails(allRequest);
        }
    }

    // express done
    const declineRequest = async (e: RequestDetails, index: number): Promise<void> => {
        //https://justforabeapi.onrender.com/declineRequest
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
        <div id='requestOuterContainer'>
            <div id="requestInnerContainer">
                <div id="requestHeaderText">Request List</div>
                {isLoad ? 
                    <>
                        {getRequestsDetails.length > 0 ? getRequestsDetails.map((element, index) => (
                            <div id='requestElementContainer' key={index}>
                                <div id='requestUpperContainer'>
                                    <div id='requestProfilePhoto'
                                        style={{ backgroundImage: `url('${element.profile_path}')` }}></div>
                                    <div id="usernameContainer">
                                        <div id='requestUsername'>{element.display_name}</div>
                                    </div>
                                </div>
                                <div id='requestLowerContainer'>
                                    <div className='requestLowerButton' onClick={() => {
                                        acceptRequest(element, index);
                                    }}>
                                        <FontAwesomeIcon className="checkIcon" icon={faCheck} />
                                    </div>
                                    <div className='requestLowerButton' onClick={() => {
                                        declineRequest(element, index);   
                                    }}>
                                        <FontAwesomeIcon className="checkIcon" icon={faX} />
                                    </div>
                                </div>
                            </div>   
                        )): <div id="noRequest">no request :)</div> }
                    </>
                : <Loader />}
            </div>
        </div>
    );
}

export default Requests;