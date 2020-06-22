//define svg for use
const svg = document.querySelector('svg')
const score = document.querySelector('#score')
const level = document.querySelector('#level')

//array of random colors
const colors = ['rgba(142, 191, 63, .5)', 'rgba(191, 63, 65, .5)', 'rgba(63, 84, 191, .5)'];

///  FUNCTIONS  ///

//random number from 1 to (but not including) max number, second parameter sets minimum
function randomNumber(max, min=1) {
    return Math.floor(Math.random() * (max - min) + min); 
}

function triggerNextLevel() {
    if(score.innerHTML >= 1500) {
        level.innerHTML = 2;
    } 
    if(level.innerHTML === '2') {
        document.body.style.backgroundColor = 'red';
    }
}

///  CIRCLE CLASS  ///

class Circle{
    constructor(){ //may not need constructor if there is nothing passed

    // constant variables //
    this.aboluteMaxRadius = 120
    this.aboluteMinRadius = 70
    this.newCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle"); //create default element circle
    
    //randomized variables //
    this.maxRadius = randomNumber(this.aboluteMaxRadius, this.aboluteMinRadius)
    this.randomColor = colors[randomNumber(3,0)];
    this.id = randomNumber(9).toString()+randomNumber(9).toString()+randomNumber(9).toString() //assign the element a random id
    this.speed = randomNumber(30, 20)

    const { aboluteMaxRadius } = this; //deconstruct for convenience
    this.cx = randomNumber((parseInt(svg.getAttribute("width")) - aboluteMaxRadius), aboluteMaxRadius) //random location svg. configured to not touch edge
    this.cy = randomNumber((parseInt(svg.getAttribute("height")) - aboluteMaxRadius), aboluteMaxRadius)

    //initialize for later use //
    this.targetCircle; 
    this.reachedApex;
    }
    //method to drop circle onto svg
    addCircleToSVG = () => {
        const { cx, cy, id, newCircle, randomColor } = this;
        newCircle.setAttribute("cx", cx);
        newCircle.setAttribute("cy", cy);
        newCircle.setAttribute("id", id);
        newCircle.setAttribute("r", "1"); //default always at 1
        newCircle.setAttribute("fill", randomColor);
        
        svg.appendChild(newCircle); //add circle to svg
        //svg.insertBefore(newCircle, svg.firstChild);
        //svg.insertAdjacentElement('afterbegin', newCircle);

        this.targetCircle = document.getElementById(this.id) //target newly added circle
        this.targetCircle.addEventListener('click', this.clickCircle);
    }
    growShrinkRemove = () => {
        this.addCircleToSVG() //run method to add circle into SVG

        const intervalFunc = setInterval(() => {
            const { currentRadius, maxRadius, reachedApex, targetCircle } = this; //deconstruct variables we will need

// if currentRadius is less than or equal to zero then removechild
// if reachedApex = true then currentRadius -1
// else currentRadius + 1

// LAST CHECK if current radius is greater than or equal to maxradius then reachedApex is true

            switch(currentRadius) {
                default:
                    if(reachedApex) targetCircle.setAttribute('r', currentRadius-1); //if radius reaches highest point, circle shrinks
                    else targetCircle.setAttribute('r', currentRadius+1); //else radius grows
                    break;
                case (maxRadius): //if circle is 100, shrink radius
                    this.reachedApex=true //set circle to shrink
                    targetCircle.setAttribute('r', currentRadius-1) //drop radius below 100 to break out of this case
                    break;
                case 0: //once radius hits zero, remove circle from svg 
                    try {
                        svg.removeChild(targetCircle); //remove child circle from svg
                        clearInterval(intervalFunc); //break out of interval
                        score.innerHTML = score.innerHTML - 50;
                        if (score.innerHTML <= 0) score.innerHTML = 0;
                    } catch (error) {
                        "error: already deleted"
                    }
                    break;
                }
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~//
            //  DEFINE SPEED OF CIRCLE   //
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~//
            }, this.speed);
        };
        clickCircle = () => {
            score.innerHTML = parseInt(score.innerHTML) + (this.aboluteMaxRadius - this.currentRadius);
            const { intervalFunc, targetCircle } = this;
            clearInterval(intervalFunc);
            svg.removeChild(targetCircle);
        }

        get currentRadius() {
            return parseInt(this.targetCircle.getAttribute("r"));
        };
};

//////////////////////////
///  initiate circles  ///
//////////////////////////

//create one initially otherwise there is 4 second delay
const firstCircle = new Circle();
firstCircle.growShrinkRemove();

//create new circle every 2 seconds
const circleFactory = setInterval(() => {
    const endlessCircle = new Circle();
    endlessCircle.growShrinkRemove();
    triggerNextLevel();
}, 2000)