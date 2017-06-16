function attachScrolling(){
  var avoidScrollingItems = document.getElementsByClassName("avoid-scrolling")
  for (var avoidScrollingItem of avoidScrollingItems) {
    avoidScrollingItem.onclick= function(e){
     e.srcElement.classList.remove("avoid-scrolling")
    }
  }
}

window.onload = attachScrolling

