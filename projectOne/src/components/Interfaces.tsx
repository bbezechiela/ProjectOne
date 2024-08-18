
export interface CurrentUser {
    uid: string,
    display_name: string | null,
    profile_path: string | null,
    email: string | null
}

export interface MessageDetails {
    message_id: number,
    message_content: string,
    message_sender: string,
    message_receiver: string,
    conversation_id: number,
    message_timestamp: string,
}

export interface RequestDetails {
    uid: string,
    display_name: string | undefined,
    email: string | null,
    profile_path: string | null,
    request_id: number,
    request_sender: number,
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void,
}

export interface ConversationCtnDetails {
    conversation_id: number,
}

// for messaging usage
export interface ReceiverDetails {
    conversation_receiver_name: string,
}

// for nav
export interface Props {
    isLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,  
    setUserSession?: React.Dispatch<React.SetStateAction<CurrentUser>>,
    windowWidth?: number
}

// for search interface
export interface SearchInterface {
    windowWidth: number;
}

// loader
export interface LoaderProps {
    fromWhere: string,
}

