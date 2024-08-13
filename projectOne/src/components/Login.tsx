import React from 'react';
import { firebaseApp } from '../firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Props } from './Interfaces';
import '../styles/signIn.css';

interface UserDetails {
    // id: number,
    // token: Promise<IdTokenResult>,
    uid: string | null,
    displayName: string | null,
    email: string | null,
    profile_path: string | null,
}

const Login: React.FC<Props> = ({ isLoggedIn }) => {

    // initialize useNavigate, it return it useNav kay function with two parameters
    const useNav = useNavigate();

    // firebase
    const auth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();
    
    const signInWithGoogle = () => {
        setPersistence(auth, browserSessionPersistence)
        .then(async () => {
            return await signInWithPopup(auth, provider).then((result) => {
                // use credential if needed, ada it access token para makag work with other google api's
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                const user = result.user;
                if (user !== null) {
                    // console.log(user);
                    createUserLocally({
                        uid: user.uid,
                        displayName: user.displayName,
                        email: user.email,
                        profile_path: user.photoURL
                    })
                    isLoggedIn(true);
                    useNav('/welcome', { replace: true });
                } else {
                    useNav('/', { replace: true });
                }
            });
        })
        .catch(error => console.log(error.message));
    }

    const createUserLocally = async ({uid, displayName, email, profile_path}: UserDetails): Promise<void> => {
        const setter = await fetch('https://justforabeapi.onrender.com/demonode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uid: uid,
                displayName: displayName,
                email: email,
                profile_path: profile_path
            })
        });

        const response = await setter.json();
        if (response) console.log('login succesfully');
    }

    return  <div id="googleSignUp" onClick={signInWithGoogle}>Sign in with Google</div>
}

export default Login;