const sideBar = document.getElementById('side');
const navs = document.getElementsByClassName('item');
for (let nav of navs) {
    nav.addEventListener('click', e => {
        for (let restNavs of navs) {
            restNavs.classList.remove('selected');
        }
        e.target.classList.add('selected');
        location.href = "#main";
        showHideSide();
    });
}


/* When window reloaded */

    window.onload = () => {
       location.href = "#home";
    }

/*--------------*/

function showHideSide() {
    const bars = document.getElementsByClassName('bar');
    for (let bar of bars) {
        bar.classList.toggle('clicked');
    }
    sideBar.classList.toggle('show');
}

function hideSide(){
    if(sideBar.classList.contains('show'))
        showHideSide();
}

document.getElementById('burgerMenu').onclick = () => {
    showHideSide();
}
function goHome() {
    location.href = "#home";
    hideSide();
    for (let nav of navs) {
                nav.classList.remove('selected');
    }
}
function goTests(arr) {
    location.href = "#tests";
    hideSide();
}

const elements = Array.from(document.body.children);

for(let element of elements){
    if(element != sideBar && element != document.getElementById('header')){
        element.onclick = () => {
            hideSide();
        }
    }
}