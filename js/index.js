document.addEventListener("DOMContentLoaded", function () {
  // *************************************************************************
  // *************************************************************************
  // *************************************************************************
  // **************************   THEME SWITCHER   ***************************
  // *************************************************************************
  // *************************************************************************
  // *************************************************************************

  const themeButtons = document.querySelectorAll(".theme-switcher button");
  const defaultTheme = "white";
  const savedTheme = localStorage.getItem("ss-theme") || defaultTheme;

  document.body.setAttribute("data-theme", savedTheme);
  highlightActiveButton(savedTheme);

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedTheme = button.getAttribute("data-theme");
      document.body.setAttribute("data-theme", selectedTheme);
      localStorage.setItem("ss-theme", selectedTheme);
      highlightActiveButton(selectedTheme);
    });
  });

  function highlightActiveButton(theme) {
    themeButtons.forEach((button) => {
      if (button.getAttribute("data-theme") === theme) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  }

  // THEME ANIMATION

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedTheme = button.getAttribute("data-theme");
      gsap.to("body", {
        duration: 0.5,
        backgroundColor: getComputedStyle(document.body).getPropertyValue(
          `--${selectedTheme}-bg`
        ),
        color: getComputedStyle(document.body).getPropertyValue(
          `--${selectedTheme}-color`
        ),
      });
      document.body.setAttribute("data-theme", selectedTheme);
      localStorage.setItem("ss-theme", selectedTheme);
    });
  });

  // *************************************************************************
  // *************************************************************************
  // *************************************************************************
  // ******************************   SPINNER   *****************************
  // *************************************************************************
  // *************************************************************************
  // *************************************************************************

  const images = document.querySelectorAll("img");
  const totalImages = images?.length;

  if (totalImages > 0) {
    let imagesLoaded = 0;
    const loader = document.getElementById("spinner");
    const percentageDisplay = document.getElementById("loading-percentage");

    images.forEach((imgElement) => {
      const img = new Image();
      img.src = imgElement.src;

      img.onload = function () {
        imagesLoaded++;
        updateLoadingPercentage();
        checkAllImagesLoaded();
      };

      img.onerror = function () {
        console.error(`Failed to load image: ${img.src}`);
        imagesLoaded++;
        updateLoadingPercentage();
        checkAllImagesLoaded();
      };
    });

    function updateLoadingPercentage() {
      const percentage = Math.round((imagesLoaded / totalImages) * 100);
      percentageDisplay.textContent = `${percentage}%`;
    }

    function checkAllImagesLoaded() {
      if (imagesLoaded === totalImages) {
        // Wait 1 second before removing the loader
        setTimeout(() => {
          gsap.to(loader, {
            opacity: 0,
            duration: 0.5,
            onComplete: function () {
              loader.remove();
            },
          });
        }, 100);
      }
    }
  } else {
    const loader = document.getElementById("spinner");
    loader.remove();
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

  let proxy = { skew: 0 },
    skewSetter = gsap.quickSetter(".image-grid-item", "skewY", "deg"), // fast
    clamp = gsap.utils.clamp(-20, 20); // don't let the skew go beyond 20 degrees.

  ScrollTrigger.create({
    onUpdate: (self) => {
      let skew = clamp(self.getVelocity() / -300);
      if (Math.abs(skew) > Math.abs(proxy.skew)) {
        proxy.skew = skew;
        gsap.to(proxy, {
          skew: 0,
          duration: 0.8,
          ease: "power3",
          overwrite: true,
          onUpdate: () => skewSetter(proxy.skew),
        });
      }
    },
  });

  gsap.set(".image-grid-item", {
    transformOrigin: "right center",
    force3D: true,
  });

  // REVEAL ELEMENT

  const elementRevealUpAnimation = (element) => {
    const elements = document.querySelectorAll(element);

    if (elements.length > 0) {
      elements.forEach((ele) => {
        const delay = parseFloat(ele.getAttribute("data-delay")) || 0;
        const trigger = ele.getAttribute("data-trigger") || ele;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: trigger,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });

        tl.from(ele, {
          y: 100,
          opacity: 0,
          delay: delay,
          ease: "power4.out",
          skewY: 4,
          scale: 0.8,
          duration: 1.5,
        });
      });
    }
  };

  elementRevealUpAnimation(".animateUp");
});

// ScrollTrigger refresh on resize
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});

window.addEventListener("orientationchange", () => {
  ScrollTrigger.refresh();
});
