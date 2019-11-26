import React, {Component} from 'react';
import './HuntingGame.css'


class HuntingGame extends Component {

    secondsCounter = '';
    seconds= 0;

    state = {
        grid: [
            ["", "", "", "", "", "", "", "", "", "",],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
        ],
        hunter: {
            image: "🧍",
            position: [5,5],
            direction: "right",
        },
        animals: [
            {
                image: "👾",
                position: [2,5],
                behavior: "down"
            },
            {
                image: "👾",
                position: [4,0],
                behavior: "up"
            },
            {
                image: "👾",
                position: [6,9],
                behavior: "left"
            },
            {
                image: "👾",
                position: [1,2],
                behavior: "right"
            },
        ],
    }
    componentDidMount(){
        this.secondsCounter = setInterval(this.handleSeconds, 300); // every .25 seconds
        document.addEventListener('keydown', this.handleKeyPress);
        this.mapObjectsToGrid();
    }
    componentWillUnmount(){
        clearInterval(this.secondsCounter);
    }
    handleSeconds = () => {
        this.seconds += 1;
        // console.log(this.seconds);
        this.updateGrid();
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
    mapObjectsToGrid = (laserCoords = null, hunterPosition = [this.state.hunter.position[0], this.state.hunter.position[1]]) => {
        let newGrid = [
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
        ];
        
        // map hunter
        newGrid[hunterPosition[0]][hunterPosition[1]] = this.state.hunter.image;
        // map animals
        this.state.animals.forEach(animal => {
            newGrid[animal.position[0]][animal.position[1]] = animal.image;
        });
        // draw laser if there are coords inputted
        if (laserCoords !== null){
            console.log("laser fired!");
            const columnLine = laserCoords[1];
            const rowLine = laserCoords[0];
            switch (this.state.hunter.direction){
                case "up":
                    console.log("up");
                    for (let row = laserCoords[0]-1; row >= 0; row--) {
                        newGrid[row][columnLine] = "🟥";
                        console.log(row,columnLine);
                    }
                    break;
                case "down":
                    console.log("down");
                    for (let row = laserCoords[0]+1; row < newGrid.length; row++) {
                        newGrid[row][columnLine] = "🟥";
                        console.log(row,columnLine);
                    }
                    break;
                case "left":
                    console.log("left");
                    for (let column = laserCoords[1]-1; column >= 0; column--) {
                        newGrid[rowLine][column] = "🟥";
                        console.log(rowLine,column);
                    }
                    break;
                case "right":
                    console.log("right");
                    for (let column = laserCoords[1]+1; column < newGrid.length; column++) {
                        newGrid[rowLine][column] = "🟥";
                        console.log(rowLine,column);
                    }
                    break;
            }
        }
        
        this.setState({grid: newGrid})
    }
    // moves animals based on animal behavior settings
    updateGrid = () => {
        // copy of animals in state
        let updatedAnimals = this.state.animals.slice();        
        // move and map animals
        updatedAnimals.forEach((animal, index) => {
            if(this.props.randomInt(0,1)){
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