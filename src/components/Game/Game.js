import React,{Component} from 'react';
import {connect} from 'react-redux';

class Game extends Component{
    render(){
        return(
            <>
            <div id="shipImage">
                Test
            </div>
            <div id="distanceTravelledGraph">

            </div>
            <div id="suppliesGraph">

            </div>
            <footer id="buttons">
                
            </footer>
            </>
        )
    }
}

const mapReduxStateToProps = (reduxState) => {
    return {saveData: reduxState.saveReducer}
}

export default connect(mapReduxStateToProps)(Game);