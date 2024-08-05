import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseApp } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import '../styles/comingSoon.css';

const Gallery = () => {
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
            <div id='demoSoonText'>Coming soon! :))</div>
        </div>
    );
}

export default Gallery;