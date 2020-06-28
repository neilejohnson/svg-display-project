//define svg for use
const svg = document.querySelector('svg')
const score = document.querySelector('#score')

///  FUNCTIONS  ///

//random number from 1 to (but not including) max number, second parameter sets minimum
function randomNumber(max, min=1) {
    return Math.floor(Math.random() * (max - min) + min); 
}

/////////////////////////////
///  LEVEL MANAGER CLASS  ///
/////////////////////////////

class LevelManager{
    constructor(){
        this.targetLevel = document.querySelector('#level')
        this.targetBackground = document.querySelector('rect')

        this.progression = [
            //level 1 goal
            200, 
            //level 2 goal
            500, 
            //level 3 goal
            600
        ]
    }
    updateProgress = () => {
        //if the player's score is greater than or equal to the current progression
        if(score.innerHTML >= this.progression[this.currentLevel - 1]) {
            //level goes up by 1
            this.currentLevel = this.currentLevel + 1;
        };
    };
    //change background color
    changeBackground = color => {
        this.targetBackground.setAttribute('fill', color)
    };
    get currentLevel() {
        return parseInt(this.targetLevel.innerHTML);
    }
    set currentLevel(value) {
        this.targetLevel.innerHTML = value;
    }
};

///  CIRCLE CLASS  ///

class Circle{
    constructor(currentLevel){ //may not need constructor if there is nothing passed

    this.levelIndex = currentLevel - 1

    //array defining the min and max Growth speeds for the circle elements.
    //the smaller the number, the faster the circle balloons
    this.sizeRange = [
        //level 1
        {
            maxRadius: 120, 
            minRadius: 70
        }, 
        //level 2
        {
            maxRadius: 100, 
            minRadius: 60
        },
        //level 3
        {
            maxRadius: 90, 
            minRadius: 40
        }
    ]

    //smaller number is faster speed!
    this.spawnSpeed = [
        //level 1
        {
            highest: 50, 
            lowest: 70
        },
        //level 2
        {
            highest: 45, 
            lowest: 60
        },
        //level 3
        {
            highest: 40, 
            lowest: 45
        },
    ]

    //color of circles changes based on level
    this.colors = [
        //level 1
        ['rgba(142, 191, 63, .5)', 'rgba(191, 63, 65, .5)', 'rgba(63, 84, 191, .5)'],
        //level 2
        ['red', 'green', 'yellow'],
        //level 3
        ['rgba(142, 191, 63, .7)', 'rgba(191, 63, 65, .7)', 'rgba(63, 84, 191, .7)']
    ]

    const { sizeRange, levelIndex, spawnSpeed, colors } = this;

    // constant variables //
    this.aboluteMaxRadius = sizeRange[levelIndex].maxRadius
    this.aboluteMinRadius = sizeRange[levelIndex].minRadius
    this.newCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle"); //create default element circle

    const { aboluteMaxRadius, aboluteMinRadius } = this;

    //randomized variables //
    this.maxRadius = randomNumber(aboluteMaxRadius, aboluteMinRadius)
    this.randomColor = colors[levelIndex][randomNumber(3,0)];
    this.id = randomNumber(9).toString()+randomNumber(9).toString()+randomNumber(9).toString() //assign the element a random id
    
    //change speed 
    this.speed = randomNumber(spawnSpeed[levelIndex].highest, spawnSpeed[levelIndex].lowest);

    this.cx = randomNumber((parseInt(svg.getAttribute("width")) - aboluteMaxRadius), aboluteMaxRadius) //random location svg. configured to not touch edge
    this.cy = randomNumber((parseInt(svg.getAttribute("height")) - aboluteMaxRadius), aboluteMaxRadius)

    //initialize for later use //
    this.targetCircle; 
    this.reachedApex;
    }
    //method to drop circle onto svg
    addCircleToSVG = () => {
        const { cx, cy, id, newCircle, randomColor, clickCircle } = this;
        newCircle.setAttribute("cx", cx);
        newCircle.setAttribute("cy", cy);
        newCircle.setAttribute("id", id);
        newCircle.setAttribute("r", "1"); //default always at 1
        newCircle.setAttribute("fill", randomColor);
        
        svg.appendChild(newCircle); //add circle to svg

        this.targetCircle = document.getElementById(id) //target newly added circle
        this.targetCircle.addEventListener('click', clickCircle); //apply event listener
    }
    growShrinkRemove = () => {
        this.addCircleToSVG() //run method to add circle into SVG

        const intervalFunc = setInterval(() => {
            const { currentRadius, maxRadius, reachedApex, targetCircle } = this; //deconstruct variables we will need

//reconfigure to if else statement
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
                        score.innerHTML = score.innerHTML - 50; //lose 50 points if you don't catch the circle
                        if (score.innerHTML <= 0) score.innerHTML = 0; //score can not dip below 0
                    } catch (error) {
                        "error: already deleted"
                    }
                    break;
                }
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
            //  DEFINE SPAWN SPEED OF CIRCLE   //
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
            }, this.speed);
        };
        clickCircle = () => {
            
            var sound = document.querySelector('#sound')
            var soundFlag = true;
            if (soundFlag) {
                sound.pause();
                sound.currentTime = 0;
                sound.play();
                soundFlag = false;
            }
            
            score.innerHTML = parseInt(score.innerHTML) + (this.aboluteMaxRadius - this.currentRadius);
            const { intervalFunc, targetCircle } = this;
            clearInterval(intervalFunc);
            svg.removeChild(targetCircle);
        }
        get currentRadius() {
            return parseInt(this.targetCircle.getAttribute("r"));
        }
};

///////////////////////////////
///  initiate levelManager  ///
///////////////////////////////

const levelManager = new LevelManager()

//////////////////////////
///  initiate circles  ///
//////////////////////////

//create one initially otherwise there is 4 second delay
const firstCircle = new Circle(levelManager.currentLevel);
firstCircle.growShrinkRemove();

//create new circle every 2 seconds
const circleFactory = setInterval(() => {
    const endlessCircle = new Circle(levelManager.currentLevel);
    endlessCircle.growShrinkRemove();
    levelManager.updateProgress();
}, 2000)