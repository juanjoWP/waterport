// =======================================================
// WaterPort
// Time Manager
// =======================================================

const TimeManager = {

    levelDuration: 120,
    remainingTime: 120,
    totalElapsedTime: 0,
    intervalId: null,

    startLevel() {

        this.stop();

        this.remainingTime = this.levelDuration;

        this.updateUI();
        this.resume();
    },

    resume() {

        if (this.intervalId !== null) return;

        this.intervalId = setInterval(() => {

            this.remainingTime--;
            this.totalElapsedTime++;

            if (this.remainingTime <= 0) {

                this.remainingTime = 0;

                this.updateUI();
                this.stop();
                this.handleTimeUp();

                return;
            }

            this.updateUI();

        }, 1000);
    },

    stop() {

        if (this.intervalId !== null) {

            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    },

    addSeconds(seconds) {

        if (!GameState.is(GameState.PLAYING)) return;

        this.remainingTime += seconds;
        this.updateUI();
    },

    getRemainingTime() {

        return this.remainingTime;
    },

    getTotalElapsedTime() {

        return this.totalElapsedTime;
    },

    resetGameTime() {

        this.stop();

        this.totalElapsedTime = 0;
        this.remainingTime = this.levelDuration;

        this.updateUI();
    },

    handleTimeUp() {

        this.stop();

        GameState.set(
            GameState.GAME_OVER
        );

        const finalScore =
            ScoreManager.get();

        const finalTime =
            this.getTotalElapsedTime();

        const entersScoreRecords =
            RecordManager.isHighScore(
                finalScore,
                finalTime
            );

        const entersTimeRecords =
            RecordManager.isBestTime(
                finalScore,
                finalTime,
                true
            );

        PopupManager.show(
            "TIEMPO AGOTADO",
            "level",
            1500
        );

        setTimeout(() => {

            if (
                entersScoreRecords ||
                entersTimeRecords
            ) {

                SoundManager.playGameComplete();

                RecordEntry.open(
                    finalScore,
                    finalTime,
                    true
                );

                return;
            }

            GameState.set(
                GameState.WAITING_RESTART
            );

            const messageElement =
                document.getElementById("message");

            if (messageElement) {

                messageElement.textContent =
                    "TIEMPO AGOTADO · CLIC PARA EMPEZAR";
            }

        }, 1500);
    },

    updateUI() {

        const timerElement =
            document.getElementById("timer");

        if (!timerElement) return;

        const minutes =
            Math.floor(this.remainingTime / 60);

        const seconds =
            this.remainingTime % 60;

        timerElement.textContent =
            `${minutes}:${seconds
                .toString()
                .padStart(2, "0")}`;
    }

};


// Cada tablero nuevo inicia una cuenta atrás de 2 minutos.
document.addEventListener(
    "boardCreated",
    () => TimeManager.startLevel()
);