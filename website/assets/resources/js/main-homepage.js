var nextTab, totalCards, centerCard, centreCard_tabs, leftCard, rightCard, leftCard_tabs, rightCard_tabs, totalCards_tabs, fiveSecTimer, leftToggle = document.getElementById("left-toggle"),
    f_leftToggle = document.getElementById("features_left-toggle"),
    f_rightToggle = document.getElementById("features_right-toggle"),
    rightToggle = document.getElementById("right-toggle"),
    footerLinks = document.getElementsByClassName("footer_link"),
    div = $(".tablink");

function startInterval() {
    var t = $(".tablink").filter(".active");
    (t.index() < div.length + 1 ? t.next() : div.first()).mouseover()
}

function stopInterval() {
    clearInterval(fiveSecTimer)
}

function sortCards() {
    totalCards = parseInt(document.getElementsByClassName("carousel_card").length), totalCards_tabs = parseInt(document.getElementsByClassName("features_carousel_tabs").length), centerCard = Math.round(totalCards / 2), centerCard_tabs = Math.round(totalCards_tabs / 2), leftCard_tabs = centerCard_tabs - 1, leftCard = centerCard - 1, rightCard_tabs = centerCard_tabs + 1, rightCard = centerCard + 1
}

function carousel() {
    for (var t = 1; t <= totalCards_tabs; t++) t < centerCard_tabs && 0 !== leftCard_tabs ? ( document.getElementById("indicator" + t + "-tab").className = "features_carousel_indicator_block", t == leftCard_tabs ? document.getElementById("card_" + leftCard_tabs + "_tab").className = "features_carousel_card features_card_left features_active_left" : document.getElementById("card_" + t + "_tab").className = "features_carousel_card features_card_left") : t == centerCard_tabs ? (document.getElementById("card_" + t + "_tab").className = "features_carousel_card features_card_active", document.getElementById("indicator" + t + "-tab").className = "features_carousel_indicator_block active") : t > centerCard_tabs && 0 !== rightCard_tabs && (document.getElementById("indicator" + t + "-tab").className = "features_carousel_indicator_block", t == rightCard_tabs ? document.getElementById("card_" + rightCard_tabs + "_tab").className = "features_carousel_card features_card_right features_active_right" : document.getElementById("card_" + t + "_tab").className = "features_carousel_card features_card_right")
}

function f_slideRight() {
    f_leftToggle.style.opacity = ".9", centerCard_tabs >= totalCards_tabs - 1 && (f_rightToggle.style.opacity = ".3"), centerCard_tabs != totalCards_tabs && (centerCard_tabs += 1, leftCard_tabs = centerCard_tabs - 1, rightCard_tabs = centerCard_tabs + 1), carousel()
}

function f_slideLeft() {
    f_rightToggle.style.opacity = ".9", (2 == centerCard_tabs || 0 == centerCard_tabs) && (f_leftToggle.style.opacity = ".3"), 1 != centerCard_tabs && (centerCard_tabs -= 1, leftCard_tabs = centerCard_tabs - 1, rightCard_tabs = centerCard_tabs + 1), carousel()
}

function changeCard(t) {
    leftToggle.style.opacity = ".9", rightToggle.style.opacity = ".9", 1 != t && (centerCard = t - 1), t <= centerCard ? slideLeft() : slideRight()
}

function f_changeCard(t) {
    f_leftToggle.style.opacity = ".9", f_rightToggle.style.opacity = ".9", 1 != t && (centerCard_tabs = t - 1), t <= centerCard_tabs ? f_slideLeft() : f_slideRight()
}

function navToggle(t) {
    document.getElementById("nav_content").classList.toggle("nav_open"), t.classList.toggle("anim")
}
$(div).on("mouseover", function () {
    var t = $(this).index();
    $(this).is("active") || ($(".tablink").removeClass("active"), $(this).addClass("active"), $(".tabcontent").css("display", "none"), $("#tab" + (t - 1)).css("display", "block"), stopInterval(), fiveSecTimer = setInterval(startInterval, 5e3))
});
var stickyNavTop = $(".navbar_wrapper").offset().top;
window.onscroll = function () {
    myScrollFunction()
};
var header = document.getElementById("navbar"),
    sticky = header.offsetTop;

function myScrollFunction() {
    window.pageYOffset > sticky ? header.classList.add("navbar_sticky") : header.classList.remove("navbar_sticky")
}
sortCards(), carousel();
