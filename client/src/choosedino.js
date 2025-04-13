let selectedDino = null;

const dinoImages = {
  red: {
    neutral: "red-neutral.png",
    happy: "red-happy.png"
  },
  blue: {
    neutral: "blue-neutral.png",
    happy: "blue-happy.png"
  },
  green: {
    neutral: "green-neutral.png",
    happy: "green-happy.png"
  }
};

document.querySelectorAll(".dino").forEach(img => {
  const color = img.dataset.color;

  img.addEventListener("mouseover", () => {
    img.src = dinoImages[color].happy;
  });

  img.addEventListener("mouseout", () => {
    if (selectedDino !== color) {
      img.src = dinoImages[color].neutral;
    }
  });

  img.addEventListener("click", () => {
    selectDino(color);
  });
});

function selectDino(color) {
  selectedDino = color;

  document.querySelectorAll(".dino").forEach(img => {
    const c = img.dataset.color;
    img.src = dinoImages[c].neutral;
  });

  // Highlight the selected one
  document.querySelector(`#${color}Dino`).src = dinoImages[color].happy;

  let defaultName = capitalizeFirstLetter(color);
  const rename = confirm(`Do you want to rename your ${defaultName} dino?`);

  if (rename) {
    const newName = prompt("Enter your dino's name:");
    if (newName) {
      saveDinoSelection(color, newName);
    } else {
      saveDinoSelection(color, defaultName);
    }
  } else {
    saveDinoSelection(color, defaultName);
  }
}

function saveDinoSelection(color, name) {
  const dinoData = {
    color: color,
    name: name,
    mood: "neutral",
    level: 1,
    gold: 0
  };

  localStorage.setItem("userDino", JSON.stringify(dinoData));
  document.getElementById("dinoNameDisplay").textContent = `You chose ${name} the ${capitalizeFirstLetter(color)} Dino!`;
  document.getElementById("continueBtn").style.display = "inline-block";
}

function goToIntro() {
  window.location.href = "intro.html";
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
