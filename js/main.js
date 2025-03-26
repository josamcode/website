/* ==========================================
            Fetch data and animate
 ========================================== */

document.addEventListener("DOMContentLoaded", function () {
  // fetch data
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      loadHeader(data);

      loadHeroSection(data);

      loadAboutMe(data);

      loadPortfolio(data);

      loadContact(data);

      loadBlog(data);

      loadFooter(data);
    });
});

function loadHeader(data) {
  const navigationLinks = document.querySelector(".links-container");
  data.header.navigation.forEach((link) => {
    navigationLinks.innerHTML += `
        <li class="header-link" onclick="scrollToElement('${link.name}')">
        <i>${link.icon}</i>
        </li>
        `;
  });

  document.querySelector(".header-button").href = `mailto:${data.header.email}`;
}

function loadHeroSection(data) {
  // hero-section
  document.querySelector(".main-name").innerText += " " + data.heroSection.name;
  document.querySelector(".job-title").innerHTML += data.heroSection.title;
  document.querySelector(".description").innerText +=
    data.heroSection.description;
}

function loadAboutMe(data) {
  // animate funcs
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progressBar = entry.target.querySelector(".progress-line");
          const percentage = entry.target.querySelector("span").innerText;
          progressBar.style.width = percentage;
          entry.target.classList.add("animate");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  // about me sections
  document.querySelector(".first-name").innerText =
    data.aboutMe.personalInfos.firstName;
  document.querySelector(".last-name").innerText =
    data.aboutMe.personalInfos.lastName;
  const birthDate = new Date("2006-12-30");
  const today = new Date();
  const age =
    today.getFullYear() -
    birthDate.getFullYear() -
    (today <
    new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
      ? 1
      : 0);

  document.querySelector(".age").innerText = age;

  document.querySelector(".nationality").innerText =
    data.aboutMe.personalInfos.nationality;
  document.querySelector(".freelance").innerText =
    data.aboutMe.personalInfos.freelance;
  document.querySelector(".address").innerText =
    data.aboutMe.personalInfos.address;
  document.querySelector(".phone-number").innerText =
    data.aboutMe.personalInfos.phone;
  document.querySelector(".gmail").innerText = data.aboutMe.personalInfos.email;
  document.querySelector(".instasam-account").innerText =
    data.aboutMe.personalInfos.instagram;
  document.querySelector(".languages").innerText =
    data.aboutMe.personalInfos.languages;
  document.querySelector(".cv-btn").href = "images/" + data.aboutMe.cv;
  document.querySelector(".cv-btn").download = data.aboutMe.cv;

  data.aboutMe.statistics.forEach((card, index) => {
    document.querySelector(".statistics").innerHTML += `
        <div class="card" data-aos="fade-left" data-aos-duration="${
          400 * (index + 1)
        }">
        <span class="card-title">${card.num}+</span>
        <div class="text">
        <span class="line"> </span>
        <p>${card.title}</p>
        </div>
        </div>
        `;
  });

  let hasSkills = false;

  data.skills.forEach((skill, index) => {
    if (index === 0) {
      document.querySelector(".my-skills").style.display = "block";
    }

    if (skill.name && skill.percentage) {
      document.querySelector(".progress-bars-boxs").innerHTML += `
            <div class="progress-bar">
            <div class="info">
            <h3>${skill.name}</h3>
            <span>${skill.percentage}%</span>
            </div>
            <div class="progress">
            <div
            class="progress-line progress-${skill.name}"
            style="--percentage: ${skill.percentage}%"
            ></div>
            </div>
            </div>
            `;
      hasSkills = true;
    }
  });

  if (!hasSkills) {
    document.querySelector(".my-skills").style.display = "none";
  }

  data.experienceEducation.forEach((card, index) => {
    document.getElementById("education-cards").innerHTML += `
        <div class="card" data-aos="fade-up" data-aos-duration="600">
        <div class="design">
        <div class="icon"><i class="${card.icon}"></i></div>
        <div class="line"></div>
        </div>
        <div class="info">
        <div class="duration">${card.year}</div>
        <h1 class="card-title">
        ${card.title}
        </h1>
        <p>
        ${card.description}
        </p>
        </div>
        </div>
        `;
  });

  // مراقبة العناصر المضافة حديثاً
  const progressBars = document.querySelectorAll(".progress-bar");
  progressBars.forEach((bar) => {
    observer.observe(bar);
  });
}

let availableCards;
let portfolioCounter;
let currentCategory = "All";

function loadPortfolio(data) {
  data.portfolio.categories.forEach((category, index) => {
    document.getElementById("portfolio-categorys").innerHTML += `<span ${
      category === "All" ? 'class="active" ' : ""
    }data-aos="zoom-in" data-aos-duration="${
      category === "All" ? 400 : 400 * (index + 1)
    }" onclick="showCardsByCategory('${category}', event)">${category}</span>`;
    document.getElementById(
      "footer-shortcuts"
    ).innerHTML += `<li>${category}</li>`;
  });

  portfolioCounter = 0;
  availableCards = 6;

  function showPortfolioCards(category = "All", append = false) {
    let cardsContainer = document.getElementById("portfolio-cards");
    if (!append) {
      cardsContainer.innerHTML = ""; // مسح المحتوى السابق فقط إذا لم يكن append
      portfolioCounter = 0; // إعادة تعيين العداد عند عدم الإضافة
    }
    let filteredProjects = data.portfolio.projects.filter(
      (card) => category === "All" || card.category === category
    );

    filteredProjects
      .slice(portfolioCounter, portfolioCounter + availableCards)
      .forEach((card) => {
        if (card.link) {
          cardsContainer.innerHTML += `
                    <div class="card" onclick="gotopage('${card.link}')" data-aos="fade-up" data-aos-duration="600">
                        <img loading="lazy" src="images/${card.image}" alt="${card.title}" width="400" height="300" />
                        <div class="title-box">
                            <h3>${card.title}</h3>
                        </div>
                    </div>
                `;
        } else {
          cardsContainer.innerHTML += `
                    <div class="card" onclick="openImage('${card.image}')" data-aos="fade-up" data-aos-duration="600">
                        <img loading="lazy" src="images/${card.image}" alt="${card.title}" width="400" height="300" />
                    </div>
                `;
        }
        portfolioCounter++;
      });
  }

  showPortfolioCards();

  document
    .getElementById("see-more-portfolio-cards")
    .addEventListener("click", () => {
      availableCards = 3; // تعديل هذا إلى العدد المطلوب عند الضغط على "اظهار المزيد"
      showPortfolioCards(currentCategory, true); // استخدام append = true
    });
}

function openImage(imgId) {
  document.getElementById("image-container-img").src = `images/${imgId}`;
  document.getElementById("image-container").classList.add("active-box");
  document.getElementById("black-box").classList.add("active-box");
}

function closeBoxs() {
  document.getElementById("image-container").classList.remove("active-box");
  document.getElementById("black-box").classList.remove("active-box");
}

document
  .getElementById("close-image-container")
  .addEventListener("click", closeBoxs);
document.getElementById("black-box").addEventListener("click", closeBoxs);

function showCardsByCategory(category, event) {
  currentCategory = category; // تحديث الفئة الحالية
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      let filteredProjects = data.portfolio.projects.filter(
        (card) => card.category === category || category === "All"
      );
      document.getElementById("portfolio-cards").innerHTML = ""; // مسح المحتوى السابق
      portfolioCounter = 0; // إعادة تعيين العداد عند تغيير الفئة
      availableCards = 6; // إعادة تعيين العدد المتاح عند تغيير الفئة

      let cardsContainer = document.getElementById("portfolio-cards");

      if (filteredProjects.length > 0) {
        filteredProjects.slice(0, availableCards).forEach((card, index) => {
          if (card.link) {
            cardsContainer.innerHTML += `
                            <div class="card" onclick="gotopage('${card.link}')" data-aos="fade-up" data-aos-duration="600">
                                <img loading="lazy" src="images/${card.image}" alt="${card.title}" width="400" height="300" />
                                <div class="title-box">
                                    <h3>${card.title}</h3>
                                </div>
                            </div>
                        `;
          } else {
            cardsContainer.innerHTML += `
                            <div class="card" onclick="openImage('${card.image}')" data-aos="fade-up" data-aos-duration="600">
                                <img loading="lazy" src="images/${card.image}" alt="${card.title}" width="400" height="300" />
                            </div>
                        `;
          }
          portfolioCounter++;
        });

        document.getElementById("see-more-portfolio-cards").style.display =
          "flex";
      } else {
        document.getElementById("portfolio-cards").innerHTML = `
                    <div class="soon-box">
                        soon...
                    </div>
                `;
        document.getElementById("see-more-portfolio-cards").style.display =
          "none";
      }

      // تحديث الزر النشط
      document.querySelectorAll("#portfolio-categorys span").forEach((btn) => {
        btn.classList.remove("active");
      });
      event.target.classList.add("active");
    })
    .catch((error) => console.error("Error loading JSON data:", error));
}

function loadContact(data) {
  // contact section
  document.getElementById("contact-small-title").textContent =
    data.contact.title;
  document.getElementById("contact-paragraph").textContent =
    data.contact.description;
  document.getElementById("contact-address-point").textContent =
    data.contact.address;
  document.getElementById("contact-phone").textContent = data.contact.phone;
  document.getElementById("contact-email").textContent = data.contact.email;

  function addSocialIcons(elementId) {
    data.contact.social.forEach((social) => {
      document.getElementById(elementId).innerHTML += `
            <a class="icon" href="${social.link}" aria-label="${social.ariaLabel}">
            <i class="${social.icon}"></i>
            </a>
            `;
    });
  }

  addSocialIcons("contact-social-icons");
  addSocialIcons("footer-social-icons");
}

function loadBlog(data) {
  // blog section

  let counter = 0;

  data.blog.posts.forEach((card, index) => {
    document.getElementById("blogs-cards").innerHTML += `
        <div class="card" ${
          card.url ? `onclick="openPage('pages/blog-pages/${card.url}')"` : ""
        } data-aos="fade-up" data-aos-duration="600">
        <div class="img">
        <img loading="lazy" src="images/${card.image}" alt="${card.title}" />
        </div>
        <div class="info">
        <h3 class="card-title" >${card.title}</h3>
        <p>
        ${card.description}
        </p>
        </div>
        </div>
        `;

    if (counter < 3) {
      document.getElementById("footer-posts").innerHTML += `
            <li>${card.title}</li>
            `;
    }
    counter++;
  });
}

function openPage(url) {
  window.location.href = url;
}

function loadFooter(data) {
  // footer
  document.getElementById(
    "footer-address"
  ).textContent = `Address: ${data.aboutMe.personalInfos.address}`;
  document.getElementById(
    "footer-phone"
  ).textContent = `Phone: ${data.aboutMe.personalInfos.phone}`;
  document.getElementById(
    "footer-email"
  ).textContent = `Email: ${data.aboutMe.personalInfos.email}`;

  document.getElementById("company-name").textContent = data.header.logoText;

  const currentYear = new Date().getFullYear();
  document.getElementById("footer-year").textContent = currentYear;
}

/* ==========================================
            scroll To Top
 ========================================== */

function scrollToTop() {
  window.scrollTo({
    top: 0,
  });
}

/* ==========================================
            Header funcs
 ========================================== */

let toggleIconContainer = document.querySelector(".toggle-icon-container");
let navLinks = document.querySelector(".header-links");
let barsLineOne = document.getElementById("bars-line-one");
let barsLineTwo = document.getElementById("bars-line-two");
let shortLine = document.getElementById("short-line");

toggleIconContainer.addEventListener("click", function () {
  navLinks.classList.toggle("active");
  if (navLinks.classList.contains("active")) {
    barsLineOne.style.transform = "rotate(45deg)";
    barsLineTwo.style.transform = "rotate(-45deg)";
    shortLine.style.opacity = "0";
  } else {
    barsLineOne.style.transform = "rotate(0deg)";
    barsLineTwo.style.transform = "rotate(0deg)";
    shortLine.style.opacity = "1";
  }
});

function scrollToElement(elementId) {
  var element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({});
  }
}

function gotopage(url) {
  window.location.href = url;
}

/* ==========================================
            Alert Box
 ========================================== */

let alertBtnBox = document.getElementById("alert-btn-box");
let alert = document.getElementById("alert");
let header = document.getElementById("header");
let heroSection = document.getElementById("hero-section");

// alertBtnBox.addEventListener("click", () => {
//   alert.style.display = "none";
//   header.style.top = "0";
//   heroSection.style.marginTop = "60px";
// });
