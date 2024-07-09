// LFG
const outerContainer = document.getElementById('outerCointainer');
outerContainer.addEventListener('scroll', scrollFunction);

const scrollFunction = () => {
    if (outerContainer.scrollTop > 100) {
        console.log('reached 100px');
    } else {
        console.log('still not on 100px');
    }
}

export { scrollFunction };