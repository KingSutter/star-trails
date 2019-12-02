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
      errorMessage: 'placeholder',
      secondConfirmation: false,
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

    // checks if the change can be made then increases said item
    incrementItem = (item, price, quantity=1) => {
      // If there is a problem, tell the user about it
      if(this.state.availableCredits - (price * quantity) < 0 || this.state.availableCredits < 0){
        document.getElementById("warning").style.color = "white";
        document.getElementById("warning").style.backgroundColor = "red";
        this.setState({errorMessage: "You cannot go into debt! Please fix that first."})
        return 0;
      } else { // otherwise, don't...
        document.getElementById("warning").style.color = "transparent";
        document.getElementById("warning").style.backgroundColor = "transparent";
        this.setState({
          [item]: this.state[item] + quantity,
          total: this.state.total + (price * quantity),
          availableCredits: this.state.availableCredits - (price * quantity),
        })
      }
    }

    // checks if the change can be made then decreases said item
    decrementItem = (item, price, quantity=1) => {
      // Checks using current available(whatever item was input) against decrement amount 
      const availableItem = "available" + (item.charAt(0).toUpperCase() + item.slice(1))
      // If there is a problem, tell the user about it
      if((this.state[availableItem] + this.state[item]) - quantity < 0){
        document.getElementById("warning").style.color = "white";
        document.getElementById("warning").style.backgroundColor = "red";
        this.setState({errorMessage: "You can't sell what you don't have!"})
        return 0;
      } else { // otherwise, don't...
        document.getElementById("warning").style.color = "transparent";
        document.getElementById("warning").style.backgroundColor = "transparent";
        this.setState({
          [item]: this.state[item] - quantity,
          total: this.state.total - (price * quantity),
          availableCredits: this.state.availableCredits + (price * quantity),
        })
      }
    }

    // resets changes
    resetItem = (item, price) => {
      document.getElementById("warning").style.color = "transparent";
      document.getElementById("warning").style.backgroundColor = "transparent";
      this.setState({
        total: this.state.total - (this.state[item] * price),
        availableCredits: this.state.availableCredits + (this.state[item] * price),
        [item]: 0,
      })
    }

    // wraps up the changes made in the shop and saves it to the user's save state in the database
    handleConfirm = () => {
      
    }

    toggleConfirm = () => {
      this.setState({secondConfirmation: !this.state.secondConfirmation})
    }

    render(){
        return(
            <div id="outpostView">
                <table>
                    <thead>
                      <tr id="warning">
                        <td colSpan="6">{this.state.errorMessage}</td>
                      </tr>
                      <tr className="header">
                          <td>Item</td>
                          <td>Price</td>
                          <td>Buy/Sell</td>
                          <td>Current</td>
                          <td>Difference</td>
                          <td>Total Cost</td>
                      </tr>
                    </thead>
                    <tbody>
                        <tr>
                          <td>Food</td>
                          <td>⌬1</td>
                          <td><button onClick={()=>this.incrementItem("food",1,10)} className="outpostButton">+</button><button onClick={()=>this.decrementItem("food",1,10)} className="outpostButton">-</button><button onClick={()=>this.resetItem("food",1)}>C</button></td>
                          <td>{this.state.availableFood + this.state.food}</td>
                          <td>{this.state.food}</td>
                          <td>⌬{this.state.food * 1}</td>
                        </tr>
                        <tr>
                          <td>Batteries</td>
                          <td>⌬2</td>
                          <td><button onClick={()=>this.incrementItem("batteries", 2)} className="outpostButton">+</button><button onClick={()=>this.decrementItem("batteries",2)} className="outpostButton">-</button><button onClick={()=>this.resetItem("batteries",2)}>C</button></td>
                          <td>{this.state.availableBatteries + this.state.batteries}</td>
                          <td>{this.state.batteries}</td>
                          <td>⌬{this.state.batteries * 2}</td>
                        </tr>
                        <tr>
                          <td>Warp Coils</td>
                          <td>⌬40</td>
                          <td><button onClick={()=>this.incrementItem("coils", 40)}>+</button><button onClick={()=>this.decrementItem("coils",40)}>-</button><button onClick={()=>this.resetItem("coils",40)}>C</button></td>
                          <td>{this.state.availableCoils + this.state.coils}</td>
                          <td>{this.state.coils}</td>
                          <td>⌬{this.state.coils * 40}</td>
                        </tr>
                        <tr>
                          <td>Antimatter Flow Regulators</td>
                          <td>⌬10</td>
                          <td><button onClick={()=>this.incrementItem("regulators", 10)}>+</button><button onClick={()=>this.decrementItem("regulators",10)}>-</button><button onClick={()=>this.resetItem("regulators",10)}>C</button></td>
                          <td>{this.state.availableRegulators + this.state.regulators}</td>
                          <td>{this.state.regulators}</td>
                          <td>⌬{this.state.regulators * 10}</td>
                        </tr>
                        <tr>
                          <td>Magnetic Constrictors</td>
                          <td>⌬10</td>
                          <td><button onClick={()=>this.incrementItem("constrictors",10)}>+</button><button onClick={()=>this.decrementItem("constrictors",10)}>-</button><button onClick={()=>this.resetItem("constrictors",10)}>C</button></td>
                          <td>{this.state.availableConstrictors + this.state.constrictors}</td>
                          <td>{this.state.constrictors}</td>
                          <td>⌬{this.state.constrictors * 10}</td>
                        </tr>
                        <tr>
                          <td>Plasma Injectors</td>
                          <td>⌬10</td>
                          <td><button onClick={()=>this.incrementItem("injectors",10)}>+</button><button onClick={()=>this.decrementItem("injectors",10)}>-</button><button onClick={()=>this.resetItem("injectors",10)}>C</button></td>
                          <td>{this.state.availableInjectors + this.state.injectors}</td>
                          <td>{this.state.injectors}</td>
                          <td>⌬{this.state.injectors * 10}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr className="footer">
                          <td>Spending Total</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>⌬{this.state.total}</td>
                        </tr>
                        <tr className="footer">
                          <td>Available Credits</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>⌬{this.state.availableCredits}</td>
                        </tr>
                        <tr>
                          {!this.state.secondConfirmation ? (
                            <td colSpan="6"><button onClick={this.toggleConfirm} id="confirmPurchaseButton" className="hoverEffect">Ready</button></td>
                          ) : (
                            <>
                            <td colSpan="2"><button onClick={this.handleConfirm} id="confirmPurchaseButton" className="hoverEffect">Confirm</button></td>
                            <td colSpan="4"><button onClick={this.toggleConfirm} id="confirmPurchaseButton" className="hoverEffect">Cancel</button></td>
                            </>
                          )}
                        </tr>
                    </tfoot>
                </table>
            </div>
        )
    }
}

export default Outpost;