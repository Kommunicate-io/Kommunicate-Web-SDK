var rateSwitcher = document.getElementById("rate-switcher"),
    rateMonthly = document.getElementById("rate-monthly"),
    rateWeekly = document.getElementById("rate-weekly"),
    currMrr = document.getElementById("current-mrr"),
    growthRate = document.getElementById("growth-rate"),
    monthlyExpense = document.getElementById("monthly-expense"),
    projectionTime = document.getElementById("projection-time"),
    growthMonthsTwitter = document.getElementById("final-months"),
    growthMrrTwitter = document.getElementById("final-mrr"),
    shareButton = document.getElementById("share-button"),
    shareTool = document.getElementById("share-tool"),
    revenueTime = document.getElementById("revenueTime"),
    currentMrrValue, growthRateValue, projectionTimeValue, monthlyExpenseValue, finalMrr, growthTimeText, myChart, ctx
monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    date = new Date(),
    currMonth = date.getMonth(),
    currYear = date.getFullYear(),
    monthLabelsArray = [],
    pow = Math.pow, floor = Math.floor, abs = Math.abs, log = Math.log;

ctx = document.getElementById("myChart").getContext('2d');
var gradientFill = ctx.createLinearGradient(0, 500, 0, 0);
gradientFill.addColorStop(0, "rgba(142, 140, 224, 0)");
gradientFill.addColorStop(1, "rgba(41, 45, 228,.35)");
myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'MRR',
            data: [100, 200],
            backgroundColor: [
                'rgba(20, 25, 232, .2)',
            ],
            borderColor: [
                'rgba(20, 25, 232, 1)'
            ],
            borderWidth: 1,
            fill: true,
            backgroundColor: gradientFill
        }]
    },
    options: {
        legend: {
            display: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: false,
                    callback: function (value, index, values) {
                        return '$ ' + FormatLongNumber(value);
                    }
                }
            }],
            xAxes: [{
                gridLines: {
                    display: false
                }
            }]
        }
    }
});

currMrr.addEventListener("keyup", function () {
    if (this.value == "") {
        currentMrrValue = 1;
    } else if (this.value > 9000000) {
        this.value = 9000000;
        currentMrrValue = 9000000;
    } else {
        currentMrrValue = this.value;
    }
    calculateMrr();
});
growthRate.addEventListener("keyup", function () {
    if (this.value == "") {
        growthRateValue = 1;
    } else if (this.value > 1000) {
        this.value = 1000;
        growthRateValue = 1000;
    } else {
        growthRateValue = this.value;
    }
    calculateMrr();
});
// monthlyExpense.addEventListener("keyup", function () {
//     if(this.value == ""){
//         monthlyExpenseValue = 1;
//     }else if(this.value  >9000000 ){
//         this.value = 9000000;
//         monthlyExpenseValue = 9000000;
//     }else{
//         monthlyExpenseValue = this.value; 
//     }
//     calculateMrr();

// });
projectionTime.addEventListener("keyup", function () {
    if (this.value == "") {
        projectionTimeValue = 1;
    } else if (this.value > 99) {
        this.value = 99;
        projectionTimeValue = 99;
    } else {
        projectionTimeValue = this.value;
        growthTimeText = "months";
        growthMonthsTwitter.innerHTML = projectionTimeValue + " " + growthTimeText;
        generateMonths();
    }
    calculateMrr();


});

function generateMonths() {

    var monthIndex = currMonth - 1,
        yearIndex = currYear % 100;
    monthLabelsArray = [];
    for (var i = 0; i <= projectionTimeValue - 1; i++) {
        monthLabelsArray.push(monthArr[monthIndex] + " '" + yearIndex);
        monthIndex === 11 ? (monthIndex = 0, yearIndex++) : monthIndex++;
    }
    myChart.data.labels = monthLabelsArray;
    myChart.update();



}

function populateFields() {
    var customValues = window.location.search;
    customValues = customValues.replace('?', ''); // results in 'ba'
    var customValues = customValues.split("-");

    if (customValues.length === 5) {
        currMrr.value = parseFloat(customValues[0]);
        currentMrrValue = parseFloat(customValues[0]);
        growthRate.value = parseFloat(customValues[1]);
        growthRateValue = parseFloat(customValues[1]);
        // monthlyExpense.value = parseFloat(customValues[2]);
        monthlyExpenseValue = parseFloat(customValues[2]);
        projectionTime.value = parseFloat(customValues[3]);
        projectionTimeValue = parseFloat(customValues[3]); {
            customValues[4] == "months" ? rateSwitcher.checked = false : rateSwitcher.checked = true
        }
    } else {
        currMrr.value = 10000;
        currentMrrValue = 10000;
        growthRate.value = 10;
        growthRateValue = 10;
        // monthlyExpense.value = 5000;
        // monthlyExpenseValue = 5000;
        projectionTime.value = 12;
        projectionTimeValue = 12;
    }
    calculateMrr();
}
populateFields();
generateMonths();


function calculateMrr() {
    var weekInMonths, growthPercent, mrrChart = [],timeInYears=projectionTimeValue;
    growthPercent = (growthRateValue / 100).toFixed(2);
    !rateSwitcher.checked ? (weekInMonths = 4.34) : (weekInMonths = 1);
    for (let i = 1; i <= projectionTimeValue; i++) {
        finalMrr = Math.floor((currentMrrValue * Math.pow((1 + parseFloat(growthPercent)), (weekInMonths * (i)))));
        mrrChart.push(finalMrr);
    }
    projectionTimeValue > 11 ? (finalMrr *= projectionTimeValue, timeInYears = getWords(projectionTimeValue), revenueTime.innerHTML = "yearly", growthTimeText = "") : (projectionTimeValue == 1 ?growthTimeText = " month":growthTimeText = " months", revenueTime.innerHTML = "monthly");
    growthMrrTwitter.innerHTML = "$" + FormatLongNumber(finalMrr);
    growthMonthsTwitter.innerHTML = timeInYears +  growthTimeText;
    window.history.pushState("", "mrrurl", "?" + currentMrrValue + "-" + growthRateValue  + "-" + projectionTimeValue);
    myChart.data.datasets[0].data = mrrChart;
    myChart.update();
}

function switchRate() {
    !rateSwitcher.checked == true ? (rateMonthly.style.color = "#c6c6c8", rateWeekly.style.color = "#000") : (rateWeekly.style.color = "#c6c6c8", rateMonthly.style.color = "#000");
    projectionTimeValue > 12 ? (growthTimeText = "") : null;
    calculateMrr();
}



function round(n, precision) {
    var prec = Math.pow(10, precision);
    return Math.round(n * prec) / prec;
}

function FormatLongNumber(n) {
    var base = floor(log(abs(n)) / log(1000));
    var suffix = 'KMB' [base - 1];
    return suffix ? round(n / pow(1000, base), 2) + suffix : '' + n;
}

// shareButton.addEventListener('click', function shareRevenue(event){
//     event.preventDefault();
//     var shareText = "We’re going to reach $" + FormatLongNumber(finalMrr) + " in "+ projectionTimeValue +" months. Calculate your projections here: www.kommunicate.io/resources/growth-calculator @kommunicateio";
//     var url = "https://twitter.com/intent/tweet?text="+encodeURIComponent(shareText);
//     window.open(url, '_blank');

//} );  
shareTool.addEventListener('click', function shareRevenue(event) {
    event.preventDefault();
    var shareText = "This super cool Growth Calculator from @kommunicateio helped me project my company’s growth easily. Give it a go, now! www.kommunicate.io/resources/growth-calculator";
    var url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText);
    window.open(url, '_blank');

});

function getWords(monthCount) {
    function getPlural(number, word) {
        return number === 1 && word.one || word.other;
    }

    var months = {
            one: ' years',
            other: ' years'
        },
        years = {
            one: ' year',
            other: '.'
        },
        m = monthCount % 12;
        y = Math.floor(monthCount / 12),
        result = [];
        projectionTimeValue > 12 ? years.one = "." : "";
        m == 0 ? years.other = " years": "";

    y && result.push(y + '' + getPlural(y, years));
    m && result.push(m + '' + getPlural(m, months));
    return result.join('');
}




switchRate();