// =======================================================
// WaterPort
// Pause Manager
// =======================================================

const PauseManager = {

    paused: false,

    pause() {

        this.paused = true;
    },

    resume() {

        this.paused = false;
    },

    toggle() {

        if (this.paused) {

            this.resume();

        } else {

            this.pause();
        }
    },

    isPaused() {

        return this.paused;
    }

};