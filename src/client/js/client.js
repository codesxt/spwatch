var ctx = document.getElementById("data-chart").getContext("2d");

var initialData = [0,0,0,0,0,0,0,0,0,0];

var data = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(87,213,255,0.2)",
            strokeColor: "rgba(66,168,200,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: initialData
        }
    ]
};

var dataChart = new Chart(ctx).Line(data);

$('#mainChart').on('click', function(event) {
  event.preventDefault();
  updateLastTenMinutes();
});

function getTenRandomValues(){
  var arr = [];
  var n_values = 10
  for (var i=0; i<n_values; i++) {
      arr.push(Math.round(Math.random() * 100))
  }
  return arr;
}

function updateLastTenMinutes(){
  var new_data = [];
  $.ajax({
      url: 'http://localhost:3000/ten_last_minutes.json',
      dataType: 'jsonp',
      success: function(dataWeGotViaJsonp){
          var text = '';
          var len = dataWeGotViaJsonp.length;
          new_data = dataWeGotViaJsonp.data;
          for(var i = 0; i < new_data.length; i++){
            dataChart.datasets[0].points[i].value = new_data[i];
          }
          dataChart.update();
      }
  });
}

setInterval(function(){
  updateLastTenMinutes();
}, 1000);
