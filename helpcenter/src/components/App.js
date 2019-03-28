import React, { Component, Fragment } from 'react';
import Header from './Header/Header';
import FaqList from '../views/FaqList/FaqList';
import  Article from '../views/Article/Article';
import  {Loading} from '../views/Loading/Loading';
import { ThemeProvider } from 'styled-components';
import  '../scss/main.scss';
import { Switch, Route, BrowserRouter as Router , withRouter } from 'react-router-dom';
import  PoweredByKommunicate  from '../components/PoweredByKommunicate/PoweredByKommunicate';
import {StyleUtils} from '../utils/StyleUtils';
import  PageNotFound  from '../views/PageNotFound/PageNotFound';
import {CommonUtils} from '../utils/CommonUtils';
import {HelpcenterClient} from '../utils/HelpcenterClient';
import { DEFAULT_HELPCENTER_SETTINGS} from '../utils/Constants';
import { HelpCenterDataContext, HelpCenterData } from '../context/HelpcenterDataContext';
import { ThirdPartyScripts } from '../utils/ThirdPartyScripts';

class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            appId : ''
        };
    };
    componentDidUpdate(prevProps) {
        //following function will search if appId is present in URL if yes the APPID url will be maintained throughout the app
        this.state.appId && (
            (((prevProps.location.pathname !== this.props.location.pathname) || (prevProps.location.search !== this.props.location.search))) &&
            this.onRouteChanged(this.props.location.search)
        )
    }
    
    onRouteChanged(prevSearchQuery) {
        let search =  window.location.origin + window.location.pathname + '?appId=' + this.state.appId; 
        CommonUtils.getUrlParameter(prevSearchQuery,'q') && (search += '&q=' +CommonUtils.getUrlParameter(prevSearchQuery,'q'))
        window.history.replaceState( {} , '', search );
    }
    
    componentDidMount = () => {
        this.setState({
            appId : CommonUtils.getUrlParameter(window.location.search,'appId')
        })
    }
    

    render(){ 
        return ( 
        <div>
            <HelpCenterDataContext>
                <HelpCenterData.Consumer>
                    {(context)=>(
                        context.helpCenter.theme && context.helpCenter.appId?
                        <ThemeProvider theme={context.helpCenter.theme}>
                            <Fragment>
                                <ThirdPartyScripts/>
                                {
                                    !location.pathname.includes('404') && <Header/> 
                                }
                                    <Switch>
                                        <Route exact path='/'  component={FaqList}/>
                                        <Route path='/article'  component={Article}/>
                                        <Route component={PageNotFound} />
                                    </Switch>
                                {
                                    !location.pathname.includes('404') && <PoweredByKommunicate fill={"#cacaca"} textColor={"#cacaca"} />
                                }    
                            </Fragment>
                        </ThemeProvider>  
                        :    
                        <Loading/>
                    )}
                </HelpCenterData.Consumer>  
            </HelpCenterDataContext>
        </div>
        )
    } 
}
export default withRouter(App);