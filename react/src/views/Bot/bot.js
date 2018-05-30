import React, { Component } from 'react';
import './bot.css';
import TabsComponent from '../../components/TabsComponent/TabsComponent';


// const panes = [
//   { menuItem: 'Bot Store', render: () => <Tab.Pane attached={false}><BotStore /></Tab.Pane> },
//   { menuItem: 'Integrated Bots', render: () => <Tab.Pane attached={false} ><IntegratedBots/></Tab.Pane> },
// ]
// const TabExampleSecondaryPointing = () => (
//   <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
// )
class Tabs extends Component {
  render() {
    return (
      <div className="animated fadeIn" >
      {/* Change showNewBot to false to hide new bot section*/}
        <div className="card" style={{display:"block"} }>
          <div className="card-block">
            <div className="bot-main-card-container">
              <div className="row">
                <div style={{width:"100%"}}>
                  <TabsComponent />
                </div>
                {/* <div className="col-sm-12 km-bot-integration-heading">
                  <p>Integrating a bot will allow you to send answers to some customer <br />queries automatically</p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Tabs;