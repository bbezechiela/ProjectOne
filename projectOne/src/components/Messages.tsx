import React, { useEffect, useState, useRef } from 'react';
import { firebaseApp } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Props ,CurrentUser, MessageDetails, RequestDetails, ConversationCtnDetails, ReceiverDetails } from './Interfaces';
import Loader from './Loader';
import moment from 'moment';
import '../styles/messages.css';

let lastMessageTimestamp:string = '1999-12-12 12:12:12';
let firstRender = true;
let interval: any; 

const Messages: React.FC<Props> = ({ isLoggedIn }) => {
    const [currentUser, setCurrentUser] = useState<CurrentUser>();
    const [getMessageContent, setMessageContent]= useState({});
    const [getResponse, setResponse] = useState<RequestDetails[]>([]);
    const [showContainer, setShowContainer] = useState(false);
    // const [getConversationId, setConversationId] = useState<ConversationCtnDetails[]>([]);
    const [getConversationReceiver, setConversationReceiver] = useState<ReceiverDetails>();
    const [getMessages, setMessages] = useState<MessageDetails[]>([]);
    const [getMessageReceiver, setMessageReceiver] = useState({});
    const messageBody = useRef<HTMLDivElement | null>(null);
    const useNav = useNavigate();

    useEffect(() => {
        const auth = getAuth(firebaseApp);
        onAuthStateChanged(auth, (user) => {
            if (user !== null) {
                isLoggedIn(true);
                getter(user.uid);
                setCurrentUser({
                    uid: user.uid,
                    display_name: user.displayName,
                    email: user.email,
                    profile_path: user.photoURL
                });
                lastMessageTimestamp = '1999-12-12 12:12:12';
                console.log(lastMessageTimestamp);
                clearInterval(interval)
            } else {
                useNav('/', { replace: true });
            }
        });

        
        // ig first render kada visit
        firstRender = true;
    }, []);

    const getter = async (uid: string): Promise<void> => {
        const getter = await fetch('https://justforabeapi.onrender.com/getFriends', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({currentUser: uid}),
        });

        const response = await getter.json();
        if (response) setResponse(response.result);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => setMessageContent({messageContent: e.target.value});
    
    // send message
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e): Promise<void> => {
        e.preventDefault();
        
        const setter = await fetch('https://justforabeapi.onrender.com/sendMessage', {
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
        setMessageReceiver(messageReceiver);

        const checker = await fetch('https://justforabeapi.onrender.com/conversation', {
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
            setShowContainer(true);

            // console.log(response);
            let receiverUsername = response.message[0][0].conversation_name.split('-');
            for (let i in receiverUsername) {
                receiverUsername[i] = receiverUsername[i].replace('_', ' ');
            }

            console.log(receiverUsername[0] === currentUser?.display_name);
            receiverUsername[0] === currentUser?.display_name ? setConversationReceiver({conversation_receiver_name: receiverUsername[1]}) : setConversationReceiver({conversation_receiver_name: receiverUsername[0]});

            const conversation_id = response.message[0][0].conversation_id;
            
            // since it format it lastMessageTimestamp is naka ISO dapat nat ig convert to regular format gamit moment js
            interval = setInterval(() => {
                gettingMessagesPerTick(conversation_id);
            }, 3000);
        }
    }

    useEffect(() => {
        if (messageBody.current) messageBody.current.scrollTop = messageBody.current.scrollHeight;
        console.log(getMessages);
    }, [getMessages]);

    const gettingMessagesPerTick = async (conversation_id: ConversationCtnDetails[]): Promise<void> => {
            const date = moment(lastMessageTimestamp);
            const formatedDate = date.format('YYYY:MM:DD HH:mm:ss');
            // console.log('formated date', formatedDate);
            
            const getter = await fetch(`https://justforabe.onrender.com/getMessagesPerTick?lastMessageTimestamp=${formatedDate}&conversation_id=${conversation_id}`);
    
            const response = await getter.json();
            if (response) {
                // console.log(firstRender);
                if (firstRender === true) {
                    if (response.message.length !== 0) {
                        console.log('response', response.message);
                        setMessages(response.message);
                        firstRender = false;
                        lastMessageTimestamp = response.message[response.message.length - 1].message_timestamp;
                        // console.log('first render');
                     } 
                }  else if (response.message.length !== 0){
                    setMessages(prevState => [
                        ...prevState,
                        response.message[0]
                    ]);
                    // console.log('not first render');
                    lastMessageTimestamp = response.message[response.message.length - 1].message_timestamp;
                }
            };
    };

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
                            {getMessages.length !== 0 ? getMessages.map((element, index) => (
                                <>
                                    {element.message_receiver === currentUser?.uid ? 
                                        <div className='leftMessage' key={index}>{element.message_content}</div> 
                                    : 
                                        <div className='rightMessage' key={index}>{element.message_content}</div> 
                                    }
                                </>
                            )): <Loader />}                            
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