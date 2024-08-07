import React, { useState, useEffect, useContext } from 'react';
import Loader from './Loader';
import { firebaseApp } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Props, RequestDetails, CurrentUser } from './Interfaces';
import '../styles/friends.css';

const Friends: React.FC<Props> = ({ isLoggedIn }) => {
    // const getCurrentUser: {} = useContext(CurrentUser);
    // const [getUserDetails, ] = useState(getCurrentUser);
    const [isLoad, setLoad] = useState<boolean>(false);
    const [getRequestDetails, setRequestDetails] = useState<RequestDetails[]>([]);
    const useNav = useNavigate();

    useEffect(() => {
        const auth = getAuth(firebaseApp);
        onAuthStateChanged(auth, (user) => {
            if (user !== null) {
                isLoggedIn(true);
                getFriends(user.uid);
            } else {
                useNav('/', { replace: true });
            }
        });
    }, []);
    
    const getFriends = async (uid: string): Promise<void> => {
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
                                    <div id="friendsProfilePhoto"
                                        style={{ backgroundImage: `url('${element.profile_path}')` }}></div>
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