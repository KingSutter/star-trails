import React,{Component} from 'react';
import {connect} from 'react-redux';

class Game extends Component{
    componentDidMount(){
        this.props.dispatch({type: "GET_SAVE"})
    }
    render(){
        return(
            <>
            <div id="shipImage">
                Test
            </div>
            <div id="distanceTravelledGraph">
            
            </div>
            <div id="suppliesGraph">
                <table>

                </table>
            </div>
            <footer id="buttons">
                
            </footer>
            <span>{JSON.stringify(this.props,null,2)}</span>
            </>
        )
    }
}

const mapReduxStateToProps = (reduxState) => {
    return {
        saveData: reduxState.game,
    }
}

export default connect(mapReduxStateToProps)(Game);