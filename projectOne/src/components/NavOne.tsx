import { Link, Outlet, BrowserRouter, Route, Routes } from 'react-router-dom';
import HeroPage from './HeroPage';
import Login from './Login';
import '../styles/navOne.css';
import HowItWorks from './HowItWorks';
import SignUp from './SignUp';

const NavOne = () => {
    return (
        <BrowserRouter>
            <div id='navContainer'>
                <Link id="navLogo" to='/'>LOGO</Link>
                <div id="navLinks">
                    <Link id='home' to='/' >home</Link>
                    <Link id='howItWorks' to='howItWorks' >how it works</Link>
                    <Link id='loginCta' to='login' >login</Link>
                </div> 
            </div>     
            {/* <Outlet /> */}
            <Routes>
                <Route>
                    <Route path='/' element={<HeroPage />} />
                    <Route path='/' element={<HeroPage />} />
                    <Route path='signUp' element={<SignUp />} />
                    <Route path='howItWorks/signUp' element={<SignUp />} />
                    <Route path='howItWorks' element={<HowItWorks fromWhere='nav' />} />
                    <Route path='login' element={<Login />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default NavOne;