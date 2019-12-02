import React,{Component} from 'react';
import './Outpost.css';

class Outpost extends Component {
    state = {
      food: 0,
      batteries: 0,
      coils: 0,
      regulators: 0,
      injectors: 0,
      availableCredits: 0,
      availableFood: 0,
      availableBatteries: 0,
      availableCoils: 0,
      availableRegulators: 0,
      availableConstrictors: 0,
      availableInjectors: 0,
    }
    componentDidMount(){
      this.setState({
        availableFood: this.props.saveData.food,
        availableBatteries: this.props.saveData.phaser_energy / 20,
        availableCoils: this.props.saveData.warp_coils,
        availableRegulators: this.props.saveData.antimatter_flow_regulators,
        availableConstrictors: this.props.saveData.magnetic_constrictors,
        availableInjectors: this.props.saveData.plasmaInjectors,
        availableCredits: this.props.saveData.money,
      })
    }

    incrementItem = (item) => {
      this.setState({
        [item]: this.state[item]+1
      })
    }
    decrementItem = (item) => {
      this.setState({
        [item]: this.state[item]-1
      })
    }
    resetItem = (item) => {
      this.setState({
        [item]: 0
      })
    }
    render(){
        return(
            <div id="outpostView">
                <table>
                    <thead>
                        <tr>
                            <td>Item</td>
                            <td>Price</td>
                            <td>Buy/Sell</td>
                            <td>Available</td>
                            <td>Difference</td>
                            <td>Total</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                          <td>Food</td>
                          <td></td>
                          <td><button onClick={()=>this.incrementItem("food")} className="outpostButton">+</button><button onClick={()=>this.decrementItem("food")} className="outpostButton">-</button><button onClick={()=>this.resetItem("food")}>C</button></td>
                          <td>{this.state.availableFood - this.state.food}</td>
                          <td>{this.state.food}</td>
                          <td>{this.state.food * 1}</td>
                        </tr>
                        <tr>
                          <td>Batteries</td>
                          <td></td>
                          <td><button onClick={()=>this.incrementItem("batteries")} className="outpostButton">+</button><button onClick={()=>this.decrementItem("batteries")} className="outpostButton">-</button><button onClick={()=>this.resetItem("batteries")}>C</button></td>
                          <td>{this.state.availableBatteries - this.state.batteries}</td>
                          <td>{this.state.batteries}</td>
                          <td>{this.state.batteries * 2}</td>
                        </tr>
                    </tbody>
                </table>
                <span>{JSON.stringify(this.state,null,2)}</span>
            </div>
        )
    }
}

export default Outpost;