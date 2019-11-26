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
            console.log("look up")
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
        if (e.code === "KeyW" && this.state.hunter.position[0] != 0){
            this.setState({
                hunter: {
                    ...this.state.hunter,
                    position: [this.state.hunter.position[0]-1,this.state.hunter.position[1]]
                }
            });
            this.mapObjectsToGrid();
        }
        if (e.code === "KeyA" && this.state.hunter.position[1] != 0){
            this.setState({
                hunter: {
                    ...this.state.hunter,
                    position: [this.state.hunter.position[0],this.state.hunter.position[1]-1]
                }
            });
            this.mapObjectsToGrid();
        }
        if (e.code === "KeyS" && this.state.hunter.position[0] != this.state.grid.length-1){
            this.setState({
                hunter: {
                    ...this.state.hunter,
                    position: [this.state.hunter.position[0]+1,this.state.hunter.position[1]]
                }
            });
            this.mapObjectsToGrid();
        }
        if (e.code === "KeyD" && this.state.hunter.position[1] != this.state.grid.length-1){
            this.setState({
                hunter: {
                    ...this.state.hunter,
                    position: [this.state.hunter.position[0],this.state.hunter.position[1]+1]
                }
            });
            this.mapObjectsToGrid();
        }
        if (e.code === "Space"){
            console.log("fire!");
        }
        // console.log(e.code);
        
    }
    mapObjectsToGrid = (hunterPosition = [this.state.hunter.position[0], this.state.hunter.position[1]]) => {
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
        this.setState({grid: newGrid})
    }
    // moves animals
    updateGrid = () => {
        let updatedAnimals = this.state.animals.slice();
        // console.log(updatedAnimals);
        
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