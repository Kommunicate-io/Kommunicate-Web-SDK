$(function(){
    var $env =$("#env-url");
    var $appId  =$("#appKey");
    var $userName =$("#userId");
    var $password =$("#password");

    


    $("#chat-submit").on('click',function(){

        var env = $env.value();
        var appId  =$appId.value();
        var userName =$userName.value();
        var password =$password.value();

        if(!env || !appId || !userName || !password){
            alert("fill all fields");
            return;
        }else{

           var  applozicbaseUrl= env==="prod"?"https://chat.kommunicate.io/":"https://apps-test.applozic.com/";
            var kmUrl = env==="prod"?"https://api.kommunicate.io/kommunicate.app":"https://api-test.kommunicate.io/kommunicate.app"

            (function(d, m){
                let o = {"appId":appId,"isAnonymousChat":true,"baseUrl":applozicbaseUrl};
                let s = document.createElement("script");
                s.type = "text/javascript";
                s.async = true;
                s.src = kmUrl ;
                let h = document.getElementsByTagName("head")[0];
                h.appendChild(s);
                window.applozic = m;
                m._globals = o;
              })(document, window.kommunicate || {});
        }
    })

    
})