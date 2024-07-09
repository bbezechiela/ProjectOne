import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/hero.css';
import HowItWorks from './HowItWorks';
import SignUp from './SignUp';
import Footer from './Footer';

const HeroPage = () => {
    const [getColor, ] = useState('var(--firstColor)');
    const [shouldAnimate, setAnimate] = useState(false);
    
    // pag mag end it animations
    const animationEnded = (): void => {
        console.log('animation ended');
        setAnimate(false);
    }
    
    // every ma click hin new emotions
    const changeEmotion = (e: string): void => {
        const r = document.querySelector(':root') as any;
        const rs = getComputedStyle(r);
        console.log(rs.getPropertyValue('--firstColor'));
        r.style.setProperty('--secondColor', rs.getPropertyValue('--firstColor'));

        r.style.setProperty('--firstColor', e);
        console.log('updated color', e);
    }

    return (
        <>  
            <div 
                id="heroContainer"
                style={{
                    backgroundColor: getColor
                }}
                className={shouldAnimate ? 'executeAnimation' : ''}
                onAnimationEnd={animationEnded}
            >
                <div id="upperContainer">
                    <div id="heroText">just for abe.</div>
                    <div id="heroSubText">let your abe know what you feel.</div>
                    <Link id='heroCta' to='signUp'>Sign up</Link>
                </div>
                <div id="lowerContainer">
                    <div 
                        id='emotionOne' 
                        className="emotions" 
                        onClick={() => {
                            // setColor('#F7D358');
                            setAnimate(true);
                            changeEmotion('#F7D358');
                        }}
                    >Joy</div>

                    <div 
                        id='emotionTwo' 
                        className="emotions"
                        onClick={() => {
                            setAnimate(true);
                            changeEmotion('#4ECDC4')
                        }}
                    >Sadness</div>
                    
                    <div 
                        id='emotionThree' 
                        className="emotions"
                        onClick={() => {
                            setAnimate(true);
                            changeEmotion('#EAD1DC');
                        }}
                    >Fear</div>
                    
                    <div 
                        id='emotionFour' 
                        className="emotions"
                        onClick={() => {
                            setAnimate(true);
                            changeEmotion('#D9382F'); 
                        }}
                    >Anger</div>
                    
                    <div 
                        id='emotionFive' 
                        className="emotions"
                        onClick={() => {
                            setAnimate(true);
                            changeEmotion('#9EADBA');
                        }}
                    >Disgust</div>
                </div>
            </div>
            <HowItWorks selectedColor={getColor} animateStatus={shouldAnimate} fromWhere='home'/>
            <SignUp selectedColor={getColor} animateStatus={shouldAnimate} />
            <Footer />
        </>
    );
}

export default HeroPage;