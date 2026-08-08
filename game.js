(() => {
  "use strict";

  const MAP = Object.freeze({
    id: "oberkirch-zentrum",
    name: "OBERKIRCH ZENTRUM",
    image: "assets/maps/OBERKIRCH ZENTRUM.webp",
    width: 10000,
    height: 6667
  });

  const PLAYER = Object.freeze({
    standRight: "assets/player/PLAYER STAND.png",
    standLeft: "assets/player/PLAYER STAND LEFT.png",

    walkRight: "assets/player/PLAYER WALK RIGHT.png",
    walkLeft: "assets/player/PLAYER WALK LEFT.png",

    walkDown: [
      "assets/player/PLAYER WALK DOWN 1.png",
      "assets/player/PLAYER WALK DOWN 2.png"
    ],

    walkUp: "assets/player/PLAYER WALK UP 1.png",

    combatBase: "assets/player/combat/PLAYER COMBAT BASE.webp",
    combatBaseLeft: "assets/player/combat/PLAYER COMBAT BASE LEFT.webp",

    attackRight1: "assets/player/combat/PLAYER ATTACK RIGHT 1.webp",
    attackRight2: "assets/player/combat/PLAYER ATTACK RIGHT 2.webp",
    attackRight3: "assets/player/combat/PLAYER ATTACK RIGHT 3.webp",

    attackLeft1: "assets/player/combat/PLAYER ATTACK LEFT 1.webp",
    attackLeft2: "assets/player/combat/PLAYER ATTACK LEFT 2.webp",
    attackLeft3: "assets/player/combat/PLAYER ATTACK LEFT 3.webp",

    attackDown1: "assets/player/combat/PLAYER ATTACK DOWN 1.webp",
    attackDown2: "assets/player/combat/PLAYER ATTACK DOWN 2.webp",

    attackFinish: "assets/player/combat/PLAYER ATTACK FINISH.webp",
    attackFinishLeft: "assets/player/combat/PLAYER ATTACK FINISH LEFT.webp",
    blockRight: "assets/player/combat/PLAYER BLOCK.webp",
    blockLeft: "assets/player/combat/PLAYER BLOCK LEFT.webp",

    width: 420,
    height: 630,
    speed: 520,
    walkFrameDuration: 120
  });

  const ATTACK_RIGHT = Object.freeze([
    { sprite: PLAYER.attackRight1, duration: 400 },
    { sprite: PLAYER.combatBase, duration: 100 },

    { sprite: PLAYER.attackRight3, duration: 500 },
    { sprite: PLAYER.combatBase, duration: 100 },

    { sprite: PLAYER.attackFinish, duration: 400 },
    { sprite: PLAYER.combatBase, duration: 100 },

    { sprite: PLAYER.attackRight1, duration: 500 },
    { sprite: PLAYER.combatBase, duration: 400 }
  ]);

  const ATTACK_LEFT = Object.freeze([
    { sprite: PLAYER.attackLeft1, duration: 400 },
    { sprite: PLAYER.combatBaseLeft, duration: 100 },

    { sprite: PLAYER.attackLeft3, duration: 500 },
    { sprite: PLAYER.combatBaseLeft, duration: 100 },

    { sprite: PLAYER.attackFinishLeft, duration: 400 },
    { sprite: PLAYER.combatBaseLeft, duration: 100 },

    { sprite: PLAYER.attackLeft1, duration: 500 },
    { sprite: PLAYER.combatBaseLeft, duration: 400 }
  ]);

  const ATTACK_DOWN = Object.freeze([
    { sprite: PLAYER.combatBase, duration: 100 },

    { sprite: PLAYER.attackDown1, duration: 400 },
    { sprite: PLAYER.combatBase, duration: 100 },

    { sprite: PLAYER.attackDown2, duration: 500 },
    { sprite: PLAYER.combatBase, duration: 100 },

    { sprite: PLAYER.attackFinish, duration: 400 },
    { sprite: PLAYER.combatBase, duration: 100 },

    { sprite: PLAYER.attackDown1, duration: 500 },
    { sprite: PLAYER.combatBase, duration: 400 }
  ]);

  const ZOOM_MULTIPLIERS = [1, 1.75, 3, 4.5];
  const ZOOM_DURATION = 300;

  const attackAudio = new Audio("assets/audio/PLAYER ATTACK.mp3");
  attackAudio.preload = "auto";
  attackAudio.loop = false;
  attackAudio.volume = 1.0;


  // ------------------------------------------------------------------
  // DYNAMIC AREA / EXIT SIGNS
  // Positions follow the colored rectangles and arrow directions
  // from the supplied reference image.
  // ------------------------------------------------------------------
  const AREA_SIGNS = Object.freeze([
    {
      id: "winterbach",
      text: "WINTERBACH",
      x: 2595, y: 475,
      direction: "up",
      glow: "#ff3030",
      trigger: { x1: 1900, y1: 0, x2: 3300, y2: 1250 }
    },
    {
      id: "oedsbach",
      text: "ÖDSBACH",
      x: 6380, y: 420,
      direction: "up",
      glow: "#ffe83b",
      trigger: { x1: 5650, y1: 0, x2: 7100, y2: 1250 }
    },
    {
      id: "hesselbach",
      text: "HESSELBACH",
      x: 8305, y: 440,
      direction: "up",
      glow: "#22d887",
      trigger: { x1: 7550, y1: 0, x2: 9050, y2: 1250 }
    },
    {
      id: "schauenburg",
      text: "SCHAUENBURG",
      x: 945, y: 1750,
      direction: "left",
      glow: "#ff8fca",
      trigger: { x1: 0, y1: 1100, x2: 1750, y2: 2400 }
    },
    {
      id: "ringelbach",
      text: "RINGELBACH",
      x: 770, y: 2680,
      direction: "left",
      glow: "#050505",
      darkGlow: true,
      trigger: { x1: 0, y1: 2050, x2: 1650, y2: 3350 }
    },
    {
      id: "butschbach",
      text: "BUTSCHBACH",
      x: 9150, y: 2390,
      direction: "right",
      glow: "#c45cff",
      trigger: { x1: 8400, y1: 1700, x2: 10000, y2: 3100 }
    },
    {
      id: "bottenau",
      text: "BOTTENAU",
      x: 9180, y: 4140,
      direction: "right",
      glow: "#35c9ff",
      trigger: { x1: 8400, y1: 3450, x2: 10000, y2: 4800 }
    },
    {
      id: "tiergarten-haslach",
      text: "TIERGARTEN HASLACH",
      x: 945, y: 5980,
      direction: "left",
      glow: "#888888",
      trigger: { x1: 0, y1: 5250, x2: 1750, y2: 6667 }
    },
    {
      id: "stadelhofen",
      text: "STADELHOFEN",
      x: 2645, y: 6040,
      direction: "down",
      glow: "#ffffff",
      trigger: { x1: 1900, y1: 5350, x2: 3400, y2: 6667 }
    },
    {
      id: "zusenhofen",
      text: "ZUSENHOFEN",
      x: 7265, y: 6075,
      direction: "down",
      glow: "#b9ff38",
      trigger: { x1: 6500, y1: 5350, x2: 8050, y2: 6667 }
    },
    {
      id: "nussbach",
      text: "NUSSBACH",
      x: 9430, y: 6110,
      direction: "down",
      glow: "#ff7a28",
      trigger: { x1: 8650, y1: 5350, x2: 10000, y2: 6667 }
    }
  ]);

  let areaSignElements = [];

  function installAreaSignStyles() {
    if (document.getElementById("areaSignStyles")) return;

    const style = document.createElement("style");
    style.id = "areaSignStyles";
    style.textContent = `
      .area-sign {
        position: absolute;
        z-index: 8;
        width: 1050px;
        min-height: 360px;
        transform: translate(-50%, -50%);
        pointer-events: none;
        user-select: none;
        opacity: 0;
        visibility: hidden;
        transition:
          opacity 280ms ease,
          visibility 280ms ease;
      }

      .area-sign__inner {
        position: relative;
        width: 100%;
        height: 100%;
        transform: translate3d(var(--intro-x, 0), var(--intro-y, 0), 0) scale(.94);
        transition: transform 320ms cubic-bezier(.2,.8,.2,1);
        will-change: transform;
      }

      .area-sign--visible {
        opacity: 1;
        visibility: visible;
      }

      .area-sign--visible .area-sign__inner {
        transform: translate3d(0, 0, 0) scale(1);
      }

      .area-sign__label {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        white-space: nowrap;
        color: #080808;
        font-family: "Old English Text MT", "Lucida Blackletter", "UnifrakturCook", Georgia, serif;
        font-size: 168px;
        font-weight: 900;
        line-height: .95;
        letter-spacing: 5px;
        text-align: center;
        -webkit-text-stroke: 3px rgba(255,255,255,.23);
        text-shadow:
          0 0 3px var(--area-glow),
          0 0 7px var(--area-glow),
          0 0 13px var(--area-glow),
          0 0 22px var(--area-glow),
          0 0 34px var(--area-glow);
        filter: drop-shadow(0 4px 1px rgba(0,0,0,.72));
      }

      .area-sign--dark .area-sign__label {
        -webkit-text-stroke: 3px rgba(255,255,255,.68);
        text-shadow:
          0 0 2px #ffffff,
          0 0 5px rgba(255,255,255,.72),
          0 0 10px #000000,
          0 0 20px #000000,
          0 0 30px #000000;
      }

      .area-sign__arrow {
        position: absolute;
        width: 250px;
        height: 250px;
        display: grid;
        place-items: center;
        color: #ffffff;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 230px;
        font-weight: 900;
        line-height: 1;
        text-shadow:
          0 0 3px #ffffff,
          0 0 7px #ffffff,
          0 0 14px #ffffff,
          0 0 25px rgba(255,255,255,.95);
        filter: drop-shadow(0 4px 2px rgba(0,0,0,.85));
      }

      .area-sign--up    { --intro-y: 55px; --intro-x: 0px; }
      .area-sign--down  { --intro-y: -55px; --intro-x: 0px; }
      .area-sign--left  { --intro-y: 0px; --intro-x: 55px; }
      .area-sign--right { --intro-y: 0px; --intro-x: -55px; }

      .area-sign--up .area-sign__arrow {
        left: 50%;
        top: -185px;
        transform: translateX(-50%) rotate(0deg);
      }

      .area-sign--down .area-sign__arrow {
        left: 50%;
        bottom: -185px;
        transform: translateX(-50%) rotate(180deg);
      }

      .area-sign--left .area-sign__arrow {
        left: -205px;
        top: 50%;
        transform: translateY(-50%) rotate(-90deg);
      }

      .area-sign--right .area-sign__arrow {
        right: -205px;
        top: 50%;
        transform: translateY(-50%) rotate(90deg);
      }

      @media (prefers-reduced-motion: reduce) {
        .area-sign,
        .area-sign__inner {
          transition-duration: 1ms !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createAreaSigns() {
    installAreaSignStyles();

    areaSignElements = AREA_SIGNS.map((config) => {
      const root = document.createElement("div");
      root.className =
        `area-sign area-sign--${config.direction}` +
        (config.darkGlow ? " area-sign--dark" : "");
      root.dataset.areaId = config.id;
      root.style.left = `${config.x}px`;
      root.style.top = `${config.y}px`;
      root.style.setProperty("--area-glow", config.glow);

      const inner = document.createElement("div");
      inner.className = "area-sign__inner";

      const label = document.createElement("div");
      label.className = "area-sign__label";
      label.textContent = config.text;

      const arrow = document.createElement("div");
      arrow.className = "area-sign__arrow";
      arrow.textContent = "↑";

      inner.append(label, arrow);
      root.appendChild(inner);
      world.appendChild(root);

      return { config, element: root, visible: false };
    });
  }

  function updateAreaSigns() {
    for (const sign of areaSignElements) {
      const t = sign.config.trigger;

      const visible =
        playerX >= t.x1 &&
        playerX <= t.x2 &&
        playerY >= t.y1 &&
        playerY <= t.y2;

      if (visible === sign.visible) continue;

      sign.visible = visible;
      sign.element.classList.toggle("area-sign--visible", visible);
    }
  }

  const game = document.getElementById("game");
  const world = document.getElementById("world");
  const mapImage = document.getElementById("map");
  const playerEl = document.getElementById("player");
  const playerSprite = document.getElementById("playerSprite");
  const loading = document.getElementById("loading");
  const zoomLabel = document.getElementById("zoomLabel");
  const coordLabel = document.getElementById("coordLabel");
  const playerLabel = document.getElementById("playerLabel");

  if (!game || !world || !mapImage || !playerEl || !playerSprite) {
    throw new Error("Game DOM incomplete: map/player elements missing.");
  }

  const allSprites = [
    PLAYER.standRight,
    PLAYER.standLeft,
    PLAYER.walkRight,
    PLAYER.walkLeft,
    ...PLAYER.walkDown,
    PLAYER.walkUp,
    PLAYER.combatBase,
    PLAYER.combatBaseLeft,
    PLAYER.attackRight1,
    PLAYER.attackRight2,
    PLAYER.attackRight3,
    PLAYER.attackLeft1,
    PLAYER.attackLeft2,
    PLAYER.attackLeft3,
    PLAYER.attackDown1,
    PLAYER.attackDown2,
    PLAYER.attackFinish,
    PLAYER.attackFinishLeft,
    PLAYER.blockRight,
    PLAYER.blockLeft
  ];

  const preloaded = {};
  allSprites.forEach((src) => {
    const img = new Image();
    img.src = src;
    preloaded[src] = img;
  });

  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight;
  let fitScale = 1;
  let zoomLevel = 0;

  let playerX = MAP.width / 2;
  let playerY = MAP.height / 2;
  let cameraX = playerX;
  let cameraY = playerY;

  let displayScale = 1;
  let targetScale = 1;
  let zoomStartScale = 1;
  let zoomStartTime = 0;
  let zoomAnimating = false;

  let facing = "right";
  let lastHorizontalFacing = "right";
  let activeSprite = "";
  let moving = false;

  let walkFrame = 0;
  let walkFrameTimer = 0;
  let currentAnimation = "idle";

  let attackHeld = false;
  let attacking = false;
  let attackSequence = null;
  let attackStep = 0;
  let attackTimer = 0;
  let blocking = false;
  let blockFacing = "right";

  const keys = new Set();
  let lastFrame = performance.now();

  function calculateFitScale() {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    fitScale = Math.min(
      viewportWidth / MAP.width,
      viewportHeight / MAP.height
    );
  }

  function scaleForLevel(level) {
    return fitScale * ZOOM_MULTIPLIERS[level];
  }

  function clampPlayer() {
    const halfW = PLAYER.width / 2;
    const topClearance = PLAYER.height;
    const bottomClearance = 10;

    playerX = Math.max(halfW, Math.min(MAP.width - halfW, playerX));
    playerY = Math.max(topClearance, Math.min(MAP.height - bottomClearance, playerY));
  }

  function clampCamera(scale = displayScale) {
    if (zoomLevel === 0 && !zoomAnimating) {
      cameraX = MAP.width / 2;
      cameraY = MAP.height / 2;
      return;
    }

    const visibleMapWidth = viewportWidth / scale;
    const visibleMapHeight = viewportHeight / scale;

    cameraX = playerX;
    cameraY = playerY;

    if (visibleMapWidth >= MAP.width) {
      cameraX = MAP.width / 2;
    } else {
      const halfW = visibleMapWidth / 2;
      cameraX = Math.max(halfW, Math.min(MAP.width - halfW, cameraX));
    }

    if (visibleMapHeight >= MAP.height) {
      cameraY = MAP.height / 2;
    } else {
      const halfH = visibleMapHeight / 2;
      cameraY = Math.max(halfH, Math.min(MAP.height - halfH, cameraY));
    }
  }

  function setSprite(src) {
    if (activeSprite === src) return;
    activeSprite = src;
    playerSprite.src = encodeURI(src);
  }

  function setIdleSprite() {
    if (facing === "down") {
      setSprite(PLAYER.combatBase);
    } else if (facing === "left") {
      setSprite(PLAYER.standLeft);
    } else {
      setSprite(PLAYER.standRight);
    }
  }

  function setAnimation(name) {
    if (currentAnimation === name) return;
    currentAnimation = name;
    walkFrame = 0;
    walkFrameTimer = 0;
  }

  function getMovementAnimation(dx, dy) {
    // S / down has priority, including S+A and S+D.
    if (dy > 0) {
      facing = "down";
      return "down";
    }

    // W+A / W+D continue to use side-facing artwork.
    if (dx > 0) {
      facing = "right";
      lastHorizontalFacing = "right";
      return "right";
    }

    if (dx < 0) {
      facing = "left";
      lastHorizontalFacing = "left";
      return "left";
    }

    if (dy < 0) {
      facing = "up";
      return "up";
    }

    return "idle";
  }

  function renderMovementFrame(animationName, deltaSeconds) {
    if (animationName === "down") {
      walkFrameTimer += deltaSeconds * 1000;

      while (walkFrameTimer >= PLAYER.walkFrameDuration) {
        walkFrameTimer -= PLAYER.walkFrameDuration;
        walkFrame = (walkFrame + 1) % 2;
      }

      setSprite(PLAYER.walkDown[walkFrame]);
      return;
    }

    if (animationName === "right") {
      setSprite(PLAYER.walkRight);
    } else if (animationName === "left") {
      setSprite(PLAYER.walkLeft);
    } else if (animationName === "up") {
      setSprite(PLAYER.walkUp);
    } else {
      setIdleSprite();
    }
  }

  function chooseAttackSequence() {
    if (facing === "down") return ATTACK_DOWN;
    if (facing === "left") return ATTACK_LEFT;
    if (facing === "right") return ATTACK_RIGHT;

    // No dedicated UP attack exists. Use the last horizontal orientation.
    return lastHorizontalFacing === "left" ? ATTACK_LEFT : ATTACK_RIGHT;
  }


  function startAttackSound() {
    // Hard restart from the beginning of the trimmed attack sound.
    // This is called at the first attack frame of EVERY combo cycle.
    attackAudio.pause();
    try {
      attackAudio.currentTime = 0;
    } catch (_) {
      // Ignore if metadata is not ready yet.
    }
    attackAudio.play().catch(() => {});
  }

  function stopAttackSound() {
    attackAudio.pause();
    try {
      attackAudio.currentTime = 0;
    } catch (_) {
      // Ignore if browser has not loaded enough metadata yet.
    }
  }

  function cancelAttackImmediately() {
    attackHeld = false;
    attacking = false;
    attackSequence = null;
    attackStep = 0;
    attackTimer = 0;

    stopAttackSound();
    setIdleSprite();
  }

  function startAttackCombo() {
    if (attacking) return;

    attacking = true;
    moving = false;
    playerEl.classList.remove("player--moving");
    playerEl.classList.add("player--idle");

    attackSequence = chooseAttackSequence();
    attackStep = 0;
    attackTimer = 0;

    setSprite(attackSequence[0].sprite);
  }

  function finishAttackState() {
    attacking = false;
    attackSequence = null;
    attackStep = 0;
    attackTimer = 0;
    setIdleSprite();
  }

  function updateAttack(deltaSeconds) {
    if (!attacking || !attackSequence) return;

    attackTimer += deltaSeconds * 1000;

    while (attacking && attackTimer >= attackSequence[attackStep].duration) {
      attackTimer -= attackSequence[attackStep].duration;
      attackStep += 1;

      if (attackStep >= attackSequence.length) {
        // Full combo completed.
        if (attackHeld) {
          // Same orientation starts again immediately.
          // IMPORTANT: restart the sound exactly with the first frame
          // of every new combo cycle so sound and animation stay synchronized.
          attackSequence = chooseAttackSequence();
          attackStep = 0;
          attackTimer = 0;
          startAttackSound();
          setSprite(attackSequence[0].sprite);
        } else {
          finishAttackState();
        }
        return;
      }

      setSprite(attackSequence[attackStep].sprite);
    }
  }


  function getBlockSprite() {
    return blockFacing === "left" ? PLAYER.blockLeft : PLAYER.blockRight;
  }

  function forceSprite(src) {
    activeSprite = "";
    setSprite(src);
  }

  function startBlocking() {
    if (blocking) return;

    // Remember the orientation that existed BEFORE CTRL was pressed.
    blockFacing = facing === "left" ? "left" : facing === "down" ? "down" : "right";
    blocking = true;

    // Block is NOT part of any combo. Cancel a running combo completely.
    attackHeld = false;
    attacking = false;
    attackSequence = null;
    attackStep = 0;
    attackTimer = 0;
    stopAttackSound();

    moving = false;
    currentAnimation = "idle";
    walkFrame = 0;
    walkFrameTimer = 0;

    keys.clear();

    playerEl.classList.remove("player--moving");
    playerEl.classList.add("player--idle");

    forceSprite(getBlockSprite());
  }

  function stopBlocking() {
    if (!blocking) return;

    blocking = false;

    // Restore the actual resting pose immediately and FORCE the image swap.
    if (blockFacing === "down") {
      facing = "down";
      forceSprite(PLAYER.combatBase);
    } else if (blockFacing === "left") {
      facing = "left";
      lastHorizontalFacing = "left";
      forceSprite(PLAYER.standLeft);
    } else {
      facing = "right";
      lastHorizontalFacing = "right";
      forceSprite(PLAYER.standRight);
    }
  }

  function updatePlayer(deltaSeconds) {
    if (blocking) {
      setSprite(getBlockSprite());
      return;
    }

    if (attacking) {
      updateAttack(deltaSeconds);
      return;
    }

    let dx = 0;
    let dy = 0;

    if (keys.has("KeyW") || keys.has("ArrowUp")) dy -= 1;
    if (keys.has("KeyS") || keys.has("ArrowDown")) dy += 1;
    if (keys.has("KeyA") || keys.has("ArrowLeft")) dx -= 1;
    if (keys.has("KeyD") || keys.has("ArrowRight")) dx += 1;

    const isMoving = dx !== 0 || dy !== 0;

    if (!isMoving) {
      if (moving) {
        moving = false;
        playerEl.classList.remove("player--moving");
        playerEl.classList.add("player--idle");
      }
      setAnimation("idle");
      setIdleSprite();
      return;
    }

    if (!moving) {
      moving = true;
      playerEl.classList.add("player--moving");
      playerEl.classList.remove("player--idle");
    }

    const nextAnimation = getMovementAnimation(dx, dy);
    setAnimation(nextAnimation);
    renderMovementFrame(currentAnimation, deltaSeconds);

    const length = Math.hypot(dx, dy) || 1;
    dx /= length;
    dy /= length;

    playerX += dx * PLAYER.speed * deltaSeconds;
    playerY += dy * PLAYER.speed * deltaSeconds;
    clampPlayer();
  }

  function renderPlayer() {
    playerEl.style.left = `${playerX}px`;
    playerEl.style.top = `${playerY}px`;
  }

  function renderWorld() {
    clampCamera(displayScale);

    const mapScreenWidth = MAP.width * displayScale;
    const mapScreenHeight = MAP.height * displayScale;

    let tx = viewportWidth / 2 - cameraX * displayScale;
    let ty = viewportHeight / 2 - cameraY * displayScale;

    if (zoomLevel === 0 && !zoomAnimating) {
      tx = (viewportWidth - mapScreenWidth) / 2;
      ty = (viewportHeight - mapScreenHeight) / 2;
    }

    world.style.transform =
      `translate3d(${tx}px, ${ty}px, 0) scale(${displayScale})`;

    zoomLabel.textContent = `ZOOM ${zoomLevel}`;
    coordLabel.textContent =
      `KAMERA X: ${Math.round(cameraX)} · Y: ${Math.round(cameraY)}`;
    playerLabel.textContent =
      `SPIELER X: ${Math.round(playerX)} · Y: ${Math.round(playerY)}`;
  }

  function setZoomLevel(nextLevel) {
    nextLevel = Math.max(0, Math.min(ZOOM_MULTIPLIERS.length - 1, nextLevel));
    if (nextLevel === zoomLevel) return;

    zoomLevel = nextLevel;
    zoomStartScale = displayScale;
    targetScale = scaleForLevel(zoomLevel);
    zoomStartTime = performance.now();
    zoomAnimating = true;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function updateZoom(now) {
    if (!zoomAnimating) return;

    const t = Math.min(1, (now - zoomStartTime) / ZOOM_DURATION);
    const eased = easeOutCubic(t);
    displayScale = zoomStartScale + (targetScale - zoomStartScale) * eased;

    if (t >= 1) {
      displayScale = targetScale;
      zoomAnimating = false;
    }
  }

  function frame(now) {
    const deltaSeconds = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;

    updateZoom(now);
    updatePlayer(deltaSeconds);
    updateAreaSigns();
    renderPlayer();
    renderWorld();

    requestAnimationFrame(frame);
  }

  function isControlEvent(event) {
    return event.code === "ControlLeft" ||
           event.code === "ControlRight" ||
           event.key === "Control";
  }

  window.addEventListener("keydown", (event) => {
    const controlled = [
      "KeyW", "KeyA", "KeyS", "KeyD",
      "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
      "Equal", "NumpadAdd", "Minus", "NumpadSubtract",
      "Space", "ControlLeft", "ControlRight"
    ];

    if (controlled.includes(event.code) || event.key === "Control") {
      event.preventDefault();
    }

    if (isControlEvent(event)) {
      startBlocking();
      return;
    }

    // Failsafe: if the browser missed CTRL-keyup but Ctrl is no longer held,
    // the next keyboard event immediately releases the block.
    if (blocking && !event.ctrlKey) {
      stopBlocking();
    }

    if (blocking) return;

    if (event.code === "Space") {
      attackHeld = true;

      if (!attacking) {
        startAttackSound();
        startAttackCombo();
      }

      return;
    }

    if (event.code === "Equal" || event.code === "NumpadAdd") {
      setZoomLevel(zoomLevel + 1);
      return;
    }

    if (event.code === "Minus" || event.code === "NumpadSubtract") {
      setZoomLevel(zoomLevel - 1);
      return;
    }

    keys.add(event.code);
  }, { passive: false });

  window.addEventListener("keyup", (event) => {
    if (isControlEvent(event)) {
      event.preventDefault();
      stopBlocking();
      return;
    }

    if (event.code === "Space") {
      event.preventDefault();
      cancelAttackImmediately();
      return;
    }

    keys.delete(event.code);
  }, { passive: false });

  // Extra safety for lost modifier-key events (Alt-Tab, browser focus changes, etc.).
  window.addEventListener("blur", () => {
    if (blocking) stopBlocking();
    cancelAttackImmediately();
    keys.clear();
  });

  game.addEventListener("wheel", (event) => {
    event.preventDefault();

    if (event.deltaY < 0) {
      setZoomLevel(zoomLevel + 1);
    } else if (event.deltaY > 0) {
      setZoomLevel(zoomLevel - 1);
    }
  }, { passive: false });

  window.addEventListener("resize", () => {
    const oldFitScale = fitScale;
    calculateFitScale();

    if (!oldFitScale) {
      displayScale = scaleForLevel(zoomLevel);
    } else {
      displayScale *= fitScale / oldFitScale;
    }

    targetScale = scaleForLevel(zoomLevel);

    if (!zoomAnimating) {
      displayScale = targetScale;
    }

    renderWorld();
  });

  function initialize() {
    calculateFitScale();
    displayScale = scaleForLevel(0);
    targetScale = displayScale;

    facing = "right";
    lastHorizontalFacing = "right";
    activeSprite = "";
    currentAnimation = "idle";
    setIdleSprite();

    createAreaSigns();

    clampPlayer();
    updateAreaSigns();
    renderPlayer();
    renderWorld();
    requestAnimationFrame(frame);
  }

  mapImage.addEventListener("load", () => {
    loading.classList.add("hidden");
    window.setTimeout(() => loading.remove(), 300);
  });

  mapImage.addEventListener("error", () => {
    loading.textContent = "Karte konnte nicht geladen werden.";
  });

  playerSprite.addEventListener("error", () => {
    console.error("PLAYER SPRITE konnte nicht geladen werden:", playerSprite.src);
  });

  initialize();

  if (mapImage.complete && mapImage.naturalWidth > 0) {
    loading.classList.add("hidden");
    window.setTimeout(() => loading.remove(), 300);
  }
})();