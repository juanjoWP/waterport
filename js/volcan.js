// =======================================================
// WaterPort
// Propagación del volcán
// =======================================================

const VOLCANO_INTERVAL = 9000;

let volcanoTimer = null;

const FIRE_IMAGES = {
  straight:
    "assets/tiles/horizontal_fuego.png",

  curve:
    "assets/tiles/curva_fuego.png",

  tee:
    "assets/tiles/T_fuego.png",

  cross:
    "assets/tiles/cruz_fuego.png"
};

function stopVolcano() {
  if (volcanoTimer !== null) {
    clearInterval(volcanoTimer);
    volcanoTimer = null;
  }
}

function getVolcanoExpansionTiles() {
  const candidates = [];

  const offsets = [
    [-1, -1],
    [-1,  0],
    [-1,  1],
    [ 0, -1],
    [ 0,  1],
    [ 1, -1],
    [ 1,  0],
    [ 1,  1]
  ];

  let volcano = null;

  for (const row of boardTiles) {
    for (const tile of row) {
      if (tile.volcano) {
        volcano = tile;
        break;
      }
    }

    if (volcano) {
      break;
    }
  }

  if (!volcano) {
    return candidates;
  }

  for (const [rowOffset, colOffset] of offsets) {
    const row =
      volcano.row + rowOffset;

    const col =
      volcano.col + colOffset;

    const tile =
      boardTiles[row]?.[col];

    if (
      !tile ||
      tile.volcano ||
      tile.burned
    ) {
      continue;
    }

    candidates.push(tile);
  }

  return candidates;
}
function burnTile(tile) {
  tile.burned = true;

  tile.element.classList.add(
    "burned-tile"
  );

  const fireImage =
    FIRE_IMAGES[tile.type];

  if (!fireImage) {
    return;
  }

  tile.pipeElement.style.backgroundImage =
    `url("${fireImage}")`;

  tile.pipeElement.style.backgroundSize =
    "contain";

  tile.pipeElement.style.backgroundPosition =
    "center";

  tile.pipeElement.style.backgroundRepeat =
    "no-repeat";
    document.dispatchEvent(
  new CustomEvent("tileBurned", {
    detail: {
      tile: tile
    }
  })
);
}

function spreadVolcano() {
  if (
    typeof levelCompleted !== "undefined" &&
    levelCompleted
  ) {
    return;
  }

  const candidates =
    getVolcanoExpansionTiles();

  if (candidates.length === 0) {
    stopVolcano();
    return;
  }

  const randomIndex =
    Math.floor(
      Math.random() * candidates.length
    );

  burnTile(
    candidates[randomIndex]
  );
}

function startVolcano() {
  stopVolcano();

  const volcanoExists =
    boardTiles.some(row =>
      row.some(tile => tile.volcano)
    );

  if (!volcanoExists) {
    return;
  }

  volcanoTimer =
    setInterval(
      spreadVolcano,
      VOLCANO_INTERVAL
    );
}

document.addEventListener(
  "boardCreated",
  startVolcano
);