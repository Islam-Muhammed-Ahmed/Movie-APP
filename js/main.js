//TMDB API

let My_Api = "api_key=618f720a9c23fc221fdf9faa27616826";
let Main_Url = "https://api.themoviedb.org/3";
let Api_Url = Main_Url + "/discover/movie?sort_by=popularity.desc&" + My_Api;
let image_Url = "https://image.tmdb.org/t/p/w500";
let search_Url = Main_Url + "/search/movie?" + My_Api;
let genres = [{
        id: 28,
        name: "Action",
    },
    {
        id: 12,
        name: "Adventure",
    },
    {
        id: 16,
        name: "Animation",
    },
    {
        id: 35,
        name: "Comedy",
    },
    {
        id: 80,
        name: "Crime",
    },
    {
        id: 99,
        name: "Documentary",
    },
    {
        id: 18,
        name: "Drama",
    },
    {
        id: 10751,
        name: "Family",
    },
    {
        id: 14,
        name: "Fantasy",
    },
    {
        id: 36,
        name: "History",
    },
    {
        id: 27,
        name: "Horror",
    },
    {
        id: 10402,
        name: "Music",
    },
    {
        id: 9648,
        name: "Mystery",
    },
    {
        id: 10749,
        name: "Romance",
    },
    {
        id: 878,
        name: "Science Fiction",
    },
    {
        id: 10770,
        name: "TV Movie",
    },
    {
        id: 53,
        name: "Thriller",
    },
    {
        id: 10752,
        name: "War",
    },
    {
        id: 37,
        name: "Western",
    },
];

let mainSection = document.getElementById("main");
let contentDiv = document.getElementById("content");
let form = document.querySelector("form");
let searchBox = document.getElementById("search");
let tagsEl = document.getElementById("tags");
let maintagsEl = document.getElementById("tagmain");

let prev = document.getElementById("previous");
let next = document.getElementById("next");
let current = document.getElementById("current");

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = "";
var totalPages = 100;

var getGenre = [];

function setGenre() {
    tagsEl.innerHTML = "";
    let h3 = document.createElement("h3");
    h3.textContent = "Genres";
    h3.classList.add("heading");
    maintagsEl.prepend(h3);
    genres.forEach((genre) => {
        let tag = document.createElement("div");
        tag.classList.add("tag");
        tag.id = genre.id;
        tag.innerText = genre.name;
        tag.addEventListener("click", () => {
            if (getGenre.length == 0) {
                getGenre.push(genre.id);
            } else {
                if (getGenre.includes(genre.id)) {
                    getGenre.forEach((id, index) => {
                        if (id == genres.id) {
                            getGenre.splice(index, 1);
                        }
                    });
                } else {
                    getGenre.push(genre.id);
                }
            }
            // console.log(getGenre);
            getMovie(Api_Url + "&with_genres=" + encodeURI(getGenre.join(",")));
            highLighted();
            showMovies();
        });
        tagsEl.append(tag);
    });
}

setGenre();

function highLighted() {
    let allTags = document.querySelectorAll(".tag");
    allTags.forEach((tag) => {
        tag.classList.remove("highlight");
    });
    removeSelction();
    if (getGenre.length != 0) {
        getGenre.forEach((id) => {
            let hightLightedButton = document.getElementById(id);
            hightLightedButton.classList.add("highlight");
        });
    } else {
        hightLightedButton.classList.remove("highlight");
    }
}

function removeSelction() {
    let removeBtn = document.getElementById("remove");
    if (removeBtn) {
        removeBtn.classList.add("red");
    } else {
        let parentbtn = document.createElement("div");
        tagsEl.appendChild(parentbtn);
        let remove = document.createElement("button");
        remove.classList.add("tag", "red");
        remove.id = "remove";
        remove.innerText = "Remove Selection";
        remove.addEventListener("click", () => {
            getGenre = [];
            setGenre();
            getMovie(Api_Url);
        });
        parentbtn.append(remove);
    }
}

function getMovie(url) {
    lastUrl = url;
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            // testing the if it's has been fetched correct
            // console.log(data);
            if (data.results.length !== 0) {
                showMovies(data.results);

                currentPage = data.page;
                nextPage = currentPage + 1;
                prevPage = currentPage - 1;
                totalPages = data.total_pages;

                current.innerText = currentPage;
                if (currentPage <= 1) {
                    prev.classList.add("disabled");
                    next.classList.remove("disabled");
                } else if (currentPage >= totalPages) {
                    prev.classList.remove("disabled");
                    next.classList.add("disabled");
                } else {
                    prev.classList.remove("disabled");
                    next.classList.remove("disabled");
                }

                tagsEl.scrollIntoView({
                    behavior: "smooth",
                });
            } else {
                mainSection.innerHTML = `
                <h1>There's No Movies To Show</h1>
                `;
            }
        });
}
getMovie(Api_Url);

function showMovies(data) {
    // any thin this function will return will be in this div
    contentDiv.innerHTML = "";
    data.forEach((loop) => {
        let { poster_path, title, overview, vote_average, id } = loop;
        let movieEl = document.createElement("div");
        movieEl.classList.add("movies");
        movieEl.innerHTML = `
                    <img src="${
                      poster_path
                        ? image_Url + poster_path
                        : "https://source.unsplash.com/random"
                    }" alt="${title}" />
                    <div class="movie-info">
                        <h4>${title}</h4>
                        <span class="${getVoteAverage(
                          vote_average
                        )}">${vote_average}</span>
                    </div>
                    <div class="overview">
                        <h4>Overview</h4>
                    ${overview}  
                    <div class="btn-parent">
                        <button id="${id}" class="know-more btn">Know More</button>  
                    </div>
                    </div>
        `;

        contentDiv.appendChild(movieEl);

        let moreBtn = document.getElementById(id);
        moreBtn.addEventListener("click", () => {
            // test if the id fetches right for every movie
            // console.log(id);
            openNav(loop);
        });
    });
}
let overlayContainer = document.querySelector("#container");
/* Open when someone clicks on the span element */
function openNav(movie) {
    let id = movie.id;
    fetch(Main_Url + "/movie/" + id + "/videos?" + My_Api + "&language=en-US")
        .then((response) => response.json())
        .then((Data) => {
            // console.log(Data);
            if (Data) {
                document.getElementById("myNav").style.height = "100%";
                if (Data.results.length > 0) {
                    var embed = [];
                    Data.results.forEach((video) => {
                        let { name, key, site } = video;
                        if (site == "YouTube") {
                            embed.push(`
                                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            `);
                        }
                    });
                    var content = `<h1 class="no-results">${movie.original_title}</h1>
                    <br/>
                    <br/>
                    ${embed.join("")}
                    `;
                    overlayContainer.innerHTML = content;
                    activeSlide = 0;
                    showVideos();
                } else {
                    overlayContainer.innerHTML = ` <h1 class="no-results">There's No Viseos To Show</h1>`;
                }
            }
        });
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}

function showVideos() {
    let embedClasses = document.querySelectorAll(".embed");
    let dots = document.querySelectorAll(".dot");

    totalVideos = embedClasses.length;
    embedClasses.forEach((embedTag, indeX) => {
        if (activeSlide == indeX) {
            embedTag.classList.add("show");
            embedTag.classList.remove("hide");
        } else {
            embedTag.classList.add("hide");
            embedTag.classList.remove("show");
        }
    });
}

function getVoteAverage(voteAverage) {
    if (voteAverage > 8) {
        return "green";
    } else if (voteAverage >= 5) {
        return "yellow";
    } else {
        return "red";
    }
}

form.addEventListener("submit", (eo) => {
    eo.preventDefault();
    let searchTerms = searchBox.value;
    if (searchTerms) {
        getMovie(search_Url + "&query=" + searchTerms);
    } else {
        getMovie(Api_Url);
    }

    // we called those here to remove the seleted Genre buttons
    getGenre = [];
    setGenre();

    // highLighted()
});

next.addEventListener("click", (eo) => {
    if (nextPage <= totalPages) {
        pageMoving(nextPage);
    }
});

prev.addEventListener("click", (eo) => {
    if (prevPage > 0) {
        pageMoving(prevPage);
    }
});

function pageMoving(page) {
    let urlSplit = lastUrl.split("?");
    let queryParams = urlSplit[1].split("&");
    let key = queryParams[queryParams.length - 1].split("=");
    if (key[0] != "page") {
        let url = lastUrl + "&page=" + page;
        getMovie(url);
    } else {
        key[1] = page.toString();
        let newVar = key.join("=");
        queryParams[queryParams.length - 1] = newVar;
        let anotherVar = queryParams.join("&");
        let url = urlSplit[0] + "?" + anotherVar;
        getMovie(url);
    }
}

//select Main section selector
let mainSectionScroll = document.querySelector("#main");

window.onscroll = function() {
    // scroll to up button
    let buttonScrollTop = document.getElementById("goup");
    if (window.pageYOffset >= 105) {
        buttonScrollTop.style.display = "block";
    } else {
        buttonScrollTop.style.display = "none";
    }
    buttonScrollTop.addEventListener("click", () => {
        window.scrollTo(0, 0);
    });
};