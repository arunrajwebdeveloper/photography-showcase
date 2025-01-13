window.onload = function () {
  history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
};

document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

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
    const loaderFill = document.getElementById("loader-fill");

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
      loaderFill.style.width = `${percentage}%`;
      percentageDisplay.textContent = `${percentage}`;

      if (percentage < 100) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }

    function checkAllImagesLoaded() {
      if (imagesLoaded === totalImages) {
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
        {
          scale: 1,
          opacity: 1,
        },
        {
          // scale: 0.5,
          scale: 0.8,
          opacity: 0,
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

  if (document.querySelector(".image-grid-item")) {
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
  }

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

  // NAVIGATION MENU

  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("main-sm-menu");
  const menuItems = document.querySelectorAll(".main-sm-navigation-list li");

  menuToggle.addEventListener("click", () => {
    const bodyElement = document.body;

    if (!menuToggle.classList.contains("menu__active")) {
      gsap.to(mobileMenu, {
        y: 0,
        opacity: 1,
        visibility: "visible",
        duration: 0.5,
        ease: "power3.out",
      });

      gsap.fromTo(
        menuItems,
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.1,
        }
      );

      menuToggle.classList.add("menu__active");
      bodyElement.style.overflow = "hidden";
    } else {
      gsap.to(menuItems, {
        y: -20,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
        stagger: 0.1,
        onComplete: () => {
          gsap.to(mobileMenu, {
            y: -20,
            opacity: 0,
            duration: 0.5,
            ease: "power3.in",
            onComplete: () => {
              mobileMenu.style.visibility = "hidden";
            },
          });
        },
      });

      menuToggle.classList.remove("menu__active");
      bodyElement.style.overflow = "";
    }
  });
});

// ScrollTrigger refresh on resize
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});

window.addEventListener("orientationchange", () => {
  ScrollTrigger.refresh();
});
