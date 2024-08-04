import React, { useState, useEffect } from 'react';
import { firebaseApp } from '../firebase.js';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 
'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/signUp.css';

interface Props {
    selectedColor?: string,
    animateStatus?: boolean,
}

interface UserDetails {
    uid: string,
    displayName: string | null,
    email: string | null,
    profile_path: string | null
}

const SignUp: React.FC<Props> = ({ selectedColor, animateStatus }) => {
    const [getColor, ] = useState(selectedColor);
    const [canAnimate, setAnimate] = useState(animateStatus);
    const [userDetails, setUserDetails] = useState<UserDetails[]>([]);

    // firebase 
    const auth = getAuth(firebaseApp);

    const useNav = useNavigate();

    const provider = new GoogleAuthProvider();
    
    const googleSignIn = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                if (user !== null) {
                    setUserDetails([{
                        uid: user.uid,
                        displayName: user.displayName,
                        email: user.email,
                        profile_path: user.photoURL
                    }]);
                    createUserLocally();
                    useNav('welcome', { replace: true })
                }
            }).catch((error) => {
                console.log(error);
            });
    }

    const createUserLocally = async () => {
        const setter = await fetch('http://localhost:2020/demonode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userDetails)
        });

        const response = await setter.json();
        if (response) console.log(response);
    }

    useEffect(() => {
        setAnimate(animateStatus);
    }, [animateStatus]);

    return (
        <div 
            id="signUpOuterContainer"
            style={{ backgroundColor: getColor }}
            className={ canAnimate ? 'signUpAnimation' : ''}
        >
            <div id='imgContainer'>
                <img src="centerImg.png" alt="center image" />
            </div>
                <div id="googleSignUp" onClick={googleSignIn}>Sign up with Google</div>
        </div>
    );
}

export default SignUp;