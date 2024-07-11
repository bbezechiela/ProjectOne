import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Welcome from "./Welcome";
import Search from "./Search";
import Messages from "./Messages";
import Gallery from "./Gallery";
import Emotions from "./Emotions";

const NavTwo = () => {
    return (
        <BrowserRouter>
            <div id="navTwoContainer">
                <Link className="navTwoItem" to='welcome'>Home</Link>
                <Link className="navTwoItem" to='search'>Search</Link>
                <Link className="navTwoItem" to='messages'>Messages</Link>
                <Link className="navTwoItem" to='gallery'>Gallery</Link>
                <Link className="navTwoItem" to='emotions'>Emotions</Link>
                <Link className="navTwoItem" to='lagout'>Lagout</Link>
            </div>
            <Routes>
                <Route>
                    <Route path="welcome" element={<Welcome />}></Route>
                    <Route path="search" element={<Search />}></Route>
                    <Route path="messages" element={<Messages />}></Route>
                    <Route path="gallery" element={<Gallery />}></Route>
                    <Route path="emotions" element={<Emotions />}></Route>
                    <Route path="lagout" element={<Welcome />}></Route>

                </Route>
            </Routes>
        </BrowserRouter>        
    );
};

export default NavTwo;