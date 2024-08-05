import React, { useEffect, useRef, useState } from 'react';
import SignIn from './SignIn';
import '../styles/howItWorks.css';

interface Props {
    selectedColor: string
    animateStatus: boolean
    fromWhere: string,
}

const HowItWorks: React.FC<Props> = ({ selectedColor, animateStatus, fromWhere }) => {
    const [getFromWhere, setFromWhere] = useState(fromWhere);

    useEffect(() => {
        setAnimate(animateStatus);
        setFromWhere(fromWhere);
    }, [animateStatus]);

    // sate na tikang heropage
    const [canAnimate, setAnimate] = useState(animateStatus);
    console.log(canAnimate);

    return (
        <div id="howItWorksOuterContainer">
            <div id="howItWorksUpperContainer">
                <div id="howItWorksText">how it works</div>
            </div>
            {/* <div id="imgContainer"> */}
                {/* <img src="centerImg.png" alt="center image" /> */}
            {/* </div> */}
            <div id="howItWorksLowerContainer">
                <div className='heroSteps'>sign in</div>
                <div className='heroSteps'>add a close friend :)</div>
                <div className='heroSteps'>make conversations</div>
                <div className='heroSteps'>set your emotion</div>
                <div className='heroSteps'>share photos</div>
                <SignIn />
            </div>
        </div>
    );
}

export default HowItWorks;