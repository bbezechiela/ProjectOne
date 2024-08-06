import React, { useState, useEffect, createContext } from 'react';
import { firebaseApp } from '../firebase';
import { IdTokenResult, getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/signIn.css';

interface UserDetails {
    // id: number,
    // token: Promise<IdTokenResult>,
    uid: string | null,
    displayName: string | null,
    email: string | null,
    profile_path: string | null,
}

interface Props {
    isLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,  
    setUserSession?: React.Dispatch<React.SetStateAction<UserDetails>>,
}

const Login: React.FC<Props> = ({ isLoggedIn, setUserSession }) => {

    // initialize useNavigate, it return it useNav kay function with two parameters
    const useNav = useNavigate();

    // firebase
    const auth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();
    
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider).then((result) => {
            // use credential if needed, ada it access token para makag work with other google api's
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const user = result.user;
            if (user !== null) {
                console.log(user);
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
    }

    const createUserLocally = async ({uid, displayName, email, profile_path}: UserDetails): Promise<void> => {
        const setter = await fetch('http://localhost:2020/demonode', {
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
        if (response) console.log(response);
    }

    return  <div id="googleSignUp" onClick={signInWithGoogle}>Sign in with Google</div>
}

export default Login;