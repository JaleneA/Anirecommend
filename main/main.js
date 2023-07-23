var typed = new Typed(".auto-type", {
  strings: ["Vinland", "Dororo", "Tokyo Ghoul", "JoJo", "Blue Lock", "One Piece", "Naruto", "FairyTail", "Demon Slayer", "Berserk", "Bleach"],
  typeSpeed: 90,
  backSpeed: 90,
  loop: true
})


const inputElement = document.getElementById("anime-input");
inputElement.addEventListener("keydown", (event) => {
  // "Enter" Key (key code 13)
  if (event.keyCode === 13) {

    event.preventDefault();
    getRecommendations();
  }
});

// Function to check if the user has scrolled down enough to show the button
function toggleScrollToTopButton() {
  const scrollToTopButton = document.getElementById("scrollToTopButton");
  if (window.scrollY > 200) {
    scrollToTopButton.style.display = "block";
  } else {
    scrollToTopButton.style.display = "none";
  }
}

function toggleMorningBtnOff() {
  const morningBtn = document.getElementById("morningTheme");
  if (window.scrollY > 1) {
    morningBtn.style.display = "none";
  } else {
    morningBtn.style.display = "block";
  }
}

function toggleEveningBtnOff() {
  const eveningBtn = document.getElementById("eveningTheme");
  if (window.scrollY > 1) {
    eveningBtn.style.display = "none";
  } else {
    eveningBtn.style.display = "block";
  }
}

// Function to smoothly scroll back to the top of the page //
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// Event Listeners //
document.addEventListener("DOMContentLoaded", () => {
  const scrollToTopButton = document.getElementById("scrollToTopButton");
  scrollToTopButton.addEventListener("click", scrollToTop);
});

window.addEventListener("scroll", toggleScrollToTopButton);
window.addEventListener("scroll", toggleMorningBtnOff);
window.addEventListener("scroll", toggleEveningBtnOff);

// Changing To Evening Theme //
document.addEventListener('DOMContentLoaded', function() {
  const eveningThemeButton = document.getElementById('eveningTheme');
  const recommendationsContainer = document.getElementById('recommendations-container');

  function changeBackgroundAndColors() {
    const body = document.body;
    const newBackgroundImageURL = '../assests/eveningbg.jpg';
    body.style.backgroundImage = `url('${newBackgroundImageURL}')`;

    recommendationsContainer.style.backgroundColor = '#160c28';
    recommendationsContainer.style.color = 'white';
  }

  eveningThemeButton.addEventListener('click', changeBackgroundAndColors);
});

// Changing To Morning Theme //
document.addEventListener('DOMContentLoaded', function() {
  const morningThemeButton = document.getElementById('morningTheme');
  const recommendationsContainer = document.getElementById('recommendations-container');

  function changeBackgroundAndColors() {
    const body = document.body;
    const newBackgroundImageURL = '../assests/morningbg.jpg';
    body.style.backgroundImage = `url('${newBackgroundImageURL}')`;

    recommendationsContainer.style.backgroundColor = 'white';
    recommendationsContainer.style.color = 'black';
  }

  morningThemeButton.addEventListener('click', changeBackgroundAndColors);
});


// Function To Show The Loading Icon //
function showLoadingIcon() {
  const loadingIcon = document.getElementById('loadingIcon');
  loadingIcon.style.display = 'block';
}

// Function To Hide The Loading Icon //
function hideLoadingIcon() {
  const loadingIcon = document.getElementById('loadingIcon');
  loadingIcon.style.display = 'none';
}

// API Implementation //
async function getRecommendations() {
  showLoadingIcon() // Calls The Function To Show The Icon //
  const inputElement = document.getElementById("anime-input");
  const animeName = inputElement.value;

  const query = `
                query ($search: String) {
                    Media(search: $search, type: ANIME) {
                        recommendations {
                            edges {
                                node {
                                    mediaRecommendation {
                                        title {
                                            userPreferred
                                        }
                                        coverImage {
                                            medium
                                        }
                                        description
                                    }
                                }
                            }
                        }
                    }
                }
            `;

  const variables = {
    search: animeName
  };

  const url = "https://graphql.anilist.co";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      query,
      variables
    })
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.data.Media && data.data.Media.recommendations && data.data.Media.recommendations.edges.length > 0) {
      const recommendationsContainer = document.getElementById("recommendations-container");
      recommendationsContainer.innerHTML = "";

      recommendationsContainer.style.display = "flex";

      const edges = data.data.Media.recommendations.edges;

      for (let i = 0; i < edges.length; i += 2) {
        const edge1 = edges[i];
        const edge2 = edges[i + 1];

        const animeRow = document.createElement("div");
        animeRow.classList.add("anime-row");

        if (edge1) {
          const animeItem1 = createAnimeItem(edge1.node.mediaRecommendation);
          animeRow.appendChild(animeItem1);
        }

        if (edge2) {
          const animeItem2 = createAnimeItem(edge2.node.mediaRecommendation);
          animeRow.appendChild(animeItem2);
        }

        recommendationsContainer.appendChild(animeRow);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    setTimeout(hideLoadingIcon, 1000); // Hides The Icon After 1 Second //
  }
}

function createAnimeItem(recommendation) {
  const animeItem = document.createElement("div");
  animeItem.classList.add("anime-item");

  // Moves The Anime Image And Its Container To The Beginning //
  const imageContainer = document.createElement("div");
  imageContainer.classList.add("anime-image");
  animeItem.appendChild(imageContainer);

  const imageElement = document.createElement("img");
  imageElement.src = recommendation.coverImage.medium;
  imageContainer.appendChild(imageElement);

  // Continue With The Rest Of The Info //
  const animeInfo = document.createElement("div");
  animeInfo.classList.add("anime-info");

  const titleElement = document.createElement("p");
  titleElement.classList.add("anime-title");
  titleElement.textContent = recommendation.title.userPreferred;

  const descriptionElement = document.createElement("p");
  descriptionElement.classList.add("anime-description");
  descriptionElement.innerHTML = recommendation.description;

  animeInfo.appendChild(titleElement);
  animeInfo.appendChild(descriptionElement);
  animeItem.appendChild(animeInfo);

  return animeItem;
}
