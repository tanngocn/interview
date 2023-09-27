document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.getElementsByClassName("wrapper")[0];
  const nextSlide = document.getElementsByClassName("next-slide")[0];
  const prevSlide = document.getElementsByClassName("prev-slide")[0];
  const slides = document.getElementsByClassName("slide-item");
  const slideActive = document.getElementsByClassName("slide-item active")[0];
  const numsSlide = slides.length;
  let endX = 0;
  let initialX = 0;
  let initialEnd = 0;
  let initialStart = 0;

  let currentSlide = checkCurrentSlideActive();

  nextSlide.addEventListener("click", function () {
    handleClick("next");
  });
  prevSlide.addEventListener("click", function () {
    handleClick("prev");
  });
  wrapper.addEventListener("touchstart", startTouch, { passive: false });
  wrapper.addEventListener("touchend", endTouch, false);
  wrapper.addEventListener("touchmove", moveTouch, { passive: false });
  wrapper.addEventListener("mousedown", startMousedown, false);
  wrapper.addEventListener("mouseup", startMouseup, false);

  function checkStatusBtn(currentSlide) {
    if (currentSlide !== 0 && currentSlide !== numsSlide - 1) {
      nextSlide.classList.remove("disabled");
      prevSlide.classList.remove("disabled");
    }
    if (currentSlide === 0) {
      prevSlide.classList.add("disabled");
    }
    if (currentSlide === numsSlide - 1) {
      nextSlide.classList.add("disabled");
    }
  }

  function checkCurrentSlideActive() {
    let result = 0;
    for (let i = 0; i < slides.length; i++) {
      if (slides[i].classList.contains("active")) {
        wrapper.style.transform = `translate3d(${
          -i * slideActive.offsetWidth
        }px, 0px, 0px)`;
        initialX = -i * slideActive.offsetWidth;
        result = i;
        checkStatusBtn(i);
        break;
      }
    }
    return result;
  }

  function handleClick(type) {
    if (type === "next") {
      if (currentSlide !== numsSlide - 1) {
        currentSlide += 1;
      }
    }

    if (type === "prev") {
      if (currentSlide !== 0) {
        currentSlide -= 1;
      }
    }

    checkStatusBtn(currentSlide);
    wrapper.style.transform = `translate3d(${
      -currentSlide * slideActive.offsetWidth
    }px, 0px, 0px)`;
  }

  function startMousedown(e) {
    initialStart = Date.now();
    initialX = e.clientX;
  }

  function startMouseup(e) {
    initialEnd = Date.now();
    endX = e.clientX;
    if (initialEnd - initialStart < 800) {
      swipe();
    }
  }

  function startTouch(e) {
    initialStart = Date.now();
    initialX = e.touches[0].clientY;
  }

  function endTouch(e) {
    initialEnd = Date.now();
    endX = e.changedTouches[0].clientY;
    if (initialEnd - initialStart < 800) {
      swipe();
    }
  }

  function moveTouch(e) {
    e.preventDefault();
  }

  function swipe() {
    if (endX - initialX < -50) {
      if (currentSlide !== numsSlide - 1) {
        currentSlide += 1;
      }
    } else if (endX - initialX > 50) {
      if (currentSlide !== 0) {
        currentSlide -= 1;
      }
    }
    checkStatusBtn(currentSlide);
    wrapper.style.transform = `translate3d(${
      -currentSlide * slideActive.offsetWidth
    }px, 0px, 0px)`;
  }
});
