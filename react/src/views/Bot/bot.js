import React, { Component } from 'react';
import './bot.css';
import TabsComponent from '../../components/TabsComponent/TabsComponent';
import LockBadge from '../../components/LockBadge/LockBadge';
import CommonUtils from '../../utils/CommonUtils';


class Tabs extends Component {
  render() {
    return (
      <div className="animated fadeIn" >
      {/* Change showNewBot to false to hide new bot section*/}
        <div className={(CommonUtils.isProductApplozic() || CommonUtils.hasFeatureAccess()) ? "card": "n-vis"} style={{display:"block"} }>
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

        <div className={(CommonUtils.isProductApplozic() || CommonUtils.hasFeatureAccess()) ? "n-vis" : "upgrade-plan-container upgrade-plan-bot-integration"}>
          <div className="upgrade-plan-heading-container">
              <div className="upgrade-plan-heading">
                  <h4>Upgrade your plan to integrate bots</h4> 
                  <button className="km-button km-button--primary" onClick={() => this.props.history.push("/settings/billing")}>Upgrade plan</button>
              </div>
          </div>
          
          <div className="upgrade-plan-integrations">
              <h2>What are Bot Integrations?</h2>
              <p className="p">Bots help you automate routine and mundane tasks. Integrate your bots using popular bot builder platforms or get a custom bot made.</p>
          </div>
          <div className="upgrade-plan-available-integrations">
              <h2>Bot integrations you are missing out on</h2>
              <div className="upgrade-plan-available-integrations-icons">
                  <LockBadge className={"lock-with-text"} text={"Available in Growth Plan"} history={this.props.history} onClickGoTo={"/settings/billing"}/>
                  <div className="integrations-icons-container">
                      <div className="integrations-icons dialogflow text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-982 5204 50.53 64.005">
                          <defs>
                            <clipPath id="a">
                              <path d="M48.33 12.64L27.45.59a4.392 4.392 0 0 0-4.38 0L2.19 12.64a4.4 4.4 0 0 0-2.18 3.8v24.12a4.392 4.392 0 0 0 2.18 3.79l10.45 6.04V62.7a1.31 1.31 0 0 0 1.32 1.31 1.249 1.249 0 0 0 .65-.18l33.75-19.47a4.346 4.346 0 0 0 2.18-3.79V16.44a4.4 4.4 0 0 0-2.21-3.8z" data-name="Path 10"/>
                            </clipPath>
                          </defs>
                          <g clipPath="url(#a)" data-name="Group 14" transform="translate(-982.01 5203.995)">
                            <path fill="#ef6c00" d="M0 13.91v29.16l12.63 7.29v14.59l37.88-21.88V13.91L25.26 28.49z" data-name="Path 6"/>
                            <path fill="#ff9800" d="M0 13.91L25.26-.67l25.25 14.58-25.25 14.58z" data-name="Path 7"/>
                            <path fill="#bf360c" d="M49.92 13.56l-25.1 14.49L.16 13.81l-.16.1 25.26 14.58 25.25-14.58z" data-name="Path 8" opacity=".1"/>
                            <path fill="#fff" d="M25.26 28.49L.16 14l-.16.09 25.26 14.58z" data-name="Path 9" opacity=".1"/>
                          </g>
                        </svg>
                          <p className="bot-heading">Dialogflow</p>
                          <p className="bot-description">Create any bot in <a href="https://dialogflow.com/" target="_blank" rel="noopener noreferrer">Dialogflow</a> and use it to interact with your customers by integrating it with Kommunicate</p>
                      </div>
                      
                      
                      <div className="integrations-icons custom-bot text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352.7 316.7">
                          <path className="km-logo-final-logo-beta-0" d="M348.5,302.2V121.2c0-65.4-53-118.3-118.3-118.3H122.5C57.1,2.8,4.1,55.8,4.1,121.2 c0,65.4,53,118.4,118.4,118.4H239c0,0,9.5,0.6,15.2,2.6c5.5,2,11.5,6.8,11.5,6.8l72,59.3c0,0,6.5,5.6,8.9,4.5 C349,311.5,348.5,302.2,348.5,302.2z M125.8,145.3c0,7.9-6.9,14.3-15.4,14.3S95,153.2,95,145.3V94.5c0-7.9,6.9-14.3,15.4-14.3 s15.4,6.4,15.4,14.3V145.3z M191.7,169.3c0,7.9-6.9,14.3-15.4,14.3c-8.5,0-15.4-6.4-15.4-14.3V70.5c0-7.9,6.9-14.3,15.4-14.3 c8.5,0,15.4,6.4,15.4,14.3V169.3z M257.6,145.3c0,7.9-6.9,14.3-15.4,14.3c-8.5,0-15.4-6.4-15.4-14.3V94.5c0-7.9,6.9-14.3,15.4-14.3 c8.5,0,15.4,6.4,15.4,14.3V145.3z" fill="#5C5AA7">
                          </path>
                        </svg>
                        <p className="bot-heading">Custom Bot</p>
                        <p className="bot-description">Don’t want to create any bot? No problem. Just tell us your bot use-case and we will create a bot for you</p>
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