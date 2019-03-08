import React, { Component } from 'react';
import {Container} from '../../components/Container/Container';
import { withRouter } from 'react-router-dom';
import * as PageNotFoundComponents from './PageNotFoundComponents';
import { FourOhFourOne, FourOhFourTwo, FourOhFourThree } from '../../assets/svgAssets';
import  Button  from "../../components/Button/Button";
import  PoweredByKommunicate  from "../../components/PoweredByKommunicate/PoweredByKommunicate";
import { CommonUtils } from '../../utils/CommonUtils'

class PageNotFound extends Component {
    constructor(props) {
        super(props);
        this.state = {
          clouds : [],
          waves : []
        };
    };
    componentDidMount = () => {
        this.setState({
            settings : CommonUtils.getItemFromLocalStorage(CommonUtils.getHostNameFromUrl())
        },()=>{
            let searchQuery = '?appId='+this.state.appId;
            this.props.history.push({
                pathname: '/404'
            });
        })
       
        this.generateClouds();
        this.generateWaves();
    }
    generateClouds = () =>{
        for(let i = 1; i<=5; i++){
           this.state.clouds.push(
            <PageNotFoundComponents.CloudAnimWrapper className={"cloudAnim"+i} key={i} >
                <PageNotFoundComponents.Cloud />
            </PageNotFoundComponents.CloudAnimWrapper>
           )
        }
    }
    
    generateWaves = () => {
        for(let i = 1; i<=4; i++){
            this.state.waves.push(
             <PageNotFoundComponents.Wave className={"wave_"+i} key={i}/>
            )
         }
    }

    returnHome = () => {
        this.state.settings ?
            this.props.history.push({
                pathname: '/'
            }) :
            window.location.assign(CommonUtils.getKommunicateWebsiteUrl())
    }
    componentDidUpdate(prevProps, prevState) {
        var that = this;
        window.onpopstate = function (event) {
            that.props.history.push({
                pathname: '/404'
            })
        };
    }
    render() {
        return (
        <PageNotFoundComponents.PageNotFoundWrapper>
            <PageNotFoundComponents.CloudsWrapper>
                {
                    this.state.clouds.map((cloud,i) => {
                        return(cloud)
                    })
                    
                }
            </PageNotFoundComponents.CloudsWrapper>
              <PageNotFoundComponents.PageNotFoundHeading>Uh oh!</PageNotFoundComponents.PageNotFoundHeading>            
            <PageNotFoundComponents.Waves>
                <PageNotFoundComponents.ErrorBlockContainer>
                    <PageNotFoundComponents.ErrorBlock>
                        <FourOhFourOne className="fourOne"/>
                    </PageNotFoundComponents.ErrorBlock>
                    <PageNotFoundComponents.ErrorBlock>
                        <FourOhFourTwo className="fourTwo"/>
                    </PageNotFoundComponents.ErrorBlock>
                    <PageNotFoundComponents.ErrorBlock>
                        <FourOhFourThree className="fourThree"/>
                    </PageNotFoundComponents.ErrorBlock>
                </PageNotFoundComponents.ErrorBlockContainer>
                    {
                        this.state.waves.map((wave,i) => {
                            return(wave)
                        })
                    }
            </PageNotFoundComponents.Waves>
            <PageNotFoundComponents.FooterContainer>
                <PageNotFoundComponents.PageNotFoundMessage>
                    Sorry, we did not find the page you were looking for.
                </PageNotFoundComponents.PageNotFoundMessage>    
                <PageNotFoundComponents.PageNotFoundCtaContainer>
                    <Button onClick={this.returnHome} branded>Return Home</Button>
                </PageNotFoundComponents.PageNotFoundCtaContainer>
                <PageNotFoundComponents.PoweredByContainer>
                    <PoweredByKommunicate fill={"#fff"} textColor={"#fff"}/>
                </PageNotFoundComponents.PoweredByContainer>
            </PageNotFoundComponents.FooterContainer>
        </PageNotFoundComponents.PageNotFoundWrapper>
        )
    }
}

export default withRouter(PageNotFound);



