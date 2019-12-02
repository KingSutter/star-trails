import React, {Component} from 'react';
import {connect} from 'react-redux';
import './HuntingGame.css'

class HuntingGame extends Component {
    movementTimer = '';
    animalSpawnTimer = '';
    timePlayedTimer = '';
    seconds= 0; // dont neccessarily need a state update to count seconds elapsed. Just a semi-accurate counter.
    phaser_energy = this.props.phaser_energy; // same goes for energy.
    phaserEnergyUsed = 0;

    state = {
        grid: [[]],
        hunter: {
            image: "⇢",
            position: [5,5],
            direction: "right",
        },
        animals: [],
        foodGathered: 0,
        showingResults: false,
    }

    componentDidMount(){
        this.movementTimer = setInterval(this.moveAnimals, 150); // every .2 seconds
        this.animalSpawnTimer = setInterval(this.spawnAnimal, 2000); // 50% chance an animal spawns every 3 seconds
        this.timePlayedTimer = setInterval(this.watchTime, 1000);
        document.addEventListener('keydown', this.handleKeyPress);
        this.mapObjectsToGrid();
        this.phaser_energy = this.props.phaser_energy
    }

    componentWillUnmount(){
        clearInterval(this.moveAnimals);
        clearInterval(this.spawnAnimal);
        clearInterval(this.timePlayedTimer);
        // send hunting results to the DB so it will update on the user's save file
        this.props.dispatch({
            type: "UPLOAD_HUNTING_RESULTS", 
            payload: {
                phaser_energy: this.phaser_energy, 
                food: (this.props.food + this.state.foodGathered),
            }
        });
        this.phaser_energy = 1;
    }

    moveAnimals = () => {
        this.updateGrid();
    }

    randomInt = (min, max) => {
        return Math.floor(Math.random() * (max + 1 - min) + min);
    }

    spawnAnimal = () => {
        switch (this.randomInt(0,7)){
            case 0:
                this.setState({
                    animals: [
                        ...this.state.animals,
                        {
                            image: "👾",
                            position: [this.state.grid.length-1, this.randomInt(0,this.state.grid.length-1)],
                            behavior: "up",
                            isAlive: true,
                        },
                    ]
                });
                break;
            case 1:
                this.setState({
                    animals: [
                        ...this.state.animals,
                        {
                            image: "👾",
                            position: [0, this.randomInt(0,this.state.grid.length-1)],
                            behavior: "down",
                            isAlive: true,
                        },
                    ]
                });
                break;
            case 2:
                this.setState({
                    animals: [
                        ...this.state.animals,
                        {
                            image: "👾",
                            position: [this.randomInt(0,this.state.grid.length-1), this.state.grid.length-1],
                            behavior: "left",
                            isAlive: true,
                        },
                    ]
                });
                break;
            case 3:
                this.setState({
                    animals: [
                        ...this.state.animals,
                        {
                            image: "👾",
                            position: [this.randomInt(0,this.state.grid.length-1), 0],
                            behavior: "right",
                            isAlive: true,
                        },
                    ]
                });
                break;
            default: break;

        }
    }
    
    handleKeyPress = (e) => {
        // event listeners for key presses
        switch (e.code){
            case "ArrowUp": 
                e.preventDefault();
                this.setState({
                    hunter: {
                        ...this.state.hunter,
                        image: "⇡",
                        direction: "up",
                    }
                });
                this.mapObjectsToGrid();
                break;
            case "ArrowLeft":
                e.preventDefault();
                this.setState({
                    hunter: {
                        ...this.state.hunter,
                        image: "⇠",
                        direction: "left",
                    }
                });
                this.mapObjectsToGrid();
                break;
            case "ArrowRight":
                e.preventDefault();
                this.setState({
                    hunter: {
                        ...this.state.hunter,
                        image: "⇢",
                        direction: "right",
                    }
                });
                this.mapObjectsToGrid();
                break;
            case "ArrowDown":
                e.preventDefault();
                this.setState({
                    hunter: {
                        ...this.state.hunter,
                        image: "⇣",
                        direction: "down",
                    }
                });
                this.mapObjectsToGrid();
                break;
            case "KeyW":
                if(this.state.hunter.position[0] !== 0){
                    this.setState({
                        hunter: {
                            ...this.state.hunter,
                            position: [this.state.hunter.position[0]-1,this.state.hunter.position[1]]
                        }
                    });
                    this.mapObjectsToGrid();
                }
                break;
            case "KeyA":
                if(this.state.hunter.position[1] !== 0){
                    this.setState({
                        hunter: {
                            ...this.state.hunter,
                            position: [this.state.hunter.position[0],this.state.hunter.position[1]-1]
                        }
                    });
                    this.mapObjectsToGrid();
                }
                break;
            case "KeyS": 
                if (this.state.hunter.position[0] !== this.state.grid.length-1){
                    this.setState({
                        hunter: {
                            ...this.state.hunter,
                            position: [this.state.hunter.position[0]+1,this.state.hunter.position[1]]
                        }
                    });
                    this.mapObjectsToGrid();
                }
                break;
            case "KeyD": 
                if(this.state.hunter.position[1] !== this.state.grid.length-1){
                    this.setState({
                        hunter: {
                            ...this.state.hunter,
                            position: [this.state.hunter.position[0],this.state.hunter.position[1]+1]
                        }
                    });
                    this.mapObjectsToGrid();
                }
                break;
            case "Space":
                e.preventDefault();
                if (this.phaser_energy > 0){
                    this.phaser_energy -= 1;
                    this.phaserEnergyUsed += 1;
                    this.mapObjectsToGrid(this.state.hunter.position); // this effectively will fire a laser
                } // else don't do anything. Don't fire a laser
                break;
        }
    }

    // updates grid and draws a laser if inputted
    mapObjectsToGrid = (hunterCoords = null, hunterPosition = [this.state.hunter.position[0], this.state.hunter.position[1]]) => {
        let newGrid = [
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ];
        // map hunter
        newGrid[hunterPosition[0]][hunterPosition[1]] = this.state.hunter.image;
        // map animals
        this.state.animals.forEach(animal => {
            newGrid[animal.position[0]][animal.position[1]] = animal.image;
        });
        // draw laser if there are coords inputted
        if (hunterCoords !== null){
            const columnLine = hunterCoords[1];
            const rowLine = hunterCoords[0];
            // will draw a laser from the hunter's position by direction to where an animal is (if any)
            switch (this.state.hunter.direction){
                case "up":
                    for (let row = hunterCoords[0]-1; row >= 0; row--) {
                        if (this.checkForHit([row,columnLine])) break;
                        else newGrid[row][columnLine] = "🟥";
                    }
                    break;
                case "down":
                    for (let row = hunterCoords[0]+1; row < newGrid.length; row++) {
                        if (this.checkForHit([row,columnLine])) break;
                        else newGrid[row][columnLine] = "🟥";
                    }
                    break;
                case "left":
                    for (let column = hunterCoords[1]-1; column >= 0; column--) {
                        if (this.checkForHit([rowLine,column])) break;
                        else newGrid[rowLine][column] = "🟥";
                    }
                    break;
                case "right":
                    for (let column = hunterCoords[1]+1; column < newGrid.length; column++) {
                        if (this.checkForHit([rowLine,column])) break;
                        else newGrid[rowLine][column] = "🟥";
                    }
                    break;
                default: break;
            }
        }
        
        this.setState({grid: newGrid})
    }

    // moves animals based on animal's behavior settings
    updateGrid = () => {
        // copy of animals in state
        let updatedAnimals = this.state.animals.slice();
        const directions = ["up", "down", "left", "right"];
        // move and map animals
        updatedAnimals.forEach((animal, index) => {
            if(animal.isAlive && this.randomInt(0,1)){
                if (animal.behavior === "up") {
                    if (animal.position[0] === 0) updatedAnimals.splice(index, 1);
                    else {animal.position[0] -= 1; if(this.randomInt(0,1)) animal.behavior=directions[this.randomInt(0,3)];}
                }
                if (animal.behavior === "down") {
                    if (animal.position[0] === this.state.grid.length - 1) updatedAnimals.splice(index, 1);
                    else {animal.position[0] += 1; if(this.randomInt(0,1)) animal.behavior=directions[this.randomInt(0,3)];}
                }
                if (animal.behavior === "left") {
                    if (animal.position[1] === 0) updatedAnimals.splice(index, 1);
                    else {animal.position[1] -= 1; if(this.randomInt(0,1)) animal.behavior=directions[this.randomInt(0,3)];}
                }
                if (animal.behavior === "right") {
                    if (animal.position[1] === this.state.grid.length - 1) updatedAnimals.splice(index, 1);
                    else {animal.position[1] += 1;  if(this.randomInt(0,1)) animal.behavior=directions[this.randomInt(0,3)];}
                }
            }
        });
        this.setState({animals: updatedAnimals})
        this.mapObjectsToGrid();
    }

    watchTime = () => {
        if (this.seconds >= 30) this.setState({showingResults: true});  // if game has been running for 30 seconds...
        else this.seconds += 1; // else add 1 seconds to timer 
    }

    // checks if any of the coordinates match an animal's coordinates
    checkForHit = (laserCoords) => {
        let updatedAnimals = JSON.parse(JSON.stringify(this.state.animals)) // creates a copy of animals in state
        for (const animal of updatedAnimals){
            if (animal.isAlive && animal.position[0] === laserCoords[0] && animal.position[1] === laserCoords[1]){
                animal.image = "🥩";
                animal.isAlive = false;
                this.setState({
                    animals: updatedAnimals,
                    foodGathered: this.state.foodGathered + this.randomInt(15, 25) // hitting an animal gives you 10-15 pounds of food
                });
                return true;
            }
        };
        return false;
    }

    render(){
        return(
            <div id="huntingGameView">
                {!this.state.showingResults ? (
                <div id="huntingGame">
                    <table>
                        <thead>
                            <td>
                                <div id="huntingBoard">
                                    <table id="huntingGrid">
                                        <tbody>
                                        {this.state.grid.map((row, rowIndex)=>(
                                        <tr key={rowIndex}>{row.map((column, columnIndex)=>(
                                            <td key={`${rowIndex}, ${columnIndex}`}>{column}</td>
                                            ))}
                                        </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                            <td id="huntingInformation">
                                <p>Time: {this.seconds}</p>
                                {this.phaser_energy > 5 ? 
                                    (<p>Phaser Energy: {this.phaser_energy}</p>) :
                                    (<p><span id="energy">Phaser Energy: {this.phaser_energy}</span></p>)
                                }
                                <p>Food Gathered: {this.state.foodGathered} lbs</p>
                                <button onClick={()=>{this.setState({showingResults: true});}}>Exit</button></td>
                        </thead>
                    </table>
                </div> 
                ) : (
                <div id="huntingResults">
                    <h2>Time to leave!</h2>
                    <h3>You gathered {this.state.foodGathered} pounds of food.</h3>
                    <h3>You used {this.phaserEnergyUsed} phaser energy.</h3>
                    <button onClick={()=>{this.setState({showingResults: false}); this.props.toggleSpecialScenario("hunting");}}>Continue</button>
                </div>
                )}
            </div>
        )
    }
}

export default connect()(HuntingGame);