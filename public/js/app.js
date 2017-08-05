var acc = document.getElementsByClassName("accordion");

for (i = 0; i < acc.length; i++) {
  acc[i].onclick = function() {
    this.nextSibling.classList.toggle("invisible");
    var images = this.nextSibling.getElementsByTagName("img");
    if(images[0].getAttribute('src')){
      console.log(images[0].getAttribute("src"));
      for (var j = 0; j < images.length; j++) {
        images[j].src = "";
      }
    } else {
      for (var j = 0; j < images.length; j++) {
        images[j].src = images[j].getAttribute('data-src');
      }
    }
  }
}
