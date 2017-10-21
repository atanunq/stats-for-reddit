function createChart(data, res){
  var labels = [];
  var count = [];
  for(var i=0;i<data.length;i++){
    labels.push(data[i].subreddit_name);
    count.push(data[i].count);
  }
  var chartData = {
    labels: labels,
    datasets: [{
      label: '# of Upvotes',
      data: count,
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  };
  var options = {
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
