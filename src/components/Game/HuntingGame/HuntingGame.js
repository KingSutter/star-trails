import React, {Component} from 'react';
import './HuntingGame.css'


class HuntingGame extends Component {

    movementTimer = '';
    animalSpawnTimer = '';
    seconds= 0;
    foodGathered = 0;

    state = {
        grid: [[]],
        hunter: {
            image: "⇢",
            position: [5,5],
            direction: "right",
        },
        animals: [],
    }
    componentDidMount(){
        this.movementTimer = setInterval(this.moveAnimals, 150); // every .2 seconds
        this.animalSpawnTimer = setInterval(this.spawnAnimal, 1000)
        document.addEventListener('keydown', this.handleKeyPress);
        this.mapObjectsToGrid();
    }
    componentWillUnmount(){
        clearInterval(this.secondsCounter);
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
        }
    }
    
    handleKeyPress = (e) => {
        // event listeners for key presses
        if (e.code === "ArrowUp") {
            this.setState({
                hunter: {
                    ...this.state.hunter,
                    image: "⇡",
                    direction: "up",
                }
            });
            this.mapObjectsToGrid();
        }
        if (e.code === "ArrowLeft"){
            this.setState({
                hunter: {
                    ...this.state.hunter,
                    image: "⇠",
                    direction: "left",
                }
            });
            this.mapObjectsToGrid();
        }
        if (e.code === "ArrowRight"){
            this.setState({
                hunter: {
                    ...this.state.hunter,
                    image: "⇢",
                    direction: "right",
                }
            });
            this.mapObjectsToGrid();
        }
        if (e.code === "ArrowDown"){
            this.setState({
                hunter: {
                    ...this.state.hunter,
                    image: "⇣",
                    direction: "down",
                }
            });
            this.mapObjectsToGrid();
        }
        if (e.code === "KeyW" && this.state.hunter.position[0] !== 0){
            this.setState({
                hunter: {
                    ...this.state.hunter,
                    position: [this.state.hunter.position[0]-1,this.state.hunter.position[1]]
                }
            });
            this.mapObjectsToGrid();
        }
        if (e.code === "KeyA" && this.state.hunter.position[1] !== 0){
            this.setState({
                hunter: {
                    ...this.state.hunter,
                    position: [this.state.hunter.position[0],this.state.hunter.position[1]-1]
                }
            });
            this.mapObjectsToGrid();
        }
        if (e.code === "KeyS" && this.state.hunter.position[0] !== this.state.grid.length-1){
            this.setState({
                hunter: {
                    ...this.state.hunter,
                    position: [this.state.hunter.position[0]+1,this.state.hunter.position[1]]
                }
            });
            this.mapObjectsToGrid();
        }
        if (e.code === "KeyD" && this.state.hunter.position[1] !== this.state.grid.length-1){
            this.setState({
                hunter: {
                    ...this.state.hunter,
                    position: [this.state.hunter.position[0],this.state.hunter.position[1]+1]
                }
            });
            this.mapObjectsToGrid();
        }
        if (e.code === "Space"){
            this.mapObjectsToGrid(this.state.hunter.position);
        }
        // console.log(e.code);
        
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
            }
        }
        
        this.setState({grid: newGrid})
    }

    // moves animals based on animal's behavior settings
    updateGrid = () => {
        // copy of animals in state
        let updatedAnimals = this.state.animals.slice();        
        // move and map animals
        updatedAnimals.forEach((animal, index) => {
            if(animal.isAlive && this.randomInt(0,1)){
                if (animal.behavior === "up") {
                    if (animal.position[0] === 0) updatedAnimals.splice(index, 1);
                    else animal.position[0] -= 1;
                }
                if (animal.behavior === "down") {
                    if (animal.position[0] === this.state.grid.length - 1) updatedAnimals.splice(index, 1);
                    else animal.position[0] += 1;
                }
                if (animal.behavior === "left") {
                    if (animal.position[1] === 0) updatedAnimals.splice(index, 1);
                    else animal.position[1] -= 1;
                }
                if (animal.behavior === "right") {
                    if (animal.position[1] === this.state.grid.length - 1) updatedAnimals.splice(index, 1);
                    else animal.position[1] += 1;
                }
            }
        });
        this.setState({animals: updatedAnimals})
        this.mapObjectsToGrid();
    }

    // checks if any of the coordinates match an animal's coordinates
    checkForHit = (laserCoords) => {
        let updatedAnimals = JSON.parse(JSON.stringify(this.state.animals)) // creates a copy of animals in state
        for (const animal of updatedAnimals){
            if (animal.isAlive && animal.position[0] === laserCoords[0] && animal.position[1] === laserCoords[1]){
                animal.image = "🥩";
                animal.isAlive = false;
                this.setState({animals: updatedAnimals});
                return true;
            }
        };
        return false;
    }

    render(){
        return(
            <>
            <div id="huntingBoard">
                <table id="huntingGrid">
                    <tbody>
                    {this.state.grid.map((row, rowIndex)=>(
                    <tr key={rowIndex}>{row.map((column, columnIndex)=>(
                        <td key={`${rowIndex}, ${columnIndex}`}>{column}</td>
                    ))}</tr>
                ))}
                </tbody>
                </table>
            </div>
            </>
        )
    }
}

export default HuntingGame;

// might need this later ...

// // copy state without referencing state
//     for (var i = 0; i < this.state.grid.length; i++)
//     newGrid[i] = this.state.grid[i].slice();