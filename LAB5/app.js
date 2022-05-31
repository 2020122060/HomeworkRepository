//fetch

function initialize(products) {
  const category = document.querySelector("#category");
  const searchTerm = document.querySelector("#searchTerm");
  const searchBtn = document.querySelector("button");
  const main = document.querySelector("main");

  let lastCategory = category.value;
  let lastSearch = "";

  let categoryGroup;
  let finalGroup;

  finalGroup = products;
  updateDisplay();

  categoryGroup = [];
  finalGroup = [];

  searchBtn.addEventListener("click", selectCategory);

  function selectCategory(event) {
    event.preventDefault();

    categoryGroup = [];
    finalGroup = [];

    if (
      category.value === lastCategory &&
      searchTerm.value.trim() === lastSearch
    ) {
      return;
    } else {
      lastCategory = category.value;
      lastSearch = searchTerm.value.trim();
      if (category.value === "All") {
        categoryGroup = products;
        selectProducts();
      } else {
        const lowerCaseType = category.value.toLowerCase();
        categoryGroup = products.filter(
          (product) => product.type === lowerCaseType
        );

        selectProducts();
      }
    }
  }

  function selectProducts() {
    if (searchTerm.value.trim() === "") {
      finalGroup = categoryGroup;
    } else {
      const lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
      finalGroup = categoryGroup.filter((product) =>
        product.name.includes(lowerCaseSearchTerm)
      );
    }

    updateDisplay();
  }

  function updateDisplay() {
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }

    if (finalGroup.length === 0) {
      const para = document.createElement("p");
      para.textContent = "No results to display!";
      main.appendChild(para);
    } else {
      for (const product of finalGroup) {
        fetchBlob(product);
      }
    }
  }

  function fetchBlob(product) {
    const url = `images/${product.image}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => showProduct(blob, product))
      .catch((err) => console.error(`Fetch problem: ${err.message}`));
  }

  function showProduct(blob, product) {
    const objectURL = URL.createObjectURL(blob);

    const section = document.createElement("section");
    const btn = document.createElement("button");
    const heading = document.createElement("h2");
    const para = document.createElement("p");
    const image = document.createElement("img");

    const form = document.createElement("form");

    section.setAttribute("class", "section");

    heading.textContent = product.name.replace(
      product.name.charAt(0),
      product.name.charAt(0).toUpperCase()
    );

    para.textContent = `$${product.price.toFixed(2)}`;

    btn.innerText = "설명 보기!";

    image.src = objectURL;
    image.alt = product.name;

    heading.hidden = true;
    para.hidden = true;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (heading.hidden === true) {
        btn.innerText = "설명 그만 보기!";
        heading.hidden = false;
        para.hidden = false;
      } else {
        btn.innerText = "설명 보기!";
        heading.hidden = true;
        para.hidden = true;
      }
    });
    main.appendChild(section);
    section.appendChild(form);
    form.appendChild(btn);
    form.appendChild(heading);
    form.appendChild(para);
    section.appendChild(image);
  }
}
let counter = 1;

load();

document.addEventListener("DOMcontentLoaded", load);

window.onscroll = () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    load();
  }
};

//

function load() {
  //
  const start = counter;
  const end = start + 1;
  counter = end + 1;
  //
  fetch("product.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then((json) => initialize(json))
    .catch((err) => console.error(`Fetch problem: ${err.message}`));
}
