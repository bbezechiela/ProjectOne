import React, { useState, useContext, useEffect } from 'react';
import { CurrentUser } from './NavOne';
import '../styles/search.css';

interface MyObj {
    id: number,
    username: string,
    password: string,
    email: string,
}

const Search = () => {
    // getting user data from useContext
    const currentUserData = useContext(CurrentUser);

    // rekta nala since dri man gud ini maka pa rerender it component kay onetime la may changes (not sure)
    const [getCurrentUser,] = useState(currentUserData);
    const [getResponse, setResponse] = useState<MyObj[]>([]);
    const [getSearchValue, setSearchValue] = useState({
        searchValue: ''
    });

    // onchange on form inpunts
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e): void => {
        setSearchValue({
            searchValue: e.target.value
        });
    }
    console.log(getSearchValue);
    
    // form submission
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e): Promise<void> => {
        e.preventDefault();
        console.log('clicked');
        console.log(JSON.stringify(getSearchValue));
        
        try {
            const setter = await fetch('http://localhost:2020/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(getSearchValue)
            });
    
            const response = await setter.json();
            response.data ? setResponse(response.data) : setResponse(response.error);
        } catch (error) {
            console.log('error fetch in search', error);
        }
    }

    // send friend request
    const friendRequest = async (e: MyObj) => {
        // console.log('clicked friend request', JSON.stringify(e));
        try {
            const sendRequest = await fetch('http://localhost:2020/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({e, getCurrentUser})
            });

            const response = await sendRequest.json();
            console.log(response);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div id="searchOuterContainer">
                <div id="searchInnerContainer">
                    <form id="searchForm" method="post" onSubmit={handleSubmit}>
                        <input
                            id="searchInputField" 
                            type="text" 
                            name='searchField' 
                            placeholder='Find a friend' 
                            onChange={(e) => handleChange(e)}      
                        />
                        <input id="searchSubmitButton" type="submit" value="Search" />
                        {getResponse.length > 0 && getResponse.map((element, index) => (
                            <div id="searchResultContainer">
                                <div className="searchResult" key={index}>{element.username}</div>
                                <div className="addFriendButton" onClick={() => friendRequest(element)}>Add Friend</div>
                            </div>
                        ))}
                    </form>
                </div>
            </div>
        </>
    );
}

export default Search;