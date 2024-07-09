import React, { useState, useEffect } from 'react';
import '../styles/signUp.css';

interface Props {
    selectedColor?: string,
    animateStatus?: boolean,
}

const SignUp: React.FC<Props> = ({ selectedColor, animateStatus }) => {
    const [getColor, ] = useState(selectedColor);
    const [canAnimate, setAnimate] = useState(animateStatus);

    const [getFormData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const formChanges: React.ChangeEventHandler<HTMLInputElement> = (e): void => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e): Promise<void> => {
        e.preventDefault();
        console.log(getFormData);

        try {
            const setter = await fetch('http://localhost:2020/demonode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify(getFormData)
            });
    
            const response = await setter.json();
            if (response) {
                console.log(response);
            } else {
                console.log('may error');
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        setAnimate(animateStatus);
    }, [animateStatus]);

    return (
        <>
            <div 
                id="signUpOuterContainer"
                style={{ backgroundColor: getColor }}
                className={ canAnimate ? 'signUpAnimation' : ''}
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
                    <input id='signUpButton' type="submit" value="Sign up" />
                    <div>Already have an account? <span id='loginLinkSignUp'><a href="#">Login</a></span></div>
                    <div id='or'>or</div>
                    <div id="googleSignUp">Sign up with Google</div>
                </form>
            </div>
        </>
    );
}

export default SignUp;