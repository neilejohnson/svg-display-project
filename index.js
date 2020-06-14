const circle = document.querySelector('circle')

// //going into dom to set value
let radius = parseFloat(circle.getAttribute('r'));

const growCircle = () => {
    console.log('grow')
    radius + 1;
    circle.setAttribute('r', radius)
};

let i=0;

const interval = setInterval(function(){ 
    i+=1;
    console.log(i);
    if(i===10) {
        clearInterval(interval);
    }
}, 1000);