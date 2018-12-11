import React from "react"
import './cardList.css'

function CardList(props) {
    return (
        <div className="km-card-list-container">
            <div className="km-card-list-wrapper">
                <div className="km-card-icon-wrapper">
                    {props.img}
                </div>
                <div className="km-card-title-wrapper">
                    <p className="km-card-title">{props.title}</p>
                    <p className="km-card-content">{props.content}</p>
                </div>
            </div>
            <div className="km-card" data-card={props.card} onClick={props.handleClick}></div>
        </div>
    )
}
export default CardList;