import React, { useState, useEffect } from 'react';
import '../styles/signUp.css';
import firebaseApp from '../firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

interface Props {
    isLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,  
}

const Login: React.FC<Props> = ({ isLoggedIn }) => {
    const [isLogged, setLogin] = useState(false);
    const [getFormData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const useNav = useNavigate();

    // firebase
    const auth = getAuth(firebaseApp);

    const formChanges: React.ChangeEventHandler<HTMLInputElement> = (e): void => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    // return to this part pag ma explore na ha auth gamit an Firebase SDK auth
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e): Promise<void> => {
        e.preventDefault();
        console.log(getFormData);

        signInWithEmailAndPassword(auth, getFormData.email, getFormData.password)
            .then((userCredentials) => {
                console.log(userCredentials.user);
            }).catch((error) => console.log(error));
        
        try {
            const getter = await fetch('http://localhost:2020/getCredentials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: getFormData.email,
                    password: getFormData.password,
                })
            });
    
            const response = await getter.json();
            if (response) {
                console.log(response);
                // setLogin(true);
                useNav('/welcome', { replace: true });
                isLoggedIn(true);
            } else {
                console.log('may error');
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            {/* <NavOne status={false}/> */}
            <div 
                id="signUpOuterContainer"
            >
                <div id='imgContainer'>
                    <img src="centerImg.png" alt="center image" />
                </div>
                <form id='signUpFormContainer' method='post' onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name='username' 
                        placeholder='username'
                        onChange={(e) => formChanges(e)}
                    />
                    <input 
                        type="text" 
                        name='email' 
                        placeholder='email' 
                        onChange={(e) => formChanges(e)} 
                    />
                    <input 
                        type="password" 
                        name='password' 
                        placeholder='password' 
                        onChange={(e) => formChanges(e)}
                    />
                    <input id='signUpButton' type="submit" value="Login" />
                    <div>Does not have an account? <span id='loginLinkSignUp'><a href="#">Sign up</a></span></div>
                    <div id='or'>or</div>
                    <div id="googleSignUp">Login with Google</div>
                </form>
            </div>
        </>
    );
}

export default Login;