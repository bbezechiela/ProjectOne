import React, { useState, useEffect, useContext } from 'react';
import { CurrentUser } from './NavOne';
import Loader from './Loader';
import { firebaseApp } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '../styles/friends.css';

interface RequestDetails {
    uid: string,
    display_name: string | null,
    email: string | null,
    profile_path: string,
    request_id: number,
    request_sender: number,
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void,
}

interface CurrentUser {
    uid: string
}

const Friends = () => {
    // const getCurrentUser: {} = useContext(CurrentUser);
    // const [getUserDetails, ] = useState(getCurrentUser);
    const [isLoad, setLoad] = useState<boolean>(false);
    const [getRequestDetails, setRequestDetails] = useState<RequestDetails[]>([]);
    const useNav = useNavigate();

    useEffect(() => {
        const auth = getAuth(firebaseApp);
        onAuthStateChanged(auth, (user) => {
            if (user !== null) {
                getFriends({uid: user.uid});
            } else {
                useNav('/', { replace: true });
            }
        });
    }, []);
    
    const getFriends = async ({uid}: CurrentUser): Promise<void> => {
        const getter = await fetch('http://localhost:2020/getFriends', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({currentUser: uid}),
        });

        const response = await getter.json();
        if (response) {
            console.log(response);
            setTimeout(() => {
                setRequestDetails(response.result);
                setLoad(true);
            }, 1500);
        }
    };
    
    const removeFriend = async (e: RequestDetails, index: number): Promise<void> => {
        const setter = await fetch('http://localhost:2020/removeFriend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(e),
        });

        const response = await setter.json();
        if (response.success) {
            const userIndex = [...getRequestDetails];
            userIndex.splice(index, 1);
            setRequestDetails(userIndex);
        }
    }

    return (
        <div id='friendsOuterContainer'>
            <div id='friendsInnerContainer'>
                <div id='friendsHeader'>Friend List <span>({getRequestDetails.length} of 20)</span></div>
                {isLoad ? 
                    <>
                        {getRequestDetails.length !== 0 ? getRequestDetails.map((element, index) => (
                            <div id='friendsElementContainer' key={index}>
                                <div id='friendsElementSectionOne'>
                                    <div id="friendsProfilePhoto"></div>
                                    <div id="usernameContainer">
                                        <div id='friendsElementUsername'>{element.display_name}</div>
                                    </div>
                                </div>
                                <div id='friendsRemoveButton' onClick={() => {
                                    removeFriend(element, index);
                                }}>Remove Friend</div>
                            </div>
                        )): <div id='noFriends'>no friends :)</div>}
                    </>
                : <Loader />}
            </div>
        </div>
    );
}

export default Friends;