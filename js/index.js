window.onload = function () {
  history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
};

// isMobile

function isMobile() {
  const regex =
    /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}

document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  // Cursor

  const cursorDotOutline = document.querySelector(".cursor-element");

  let x = 0,
    y = 0;
  let endX = 0,
    endY = 0;

  const animateDotOutline = () => {
    x += (endX - x) / 8;
    y += (endY - y) / 8;
    cursorDotOutline.style.top = y + "px";
    cursorDotOutline.style.left = x + "px";

    requestAnimationFrame(animateDotOutline);
  };

  animateDotOutline();

  document.addEventListener("mousemove", (e) => {
    endX = e.clientX - cursorDotOutline.offsetWidth / 2;
    endY = e.clientY - cursorDotOutline.offsetHeight / 2;
  });

  document.querySelectorAll("a, button").forEach((interactiveElement) => {
    interactiveElement.addEventListener("mouseenter", () => {
      cursorDotOutline.classList.add("hover");
    });

    interactiveElement.addEventListener("mouseleave", () => {
      cursorDotOutline.classList.remove("hover");
    });
  });

  // SmoothScrolling

  const lenis = new Lenis({
    duration: 3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
    lerp: 0.05,
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
    wheelMultiplier: 2,
    infinite: false,
    autoResize: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  const heroTitle = document.querySelector(".hero-title");

  if (!!heroTitle && !isMobile()) {
    // HOME TEXT MOVEMENT

    let mouseX, mouseY;
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(heroTitle, {
        x: (mouseX / window.innerWidth - 0.5) * 50,
        y: (mouseY / window.innerHeight - 0.5) * 50,
        delay: 0.1,
        ease: "power2.out",
        overwrite: "auto",
      });
    });

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
    const loaderFill = document.getElementById("spinner-fill");
    const spinnerCounter = document.querySelector(".spinner__counter");
    const unit = document.querySelector(".spinner__number--unit");
    const decimal = document.querySelector(".spinner__number--decimal");
    const hundred = document.querySelector(".spinner__number--hundred");

    const updatePreloaderNumbers = (percentage) => {
      const paddedPercentage = String(percentage).padStart(3, "0");
      const [hundredVal, decimalVal, unitVal] = paddedPercentage;

      gsap.to(hundred, {
        y: `-${hundredVal * 100}%`,
        duration: 0.5,
        ease: "power4.out",
      });

      gsap.to(decimal, {
        y: `-${decimalVal * 100}%`,
        duration: 0.5,
        ease: "power4.out",
      });

      gsap.to(unit, {
        y: `-${unitVal * 100}%`,
        duration: 0.5,
        ease: "power4.out",
      });

      if (loaderFill) {
        gsap.to(loaderFill, {
          width: `${percentage}%`,
          duration: 1,
          ease: "power4.out",
        });
      }
    };

    images.forEach((imgElement) => {
      const img = new Image();
      img.src = imgElement.src;

      img.onload = function () {
        imagesLoaded++;
        const percentage = Math.round((imagesLoaded / totalImages) * 100);
        updatePreloaderNumbers(percentage);

        if (imagesLoaded === totalImages) {
          finishPreloader();
        }
      };

      img.onerror = function () {
        console.error(`Failed to load image: ${img.src}`);
        imagesLoaded++;
        const percentage = Math.round((imagesLoaded / totalImages) * 100);
        updatePreloaderNumbers(percentage);

        if (imagesLoaded === totalImages) {
          finishPreloader();
        }
      };
    });

    const finishPreloader = () => {
      setTimeout(() => {
        gsap.to(spinnerCounter, {
          y: "100%",
          duration: 0.5,
          ease: "power4.in",
          onComplete: function () {
            gsap.to(loader, {
              y: "-100%",
              duration: 0.6,
              delay: 0.2,
              ease: "power4.in",
              onComplete: function () {
                loader.remove();
              },
            });
            document.body.style.overflow = "";
          },
        });
      }, 1000);
    };

    document.body.style.overflow = "hidden";
  } else {
    const loader = document.getElementById("spinner");
    loader.remove();
    document.body.style.overflow = "";
  }

  // *************************************************************************
  // *************************************************************************
  // *************************************************************************
  // ******************   LANDING STACK IMAGE   *****************************
  // *************************************************************************
  // *************************************************************************
  // *************************************************************************

  const footer = document.querySelector(".main-footer");
  const pinnedSections = gsap.utils.toArray(".card-section.pinned");
  const lastSection = pinnedSections[pinnedSections.length - 1];

  // Function to apply parallax effect to any image inside a section
  function applyParallaxEffect(section) {
    let imgContainer = section.querySelector(".card-img");
    if (isMobile() || !imgContainer) return;
    let img = imgContainer.querySelector("img");

    gsap.fromTo(
      img,
      { yPercent: -20 },
      {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  }

  // Apply parallax effect to all pinned sections
  if (pinnedSections.length > 0) {
    pinnedSections.forEach((section, index, sections) => {
      let nextSection = sections[index + 1] || lastSection;
      let endScalePoint = `top+=${
        nextSection.offsetTop - section.offsetTop
      } top`;

      // Pin the section
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "top bottom",
        pin: true,
        pinSpacing: false,
        endTrigger: footer,
        id: index + 1,
        scrub: 1,
      });

      if (section !== lastSection) {
        // Image scale and blur effect
        let imgContainer = section.querySelector(".card-img");
        if (imgContainer) {
          gsap.fromTo(
            imgContainer,
            {
              scale: 1,
              y: 0,
              filter: "blur(0px)",
              webkitFilter: "blur(0px)",
            },
            {
              scale: 0.8,
              y: 100,
              filter: "blur(10px)",
              webkitFilter: "blur(10px)",
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: endScalePoint,
                scrub: 1,
              },
            }
          );
        }
      }

      // Apply parallax effect to the image inside pinned section
      applyParallaxEffect(section);
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
      mobileMenu.style.display = "block";

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
              mobileMenu.style.display = "none";
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

// contextmenu
document.addEventListener("contextmenu", (event) => event.preventDefault());

// function showContextMenu(event) {
//   event.preventDefault();

//   removeContextMenu();

//   const contextMenu = document.createElement("div");
//   contextMenu.classList.add("context-menu");

//   const menuItems = [
//     {
//       text: "About me",
//       action: () => {
//         window.location.href = "/photography-showcase/about-me.html";
//       },
//     },
//     {
//       text: "Showcase",
//       action: () => {
//         window.location.href = "/photography-showcase/showcase.html";
//       },
//     },
//     {
//       text: "Contact me",
//       action: () => {
//         window.location.href = "/photography-showcase/contact.html";
//       },
//     },
//   ];

//   menuItems.forEach((item) => {
//     const menuItem = document.createElement("div");
//     menuItem.classList.add("menu-item");
//     menuItem.textContent = item.text;
//     menuItem.onclick = () => {
//       item.action();
//       removeContextMenu();
//     };
//     contextMenu.appendChild(menuItem);
//   });

//   document.body.appendChild(contextMenu);

//   contextMenu.style.display = "block";
//   const menuWidth = contextMenu.offsetWidth;
//   const menuHeight = contextMenu.offsetHeight;
//   const screenWidth = window.innerWidth;
//   const screenHeight = window.innerHeight;
//   let x = event.clientX;
//   let y = event.clientY;

//   if (x + menuWidth > screenWidth) x = screenWidth - menuWidth - 5;
//   if (y + menuHeight > screenHeight) y = screenHeight - menuHeight - 5;

//   contextMenu.style.left = `${x}px`;
//   contextMenu.style.top = `${y}px`;

//   document.addEventListener("click", removeContextMenu);
//   document.addEventListener("keydown", (e) => {
//     if (e.key === "Escape") removeContextMenu();
//   });
// }

// function removeContextMenu() {
//   const existingMenu = document.querySelector(".context-menu");
//   if (existingMenu) {
//     existingMenu.remove();
//     document.removeEventListener("click", removeContextMenu);
//   }
// }

// document.addEventListener("contextmenu", showContextMenu);
