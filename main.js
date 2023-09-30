  const sliderItems = document.getElementById("slide-wrapper");
  const next = document.getElementById("next-slide");
  const prev = document.getElementById("prev-slide");
  slide(sliderItems, prev, next);

  function getTranslateValues(element) {
    const style = window.getComputedStyle(element);
    const matrix =
      style["transform"] || style.webkitTransform || style.mozTransform;

    // No transform property. Simply return 0 values.
    if (matrix === "none" || typeof matrix === "undefined") {
      return {
        x: 0,
        y: 0,
        z: 0,
      };
    }

    // Can either be 2d or 3d transform
    const matrixType = matrix.includes("3d") ? "3d" : "2d";
    const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(", ");

    // 2d matrices have 6 values
    // Last 2 values are X and Y.
    // 2d matrices does not have Z value.
    if (matrixType === "2d") {
      return {
        x: matrixValues[4],
        y: matrixValues[5],
        z: 0,
      };
    }

    // 3d matrices have 16 values
    // The 13th, 14th, and 15th values are X, Y, and Z
    if (matrixType === "3d") {
      return {
        x: matrixValues[12],
        y: matrixValues[13],
        z: matrixValues[14],
      };
    }
  }

  
  function slide(items, prev, next) {
    var posX1 = 0,
      posX2 = 0,
      posInitial,
      posFinal,
      threshold =  items.getElementsByClassName("slide")[0].offsetWidth / 20,
      slides = items.getElementsByClassName("slide"),
      slidesLength = slides.length,
      slideSize = items.getElementsByClassName("slide")[0].offsetWidth,
      index = 0,
      allowShift = true;
    checkIndex();
    items.onmousedown = dragStart;
    // Touch events
    items.addEventListener("touchstart", dragStart);
    items.addEventListener("touchend", dragEnd);
    items.addEventListener("touchmove", dragAction);


    window.addEventListener('resize', () => {
      slideSize = items.getElementsByClassName("slide")[0].clientWidth;
      threshold = slideSize / 20,
      items.style.webkitTransform = 'translateX(' + (-slideSize * index ) + 'px)';

    })
    // click event
    prev.addEventListener("click", function () {
      shiftSlide(-1);
    });
    next.addEventListener("click", function () {
      shiftSlide(1);
    });

    items.addEventListener("transitionend", checkIndex);

    function dragStart(e) {
      e = e || window.event;
      e.preventDefault();
      const { x } = getTranslateValues(items);
      posInitial = x;
      if (e.type == "touchstart") {
        posX1 = e.touches[0].clientX;
      } else {
        posX1 = e.clientX;
        document.onmouseup = dragEnd;
        document.onmousemove = dragAction;
      }
    }
    function dragAction(e) {
      e = e || window.event;
      let x =index * -slideSize;

      if (e.type == "touchmove") {
        posX2 = (posX1 - e.touches[0].clientX)*threshold;
        posX1 = e.touches[0].clientX;
      } else {
        posX2 = (posX1 - e.clientX)*threshold;
        posX1 = e.clientX;
      }
      items.style.webkitTransform = `translateX(${parseInt(x) - parseInt(posX2)}px)`;
    }

    function dragEnd(e) {
      const { x } = getTranslateValues(items);
      posFinal = x;
      if (posFinal - posInitial < -threshold) {
        shiftSlide(1, "drag");
      } else if (posFinal - posInitial > threshold) {
        shiftSlide(-1, "drag");
      } else {
        items.style.webkitTransform  = `translateX(${parseInt(posInitial)}px)`;
      }
      document.onmouseup = null;
      document.onmousemove = null;
    }

    function shiftSlide(dir, action) {
      items.classList.add("shifting");
      const { x } = getTranslateValues(items);
      if (allowShift) {
        if (!action) {
          posInitial = x;
        }
      
        if (dir == 1) {
          if (index !== slidesLength - 1) {
            items.style.transform = `translateX(${
              parseInt(posInitial) - parseInt(slideSize)
            }px)`;
            items.style.webkitTransform  = `translateX(${
              parseInt(posInitial) - parseInt(slideSize)
            }px)`;
            index++;
          }else{
            items.style.webkitTransform  = `translateX(${parseInt(posInitial)}px)`;
          }
        } else if (dir == -1) {
          if (index !== 0) {
            items.style.transform = `translateX(${
              parseInt(posInitial) + parseInt(slideSize)
            }px)`;
            items.style.webkitTransform  = `translateX(${
              parseInt(posInitial) + parseInt(slideSize)
            }px)`;
            index--;
          }else{
            items.style.webkitTransform  = `translateX(${parseInt(posInitial)}px)`;
          }
        }
      }
      allowShift = false;
    }

    function checkIndex() {
      items.classList.remove("shifting");
      const { x } = getTranslateValues(items);
      if(x===0){
        index = 0;
      }
      if (index === 0) {
        prev.classList.add("disabled");
        next.classList.remove("disabled");
      }

      if (index === slidesLength - 1) {
        next.classList.add("disabled");
        prev.classList.remove("disabled");
      }

      if (index !== 0 && index !== slidesLength - 1) {
        next.classList.remove("disabled");
        prev.classList.remove("disabled");
      }
      allowShift = true;
    }
  }
