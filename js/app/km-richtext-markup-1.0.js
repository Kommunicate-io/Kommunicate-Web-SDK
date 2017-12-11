Kommunicate.markup={
    KM_HOTEL_ROOM_PAX_INFO :`<div class="km-room-person-selector-container">
<div class="km-room-title-text">ROOM 1</div>
<div class="km-room-selector">
    <span>Adult <span style="font-size:12px; color: rgba(0,0,0,0.5)">(12+ yrs)</span> :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    <span>
        <input type="button" value="-" onclick="decrement()">
        <input type="number" min="1" max="5" value="1" id="km-room-number-field" maxlength="1" disabled>
        <input type="button" value="+" onclick="increment()">
    </span>
</div>
<div class="km-person-selector">
        <span>Children <span style="font-size:12px; color: rgba(0,0,0,0.5)">(1-12 yrs)</span> :</span>
    <span>
        <input type="button" value="-" onclick="decrement2()">
        <input type="number" min="1" max="6" value="1" id="km-person-number-field" maxlength="1" disabled>
        <input type="button" value="+" onclick="increment2()">
    </span>
</div>
<hr>
<div class="km-add-room-button-container">
    <button id="km-add-more-rooms" class="km-add-more-rooms">ADD ROOM</button>
    <button id="km-done-button" class="km-add-more-rooms km-done-button">DONE</button>
</div>
</div>
</div>`
}