var ctx = document.getElementById("data-chart").getContext("2d");

var initialData = getTenRandomValues();

var data = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: initialData
        }
    ]
};

var dataChart = new Chart(ctx).Bar(data);

$('#mainChart').on('click', function(event) {
  event.preventDefault();
  //var new_data = getTenRandomValues();
  var new_data = [];
  /*
  console.log("Before.");
  $.getJSON('localhost:3000/ten_last_minutes.json', function(data){
    console.log("Inside.");
    console.log(data);
  });
  console.log("After.");

  for(var i = 0; i < new_data.length; i++){
    dataChart.datasets[0].bars[i].value = new_data[i];
  }
  dataChart.update();*/

  $.ajax({
    url: "localhost:3000/ten_last_minutes.json",

    // The name of the callback parameter, as specified by the YQL service
    jsonp: "callback",

    // Tell jQuery we're expecting JSONP
    dataType: "jsonp",

    // Tell YQL what we want and that we want JSON
    data: {
        q: "select title,abstract,url from search.news where query=\"cat\"",
        format: "json"
    },

    // Work with the response
    success: function( response ) {
        console.log( response ); // server response
    }
});
});

function getTenRandomValues(){
  var arr = [];
  var n_values = 10
  for (var i=0; i<n_values; i++) {
      arr.push(Math.round(Math.random() * 100))
  }
  return arr;
}

/*
setInterval(function(){
  var new_data = getTenLastMinutes();
  for(var i = 0; i < new_data.length; i++){
    dataChart.datasets[0].bars[i].value = new_data[i];
  }
  dataChart.update();
}, 1000);
*/
