import { useEffect, useState, useContext } from "react";
import { CurrentUser } from "./NavOne";
import Search from "./Search";
import '../styles/welcome.css';

const Welcome = () => {
    const currentUserData = useContext(CurrentUser);
    const [getUserDetails, ] = useState(currentUserData);
    const [getColors, ] = useState([{color: '#F7D358', name: 'Joy'}, {color: '#4ECDC4', name: 'Sadness'}, {color: '#EAD1DC', name: 'Fear'}, {color: '#D9382F', name: 'Anger'}, {color: '#9EADBA', name: 'Disgust'}]);

    useEffect(() => {
        console.log(currentUserData);
    }, []);

    return (
        <div id='welcomeOuterContainer'>
            <div id="welcomeInnerContainer">
                <div id="welcomeTextContainer">
                    <div id='welcomeText'>Welcome, {getUserDetails.username} :) </div>
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
                        <div id="welcomeRequestss">Requests {'(5)'}</div>
                        <div id="welcomeFriends">Friends {'(2)'}</div>
                    </div>
                    <div id="welcomeMessagesContainer">messages</div>
                </div>
            </div>
        </div>
    );
}

export default Welcome;