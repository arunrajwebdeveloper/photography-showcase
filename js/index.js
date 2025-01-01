document.addEventListener("DOMContentLoaded", function () {
  // *************************************************************************
  // *************************************************************************
  // *************************************************************************
  // ******************************   SPINNER   *****************************
  // *************************************************************************
  // *************************************************************************
  // *************************************************************************

  const images = document.querySelectorAll("img");
  const totalImages = images.length;
  let imagesLoaded = 0;

  images.forEach((imgElement) => {
    const img = new Image();
    img.src = imgElement.src;

    img.onload = function () {
      imagesLoaded++;
      checkAllImagesLoaded();
    };

    img.onerror = function () {
      console.error(`Failed to load image: ${img.src}`);
      imagesLoaded++;
      checkAllImagesLoaded();
    };
  });

  function checkAllImagesLoaded() {
    if (imagesLoaded === totalImages) {
      const loader = document.getElementById("spinner");

      gsap.to(loader, {
        opacity: 0,
        duration: 0.5,
        onComplete: function () {
          loader.remove();
        },
      });
    }
  }

  // *************************************************************************
  // *************************************************************************
  // *************************************************************************
  // ******************   LANDING STACK IMAGE   *****************************
  // *************************************************************************
  // *************************************************************************
  // *************************************************************************

  gsap.registerPlugin(ScrollTrigger);

  const footer = document.querySelector(".main-footer");
  const lastCard = document.querySelector(".card-section.scroll");
  const pinnedSections = gsap.utils.toArray(".card-section.pinned");

  if (pinnedSections.length > 0) {
    pinnedSections.forEach((section, index, sections) => {
      let img = section.querySelector(".card-img");
      let nextSection = sections[index + 1] || lastCard;
      let endScalePoint = `top+=${
        nextSection.offsetTop - section.offsetTop
      } top`;

      gsap.to(section, {
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end:
            index === sections.length
              ? `+=${lastCard.offsetHeight / 2}`
              : footer.offsetTop - window.innerHeight,
          pin: true,
          pinSpacing: false,
          scrub: 1,
        },
      });

      gsap.fromTo(
        img,
        { scale: 1 },
        {
          scale: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: endScalePoint,
            scrub: 1,
          },
        }
      );
    });

    const heroTitle = document.querySelector(".hero-section h1");

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "+=500vh",
      scrub: 1,
      onUpdate: (self) => {
        let opacityProgress = self.progress;
        heroTitle.style.opacity = 1 - opacityProgress;
      },
    });
  }

  // *************************************************************************
  // *************************************************************************
  // *************************************************************************
  // ******************************   SHOWCASE   *****************************
  // *************************************************************************
  // *************************************************************************
  // *************************************************************************

  const imageGridItems = gsap.utils.toArray(".image-grid-item");

  if (imageGridItems.length > 0) {
    imageGridItems.forEach((elem) => {
      // Create a ScrollTrigger instance for each element
      ScrollTrigger.create({
        trigger: elem,
        start: "top bottom", // When the element enters the viewport
        end: "bottom top", // When the element exits the viewport
        onEnter: () => {
          // Remove both classes when the element is in the viewport
          elem.classList.remove("tilt-from-top", "tilt-from-bottom");
        },
        onLeave: (self) => {
          // Add tilt-from-top when the element leaves the bottom of the viewport
          if (self.direction > 0) {
            elem.classList.add("tilt-from-top");
            elem.classList.remove("tilt-from-bottom");
          }
        },
        onEnterBack: () => {
          // Remove both classes when the element re-enters the viewport
          elem.classList.remove("tilt-from-top", "tilt-from-bottom");
        },
        onLeaveBack: (self) => {
          // Add tilt-from-bottom when the element leaves the top of the viewport
          if (self.direction < 0) {
            elem.classList.add("tilt-from-bottom");
            elem.classList.remove("tilt-from-top");
          }
        },
        markers: false, // Set to true for debugging
      });

      // Set initial state based on the element's visibility
      if (!ScrollTrigger.isInViewport(elem)) {
        const bounds = elem.getBoundingClientRect();
        if (bounds.top < 0) {
          // Element is out of the top of the viewport
          elem.classList.add("tilt-from-bottom");
        } else if (bounds.bottom > window.innerHeight) {
          // Element is out of the bottom of the viewport
          elem.classList.add("tilt-from-top");
        }
      }
    });
  }
});
