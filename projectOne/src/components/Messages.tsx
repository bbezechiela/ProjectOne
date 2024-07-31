import React, { useContext, useEffect, useState, useRef } from 'react';
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

interface ConversationCtnDetails {
    conversation_id: number,
    conversation_name: string,
    conversation_timestamp: string,
}

interface ReceiverDetails {
    conversation_receiver_name: string,
}

interface MessageDetails {
    message_id: number,
    message_content: string,
    message_sender: number,
    message_receiver: number,
    conversation_id: number,
    message_timestamp: string,
}

const Messages = () => {
    const currentUserDetails = useContext(CurrentUser); 
    const [getCurrentUser, ] = useState(currentUserDetails);
    const [getMessageContent, setMessageContent]= useState({});
    const [getResponse, setResponse] = useState<RequestDetails[]>([]);
    const [showContainer, setShowContainer] = useState(false);
    const [getConversation, setConversation] = useState<ConversationCtnDetails[]>([]);
    const [getConversationReceiver, setConversationReceiver] = useState<ReceiverDetails[]>([]);
    const [getMessages, setMessages] = useState<MessageDetails[]>([]);
    const [getMessageReceiver, setMessageReceiver] = useState({});
    const messageBody = useRef<HTMLDivElement | null>(null);
    // const [demoGetter, demoSetter] = useState<HTMLDivElement>(null);

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

    const selectConversation = async (messageReceiver: RequestDetails): Promise<void> => {
        setShowContainer(true);
        setMessageReceiver(messageReceiver);
        
        const checker = await fetch('http://localhost:2020/conversation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({
                getCurrentUser,
                messageReceiver,
            }),
        });

        const response = await checker.json();
        if (response) {
            // console.log(response);
            let receiverUsername = response.message[0][0].conversation_name.split('_');
            receiverUsername[0] === getCurrentUser.username ? setConversationReceiver([{conversation_receiver_name: receiverUsername[1]}]) : setConversationReceiver([{conversation_receiver_name: receiverUsername[0]}]);

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
                                <div className="conversationProfile"></div>
                                <div className='conversationUsername'>{element.username}</div>   
                            </div>
                        )) :
                        <div>you need friends :)</div>
                    }
                </div>
                {showContainer &&
                    <div id='messagesSectionTwo'>
                        <div id="messagesHeader">
                            {getConversationReceiver.length !== 0 && getConversationReceiver.map((element) => (
                                <div className='conversationReceiverName'>{element.conversation_receiver_name}</div>
                            ))}
                        </div>
                        <div id="messagesBody" ref={messageBody}>
                            {getMessages.length !== 0 ? getMessages.map((element) => (
                                <>
                                    {element.message_receiver === getCurrentUser.id ? 
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