/* eslint-disable */
const getJSON = (function(){
  var that = {};
  that.send = function(url, options) {
      var on_success = options.onSuccess || function(){},
          on_error   = options.onError   || function(){},
          on_timeout = options.onTimeout || function(){},
          timeout    = options.timeout   || 10000; // ms

      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
              //console.log('responseText:' + xmlhttp.responseText);
              try {
                  var data = JSON.parse(xmlhttp.responseText);
              } catch(err) {
                  console.log(err.message + " in " + xmlhttp.responseText);
                  return;
              }
              on_success(data);
          }else{
              if(xmlhttp.readyState == 4){
                  on_error();
              }
          }
      };
      xmlhttp.timeout = timeout;
      xmlhttp.ontimeout = function () {
          on_timeout();
      }
      xmlhttp.open("GET", url, true);
      xmlhttp.send();
  }
  return that;
}());

export default getJSON;

// getJSON.send("someUrl.com", {
//   onSuccess: function(data){
//       console.log("success",data);
//   },
//   onError: function(){
//       console.log("Error");
//   },
//   onTimeout: function(){
//       console.log("Timeout");
//   },
//   timeout: 10000
// });
