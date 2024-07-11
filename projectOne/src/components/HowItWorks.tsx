import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/howItWorks.css';

interface Props {
    selectedColor?: string,
    animateStatus?: boolean,
    fromWhere?: string,
}

const HowItWorks: React.FC<Props> = ({ selectedColor, animateStatus, fromWhere }) => {
    const [checkFirstQ, setFirstQ] = useState(false);
    const [checkSecondQ, setSecondQ] = useState(false);
    const [checkThirdQ, setThirdQ] = useState(false);
    const [checkFourthQ, setFourthQ] = useState(false);
    const [checkFifthQ, setFifthQ] = useState(false);
    const [getFromWhere, setFromWhere] = useState(fromWhere);

    useEffect(() => {
        setAnimate(animateStatus);
    }, [animateStatus]);

    useEffect(() => {
        setFromWhere(fromWhere);
    }, [fromWhere]);

    // sate na tikang heropage
    const [canAnimate, setAnimate] = useState(animateStatus);
    console.log(canAnimate);
    
    // panginano didi
    window.addEventListener('scroll', (): void => {
        const currentPosition: string = window.scrollY.toFixed();
        const converted: number = Number(currentPosition);
        console.log(currentPosition);
        
        converted > 430 ? setFirstQ(true) : setFirstQ(false);
        converted > 490 ? setSecondQ(true) : setSecondQ(false);
        converted > 530 ? setThirdQ(true) : setThirdQ(false);
        converted > 570 ? setFourthQ(true) : setFourthQ(false);
        converted > 610 ? setFifthQ(true) : setFifthQ(false);
    });

    return (
        <>
            <div id="outerContainer">
                <div 
                    id="overlayContainer"
                    style={{ 
                        backgroundColor: selectedColor 
                    }}
                    className={canAnimate ? 'executeAnimationn' : '' }
                    // onAnimationEnd={animationEnded}
                >how it works</div>
                <div id="imgContainer">
                    <img src="centerImg.png" alt="center image" />
                </div>
                {getFromWhere === 'nav' && (
                    <>
                        <div id="innerContainer">
                            <div className='classFromNav firstStepFromNav'>Register</div>
                            <div className='classFromNav secondStepFromNav'>Add friends</div>
                            <div className='classFromNav thirdStepFromNav'>Tell your emotion</div>
                            <div className='classFromNav fourthStepFromNav'>Share photos</div>
                            <div className='classFromNav fifthStepFromNav'>Create Conversations</div>
                            <Link id='getStarted' to='/signUp'>Get Started</Link>
                        </div>
                    </>
                )}
                {getFromWhere === 'home' && (
                    <>
                        <div id="innerContainer">
                            <div className={checkFirstQ ? 'firstStep' : 'noClassYet'}>Register</div>
                            <div className={checkSecondQ ? 'secondStep' : 'noClassYet'}>Add friends</div>
                            <div className={checkThirdQ ? 'thirdStep' : 'noClassYet'}>Tell your emotion</div>
                            <div className={checkFourthQ ? 'fourthStep' : 'noClassYet'}>Share photos</div>
                            <div className={checkFifthQ ? 'fifthStep' : 'noClassYet'}>Create Conversations</div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default HowItWorks;