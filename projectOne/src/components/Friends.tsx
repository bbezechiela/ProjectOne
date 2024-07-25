import React, { useState, useEffect, useContext } from 'react';
import { CurrentUser } from './NavOne';
import '../styles/friends.css';

interface RequestDetails {
    id: number,
    username: string,
    password: string,
    email: string,
    profile_path: null,
    request_id: number,
    request_sender: number,
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void,
}

const Friends = () => {
    const getCurrentUser: {} = useContext(CurrentUser);
    const [getUserDetails, ] = useState(getCurrentUser);
    const [getRequestDetails, setRequestDetails] = useState<RequestDetails[]>([]);
    
    useEffect(() => {
        (async () => {
            const getter = await fetch('http://localhost:2020/getFriends', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(getUserDetails),
            });

            const response = await getter.json();
            if (response) {
                console.log(response);
                setRequestDetails(response.result);
            }
        })();
    }, []);

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
                <div id='friendsHeader'>Friend List</div>
                {getRequestDetails.length !== 0 ? getRequestDetails.map((element, index) => (
                    <div id='friendsElementContainer' key={index}>
                        <div id='friendsElementSectionOne'>
                            <div id="friendsProfilePhoto"></div>
                            <div id="usernameContainer">
                                <div id='friendsElementUsername'>{element.username}</div>
                            </div>
                        </div>
                        <div id='friendsRemoveButton' onClick={() => {
                            removeFriend(element, index);
                        }}>Remove Friend</div>
                    </div>
                )): <div id='noFriends'>no friends :)</div>}
            </div>
        </div>
    );
}

export default Friends;