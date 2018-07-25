import React, {Component} from 'react'
import './TrialDaysLeft.css'
import CommonUtils from '../../utils/CommonUtils';
import { Link } from 'react-router-dom';

export default class TrialDaysLeft extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showPopupBox: true
        };

        this.showPopup = this.showPopup.bind(this);
        this.hidePopup = this.hidePopup.bind(this);
    }
    
    componentDidMount() {
        if (typeof(Storage) !== "undefined") {
            (localStorage.getItem("KM_TRIAL_OVER") === null ) ?
              document.querySelector(".km-trial-days-left-popup-container").classList.add("shown") : document.querySelector(".km-trial-days-left-popup-container").classList.add("hidden")   
          } else {
              console.log("Please update your browser.");
          }
    }

    showPopup(elem) {
        document.querySelector(".km-trial-days-left-popup-container").removeAttribute("style");
    }

    hidePopup(elem){
        if (typeof(Storage) !== "undefined") {
            if(localStorage.getItem("KM_TRIAL_OVER") === null) {
                localStorage.setItem("KM_TRIAL_OVER", "true");
                document.querySelector(".km-trial-days-left-popup-container").style.display = "none";
            } else {
                document.querySelector(".km-trial-days-left-popup-container").style.display = "none";
            }
            } else {
                console.log("Please update your browser.");
        }
    }

    render() {

        let daysLeft;
        if(CommonUtils.isTrialPlan())
        {
            daysLeft = ["trial ", <span key="0">{31 - CommonUtils.getDaysCount()} days</span>, " left"];
        } else {
            daysLeft = ["", <span key="0">upgrade plan</span>, ""];
        }

        return(
            <div className={(CommonUtils.isTrialPlan() || CommonUtils.isStartupPlan()) ? "km-trial-days-left-container" : "n-vis" } onMouseOver={this.showPopup}>
                { (CommonUtils.isTrialPlan()) ?
                    <div className="km-trial-days-left">
                        <p>{daysLeft}</p>
                    </div> 
                    : <div className="km-trial-days-left">
                        <Link to="/settings/billing?offer=early-bird" className="km-button km-button--secondary trial-over">{daysLeft}</Link>
                    </div> 
                }
                
                        <div id="km-trial-days-left-popup-container" className="km-trial-days-left-popup-container text-center">
                        {
                        (CommonUtils.isTrialPlan()) ?
                        <div>
                            <div className="km-trial-days-left-popup-demo">
                                <img src="data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/4QMdaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQ3NjA5NUEyMzhENzExRTg5RDIwOEM5MDg0NUYxMDAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQ3NjA5NUExMzhENzExRTg5RDIwOEM5MDg0NUYxMDAwIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0iQUZGMDNDNTA3RDhGMDg4QTVBQjk5QTQwQzUyRUYxQjMiIHN0UmVmOmRvY3VtZW50SUQ9IkFGRjAzQzUwN0Q4RjA4OEE1QUI5OUE0MEM1MkVGMUIzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAEAsLCwwLEAwMEBcPDQ8XGxQQEBQbHxcXFxcXHx4XGhoa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" alt="avatar_vigil"/>
                                <p className="km-person-name">
                                    Vigil Viswanathan
                                </p>
                                <p className="km-person-designation">
                                    Director of Sales &amp; Marketing
                                </p>
                                <p className="km-quote first">Want to see how you can increase</p>
                                <p className="km-quote mid">your support efficiency by 27%?</p>
                                <p className="km-quote last">Schedule a demo with me!</p>

                                <a href="https://calendly.com/kommunicate/15min" target="_blank" className="km-button km-button--secondary km-demo-btn">Get demo</a>
                            </div>
                            <div className="km-trial-days-left-popup-buy-plan">
                                <p>Ready to improve your customer support?</p>
                                <Link to="/settings/billing?offer=early-bird" className="km-button km-button--primary km-demo-btn">See plans</Link>
                            </div>
                            <div className="km-trial-days-left-close-btn" onClick={this.hidePopup}>
                                <svg className="km-modal-close-icon" xmlns="http://www.w3.org/2000/svg" fill="#8d8888" height="24" viewBox="0 0 24 24" width="24">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                    <path d="M0 0h24v24H0z" fill="none" />
                                </svg>
                            </div>
                            <div className="triangle-before"></div>
                            <div className="triangle-after"></div>
                            </div>
                            : ""
                        }
                        </div> 
                
            </div>  
        )
    }
}