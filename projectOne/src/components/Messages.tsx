import React, { useContext, useEffect, useState } from 'react';
import { CurrentUser } from './NavOne';
import '../styles/messages.css';
import { logEvent } from 'firebase/analytics';

const Messages = () => {
    const currentUserDetails = useContext(CurrentUser); 
    const [getCurrentUser, ] = useState(currentUserDetails);
    const [getMessageContent, setMessageContent] = useState({});

    useEffect(() => {

    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void =>  setMessageContent({messageContent: e.target.value});
    
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e): Promise<void> => {
        e.preventDefault();
        
        const setter = await fetch('http://localhost:2020/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({getCurrentUser, getMessageContent})
        });

        const response = await setter.json();
        if (response) console.log(response);
    }

    return (
        <div id='messagesOuterContainer'>
            <div id="messagesInnerContainer">
                <div id="messagesText">Messages</div>
                <div id="messagesSectionOne">

                </div>
                <div id="messagesSectionTwo">
                    <div id="messagesHeader"></div>
                    <div id="messagesBody"></div>
                    <form id="messagesForm" onSubmit={handleSubmit}>
                        <input 
                            id='messageInputField'
                            type="text"
                            placeholder='Message...' 
                            name='message'
                            onChange={(e) => handleChange(e)}
                        />
                        <input id='messageSubmitButton' type="submit" value='Send :)'/>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Messages;