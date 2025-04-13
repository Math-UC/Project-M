let selectedDino = null;

const dinos = document.querySelectorAll(".dino");
const continueBtn = document.getElementById("continueBtn");

dinos.forEach(dino => {
    dino.addEventListener("click", () => {
        dinos.forEach(d => d.classList.remove("selected"));
        dino.classList.add("selected");
        selectedDino = dino.getAttribute("data-dino");
    });
});

continueBtn.addEventListener("click", () => {
    const nameInput = document.getElementById("dinoName").value.trim();

    if (!selectedDino) {
        alert("Please select a dino!");
        return;
    }

    const userDino = {
        color: selectedDino,
        name: nameInput || "Unnamed Dino",
        mood: "happy",
        level: 1,
        gold: 0
    };

    localStorage.setItem("userDino", JSON.stringify(userDino));
    // window.location.href = ".html"; 
});