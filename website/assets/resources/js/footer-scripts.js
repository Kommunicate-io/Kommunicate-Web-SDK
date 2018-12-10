  var trackcmp_email = '';
  var trackcmp = document.createElement("script");
  trackcmp.async = true;
  trackcmp.type = 'text/javascript';
  trackcmp.src = '//trackcmp.net/visit?actid=66105982&e='+encodeURIComponent(trackcmp_email)+'&r='+encodeURIComponent(document.referrer)+'&u='+encodeURIComponent(window.location.href);
  var trackcmp_s = document.getElementsByTagName("script");
  if (trackcmp_s.length) {
  trackcmp_s[0].parentNode.appendChild(trackcmp);
  } else {
  var trackcmp_h = document.getElementsByTagName("head");
  trackcmp_h.length && trackcmp_h[0].appendChild(trackcmp);
  }


  (function(i,s,o,g,r,a,m){i['ProfitWellObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
    })(window,document,'script','https://dna8twue3dlxq.cloudfront.net/js/profitwell.js','profitwell');
    profitwell('auth_token', '71e77c6a8d59f50233d1705120049bf1'); // Your unique Profitwell public API token
    profitwell('user_email', '');


$(".calendly-url").click(function(){
      var heapData;
      heap.identity == null ? heapData = heap.userId : heapData = heap.identity ;
      window.open($(this).attr("href")+"?utm_source="+heapData, '_blank');
      return false;
    });


if(window.location.search == "?ref=sifterydeals") {
  $(".announcement").css("display","inline-block");
  $("#coupon").text("SIFTERY");
} else if(window.location.search == "?ref=deal") {
  $(".announcement").css("display","inline-block");
  $("#coupon").text("FRIDAY");
}


function acEventTrigger(event) {

  if(!heap.identity){
    return;
  }

  var xhttp = new XMLHttpRequest();  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // console.log(this.responseText);
    } else {
      // console.log(this.responseText)
    }
  };
 
  //  ActiveCampaign id. 
  var actid = "66105982";

  //  event key,
  var eventKey = "6fcd6450068b76b0eb4e03c32f22cedbd7c5b545";


  var visit = {
    email:  heap.identity // the user's email address
  }

  // get the url of the page and send it as event data
  var eventData = "kommunicate";

  // build the eventString based on the variables you just edited above 
  var eventString = "actid=" + actid +
    "&key=" + eventKey +
    "&visit=" + encodeURIComponent(JSON.stringify(visit)) +
    "&visit=" + heap.identity +
    "&eventdata=" + eventData;
    
    xhttp.open("POST", "https://services.kommunicate.io/track?", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(eventString);

}
