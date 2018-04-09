import React, { Component, PropTypes } from 'react';
import './EarlyBirdOffer.css';

export default class EarlyBirdOffer extends Component {


    render() {

        const {OfferPercent, remainingOffers} = this.props;

        return(
            <div className="early-bird-offer-container">
                <div className="early-bird-offer">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="early-bird-details-container">
                            <div className="img-container">
                                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 45.965 48.14'>
                                    <circle id='Oval' cx='2.407' cy='2.407' r='2.407' fill='#2dd35c' transform='translate(16.047 14.442)'
                                    />
                                    <circle id='Oval-2' cx='2.407' cy='2.407' r='2.407' fill='#2dd35c'
                                    dataName='Oval' transform='translate(25.14 28.349)' />
                                    <path id='Shape' fill='#2dd35c' d='M23.01 48.14a2.44 2.44 0 0 1-1.738-.723l-4.44-4.333-6.151.856a2.476 2.476 0 0 1-2.835-2.032l-1.069-6.1-5.456-2.886a2.532 2.532 0 0 1-1.07-3.316l2.728-5.563-2.728-5.562a2.532 2.532 0 0 1 1.07-3.316l5.456-2.942 1.069-6.1a2.531 2.531 0 0 1 2.444-2.064 2.5 2.5 0 0 1 .391.032l6.1.909 4.44-4.28a2.454 2.454 0 0 1 3.477 0L29.135 5l6.152-.856a2.476 2.476 0 0 1 2.835 2.032l1.069 6.1 5.456 2.888a2.532 2.532 0 0 1 1.07 3.316l-2.728 5.562 2.728 5.563a2.6 2.6 0 0 1-1.07 3.371l-5.456 2.888-1.069 6.1a2.531 2.531 0 0 1-2.444 2.064 2.5 2.5 0 0 1-.391-.032l-6.1-.909-4.439 4.333a2.444 2.444 0 0 1-1.738.72zm4.52-21.957a4.546 4.546 0 1 0 4.547 4.546 4.552 4.552 0 0 0-4.547-4.546zm2.609-12.826a1.051 1.051 0 0 0-.844.417L15.442 31.959a1.089 1.089 0 0 0 .213 1.5 1.033 1.033 0 0 0 .642.214 1.113 1.113 0 0 0 .856-.428l13.854-18.188a1.09 1.09 0 0 0-.214-1.5 1.175 1.175 0 0 0-.654-.2zm-11.7-1.081a4.546 4.546 0 1 0 4.546 4.546 4.552 4.552 0 0 0-4.548-4.546z'
                                        transform='translate(.016 .027)' />
                                </svg>
                            </div>
                            <div className="early-bird-details">
                                <p className="percent-off">{OfferPercent}% off on</p>
                                <h3 className="early-bird-plan-name">Early Bird Plan</h3>
                                <p className="early-bird-plan-description">Available for the first 100 customers</p>
                            </div>
                        </div>
                        <div className="offer-tag">
                            <p>OFFER</p>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 curves-container">
                        <button className="km-button km-button--primary avail-offer-button">Avail offer now</button>
                        <p className="offer-left">Hurry, only <span><strong>{remainingOffers}</strong></span> remaining!</p>
                        <div className="bg-curves-container">
                            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 307.032 135.562'>
                                <path fill='#5c5aa7' d='M71.791 0c-34.4 29.12-87.862 84.747-67.165 135.562 5.385-.045 302.406-.184 302.406-.184V0S89.413.321 71.791 0z'
                                dataName='Path 2' />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


EarlyBirdOffer.propTypes = {
    OfferPercent: PropTypes.string.isRequired, 
    remainingOffers: PropTypes.string.isRequired,
}