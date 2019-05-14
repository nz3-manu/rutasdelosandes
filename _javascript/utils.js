export function scrollToTargetAdjusted(element, headerOffset){
    var elementPosition = element.getBoundingClientRect().top;
    var offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
         top: offsetPosition,
         behavior: "smooth"
    });
}


