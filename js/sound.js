// =======================================================
// WaterPort
// Sound Manager
// =======================================================

const SoundManager = {

    levelCompleteSound: new Audio(
        "assets/sounds/glu.mp3"
    ),

    gameCompleteSound: new Audio(
        "assets/sounds/clap.mp3"
    ),

    playLevelComplete() {

        this.levelCompleteSound.currentTime = 0;

        this.levelCompleteSound.play().catch(() => {
            // El navegador puede bloquear el audio.
        });
    },

    playGameComplete() {

        this.gameCompleteSound.currentTime = 0;

        this.gameCompleteSound.play().catch(() => {
            // El navegador puede bloquear el audio.
        });
    }

};