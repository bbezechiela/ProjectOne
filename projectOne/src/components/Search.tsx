import React, { useState, useEffect } from 'react';
// import { CurrentUser } from './NavOne';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseApp } from '../firebase';
import { SearchInterface } from './Interfaces';
import '../styles/search.css';

interface MyObj {
    uid: string,
    display_name: string | null,
    email: string | null,
    profile_path: string | null,
}

const Search: React.FC<SearchInterface> = ({ windowWidth }) => {
    const [currentUser, setCurrentUser] = useState<MyObj[]>([]);
    const [getNumberOfFriends, ] = useState<MyObj[]>([]);
    const [getResponse, setResponse] = useState<MyObj[]>([]);
    // const [getWindowWidth, ] = useState<number>(windowWidth);
    const [getSearchValue, setSearchValue] = useState({
        searchValue: ''
    });
    
    useEffect(() => {
        const auth = getAuth(firebaseApp);
        
        onAuthStateChanged(auth, (user) => {
            if (user !== null) {
                // console.log(user);
                setCurrentUser([{
                    uid: user.uid,
                    display_name: user.displayName,
                    email: user.email, 
                    profile_path: user.photoURL
                }])
    
            }
        });
        
    }, []);
    
    // onchange on form inpunts
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e): void => {
        setSearchValue({
            searchValue: e.target.value
        });
    }
    
    // form submission
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e): Promise<void> => {
        e.preventDefault();
        
        try {
            const setter = await fetch('https://justforabeapi.onrender.com/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({getSearchValue, currentUser})
            });
    
            const response = await setter.json();
            // console.log(response);
            response.data ? setResponse(response.data) : setResponse(response.error);
        } catch (error) {
            console.log('error fetch in search');
        }
    }

    // onclick remove element
    const removeSearchResult = (index: number): void => {
        const allResponses = [...getResponse];
        allResponses.splice(index, 1);
        setResponse(allResponses);
    }

    // send friend request
    const friendRequest = async (e: MyObj, index: number): Promise<void> => {
        if (getNumberOfFriends.length <= 20) {
            const sendRequest = await fetch('https://justforabeapi.onrender.com/sendRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({e, currentUser})
            });

            const response = await sendRequest.json();
            if (response) {
                const removeResponse = [...getResponse];
                removeResponse.splice(index, 1);
                setResponse(removeResponse);
            }
        } else {
            "you got no slot for a new friend :))";
        }
    }

    return (
        <form id='searchForm' method="post" onSubmit={handleSubmit}>
            <div id='formSectionOne'>
                <input
                    id='searchInputField' 
                    type="text" 
                    name='searchField' 
                    placeholder='Find a close friend :)' 
                    onChange={(e) => handleChange(e)}      
                />

                <input id='searchSubmitButton' type="submit" value="Search" />
            </div>
            {getResponse.length !== 0 && getResponse.map((element, index) => (
                <div id="searchResultContainer">
                    <div id="searchResult" key={index}>{element.display_name}</div>
                    {element.display_name == 'Cant find any user' ? '' : 
                        <div className='addFriendButton'>
                            {element.hasOwnProperty('request_id') ? 
                            <div className='addFriendButton'>Friends</div> : 
                            <div className='addFriendButton' onClick={() => friendRequest(element, index)}>Add Friend</div>} 
                        </div>}
                    <div id="closeSearchResult" onClick={() => removeSearchResult(index)}>X</div>
                </div>
            ))}
        </form>
    );
}

export default Search;
