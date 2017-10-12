$(".parent-accordion").on('hidden.bs.collapse', function(){
    $(".plus").next().collapse('hide');
});
$(".parent-accordion").on('show.bs.collapse', function(e){
    var element = $(e.target).find('img, video');
    console.log(element);
    var src = element.attr('data-src');
    element.attr('src', src);
});
