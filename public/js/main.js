$(".parent-accordion").on('hidden.bs.collapse', function(){
    $(".plus").next().collapse('hide');
});
$(".parent-accordion").on('show.bs.collapse', function(e){
    //console.log($(e.target).data('bs.collapse').$trigger);
    // for refence :
    //https://stackoverflow.com/questions/30596773/how-to-get-the-clicked-element-in-bootstrap-collapse-event
});
