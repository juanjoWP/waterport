// =======================================================
// WaterPort
// Vista de récords
// =======================================================

const RecordsView = {

    overlayElement: null,
    scoreListElement: null,

    closeButtonElement: null,

    deleteButtonElement: null,
    confirmationElement: null,
    confirmYesElement: null,
    confirmNoElement: null,

    finishButtonElement: null,
    finishConfirmationElement: null,
    finishConfirmYesElement: null,
    finishConfirmNoElement: null,

    previousState: null,


    init() {

        this.overlayElement =
            document.getElementById("records-window");

        this.scoreListElement =
            document.getElementById("score-records-list");

        this.closeButtonElement =
            document.getElementById("records-close-button");

        this.deleteButtonElement =
            document.getElementById("records-delete-button");

        this.confirmationElement =
            document.getElementById("records-confirmation");

        this.confirmYesElement =
            document.getElementById("records-confirm-yes");

        this.confirmNoElement =
            document.getElementById("records-confirm-no");

        this.finishButtonElement =
            document.getElementById("records-finish-button");

        this.finishConfirmationElement =
            document.getElementById("finish-game-confirmation");

        this.finishConfirmYesElement =
            document.getElementById("finish-game-confirm-yes");

        this.finishConfirmNoElement =
            document.getElementById("finish-game-confirm-no");

        const recordsButton =
            document.getElementById("records-button");

        if (
            !this.overlayElement ||
            !this.scoreListElement ||
            !this.closeButtonElement ||
            !this.deleteButtonElement ||
            !this.confirmationElement ||
            !this.confirmYesElement ||
            !this.confirmNoElement ||
            !this.finishButtonElement ||
            !this.finishConfirmationElement ||
            !this.finishConfirmYesElement ||
            !this.finishConfirmNoElement ||
            !recordsButton
        ) {
            return;
        }

        recordsButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();
                this.open();
            }
        );

        this.closeButtonElement.addEventListener(
            "click",
            event => {

                event.stopPropagation();
                this.close();
            }
        );

        this.deleteButtonElement.addEventListener(
            "click",
            event => {

                event.stopPropagation();
                this.showDeleteConfirmation();
            }
        );

        this.confirmNoElement.addEventListener(
            "click",
            event => {

                event.stopPropagation();
                this.hideDeleteConfirmation();
            }
        );

        this.confirmYesElement.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                RecordManager.clearRecords();

                this.hideDeleteConfirmation();
                this.render();
            }
        );

        this.finishButtonElement.addEventListener(
            "click",
            event => {

                event.stopPropagation();
                this.showFinishConfirmation();
            }
        );

        this.finishConfirmNoElement.addEventListener(
            "click",
            event => {

                event.stopPropagation();
                this.hideFinishConfirmation();
            }
        );

            this.finishConfirmYesElement.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    this.hideFinishConfirmation();

                    this.overlayElement.classList.remove(
                        "records-window-visible"
                    );

                    TimeManager.finishCurrentGame();
                }
            );

        this.overlayElement.addEventListener(
            "click",
            event => {

                if (event.target === this.overlayElement) {
                    this.close();
                }
            }
        );
    },


    open() {

        if (!this.overlayElement) return;

        this.previousState =
            GameState.current;

        GameState.set(
            GameState.ENTERING_RECORD
        );

        PauseManager.pause();
        TimeManager.stop();

        this.hideDeleteConfirmation();
        this.hideFinishConfirmation();

        this.render();

        this.overlayElement.classList.add(
            "records-window-visible"
        );
    },


    close() {

        if (!this.overlayElement) return;

        this.hideDeleteConfirmation();
        this.hideFinishConfirmation();

        this.overlayElement.classList.remove(
            "records-window-visible"
        );

        PauseManager.resume();
        TimeManager.resume();

        GameState.set(
            this.previousState ||
            GameState.PLAYING
        );
    },


    showDeleteConfirmation() {

        this.hideFinishConfirmation();

        this.confirmationElement.classList.add(
            "records-confirmation-visible"
        );
    },


    hideDeleteConfirmation() {

        this.confirmationElement.classList.remove(
            "records-confirmation-visible"
        );
    },


    showFinishConfirmation() {

        this.hideDeleteConfirmation();

        this.finishConfirmationElement.classList.add(
            "finish-game-confirmation-visible"
        );
    },


    hideFinishConfirmation() {

        this.finishConfirmationElement.classList.remove(
            "finish-game-confirmation-visible"
        );
    },


    render() {

        this.renderScoreRecords();
    },


    renderScoreRecords() {

        this.scoreListElement.innerHTML = "";

        const records =
            RecordManager.records.scores;

        if (records.length === 0) {

            this.scoreListElement.innerHTML =
                '<div class="records-empty">SIN RÉCORDS</div>';

            return;
        }

        records.forEach((record, index) => {

            const level =
                Math.max(
                    0,
                    Number(record.level) || 0
                );

            const row =
                this.createRecordRow(
                    index,
                    record.initials,
                    `${record.score} PUNTOS`,
                    `${this.formatTime(record.time)} · NIVEL ${level}`
                );

            this.scoreListElement.appendChild(row);
        });
    },


    createRecordRow(
        index,
        initials,
        mainValue,
        secondaryValue
    ) {

        const row =
            document.createElement("div");

        row.className = "record-row";

        if (index === 0) {
            row.classList.add("record-first");
        }

        row.innerHTML = `
            <span class="record-position">${index + 1}º</span>
            <span class="record-initials">${initials}</span>
            <span class="record-main">${mainValue}</span>
            <span class="record-secondary">${secondaryValue}</span>
        `;

        return row;
    },


    formatTime(totalSeconds) {

        const safeTotalSeconds =
            Math.max(
                0,
                Number(totalSeconds) || 0
            );

        const minutes =
            Math.floor(safeTotalSeconds / 60);

        const seconds =
            safeTotalSeconds % 60;

        return `${minutes}:${seconds
            .toString()
            .padStart(2, "0")}`;
    }

};


document.addEventListener(
    "DOMContentLoaded",
    () => RecordsView.init()
);