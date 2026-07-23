// =======================================================
// WaterPort
// Record Manager
// =======================================================

const RecordManager = {

    maximumScoreRecords: 5,

    records: {
        scores: [],
        times: []
    },


    // ===================================================
    // INICIO Y ALMACENAMIENTO
    // ===================================================

    init() {

        const savedRecords =
            localStorage.getItem("waterportRecords");

        if (!savedRecords) return;

        try {

            const parsedRecords =
                JSON.parse(savedRecords);

            this.records.scores =
                Array.isArray(parsedRecords.scores)
                    ? parsedRecords.scores
                    : [];

            // Se conserva vacío por compatibilidad con
            // archivos del juego que todavía lo consultan.
            this.records.times = [];

            this.sortRecords();

        } catch (error) {

            console.warn(
                "No se pudieron leer los récords guardados.",
                error
            );

            this.records = {
                scores: [],
                times: []
            };
        }
    },


    save() {

        localStorage.setItem(
            "waterportRecords",
            JSON.stringify(this.records)
        );
    },


    // ===================================================
    // COMPROBACIÓN DE RÉCORDS
    // ===================================================

    isHighScore(score, time, level = 0) {

        const candidate = {
            score: Number(score) || 0,
            time: Number(time) || 0,
            level: Number(level) || 0
        };

        const ranking = [
            ...this.records.scores,
            candidate
        ];

        ranking.sort(
            this.compareScoreRecords
        );

        return (
            ranking.indexOf(candidate) <
            this.maximumScoreRecords
        );
    },


    /*
        Se mantiene esta función para no romper las llamadas
        antiguas de finishGame() y TimeManager.

        Ya no existe una clasificación independiente
        de mejores tiempos.
    */
    isBestTime() {

        return false;
    },


    // ===================================================
    // GUARDAR UNA PARTIDA
    // ===================================================

    addRecord(
        initials,
        score,
        time,
        gameCompleted,
        level
    ) {

        const cleanInitials =
            this.cleanInitials(initials);

        const cleanScore =
            Number(score) || 0;

        const cleanTime =
            Number(time) || 0;

        const cleanLevel =
            Math.max(
                0,
                Number(level) || 0
            );

        const entersScoreList =
            this.isHighScore(
                cleanScore,
                cleanTime,
                cleanLevel
            );

        if (entersScoreList) {

            this.records.scores.push({
                initials: cleanInitials,
                score: cleanScore,
                time: cleanTime,
                level: cleanLevel
            });

            this.sortRecords();
            this.save();
        }

        return {
            highScore: entersScoreList,
            bestTime: false
        };
    },


    cleanInitials(initials) {

        const cleaned =
            String(initials || "")
                .toUpperCase()
                .replace(/[^A-ZÑ]/g, "")
                .slice(0, 3);

        return cleaned.padEnd(3, "-");
    },


    // ===================================================
    // ORDEN DE LA CLASIFICACIÓN
    // ===================================================

    compareScoreRecords(recordA, recordB) {

        const scoreA =
            Number(recordA.score) || 0;

        const scoreB =
            Number(recordB.score) || 0;

        if (scoreB !== scoreA) {
            return scoreB - scoreA;
        }

        const levelA =
            Number(recordA.level) || 0;

        const levelB =
            Number(recordB.level) || 0;

        if (levelB !== levelA) {
            return levelB - levelA;
        }

        const timeA =
            Number(recordA.time) || 0;

        const timeB =
            Number(recordB.time) || 0;

        return timeA - timeB;
    },


    sortRecords() {

        this.records.scores.sort(
            this.compareScoreRecords
        );

        this.records.scores =
            this.records.scores.slice(
                0,
                this.maximumScoreRecords
            );

        this.records.times = [];
    },


    // ===================================================
    // BORRAR TODOS LOS RÉCORDS
    // ===================================================

    clearRecords() {

        this.records = {
            scores: [],
            times: []
        };

        this.save();
    }

};


// Inicializar al arrancar el juego.
document.addEventListener(
    "DOMContentLoaded",
    () => RecordManager.init()
);