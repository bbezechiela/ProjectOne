import React, { useContext, useEffect, useState } from 'react';
import { CurrentUser } from './NavOne';
import '../styles/messages.css';

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

const Messages = () => {
    const currentUserDetails = useContext(CurrentUser); 
    const [getCurrentUser, ] = useState(currentUserDetails);
    const [getMessageContent, setMessageContent]= useState({});
    const [getResponse, setResponse] = useState<RequestDetails[]>([]);
    const [getConversation, setConversation] = useState(false);
    const [getMessageReceiver, setMessageReceiver] = useState({});

    useEffect(() => {
        (async () => {
            const getter = await fetch('http://localhost:2020/getFriends', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(getCurrentUser),
            });

            const response = await getter.json();
            if (response) setResponse(response.result);
        })();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void =>  setMessageContent({messageContent: e.target.value});
    
    // send message
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e): Promise<void> => {
        e.preventDefault();
        
        const setter = await fetch('http://localhost:2020/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({getCurrentUser, getMessageContent, getMessageReceiver})
        });

        const response = await setter.json();
        if (response) console.log(response);
    }

    const selectConversation = async (e: RequestDetails): Promise<void> => {
        setConversation(true);
        const checker = await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({

            }),
        });

        const response = await checker.json();
        if (response) console.log(response);
    }

    return (
        <div id='messagesOuterContainer'>
            <div id="messagesInnerContainer">
                <div id="messagesText">Messages</div>
                <div id="messagesSectionOne">
                    {getResponse.length !== 0 ? 
                        getResponse.map((element, index) => (
                            <div 
                                key={index}
                                className="conversationContainer"
                                onClick={() => {
                                    setConversation(true);
                                    setMessageReceiver(element)
                                }}
                            >
                                <div className="conversationProfile"></div>
                                <div className='conversationUsername'>{element.username}</div>   
                            </div>
                        )) :
                        <div>you need friends :)</div>
                    }
                </div>
                {getConversation ? 
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
                : ''}
            </div>
        </div>
    )
}

export default Messages;