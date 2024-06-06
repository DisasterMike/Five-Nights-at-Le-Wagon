// ---------------------------------------------------
// Variables
// ---------------------------------------------------

const screen = document.querySelector(".screen");
const upButton = document.querySelector(".up");
const downButton = document.querySelector(".down");
const onButton = document.querySelector(".on-button");
const freddy = document.querySelector("#freddy");
const jumpscare = document.querySelector(".jumpscare");

const blackScreen = "url(../images/black.png)";
const staticScreen = "url(../images/static.png)";

const scareAudio = new Audio(
  "../sounds/fnaf-1-jumpscare-sound-made-with-Voicemod.mp3"
);
const staticAudio = new Audio("../sounds/static-noise.mp3");
const successAudio = new Audio("../sounds/Success 1c.wav");
const mainMusic = new Audio("../sounds/Atmosphere Loop 3.wav");
const winMusic = new Audio("../sounds/SC_Positive_Stinger_02.wav");

let tvScreenIndex = 0;
const screenImages = [
  "url(../images/horror.png)",
  "url(../images/Kitchen.jpg)",
  "url(../images/Dinning.jpg)",
  "url(../images/Bedroom.jpg)",
];

let freddieLocationIndex = 0;

let tvIsOff = true;
let canChangeChannel = true;

let p1CarPosition = 0;
let p2CarPosition = 0;
const p1Positions = document.querySelectorAll("#p1-race td");
const p2Positions = document.querySelectorAll("#p2-race td");

let hasWonTheGame = false;

// ---------------------------------------------------
// Functions
// ---------------------------------------------------

const setFreddie = (value) => {
  if (value === true) {
    freddy.style.display = "block";
  } else {
    freddy.style.display = "none";
  }
};

// const checkWinCondition = () => {
//   return p1CarPosition >= p1Positions.length;
// };

const setFreddieLocation = () => {
  const previousPosition = freddieLocationIndex;
  freddieLocationIndex = Math.floor(Math.random() * screenImages.length);
  if (freddieLocationIndex === previousPosition) freddieLocationIndex += 3;
  if (freddieLocationIndex >= screenImages.length) freddieLocationIndex = 0;
  // if previous was 0 and was for some reason new is 0, set it to last! - should never happen...
  if (freddieLocationIndex === previousPosition) freddieLocationIndex = -1;
};

const createSpawnForFreddie = () => {
  const top = Math.floor(Math.random() * 150);
  const left = Math.floor(Math.random() * 280);
  const size = Math.floor(Math.random() * 30) + 20; // between * ?? and + ??
  const rotation = Math.floor(Math.random() * 45); // set random rotation (min 45)
  // set a value used for flipping rotatio and getting negative value
  const negative = Math.floor(Math.random() * 2);
  freddy.style.top = `${top.toString()}px`;
  freddy.style.left = `${left.toString()}px`;
  freddy.style.height = `${size}px`;
  const rot = negative === 0 ? -rotation : rotation;
  freddy.style.transform = `rotate(${rot}deg)`;
  setFreddieLocation();
};

function resolveAfterTime(amountInSeconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, amountInSeconds * 1000);
  });
}

async function changeChannel(amount) {
  if (tvIsOff) return;

  canChangeChannel = false;
  setFreddie(false);
  screen.style.backgroundImage = staticScreen;
  staticAudio.play();
  const result = await resolveAfterTime(0.3);
  staticAudio.pause();
  tvScreenIndex += amount;
  if (tvScreenIndex > screenImages.length - 1) tvScreenIndex = 0;
  if (tvScreenIndex < 0) tvScreenIndex = screenImages.length - 1;
  screen.style.backgroundImage = screenImages[tvScreenIndex];
  canChangeChannel = true;
  tvIsOff = false;
  if (freddieLocationIndex !== tvScreenIndex) return;
  setFreddie(true);
}

const PlayJumpScare = () => {
  scareAudio.play();
  setFreddie(false);
  jumpscare.style.display = "block";
};

const turnOffTv = () => {
  screen.style.backgroundImage = blackScreen;
};
async function turnOnTv() {
  screen.style.backgroundImage = staticScreen;
  staticAudio.play();
  const result = await resolveAfterTime(0.3);
  staticAudio.pause();
  screen.style.backgroundImage = screenImages[tvScreenIndex];
  if (freddieLocationIndex !== tvScreenIndex) return;
  setFreddie(true);
}

const p1Race = () => {
  p1CarPosition += 3;
  for (let i = 0; i < p1Positions.length; i += 1) {
    p1Positions[i].classList.remove("active");
    if (i === p1CarPosition) p1Positions[i].classList.add("active");
  }
  setFreddie(false);

  if (p1CarPosition < p1Positions.length - 1) return;
  // console.log(p1Positions.length);
  // console.log(p1CarPosition);
  hasWonTheGame = true;
  const win = document.querySelector(".win-screen");
  win.style.display = "block";
  mainMusic.pause();
  winMusic.play();
};

const p2Race = () => {
  if (tvIsOff) return;
  if (hasWonTheGame) return;
  p2CarPosition += 1;
  for (let i = 0; i < p2Positions.length; i += 1) {
    p2Positions[i].classList.remove("active");
    if (i === p2CarPosition) p2Positions[i].classList.add("active");
  }
  if (p2CarPosition === p2Positions.length - 1) {
    PlayJumpScare();
    mainMusic.pause();
  }
};

// async function typeText(text) {
//   const string = document.querySelector(".rules");
//   const chars = text.split("");
//   for (let i = 0; i < chars.length; i += 1) {
//     string.innerText += chars[i];
//     await resolveAfterTime(0.03);
//   }
// }

// ---------------------------------------------------
// Event Listeners
// ---------------------------------------------------

upButton.addEventListener("click", (event) => {
  if (canChangeChannel) changeChannel(1);
});
downButton.addEventListener("click", (event) => {
  if (canChangeChannel) changeChannel(-1);
});

onButton.addEventListener("click", (event) => {
  if (tvIsOff) {
    turnOnTv();
    tvIsOff = false;
    mainMusic.play();
  } else {
    // turnOffTv();
    // tvIsOff = true;
    // TODO: start game when turning on the TV
  }
});

document.addEventListener("keyup", (event) => {
  if (event.code === "KeyD" || event.code === "ArrowRight") {
    if (canChangeChannel) changeChannel(1);
  }
  if (event.code === "KeyA" || event.code === "ArrowLeft") {
    if (canChangeChannel) changeChannel(-1);
  }
});

// When click freddie
freddy.addEventListener("click", (event) => {
  // play correct sound effect!
  successAudio.pause();
  successAudio.currentTime = 0;
  successAudio.play();
  p1Race();
  if (hasWonTheGame) return;
  createSpawnForFreddie();
  // reset tv
  turnOnTv();
});

if (typeof window === "object") {
  document.addEventListener("DOMContentLoaded", () => {
    // mainMusic.play();
    setInterval(p2Race, 2000); // Every 1 second, the `refresh` function is called.
    createSpawnForFreddie();
  });
}
