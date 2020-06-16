const svg = document.querySelector('svg')
const circle = document.querySelector('circle')


// //going into dom to get radius value
let radius = parseFloat(circle.getAttribute('r'));

// initialize turn attr
let turn;

//////////////////////////////////////////////
///  change radius and then deletes child  ///
//////////////////////////////////////////////

const bigC = setInterval(() => {
    switch(radius) {
        default:
        //if turn has occored, circle will shrink
            if(turn) circle.setAttribute('r', radius--);
            //else radius grows
            else circle.setAttribute('r', radius++);
            break;
        
    //if circle is 100, shrink radius
        case 100:
            turn=true //
            circle.setAttribute('r', radius--) //drop radius below 100 to break out of this case
            break;
        
    //once radius hits zero, remove circle from svg 
        case 0:
            //remove child circle from svg
            svg.removeChild(circle);
            clearInterval(bigC);
            break;
        }
//create a speed interval? random number between 5 - 15
    }, 10);

//adds new circle after 1 second
setTimeout(() => {
    const circle2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle2.setAttribute("cx", "20");
    circle2.setAttribute("cy", "20");
    circle2.setAttribute("r", "15");
    svg.appendChild(circle2);
}, 1000);


//function to get random number from 1 to max number, second parameter sets minimum
function randomNumber(max, min=1) {  
    return Math.floor(Math.random() * (max - min) + min); 
}  

///////////////////////////////
///  create a circle class  ///
///////////////////////////////

class Circle{
    //may not need constructor if there is nothing passed
    constructor(){
    this.radius = randomNumber(300, 50)
    //random location in current browser
    this.cx = randomNumber(window.innerWidth)
    this.cy = randomNumber(window.innerHeight)
    //still need to set color and speed?

    }
    //method to drop circle onto svg
    addCircleToSVG = () => {
        const newCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        newCircle.setAttribute("cx", this.cx);
        newCircle.setAttribute("cy", this.cy);
        newCircle.setAttribute("r", this.radius);
        svg.appendChild(newCircle);
    }
}

//create circle class
//create method to append to svg
//remove once the cycle is complete

const c1 = new Circle()


/* 
1. get coordinate cx cy of spawn point
2. have circle expand and then contract based on max point
 --- color should be randomized
*/


//// CREATE ARRAYS, probably don't need

// console.log([...Array(100).keys()]); //0,1,2,3,4
// console.log([...Array(99).keys()].reverse()); //4,3,2,1

//sample for loop, prints array
// for (x of [...Array(5).keys()]) {
//     console.log(x)
// }
