
//define svg for use
const svg = document.querySelector('svg')

//////////////////
///  function  ///
//////////////////

//function to get random number from 1 to max number, second parameter sets minimum
function randomNumber(max, min=1) {
    return Math.floor(Math.random() * (max - min) + min); 
}

//x
//min this.absoluteMaxRadius
//max svg.getAttribute("width") - this.absoluteMaxRadius

//y
//min this.absoluteMaxRadius
//max svg.getAttribute("height") - this.absoluteMaxRadius


///////////////////////////////
///  create a circle class  ///
///////////////////////////////

class Circle{
    //may not need constructor if there is nothing passed
    constructor(){
    
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    //  DEFINE RADIUS OF GENERATED CIRCLES   //
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    this.aboluteMaxRadius = 120
    this.aboluteMinRadius = 70
    this.maxRadius = randomNumber(this.aboluteMaxRadius, this.aboluteMinRadius)
    console.log(parseInt(svg.getAttribute("width")) - this.aboluteMaxRadius)
    console.log(this.aboluteMaxRadius)
    
    const { aboluteMaxRadius } = this;

    //random location in current browser
    this.cx = randomNumber((parseInt(svg.getAttribute("width")) - aboluteMaxRadius), aboluteMaxRadius)
    this.cy = randomNumber((parseInt(svg.getAttribute("height")) - aboluteMaxRadius), aboluteMaxRadius)

    // this.cx = randomNumber((1000 - 120), 120)
    // this.cy = randomNumber((500 - 120), 120)

    //assign the element a random id
    this.id = randomNumber(9).toString()+randomNumber(9).toString()+randomNumber(9).toString()

    //create default element circle 
    this.newCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    //initialize for later use
    this.targetCircle;
    this.reachedApex;

    //////////////////////////////////////
    //still need to set color and speed
    //////////////////////////////////////

    }
    //method to drop circle onto svg
    addCircleToSVG = () => {
        const { cx, cy, id, newCircle } = this;
        newCircle.setAttribute("cx", cx);
        newCircle.setAttribute("cy", cy);
        newCircle.setAttribute("id", id);
        //defualt is always 1
        newCircle.setAttribute("r", "1");  
        
        newCircle.setAttribute("fill", "red");
        
        svg.appendChild(newCircle);
    }
    growShrinkRemove = () => {

        //run method to add circle into SVG
        this.addCircleToSVG()

        //target newly added circle
        this.targetCircle = document.getElementById(this.id)
    
        const intervalFunc = setInterval(() => {
            
            //deconstruct variables we will need
            const { currentRadius, maxRadius, reachedApex, targetCircle } = this;

            switch(currentRadius) {
                default:
                //if radius has reached highest point/apex, circle will shrink
                    if(reachedApex) targetCircle.setAttribute('r', currentRadius-1);
                    //else radius grows
                    else targetCircle.setAttribute('r', currentRadius+1);
                    break;
                
            //if circle is 100, shrink radius
                case (maxRadius):
                    //redefining and not using it as a variable so I do need to use this
                    this.reachedApex=true

                    targetCircle.setAttribute('r', currentRadius-1) //drop radius below 100 to break out of this case
                    break;
                
            //once radius hits zero, remove circle from svg 
                case 0:
                    //remove child circle from svg
                    svg.removeChild(targetCircle);
                    //break out of interval
                    clearInterval(intervalFunc);
                    break;
                }
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~//
            //  DEFINE SPEED OF CIRCLE   //
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~//
            }, randomNumber(30, 20));
        };
        get currentRadius() {
            return parseInt(this.targetCircle.getAttribute("r"));
        };
};

//create circle class
//create method to append to svg
//remove once the cycle is complete

const firstCircle = new Circle();
firstCircle.growShrinkRemove();

const circleFactory = setInterval(() => {
    const endlessCircle = new Circle();
    endlessCircle.growShrinkRemove();
}, 4000)


//// CREATE ARRAYS, probably don't need

// console.log([...Array(100).keys()]); //0,1,2,3,4
// console.log([...Array(99).keys()].reverse()); //4,3,2,1

//sample for loop, prints array
// for (x of [...Array(5).keys()]) {
//     console.log(x)
// }
