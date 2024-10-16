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
                // console.log(lastMessageTimestamp);
                clearInterval(interval)
            } else {
                useNav('/', { replace: true });
            }
        });

        // ig first render kada visit
        firstRender = true;
    }, []);

    const getter = async (uid: string): Promise<void> => {
        // https://justforabeapi.onrender.com/getFriends
        const getter = await fetch(`http://localhost:2020/getFriends?current_user=${uid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const response = await getter.json();
        if (response) setResponse(response.result);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => setMessageContent({messageContent: e.target.value});
    
    // send message
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e): Promise<void> => {
        e.preventDefault();
        
        // https://justforabeapi.onrender.com/sendMessage
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
        setMessageReceiver(messageReceiver);
    
        // https://justforabeapi.onrender.com/conversation
        const checker = await fetch(`http://localhost:2020/conversation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({currentUser, messageReceiver})
        });
        
        const response = await checker.json();
        if (response) {
            setShowContainer(true);
            
            console.log(response);
            let receiverUsername = response.message[0][0].conversation_name.split('-');
            for (let i in receiverUsername) {
                receiverUsername[i] = receiverUsername[i].replace('_', ' ');
            }

            // console.log(receiverUsername[0] === currentUser?.display_name);
            receiverUsername[0] === currentUser?.display_name ? setConversationReceiver({conversation_receiver_name: receiverUsername[1]}) : setConversationReceiver({conversation_receiver_name: receiverUsername[0]});

            const conversation_id = response.message[0][0].conversation_id;
            
            // since it format it lastMessageTimestamp is naka ISO format dapat nat ig convert to regular format gamit moment js
            interval = setInterval(() => {
                gettingMessagesPerTick(conversation_id);
                // na result hin pending promise
                // console.log(gettingMessagesPerTick(conversation_id));
                console.log('ticking');
            }, 500);
        }
    }

    useEffect(() => {
        if (messageBody.current) messageBody.current.scrollTop = messageBody.current.scrollHeight;
    }, [getMessages]);

    const gettingMessagesPerTick = async (conversation_id: ConversationCtnDetails[]): Promise<void> => {
            const date = moment(lastMessageTimestamp);
            const formatedDate = date.format('YYYY:MM:DD HH:mm:ss');
            
            console.log(formatedDate);

            // https://justforabeapi.onrender.com/getMessagesPerTick?lastMessageTimestamp=${formatedDate}&conversation_id=${conversation_id}
            const getter = await fetch(`http://localhost:2020/getMessagesPerTick?lastMessageTimestamp=${formatedDate}&conversation_id=${conversation_id}`);
    
            const response = await getter.json();
            if (response) {
                if (firstRender === true) {
                    if (response.message.length !== 0) {
                        setMessages(response.message);
                        firstRender = false;
                        lastMessageTimestamp = response.message[response.message.length - 1].message_timestamp;
                     } 
                } else if (response.message.length !== 0){
                    setMessages(prevState => [
                        ...prevState,
                        response.message[0]
                    ]); 
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