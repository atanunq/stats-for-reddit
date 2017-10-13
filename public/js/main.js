$(".parent-accordion").on('hidden.bs.collapse', function(){
    $(".plus").next().collapse('hide');
});
$(".parent-accordion").on('show.bs.collapse', function(e){
    var elements = $(e.target).find('img.controlled-width, video');
    for(var i=0;i<elements.length;i++){
      var src = $(elements[i]).attr('data-src');
      $(elements[i]).attr('src', src);
    }
});
