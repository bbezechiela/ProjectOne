import { useContext } from 'react';
import { CurrentUser } from "./NavOne";


const Emotions = () => {
    const showCurrentUserData = useContext(CurrentUser);

    console.log(showCurrentUserData);

    return (
        <>
            <h1>Emotions</h1>  
        </>
    );
}

export default Emotions;