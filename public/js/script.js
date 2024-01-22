const btn = document.getElementById('menu');
const navhide = document.getElementsByClassName("links")[0];
const cal = document.getElementsByClassName("calculater")[0];
const calculater = document.getElementsByClassName("cals")[0];
const close = document.getElementsByClassName("close")[0];
btn.addEventListener('click', () => {
    navhide.classList.toggle("active")
    console.log("here");

});
if(close){
    close.addEventListener('click', () => {
        calculater.classList.toggle("active")
    });
}
if (cal){
    cal.addEventListener('click', () => {
        calculater.classList.toggle("active")
    });
}



let imgs = document.querySelectorAll(".banner-wrapper img");
let banner = document.querySelector(".banner-wrapper");
let count = 1;
if(banner){
    function slide() {
        if (count < imgs.length) {
            console.log(banner.clientWidth)
            banner.style.translate = count * banner.clientWidth + "px";
            count++;
        }
        else {
            count = 1;
            banner.style.translate = "0%";
        }
    
    }
    
    
    setInterval(function () {
        slide();
    }, 5000)
    
    
}
