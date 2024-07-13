import React, { useState } from 'react';
import '../styles/search.css';

interface MyObj {
    id: number,
    username: string,
    password: string,
    email: string,
}

const Search = () => {
    const [getSearchValue, setSearchValue] = useState({
        searchValue: ''
    });

    const [getResponse, setResponse] = useState<MyObj[]>([]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e): void => {
        setSearchValue({
            searchValue: e.target.value
        });
    }
    console.log(getSearchValue);
    

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
                                <div className="addFriendButton">Add Friend</div>
                            </div>
                        ))}
                    </form>
                </div>
            </div>
        </>
    );
}

export default Search;