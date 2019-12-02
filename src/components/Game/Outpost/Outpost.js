import React,{Component} from 'react';
import './Outpost.css';

class Outpost extends Component {
    state = {
      buyFood: 0,
      
    }
    incrementObject = (object) => {
      this.setState({
        [object]: this.state[object] + 1
      })
    }
    render(){
        return(
            <div id="outpostView">
                <table>
                    <thead>
                        <tr>
                            <td>Buy</td>
                            <td>Sell</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                          <td>Food <button onClick={()=>this.incrementObject("buyFood")} className="universalButton">+</button></td>
                        </tr>
                    </tbody>
                </table>
                <span>{JSON.stringify(this.state,null,2)}</span>
            </div>
        )
    }
}

export default Outpost;