import { useContext } from "react";
import { CurrentUser } from "./NavOne";

const Gallery = () => {
    const currentUserData = useContext(CurrentUser);
    console.log(currentUserData);

    return (
        <>
            <h1>Gallery</h1>
        </>
    );
}

export default Gallery;