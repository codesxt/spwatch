var ctx = document.getElementById("data-chart").getContext("2d");

var initialData = [0,0,0,0,0,0,0,0,0,0];

var updateRate = 1000;

var screenChart = 0;
//0: last ten minutes
//1: last 24 hours
//2: last 7 days

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

var dataChart = new Chart(ctx).Line(data, {animation : false});

$('#minutelyChart').on('click', function(event) {
  event.preventDefault();
  updateRate = 1000;
  updateLastTenMinutes();
  screenChart = 0;
});

$('#hourlyChart').on('click', function(event) {
  event.preventDefault();
  updateRate = 60*1000;
  updateLast24Hours();
  screenChart = 1;
});

$('#dailyChart').on('click', function(event) {
  event.preventDefault();
  updateRate = 60*60*1000;
  updateLast7Days();
  screenChart = 2;
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
          new_data = dataWeGotViaJsonp.data;
          clearChart();
          var d = new Date();
          for(var i = 0; i < new_data.length; i++){
            //dataChart.datasets[0].points[i].value = new_data[i];
            //dataChart.addData([new_data[i]], (hour%60)+":"+(min-(10-i)%60));
            nd = new Date(d - (10-i)*60000);
            dataChart.addData([new_data[i]], nd.getHours()+":"+nd.getMinutes());
          }
          dataChart.update();
      }
  });
}

function updateLast24Hours(){
  var new_data = [];
  $.ajax({
      url: 'http://localhost:3000/tfour_last_hours.json',
      dataType: 'jsonp',
      success: function(dataWeGotViaJsonp){
          new_data = dataWeGotViaJsonp.data;
          clearChart();
          var d = new Date();
          for(var i = 0; i < new_data.length; i++){
            //dataChart.datasets[0].points[i].value = new_data[i];
            nd = new Date(d - (24-i)*(60*60*1000));
            dataChart.addData([new_data[i]], "("+nd.getUTCDate()+")"+nd.getHours()+":00");
          }
          dataChart.update();
      }
  });
}

function updateLast7Days(){
  var new_data = [];
  $.ajax({
      url: 'http://localhost:3000/seven_last_days.json',
      dataType: 'jsonp',
      success: function(dataWeGotViaJsonp){
          new_data = dataWeGotViaJsonp.data;
          clearChart();
          var d = new Date();
          for(var i = 0; i < new_data.length; i++){
            //dataChart.datasets[0].points[i].value = new_data[i];
            nd = new Date(d - (7-i)*(24*60*60*1000));
            dataChart.addData([new_data[i]], nd.getUTCDate()+1);
          }
          dataChart.update();
      }
  });
}

function clearChart(){
  //console.log("Tamaño del dataset: "+dataChart.datasets[0].points.length);
  var nData = dataChart.datasets[0].points.length;
  for(var i = 0; i < nData; i++){
    dataChart.removeData();
  }
}

var intervalUpdater = function(){
  if(screenChart == 0){
    updateLastTenMinutes();
  }else if(screenChart == 1){
    updateLast24Hours();
  }else if(screenChart == 2){
    updateLast7Days();
  }
  clearInterval(interval);
  interval = setInterval(intervalUpdater, updateRate);
}

var interval = setInterval(intervalUpdater, updateRate);
