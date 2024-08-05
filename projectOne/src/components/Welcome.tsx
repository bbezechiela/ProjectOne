import { useEffect, useState, useContext } from "react";
import { CurrentUser } from "./NavOne";
import Search from "./Search";
import { firebaseApp } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import '../styles/welcome.css';

const customFunction = async (url: string, currentUser: object): Promise<object> => {
    const getter = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }, body: JSON.stringify(currentUser)
    });

    const response = await getter.json();
    return response.result;
};


const Welcome = () => {
    const [currentUser, setCurrentUser] = useState<{uid: string, display_name: string | null}>({uid: '', display_name: ''});
    const [getNumberOfRequests, setNumberOfRequests]: any = useState([]);
    const [getNumberOfFriends, setNumberOfFriends]: any = useState([]);
    const [getColors, ] = useState([{color: '#F7D358', name: 'Joy'}, {color: '#4ECDC4', name: 'Sadness'}, {color: '#EAD1DC', name: 'Fear'}, {color: '#D9382F', name: 'Anger'}, {color: '#9EADBA', name: 'Disgust'}]);

    const useNav =  useNavigate();
    
    const redirectComponent = (url: string): void => useNav(url, { replace: true });
    
    useEffect(() => {
        const auth = getAuth(firebaseApp);
        onAuthStateChanged(auth, (user) => {
            if (user !== null) {
                getter(user.uid);
                setCurrentUser({uid: user.uid, display_name: user.displayName});
            } else {
                useNav('/', { replace: true });
            } 
        });

    }, []);
    
    const getter = async (uid: string): Promise<void> => {
        const currentUser = { currentUser: uid }
        const getRequest = await customFunction('http://localhost:2020/getRequests', currentUser);
        setNumberOfRequests(getRequest);

        const getFriends = await customFunction('http://localhost:2020/getFriends', currentUser);
        setNumberOfFriends(getFriends);
    };

    return (
        <div id='welcomeOuterContainer'>
            <div id="welcomeInnerContainer">
                <div id="welcomeTextContainer">
                    <div id='welcomeText'>Welcome, {currentUser.display_name} :)</div>
                </div>
                <div id="welcomeGridContainer">
                    <div id="welcomeGalleryContainer">
                        <div id="redirectToGallery">view more</div>
                    </div>
                    <div id="welcomeSearchAndEmotionsContainer">
                        <Search />
                        <div id="welcomeEmotions">
                            {getColors.map((element) => (
                                <div className="wlcEmotion" style={{ backgroundColor: element.color}}>{element.name}</div>
                            ))}
                        </div>
                    </div>
                    <div id="welcomeRequestsFriendsContainer">
                        <div id="welcomeRequestss" onClick={() => redirectComponent('/requests')}>Requests {`(${getNumberOfRequests.length})`}</div>
                        <div id="welcomeFriends" onClick={() => redirectComponent('/friends')}>Friends {`(${getNumberOfFriends.length})`}</div>
                    </div>
                    <div id="welcomeMessagesContainer" onClick={() => redirectComponent('/messages')}>messages</div>
                </div>
            </div>
        </div>
    );
}

export default Welcome;