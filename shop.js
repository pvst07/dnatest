// ---- data ----
const ENZYMES = [
  {
    id: "topoisomerase",
    name: "Topoisomerase",
    img: "../image/Topoisomerase.png",
  },
  { id: "helicase", name: "Helicase", img: "../image/helicase.png" },
  { id: "primase", name: "Primase", img: "../image/primase.png" },
  { id: "ligase", name: "Ligase", img: "../image/ligase.png" },
  {
    id: "dna_pol_iii",
    name: "DNA Polymerase III",
    img: "../image/DNA_pol_iii.png",
  },
  { id: "dna_pol_i", name: "DNA Polymerase I", img: "../image/DNA_pol_i.png" },
  {
    id: "SSB_Protein",
    name: "SSB_Protein",
    img: "../image/SSB_Protein-fotor-bg-remover-20250811192919.png",
  },
  { id: "oxidoreductase", name: "Oxidoreductase", img: "../image/Oxidoreductase.png" },
  { id: "amylase", name: "Amylase", color: "#39B4E6" },
];

const LS_KEY = "selectedEnzymes";

// restore state
let selected = loadSelected();

// render grid
const grid = document.getElementById("grid");
grid.innerHTML = ENZYMES.map((e) => cardHTML(e)).join("");
attachCardHandlers();

// render dots
renderDots();
updateButtonStates();

document.getElementById('clearBtn').addEventListener('click', (e) => {
  e.preventDefault();
  selected = [];
  renderDots();
  saveSelected();
  updateButtonStates();
});


// go button
document.getElementById("goBtn").addEventListener("click", (e) => {
  e.preventDefault();
  // persist and go
  saveSelected();
  window.location.href = '../game/game.html';
});

// ---------- functions ----------
// function cardHTML(e){
//   return `
//     <article class="card" data-id="${e.id}">
//       <div class="circle" style="background:${e.color}"></div>
//       <div class="controls">
//         <button class="ctrl plus" title="Add ${e.name}" aria-label="Add ${e.name}">+</button>
//         <button class="ctrl minus" title="Remove ${e.name}" aria-label="Remove ${e.name}">−</button>
//       </div>
//       <div class="label">${e.name}</div>
//     </article>
//   `;
// }

function cardHTML(e) {
  return `
    <article class="card" data-id="${e.id}">
      <div class="pic" >
        <img src="${e.img}" alt="${e.name}" />
      </div>
      <div class="controls">
        <button class="ctrl plus" title="Add ${e.name}" aria-label="Add ${e.name}">+</button>
        <button class="ctrl minus" title="Remove ${e.name}" aria-label="Remove ${e.name}">−</button>
      </div>
      <div class="label">${e.name}</div>
    </article>
  `;
}

// function attachCardHandlers() {
//   grid.querySelectorAll(".card").forEach((card) => {
//     const id = card.getAttribute("data-id");
//     card.querySelector(".plus").addEventListener("click", () => addEnzyme(id));
//     card
//       .querySelector(".minus")
//       .addEventListener("click", () => removeEnzyme(id));
//   });
// }

function attachCardHandlers(){
  grid.querySelectorAll('.card').forEach(card => {
    const id = card.getAttribute('data-id');
    const plusBtn = card.querySelector('.plus');
    const minusBtn = card.querySelector('.minus');

    plusBtn.addEventListener('click', () => addEnzyme(id));
    minusBtn.addEventListener('click', () => removeEnzyme(id));
  });
}


function addEnzyme(id){
  const warningBox = document.getElementById("warning");
  if(selected.length >= 7){
    warningBox.textContent = "You can only select up to 7 enzymes.";
    return;
  }
  if (selected.includes(id)) return;
  selected.push(id);
  renderDots();
  saveSelected();
  updateButtonStates();
  warningBox.textContent = "";

}

function removeEnzyme(id){
  const idx = selected.indexOf(id);
  if (idx === -1) return; // not in list

  selected.splice(idx, 1);
  renderDots();
  saveSelected();
  updateButtonStates();
}
function updateButtonStates(){
  grid.querySelectorAll('.card').forEach(card => {
    const id = card.getAttribute('data-id');
    const plusBtn = card.querySelector('.plus');

    if (selected.includes(id)) {
      plusBtn.disabled = true;
      plusBtn.classList.add('disabled');
    } else {
      plusBtn.disabled = false;
      plusBtn.classList.remove('disabled');
    }
  });
}


function renderDots() {
  const track = document.getElementById("dotTrack");
  track.innerHTML = "";
  selected.forEach((id) => {
    const e = ENZYMES.find((x) => x.id === id);
    if (!e) return;

    if (e.img) {
      const wrap = document.createElement("span");
      wrap.className = "dot dot-img";
      const img = document.createElement("img");
      img.src = e.img;
      img.alt = e.name;
      wrap.appendChild(img);
      track.appendChild(wrap);
    } else {
      const dot = document.createElement("span");
      dot.className = "dot";
      dot.style.background = e.color;
      track.appendChild(dot);
    }
  });
}

function saveSelected() {
  localStorage.setItem(LS_KEY, JSON.stringify(selected));
}

function loadSelected() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

localStorage.setItem('enzymesCatalog', JSON.stringify(ENZYMES));
