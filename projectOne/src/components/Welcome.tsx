import { useEffect, useState, useContext } from "react";
import { CurrentUser } from "./NavOne";
import Search from "./Search";
import { firebaseApp } from "../firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import '../styles/welcome.css';

const customFunction = async (url: string, userDetails: object): Promise<object> => {
    const getter = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }, body: JSON.stringify(userDetails)
    });

    const response = await getter.json();
    return response.result;
};

const Welcome = () => {
    const currentUserData = useContext(CurrentUser);
    const [getUserDetails, ] = useState(currentUserData);
    const [getNumberOfRequsts, setNumberOfRequests]: any = useState([]);
    const [getNumberOfFriends, setNumberOfFriends]: any = useState([]);
    const [getColors, ] = useState([{color: '#F7D358', name: 'Joy'}, {color: '#4ECDC4', name: 'Sadness'}, {color: '#EAD1DC', name: 'Fear'}, {color: '#D9382F', name: 'Anger'}, {color: '#9EADBA', name: 'Disgust'}]);

    const useNav =  useNavigate();
    
    const redirectComponent = (url: string): void => useNav(url, { replace: true });
    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;
    
    useEffect(() => {
        if (user == null) {
            useNav('/', { replace: true });
        }

    }, []);
    // console.log(currentUserData);
    // (async () => {
    //     const getRequest = await customFunction('http://localhost:2020/getRequests', getUserDetails);
    //     setNumberOfRequests(getRequest);

    //     const getFriends = await customFunction('http://localhost:2020/getFriends', getUserDetails);
    //     setNumberOfFriends(getFriends);
    // })();

    return (
        <div id='welcomeOuterContainer'>
            <div id="welcomeInnerContainer">
                <div id="welcomeTextContainer">
                    <div id='welcomeText'>Welcome, {user?.displayName} :)</div>
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
                        <div id="welcomeRequestss" onClick={() => redirectComponent('/requests')}>Requests {`(${getNumberOfRequsts.length})`}</div>
                        <div id="welcomeFriends" onClick={() => redirectComponent('/friends')}>Friends {`(${getNumberOfFriends.length})`}</div>
                    </div>
                    <div id="welcomeMessagesContainer" onClick={() => redirectComponent('/messages')}>messages</div>
                </div>
            </div>
        </div>
    );
}

export default Welcome;