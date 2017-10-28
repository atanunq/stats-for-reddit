$(".plus").next().on('hidden.bs.collapse', function(){
    $(".plus").next().collapse('hide');
});

// on clicking the plus load the content to be shown
$(".plus").next().on('show.bs.collapse', function(e){
  var elements = $(e.target).find('img.controlled-width, video, iframe');
  for(var i=0;i<elements.length;i++){
    var src = $(elements[i]).attr('data-src');
    $(elements[i]).attr('src', src);
  }
});

// on clicking the plus hid the content that was loaded with the above function
$(".plus").next().on('hidden.bs.collapse', function(e){
  var elements = $(e.target).find('img.controlled-width, video, iframe');
  for(var i=0;i<elements.length;i++){
    var dataSrc = $(elements[i]).attr('src');
    $(elements[i]).attr('data-src', dataSrc);
    $(elements[i]).attr('src', "");
  }
});
