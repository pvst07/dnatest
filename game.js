// Read catalog saved by the shop page
const catalog = JSON.parse(localStorage.getItem('enzymesCatalog') || '[]');
const byId = Object.fromEntries(catalog.map(e => [e.id, e]));

// Stage 1 buttons (match your mockup order)
const STAGE_ENZYMES = JSON.parse(localStorage.getItem('selectedEnzymes') || '[]');

// Render enzyme buttons with picture icons
const actions = document.getElementById('actions');
actions.innerHTML = STAGE_ENZYMES.map(id => {
  const e = byId[id] || { name: id, color: '#ccc' };
  const icon = e.img
    ? `<span class="icon-dot"><img src="${e.img}" alt="${e.name}"></span>`
    : `<span class="icon-dot" style="background:${e.color || '#ccc'}"></span>`;
  return `<button class="enzyme-btn" data-id="${id}">${icon}<span>${e.name}</span></button>`;
}).join('');

// // Example click logic: make HELICASE the correct one to “uncoil”
// actions.querySelectorAll('.enzyme-btn').forEach(btn => {
//   btn.addEventListener('click', () => {
//     const id = btn.getAttribute('data-id');

//     // demo feedback
//     if (id === 'helicase') {
//       btn.classList.add('correct');
//       // TODO: move to next scene/animate DNA, etc.
//       console.log('Correct: helicase chosen');
//     } else {
//       btn.classList.add('wrong');
//       setTimeout(() => btn.classList.remove('wrong'), 600);
//     }
//   });





// });

let currentStep = 1;
let templateDNA = '';

const instructions   = document.getElementById('game-instructions');
const imageEl        = document.getElementById('dna-image');
const inputBox       = document.getElementById('input-container');
const randomDNABox   = document.getElementById('random-dna-container');
const userInputEl    = document.getElementById('user-input');
const checkBtn       = document.getElementById('check-btn');

function generateRandomDNA(len = 6){
  const bases = ['A','T','C','G'];
  let s = '';
  for (let i=0;i<len;i++) s += bases[Math.floor(Math.random()*bases.length)];
  return s;
}
function compBase(b){
  if (b==='A') return 'T';
  if (b==='T') return 'A';
  if (b==='C') return 'G';
  if (b==='G') return 'C';
  return '';
}

function setImageSequence(paths, delays){
  // simple small animation sequence
  paths.forEach((src, i) => setTimeout(() => { imageEl.src = src; }, delays[i] || 0));
}

// ------- main step logic -------
let awaitingComplement = false;

function chooseEnzyme(enzymeId){
  switch (currentStep) {
    case 1: // Topoisomerase
      if (enzymeId === 'topoisomerase') {
        instructions.textContent = 'Great! DNA is relaxing…'; instructions.style.color = 'green';
        setImageSequence(
          ['../image/topo1.jpg','../image/topo2.jpg','../image/topo3.jpg','../image/topo4.jpg','../image/uncoiledDNA.jpg'],
          [0,400,800,1200,1700]
        );
        currentStep = 2;
      } else {
        instructions.textContent = 'Silly you! DNA is still super coiled.'; instructions.style.color = 'red';
      }
      break;

    case 2: // Helicase
      if (enzymeId === 'helicase') {
        instructions.textContent = 'Well done! Helicase opened the strands.'; instructions.style.color = 'green';
        imageEl.src = '../image/helicase.jpg';
        currentStep = 3;
      } else {
        instructions.textContent = 'Your DNA is still double helix; you cannot proceed the replication like this!'; instructions.style.color = 'red';
      }
      break;

    case 3: // SSB
      if (enzymeId === 'SSB_Protein') {
        instructions.textContent = 'Nice! SSB keeps strands apart.'; instructions.style.color = 'green';
        imageEl.src = '../image/ssb.jpg';
        currentStep = 4;
      } else {
        instructions.textContent = 'Your DNA strands are rejoining. Try another enzyme.'; instructions.style.color = 'red';
      }
      break;

    case 4: // Primase
      if (enzymeId === 'primase') {
        instructions.textContent = 'Good! Primers are in. Time to add nucleotides!'; instructions.style.color = 'green';
        imageEl.src = '../image/primase.jpg';
        currentStep = 5;
       
      } 
      else {
        instructions.textContent = 'Seems like your enzymes do not know where to begin???'; instructions.style.color = 'red';
      }
      break;

    case 5: // waiting for user to type complement (handled by CHECK button)
      if (enzymeId === 'dna_pol_iii' && !awaitingComplement) {
        imageEl.src = '../image/dnapol3.jpg';
        instructions.textContent = 'Enter the complementary strand and press CHECK.'; instructions.style.color = 'green';
        // show the input ONLY now
        templateDNA = generateRandomDNA(6);
        randomDNABox.textContent = `Template Strand: ${templateDNA}`;
        userInputEl.value = '';
        inputBox.classList.remove('hidden');
        awaitingComplement = true; 
        
      } 
      else {
        instructions.textContent =  'The strands are not complete yet! Please replicate them.'; instructions.style.color = 'red';
      }
     break;

    case 6: // DNA Pol I
      if (enzymeId === 'dna_pol_i') {
        instructions.textContent = 'Great! DNA Polymerase I replaced primers.'; instructions.style.color = 'green';
        imageEl.src = '../image/dnapol1.jpg';
        currentStep = 7;
      } else {
        instructions.textContent =  'There is still something a little bit off on the replicated sides. Maybe replace something?'; instructions.style.color = 'red';
      }
      break;

    case 7: // Ligase
      if (enzymeId === 'ligase') {
        instructions.textContent = 'Congrats! Ligase sealed the gaps!'; instructions.style.color = 'green';
        imageEl.src = '../image/ligase.jpg';

        setTimeout(() => {
          instructions.textContent = 'You finished the game! Refresh to play again.'; instructions.style.color = 'green';
          imageEl.src = '../image/ligase.jpg';
          imageEl.src = '../image/DNA-finish.jpg';
        }, 3000);
      } else {
        instructions.textContent = 'The gaps have not been sealed!!'; instructions.style.color = 'red';
      }
      break;

  }
}

// CHECK button (validates user ATCG only at step 5)
checkBtn.addEventListener('click', () => {
  if (currentStep !== 5) return; // only active at step 5
  const input = userInputEl.value.trim().toUpperCase();
  // simple validation: only A/T/C/G
  if (!/^[ATCG]{6}$/.test(input)) {
    instructions.textContent = 'Use only A, T, C, G (length 6). Try again.'; instructions.style.color = 'red';
    return;
  }
  const correct = templateDNA.split('').map(compBase).join('');
  if (input === correct) {
    instructions.textContent = 'Awesome! Complementary strand synthesized.'; instructions.style.color = 'green';
    imageEl.src = '../image/completestrand.jpg';
    inputBox.classList.add('hidden');
    currentStep = 6; // move to next enzyme (DNA Pol I)
  } else {
    instructions.textContent = 'Incorrect complementary strand. Try again!'; instructions.style.color = 'red';
  }
});

// hook up buttons
actions.querySelectorAll('.enzyme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-id');

    if (currentStep === 5 && awaitingComplement) {
      instructions.textContent = 'Enter the complementary strand and press CHECK.';instructions.style.color = 'green';
      return; // ไม่ทำอะไรต่อ
    }
    
    chooseEnzyme(id);
  });
});


function handleCheck() {
  if (currentStep !== 5 || !awaitingComplement) return;

  const input = userInputEl.value.trim().toUpperCase();
  if (!/^[ATCG]{6}$/.test(input)) {
    instructions.textContent = 'Use only A, T, C, G (length 6). Try again.';instructions.style.color = 'red';
    return;
  }

  const correct = templateDNA.split('').map(compBase).join('');
  if (input === correct) {
    instructions.textContent = 'Awesome! Complementary strand synthesized.'; instructions.style.color = 'green';
    imageEl.src = '../image/completestrand.jpg';
    inputBox.classList.add('hidden');   // ← ซ่อนอินพุตเมื่อถูก
    awaitingComplement = false;
    currentStep = 6;                    // ← ค่อยขยับขั้นตอนที่นี่
  } else {
    instructions.textContent = 'Incorrect complementary strand. Try again!'; instructions.style.color = 'red';
  }
}

// ผูกกับปุ่ม CHECK
checkBtn.addEventListener('click', handleCheck);

// ผูกกับปุ่ม Enter ในช่องกรอก
userInputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleCheck();
  }
});
