const pokemonContainer = document.getElementById("pokemonContainer");
const overlay = document.getElementById("overlay");
const pokeBox = document.getElementById("pokeBox");
const resultBox = document.getElementById("resultBox");
const pokeBtn = document.getElementById("pokeBtn");
const myPokemonBtn = document.getElementById("myPokemonBtn");
const modal = document.getElementById("modal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modeBtn = document.getElementById("modeBtn");
const resetBtn = document.getElementById("resetBtn");

let myPokemonList = [];

function loadMyPokemon() {
  const savedData = localStorage.getItem("myPokemonList");

  if (savedData !== null) {
    const jsonData = JSON.parse(savedData);
    jsonData.forEach((pokemon) => {
      paintMyPokemon(pokemon);
      myPokemonList.push(pokemon);
    });
  }
}

function paintMyPokemon(pokemon) {
  const pokemonCard = document.createElement("div");
  const pokemonImg = `<img src=${pokemon.smImgUrl} alt=${pokemon.name}>`;

  pokemonCard.setAttribute("id", pokemon.id);
  pokemonCard.classList.add("modal-image");
  pokemonCard.innerHTML = pokemonImg;
  pokemonContainer.appendChild(pokemonCard);
}

async function openMyPokeball() {
  pokeBtn.disabled = true;
  pokeBtn.style.cursor = "inherit";
  pokeBtn.classList.add("shake-ball");

  const pokemon = await getNewPokemon();
  setTimeout(() => showNewPokemon(pokemon), 3000);

  if (myPokemonList.find((obj) => obj.id === pokemon.id) === undefined) {
    paintMyPokemon(pokemon);
    myPokemonList.push(pokemon);
  }
  saveLS();
}

async function getNewPokemon() {
  const maxNum = 300;
  const num = Math.ceil(Math.random() * maxNum);

  const {
    name,
    id,
    weight,
    height,
    types,
    sprites: { front_default: smImgUrl },
  } = await fetch(`https://pokeapi.co/api/v2/pokemon/${num}`).then((res) =>
    res.json()
  );

  const lgPokeUrl =
    "https://pokeres.bastionbot.org/images/pokemon/" + id + ".png";

  const obj = {
    name,
    id,
    weight,
    height,
    smImgUrl,
    lgPokeUrl,
    types: types.map((arr) => arr.type.name),
  };

  return obj;
}

function saveLS() {
  localStorage.setItem("myPokemonList", JSON.stringify(myPokemonList));
}

function showNewPokemon(pokemon) {
  pokeBtn.classList.remove("shake-ball");
  pokeBox.classList.add("is-hidden");
  resultBox.classList.remove("is-hidden");

  const { name, weight, height, types, lgPokeUrl } = pokemon;
  const html_code = `
    <button type="button" id="closeBtn" class="close-btn">
      <i class="fas fa-times"></i>
    </button>
    <div class="result-img">
      <img
        src=${lgPokeUrl}
        alt=${name}
      />
    </div>
    <div class="result-info">
      <dl class="result-list">
        <div class="result-item">
          <dt>Name</dt>
          <dd>${name}</dd>
        </div>
        <div class="result-item">
          <dt>Height(cm)</dt>
          <dd>${height * 10}</dd>
        </div>
        <div class="result-item">
          <dt>Weight(kg)</dt>
          <dd>${weight * 0.1}</dd>
        </div>
        <div class="result-item">
          <dt>Types</dt>
          <dd>${types.join(", ")}</dd>
        </div>
      </dl>
    </div>
  `;

  resultBox.innerHTML = html_code;

  const closeBtn = document.getElementById("closeBtn");
  closeBtn.addEventListener("click", closeNewPokemon);
}

function closeNewPokemon() {
  resultBox.innerHTML = "";
  resultBox.classList.add("is-hidden");
  pokeBox.classList.remove("is-hidden");
  pokeBtn.style.cursor = "pointer";
  pokeBtn.disabled = false;
}

function toggleModal() {
  const currentMode = document.getElementById("currentMode");

  if (currentMode.innerText === "Delete Mode") {
    toggleMode();
  }

  modal.classList.toggle("is-hidden");
  overlay.classList.toggle("is-hidden");
}

function deleteModalImg(e) {
  const target = e.target;
  pokemonContainer.removeChild(target);

  const newMyPokemon = myPokemonList.filter(
    (pokemon) => pokemon.id !== Number(target.id)
  );
  myPokemonList = newMyPokemon;
  saveLS();
}

function toggleMode() {
  const currentMode = document.getElementById("currentMode");
  const modalImgs = document.querySelectorAll(".modal-image");

  // normal mode에서 delete mode로 변경
  if (currentMode.innerText === "Normal Mode") {
    currentMode.innerText = "Delete Mode";
    modeBtn.innerText = "Normal Mode";
    modalImgs.forEach((modalImg) => {
      modalImg.addEventListener("click", deleteModalImg);
      modalImg.classList.add("modal-img-delete");
    });
    // delete mode에서 normal mode로 변경
  } else {
    currentMode.innerText = "Normal Mode";
    modeBtn.innerText = "Delete Mode";

    modalImgs.forEach((modalImg) => {
      modalImg.removeEventListener("click", deleteModalImg);
      modalImg.classList.remove("modal-img-delete");
    });
  }
  currentMode.classList.toggle("delete-mode");
  currentMode.classList.toggle("normal-mode");
}

function resetMyPokemon() {
  myPokemonList = [];
  pokemonContainer.innerText = "";
  saveLS();
}

function init() {
  loadMyPokemon();
  pokeBtn.addEventListener("click", openMyPokeball);
  myPokemonBtn.addEventListener("click", toggleModal);
  modalCloseBtn.addEventListener("click", toggleModal);
  modeBtn.addEventListener("click", toggleMode);
  resetBtn.addEventListener("click", resetMyPokemon);
}

init();
