import React, { Component } from 'react';
import {Container} from '../../components/Container/Container';
import { withRouter } from 'react-router-dom';
import * as PageNotFoundComponents from './PageNotFoundComponents';


class PageNotFound extends Component {
    constructor(props) {
        super(props);
        this.state = {
          clouds : []
        };
    };
    componentDidMount = () => {
        this.props.history.push({
            pathname: '/404',
        });
        this.generateClouds();
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
    
    render() {
        return (
    <PageNotFoundComponents.CloudsWrapper>
        {
             this.state.clouds.map((rd,i) => {
                return(rd)
            })
            
        }
    </PageNotFoundComponents.CloudsWrapper>
        )
    }
}

export default withRouter(PageNotFound);



