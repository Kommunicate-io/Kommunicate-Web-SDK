import React, { Component } from 'react';
import './bot.css';
// import { Tab } from 'semantic-ui-react';
// import IntegratedBots from '../../components/IntegratedBots/IntegratedBots';
// import BotStore from '../../views/Bot/BotStore';
import TabsComponent from '../../components/TabsComponent/TabsComponent';

// const panes = [
//   { menuItem: 'Bot Store', render: () => <Tab.Pane attached={false}><BotStore /></Tab.Pane> },
//   { menuItem: 'Integrated Bots', render: () => <Tab.Pane attached={false} ><IntegratedBots/></Tab.Pane> },
// ]

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
                  {/* <p>Currently using React {React.version}</p> */}
                  {/* <Tab menu={{ secondary: true, pointing: true }} panes={panes} /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Tabs;