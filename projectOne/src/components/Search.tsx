import React, { useState } from 'react';
import '../styles/search.css';

interface MyObj {
    id: string,
    username: string,
    password: string,
    email: string
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
            if (response) {
                console.log(response);
                setResponse(response);
            }
            
        } catch (error) {
            console.log('error fetch in search', error);
        }
    }

    return (
        <>
            <div id="searchOuterContainer">
                <div id="searchInnerContainer">
                    <form method="post" onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            name='searchField' 
                            placeholder='Find a friend' 
                            onChange={(e) => handleChange(e)}      
                        />
                        <input type="submit" value="Search" />
                    </form>
                    {getResponse.map((element, index) => (
                        <div key={index}>{element.username}</div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Search;