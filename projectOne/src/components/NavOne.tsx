import { Link, Outlet, BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { useEffect, useState, createContext} from 'react';
import HeroPage from './HeroPage';
import Login from './Login';
import HowItWorks from './HowItWorks';
import SignUp from './SignUp';
import Welcome from './Welcome';
import Search from './Search';
import Messages from './Messages';
import Gallery from './Gallery';
import Emotions from './Emotions';
import '../styles/navOne.css';

interface Props {
    isLoggedIn: boolean,
    setUserLogIn: React.Dispatch<React.SetStateAction<boolean>>,
}

interface ObjProps {
    id: number,
    username: string,
    email: string,
    password: string,
}

export const CurrentUser = createContext<ObjProps>({
    id: 0,
    username: '',
    email: '',
    password: '',
});

const NavOne: React.FC<Props> = ({ isLoggedIn, setUserLogIn }) => {
    const [getUserData, setUserData] = useState<ObjProps>({
        id: 0,
        username: '',
        password: '',
        email: '',
    });

    return (
        <>
            <BrowserRouter>
                {isLoggedIn ? 
                (<>
                    <div id="navTwoContainer">
                        <Link className="navTwoItem" to='welcome'>Home</Link>
                        <Link className="navTwoItem" to='search'>Search</Link>
                        <Link className="navTwoItem" to='messages'>Messages</Link>
                        <Link className="navTwoItem" to='gallery'>Gallery</Link>
                        <Link className="navTwoItem" to='emotions'>Emotions</Link>
                        <Link className="navTwoItem" to='lagout'>Lagout</Link>
                    </div>
                </>) : 
                (<>
                    <div id='navContainer'>
                        <Link id="navLogo" to='/'>LOGO</Link>
                        <div id="navLinks">
                            <Link id='home' to='/' >home</Link>
                            <Link id='howItWorks' to='howItWorks' >how it works</Link>
                            <Link id='loginCta' to='login' >login</Link>
                        </div> 
                    </div>     
                </>)}

                {/* <Outlet /> */}
                <CurrentUser.Provider value={getUserData}>
                <Routes>    
                    <Route>
                        {/* navOne routes */}
                        <Route path='/' element={<HeroPage />} />
                        <Route path='signUp' element={<SignUp />} />
                        <Route path='/signUp' element={<SignUp />} />
                        <Route path='howItWorks' element={<HowItWorks fromWhere='nav'/>} />
                        <Route path='login' element={<Login isLoggedIn={setUserLogIn} setUserSession={setUserData} />} />

                        {/* navTwo routes */}
                        <Route path="welcome" element={<Welcome />}></Route>
                        <Route path="search" element={<Search />}></Route>
                        <Route path="messages" element={<Messages />}></Route>
                        <Route path="gallery" element={<Gallery />}></Route>
                        <Route path="emotions" element={<Emotions />}></Route>
                        <Route path="lagout" element={<HeroPage />}></Route>
                    </Route>
                </Routes>
                </CurrentUser.Provider>
            </BrowserRouter>
        </>
    );
}

export default NavOne;