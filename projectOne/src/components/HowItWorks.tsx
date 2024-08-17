import React, { useEffect, useState } from 'react';
import '../styles/howItWorks.css';

interface Props {
    selectedColor: string
    animateStatus: boolean
    fromWhere?: string,
}

const HowItWorks: React.FC<Props> = ({ selectedColor, animateStatus }) => {
    const [canAnimate, setAnimate] = useState(animateStatus);
    const [animationEnded, setAnimationEnded] = useState<boolean>();
    
    useEffect(() => {
        setAnimate(animateStatus);
    }, [animateStatus]);

    const demoFunction = () => {
        setTimeout(() => {
            setAnimationEnded(true);
        }, 3000)
    }

    return (
        <div id="howItWorksOuterContainer"
            style={animationEnded ? {backgroundColor: selectedColor } : {}}
            className={canAnimate ? 'executeAnimationn': ''}
            onAnimationStart={demoFunction}
        >
            <div id="howItWorksUpperContainer">
                <div id="howItWorksText">how it works</div>
            </div>
            <div id="howItWorksLowerContainer">
                <div className='heroSteps'>sign in</div>
                <div className='heroSteps'>add a close friend :)</div>
                <div className='heroSteps'>make conversations</div>
                <div className='heroSteps'>set your emotion</div>
                <div className='heroSteps'>share photos</div>
                {/* <SignIn /> */}
            </div>
        </div>
    );
}

export default HowItWorks;