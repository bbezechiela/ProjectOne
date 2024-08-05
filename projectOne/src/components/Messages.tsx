import React, { useContext, useEffect, useState, useRef } from 'react';
import { firebaseApp } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { CurrentUser, MessageDetails, RequestDetails, ConversationCtnDetails, ReceiverDetails } from './Interfaces';
import '../styles/messages.css';

const Messages = () => {
    const [currentUser, setCurrentUser] = useState<CurrentUser>();
    const [getMessageContent, setMessageContent]= useState({});
    const [getResponse, setResponse] = useState<RequestDetails[]>([]);
    const [showContainer, setShowContainer] = useState(false);
    const [getConversation, setConversation] = useState<ConversationCtnDetails[]>([]);
    const [getConversationReceiver, setConversationReceiver] = useState<ReceiverDetails>();
    const [getMessages, setMessages] = useState<MessageDetails[]>([]);
    const [getMessageReceiver, setMessageReceiver] = useState({});
    const messageBody = useRef<HTMLDivElement | null>(null);
    // const [demoGetter, demoSetter] = useState<HTMLDivElement>(null);
    const useNav = useNavigate();

    useEffect(() => {
        const auth = getAuth(firebaseApp);
        onAuthStateChanged(auth, (user) => {
            if (user !== null) {
                getter(user.uid);
                setCurrentUser({
                    uid: user.uid,
                    display_name: user.displayName,
                    email: user.email,
                    profile_path: user.photoURL
                });
            } else {
                useNav('/', { replace: true });
            }
        });
    }, []);

    const getter = async (uid: string): Promise<void> => {
        const getter = await fetch('http://localhost:2020/getFriends', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({currentUser: uid}),
        });

        const response = await getter.json();
        if (response) setResponse(response.result);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void =>  setMessageContent({messageContent: e.target.value});
    
    // send message
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e): Promise<void> => {
        e.preventDefault();
        
        const setter = await fetch('http://localhost:2020/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({currentUser, getMessageContent, getMessageReceiver})
        });

        const response = await setter.json();
        if (response) console.log(response);
    }

    const selectConversation = async (messageReceiver: RequestDetails): Promise<void> => {
        setShowContainer(true);
        setMessageReceiver(messageReceiver);
        
        const checker = await fetch('http://localhost:2020/conversation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({
                currentUser,
                messageReceiver,
            }),
        });

        const response = await checker.json();
        if (response) {
            console.log(response);
            let receiverUsername = response.message[0][0].conversation_name.split('-');
            for (let i in receiverUsername) {
                receiverUsername[i] = receiverUsername[i].replace('_', ' ');
            }

            console.log(receiverUsername[0] === currentUser?.display_name);
            receiverUsername[0] === currentUser?.display_name ? setConversationReceiver({conversation_receiver_name: receiverUsername[1]}) : setConversationReceiver({conversation_receiver_name: receiverUsername[0]});

            setConversation(response.message[0]);
            setMessages(response.message[1]);
        }
    }
        
    useEffect(() => {
        if (messageBody.current) messageBody.current.scrollTop = messageBody.current.scrollHeight;
        console.log(getConversationReceiver);
    }, [getMessages]);

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
                                onClick={() => selectConversation(element)}
                            >
                                <div style={{ backgroundImage: `url(${element.profile_path})` }} className="conversationProfile">
                                </div>
                                <div className='conversationUsername'>{element.display_name}</div>   
                            </div>
                        )) :
                        <div>you need friends :)</div>
                    }
                </div>
                {showContainer &&
                    <div id='messagesSectionTwo'>
                        <div id="messagesHeader">
                            <div className='conversationReceiverName'>{getConversationReceiver?.conversation_receiver_name}</div>
                        </div>
                        <div id="messagesBody" ref={messageBody}>
                            {getMessages.length !== 0 ? getMessages.map((element) => (
                                <>
                                    {element.message_receiver === currentUser?.uid ? 
                                        <div className='leftMessage'>{element.message_content}</div> 
                                    : 
                                        <div className='rightMessage'>{element.message_content}</div> 
                                    }
                                </>
                            )): ''}                            
                        </div>
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
                }
            </div>
        </div>
    )
}

export default Messages;