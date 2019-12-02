import React,{Component} from 'react';
import './Outpost.css';

class Outpost extends Component {
    state = {
      food: 0,
      batteries: 0,
      coils: 0,
      regulators: 0,
      constrictors: 0,
      injectors: 0,
      availableCredits: 0,
      availableFood: 0,
      availableBatteries: 0,
      availableCoils: 0,
      availableRegulators: 0,
      availableConstrictors: 0,
      availableInjectors: 0,
      total: 0,
    }
    componentDidMount(){
      this.setState({
        availableFood: this.props.saveData.food,
        availableBatteries: this.props.saveData.phaser_energy / 20,
        availableCoils: this.props.saveData.warp_coils,
        availableRegulators: this.props.saveData.antimatter_flow_regulators,
        availableConstrictors: this.props.saveData.magnetic_constrictors,
        availableInjectors: this.props.saveData.plasma_injectors,
        availableCredits: this.props.saveData.money,
      })
    }

    incrementItem = (item, price, quantity=1) => {
      this.setState({
        [item]: this.state[item] + quantity,
        total: this.state.total + (price * quantity),
      })
    }
    decrementItem = (item, price, quantity=1) => {
      this.setState({
        [item]: this.state[item] - quantity,
        total: this.state.total - (price * quantity),
      })
    }
    resetItem = (item, price) => {
      this.setState({
        total: this.state.total - (this.state[item] * price),
        [item]: 0,
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
                          <td>⌬1</td>
                          <td><button onClick={()=>this.incrementItem("food",1,10)} className="outpostButton">+</button><button onClick={()=>this.decrementItem("food",1)} className="outpostButton">-</button><button onClick={()=>this.resetItem("food",1)}>C</button></td>
                          <td>{this.state.availableFood + this.state.food}</td>
                          <td>{this.state.food}</td>
                          <td>{this.state.food * 1}</td>
                        </tr>
                        <tr>
                          <td>Batteries</td>
                          <td>⌬2</td>
                          <td><button onClick={()=>this.incrementItem("batteries", 2)} className="outpostButton">+</button><button onClick={()=>this.decrementItem("batteries",2)} className="outpostButton">-</button><button onClick={()=>this.resetItem("batteries",2)}>C</button></td>
                          <td>{this.state.availableBatteries + this.state.batteries}</td>
                          <td>{this.state.batteries}</td>
                          <td>{this.state.batteries * 2}</td>
                        </tr>
                        <tr>
                          <td>Warp Coils</td>
                          <td>⌬40</td>
                          <td><button onClick={()=>this.incrementItem("coils", 40)} className="outpostButton">+</button><button onClick={()=>this.decrementItem("coils",40)} className="outpostButton">-</button><button onClick={()=>this.resetItem("coils",40)}>C</button></td>
                          <td>{this.state.availableCoils + this.state.coils}</td>
                          <td>{this.state.coils}</td>
                          <td>{this.state.coils * 40}</td>
                        </tr>
                        <tr>
                          <td>Antimatter Flow Regulators</td>
                          <td>⌬10</td>
                          <td><button onClick={()=>this.incrementItem("regulators", 10)} className="outpostButton">+</button><button onClick={()=>this.decrementItem("regulators",10)} className="outpostButton">-</button><button onClick={()=>this.resetItem("regulators",10)}>C</button></td>
                          <td>{this.state.availableRegulators + this.state.regulators}</td>
                          <td>{this.state.regulators}</td>
                          <td>{this.state.regulators * 10}</td>
                        </tr>
                        <tr>
                          <td>Magnetic Constrictors</td>
                          <td>⌬10</td>
                          <td><button onClick={()=>this.incrementItem("constrictors",10)} className="outpostButton">+</button><button onClick={()=>this.decrementItem("constrictors",10)} className="outpostButton">-</button><button onClick={()=>this.resetItem("constrictors",10)}>C</button></td>
                          <td>{this.state.availableConstrictors + this.state.constrictors}</td>
                          <td>{this.state.constrictors}</td>
                          <td>{this.state.constrictors * 10}</td>
                        </tr>
                        <tr>
                          <td>Plasma Injectors</td>
                          <td>⌬10</td>
                          <td><button onClick={()=>this.incrementItem("injectors",10)} className="outpostButton">+</button><button onClick={()=>this.decrementItem("injectors",10)} className="outpostButton">-</button><button onClick={()=>this.resetItem("injectors",10)}>C</button></td>
                          <td>{this.state.availableInjectors + this.state.injectors}</td>
                          <td>{this.state.injectors}</td>
                          <td>{this.state.injectors * 10}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                          <td>Total</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>{this.state.total}</td>
                        </tr>
                    </tfoot>
                </table>
                <p>{JSON.stringify(this.state,null,2)}</p>
                <p>{JSON.stringify(this.props,null,2)}</p>
            </div>
        )
    }
}

export default Outpost;