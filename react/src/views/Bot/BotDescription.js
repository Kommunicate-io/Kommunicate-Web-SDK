import React, { Component } from 'react';
import './botDescription.css';

function getDescription(type){
    switch(type){
        case "ADD_BOT":
        return "You can create a bot here. This step will create a bot in Kommunicate system."+
        "you can configure it with any AI platform later";
        break;
        case "CONFIGURE_BOT":

        return "you can configure your Bot with any AI platform. Right now only Dialog Flow(Google's bot builder platform  is supported)."+
       "check out Dialog Flow here: https://dialogflow.com/ "+
        "let us know if you have any other platform in mind.";
        break;
    }
}

class BotDiscription extends Component{

    constructor(props){
        super(props);
        this.state={
            descriptionType: props.type,
            description :getDescription(props.type)
        }
    }
    componentWillReceiveProps(nextProps){
        console.log("received props",nextProps);
        this.setState({description:getDescription(nextProps.type)});
    }
    render(){
        return(<div>
            <div className="card">
              <div className="row">
                <h4 className="instruction-heading">
                 Looking for bot Integration? 
                </h4>
              </div>
              <div className="card-header"><h5>{this.props.header}</h5>
                  <div>
                      <div className="row">
                        <div className="form-group col-md-12 description-text-area">
                           {this.state.description}
                        </div>
                      </div>
                    
                  </div>
                </div>
              </div>

        </div>);
    }
}

export default BotDiscription;