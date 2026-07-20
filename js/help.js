// =======================================================
// WaterPort
// Help System
// =======================================================

document.addEventListener("DOMContentLoaded", () => {

    const helpButton = document.getElementById("help-button");

    if (helpButton) {
        helpButton.addEventListener("click", toggleHelp);
    }

});

// =======================================================
// Abrir / Cerrar ayuda
// =======================================================

function toggleHelp() {

    const helpWindow = document.getElementById("help-window");

    if (!helpWindow) return;

    helpWindow.classList.toggle("visible");

}