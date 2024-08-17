import { useState, useEffect } from 'react';
import { Props } from './Interfaces';
import HowItWorks from './HowItWorks';
import Footer from './Footer';
import Login from './Login';
import '../styles/hero.css';

const HeroPage: React.FC<Props> = ({ isLoggedIn }) => {
    const [getColor, ] = useState('var(--firstColor)');
    const [shouldAnimate, setAnimate] = useState(false);
    const [getWindowWidth, setWindowWidth] = useState<number>(0);

    // pag mag end it animations
    const animationEnded = (): void => {
        console.log('animation ended');
        setAnimate(false);
    }

    // console.log(window.innerWidth);

    useEffect(() => {
        setWindowWidth(window.innerWidth);        
    }, []);

    // every ma click hin new emotions
    const changeEmotion = (e: string): void => {
        const r = document.querySelector(':root') as any;
        const rs = getComputedStyle(r);
        console.log(rs.getPropertyValue('--firstColor'));
        r.style.setProperty('--secondColor', rs.getPropertyValue('--firstColor'));

        r.style.setProperty('--firstColor', e);
        // console.log('updated color', e);
        console.log(getWindowWidth);
    }

    return (
        <div id='heroPageContainer'>  
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
                    <Login windowWidth={getWindowWidth} isLoggedIn={isLoggedIn}/>
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
            <HowItWorks selectedColor={getColor} animateStatus={shouldAnimate} />
            {/* <SignUp selectedColor={getColor} animateStatus={shouldAnimate} /> */}
            <Footer />
        </div>
    );
}

export default HeroPage;