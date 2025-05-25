var abc = document.getElementById("header");

function handleScroll() {
    const verticalScrollPx = window.scrollY;

    if (window.innerWidth > 700) {
        if (verticalScrollPx > 30) {
            abc.style.backgroundImage = 'linear-gradient(to right, #EF629F, #EECDA3)';
            abc.style.boxShadow = "0 0 8px rgba(0, 0, 0, 0.6)";
            abc.style.transition = "all 0.5s ease";
            abc.style.top = "0px";
        } else {
            abc.style.backgroundImage = '';
            abc.style.top = "15px";
            abc.style.boxShadow = "none";
        }
    } else {
        abc.style.backgroundImage = 'linear-gradient(to right, #403a3e, #be5869)';
        abc.style.top = "0px";
    }
}

window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll);


const menuIcon = document.querySelector('.menu-icon');
const navLinks = document.querySelector('.nav-links');

menuIcon.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuIcon.classList.toggle('active');
});