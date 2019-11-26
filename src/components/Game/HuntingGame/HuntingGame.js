import React, {Component} from 'react';
import './HuntingGame.css'


class HuntingGame extends Component {

    secondsCounter = '';
    seconds= 0;

    state = {
        grid: [
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
        ],
        hunter: {
            image: "🧍",
            position: [0,0],
            direction: "right",
        },
        animals: [
            {
                image: "👾",
                position: [2,5],
                behavior: "up"
            },
            {
                image: "👾",
                position: [4,0],
                behavior: "down"
            },
        ],
    }
    componentDidMount(){
        // event listeners for key presses
        this.secondsCounter = setInterval(this.handleSeconds, 1000);
        document.addEventListener('keydown', this.handleKeyPress);
        this.mapObjectsToGrid();
    }
    componentWillUnmount(){
        clearInterval(this.secondsCounter);
    }
    handleSeconds = () => {
        this.seconds += 1;
        console.log(this.seconds);
        
        this.updateGrid();
    }
    handleKeyPress = (e) => {
        if (e.code === "ArrowUp") {
            console.log("look up");
        }
        if (e.code === "ArrowLeft"){
            console.log("look left");
        }
        if (e.code === "ArrowRight"){
            console.log("look right");
        }
        if (e.code === "ArrowDown"){
            console.log("look down");
        }
        if (e.code === "KeyW"){
            console.log(" move forward");
        }
        if (e.code === "KeyA"){
            console.log("move left");
        }
        if (e.code === "KeyS"){
            console.log("move down");
        }
        if (e.code === "KeyD"){
            console.log("move right");
        }
        if (e.code === "Space"){
            console.log("fire!");
        }
        // console.log(e.code);
        
    }
    mapObjectsToGrid = () => {
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
        newGrid[this.state.hunter.position[0]][this.state.hunter.position[1]] = this.state.hunter.image;
        // map animals
        this.state.animals.forEach(animal => {
            newGrid[animal.position[0]][animal.position[1]] = animal.image;
        });
        this.setState({grid: newGrid})
    }
    updateGrid = () => {
        let updatedAnimals = this.state.animals.slice();
        console.log(updatedAnimals);
        
        // move and map animals
        updatedAnimals.forEach((animal, index) => {
            if (animal.behavior === "up") {
                if (animal.position[0] === 0) animal.image = '';
                else animal.position[0] -= 1;
            }
            if (animal.behavior === "down") {
                if (animal.position[0] === this.state.grid.length - 1) updatedAnimals.splice(index, 1);
                else animal.position[0] += 1;
            }
            console.log(animal);
            
        console.log(updatedAnimals);
        
            // if (animal.behavior === "left") {
            //     if (animal.position[1] === 0) animal.image = '';
            //     newGrid[animal.position[0]][animal.position[1]-1] = animal.image;
            // }
            // if (animal.behavior === "right") {
            //     if (animal.position[1] === newGrid[0].length - 1) animal.image = '';
            //     newGrid[animal.position[0]][animal.position[1]+1] = animal.image;
            // }
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
                    {this.state.grid.map((x, xIndex)=>(
                    <tr key={xIndex}>{x.map((y, yIndex)=>(
                        <td key={xIndex, yIndex}>{y}</td>
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