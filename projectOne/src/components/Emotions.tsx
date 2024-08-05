import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseApp } from '../firebase';
import '../styles/comingSoon.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Emotions = () => {
    const useNav = useNavigate();

    useEffect(() => {
        const auth = getAuth(firebaseApp);
        onAuthStateChanged(auth, (user) => {
            console.log();
            if (user === null) {
                useNav('/', { replace: true });
            }
        });
    }, []);

    return (
        <div id='demoSoon'>
            <h1 id='demoSoonText'>Coming Soon! :))</h1>  
        </div>
    );
}

export default Emotions;