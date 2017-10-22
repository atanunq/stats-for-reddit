function createChart(data, limit, res){
  var labels = [];
  var count = [];
  var backgroundColor = [];
  var hoverBackgroundColor = [];
  var borderColor = [];
  for(var i=0;i<data.length;i++){
    if(data[i].count > 1){
      labels.push(data[i].subreddit_name);
      count.push(data[i].count);
      rgb = [
        Math.random()*255,
        Math.random()*255,
        Math.random()*255
      ]
      backgroundColor.push("rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ", 0.5)");
      hoverBackgroundColor.push("rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ", 1)");
      borderColor.push("rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ", 1)");
    }
  }
  var chartData = {
    labels: labels,
    datasets: [{
      data: count,
      backgroundColor: backgroundColor,
      hoverBackgroundColor: hoverBackgroundColor,
      borderColor: borderColor,
      borderWidth: 1
    }]
  };
  var options = {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: '# of Upvotes out of the last ' + limit + ' upvotes',
      fontSize: 20
    },
    scales: {
      yAxes: [{
        ticks: {
          min:0
        }
      }]
    }
  };

  res.render('charts',{
    data: JSON.stringify(chartData),
    options: JSON.stringify(options)
  })
}
module.exports = {
  createChart: createChart
}
