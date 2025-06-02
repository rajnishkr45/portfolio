const menuIcon = document.querySelector('.menu-icon');
const navLinks = document.querySelector('.nav-links');

menuIcon.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuIcon.classList.toggle('active');
});

let header = document.getElementById("header"); // Removed the '#' – ID is passed without it
window.addEventListener('scroll', () => { // Fixed typo: 'scrll' → 'scroll'
    if (window.scrollY > 30) {
        header.style.backgroundColor = "#1f2833";
    } else {
        header.style.backgroundColor = "transparent"; // Optional: reset background on scroll up
    }
});
