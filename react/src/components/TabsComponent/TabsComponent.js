import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';
import IntegratedBots from '../../components/IntegratedBots/IntegratedBots';
import BotStore from '../../views/Bot/BotStore';

export default class TabsComponent extends Component {
    render() {
        const panes = [
            { menuItem: 'Bot Store', render: () => {return (<Tab.Pane attached={false}><BotStore /></Tab.Pane> )}},
            { menuItem: 'Integrated Bots', render: () => {return (<Tab.Pane attached={false} ><IntegratedBots/></Tab.Pane> )}},
          ]
          return(
            <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
          )
    }
}