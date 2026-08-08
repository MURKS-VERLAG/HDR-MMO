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
    { sprite: PLAYER.attackRight1, duration: 400, hit: true, damage: 20, strike: 1 },
    { sprite: PLAYER.combatBase, duration: 100 },

    { sprite: PLAYER.attackRight3, duration: 500, hit: true, damage: 20, strike: 2 },
    { sprite: PLAYER.combatBase, duration: 100 },

    { sprite: PLAYER.attackFinish, duration: 400, hit: true, damage: 20, strike: 4 },
    { sprite: PLAYER.combatBase, duration: 100 },

    { sprite: PLAYER.attackRight1, duration: 500, hit: true, damage: 40, strike: 3, critical: true },
    { sprite: PLAYER.combatBase, duration: 400 }
  ]);

  const ATTACK_LEFT = Object.freeze([
    { sprite: PLAYER.attackLeft1, duration: 400, hit: true, damage: 20, strike: 1 },
    { sprite: PLAYER.combatBaseLeft, duration: 100 },

    { sprite: PLAYER.attackLeft3, duration: 500, hit: true, damage: 20, strike: 2 },
    { sprite: PLAYER.combatBaseLeft, duration: 100 },

    { sprite: PLAYER.attackFinishLeft, duration: 400, hit: true, damage: 20, strike: 4 },
    { sprite: PLAYER.combatBaseLeft, duration: 100 },

    { sprite: PLAYER.attackLeft1, duration: 500, hit: true, damage: 40, strike: 3, critical: true },
    { sprite: PLAYER.combatBaseLeft, duration: 400 }
  ]);

  const ATTACK_DOWN = Object.freeze([
    { sprite: PLAYER.combatBase, duration: 100 },

    { sprite: PLAYER.attackDown1, duration: 400, hit: true, damage: 20, strike: 1 },
    { sprite: PLAYER.combatBase, duration: 100 },

    { sprite: PLAYER.attackDown2, duration: 500, hit: true, damage: 20, strike: 2 },
    { sprite: PLAYER.combatBase, duration: 100 },

    { sprite: PLAYER.attackFinish, duration: 400, hit: true, damage: 20, strike: 4 },
    { sprite: PLAYER.combatBase, duration: 100 },

    { sprite: PLAYER.attackDown1, duration: 500, hit: true, damage: 40, strike: 3, critical: true },
    { sprite: PLAYER.combatBase, duration: 400 }
  ]);

  const ZOOM_MULTIPLIERS = [1, 1.75, 3, 4.5];
  const ZOOM_DURATION = 300;

  const attackAudio = new Audio("assets/audio/PLAYER ATTACK.mp3");
  attackAudio.preload = "auto";
  attackAudio.loop = false;
  attackAudio.volume = 1.0;

  const backgroundMusic = new Audio("assets/audio/THE WEEPING STONE.mp3");
  backgroundMusic.preload = "auto";
  backgroundMusic.loop = true;
  backgroundMusic.volume = 1.0;

  let backgroundMusicStarted = false;

  function startBackgroundMusic() {
    if (backgroundMusicStarted && !backgroundMusic.paused) return;

    backgroundMusic.play()
      .then(() => {
        backgroundMusicStarted = true;
      })
      .catch(() => {
        // Browser autoplay may be blocked until the first user interaction.
      });
  }

  function unlockBackgroundMusic() {
    startBackgroundMusic();

    if (backgroundMusicStarted) {
      window.removeEventListener("pointerdown", unlockBackgroundMusic);
      window.removeEventListener("keydown", unlockBackgroundMusic);
      window.removeEventListener("touchstart", unlockBackgroundMusic);
    }
  }

  window.addEventListener("pointerdown", unlockBackgroundMusic, { passive: true });
  window.addEventListener("keydown", unlockBackgroundMusic);
  window.addEventListener("touchstart", unlockBackgroundMusic, { passive: true });


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
      glow: "#ffffff",
      trigger: { x1: 1900, y1: 0, x2: 3300, y2: 1250 }
    },
    {
      id: "oedsbach",
      text: "ÖDSBACH",
      x: 6380, y: 420,
      direction: "up",
      glow: "#ffffff",
      trigger: { x1: 5650, y1: 0, x2: 7100, y2: 1250 }
    },
    {
      id: "hesselbach",
      text: "HESSELBACH",
      x: 8305, y: 440,
      direction: "up",
      glow: "#ffffff",
      trigger: { x1: 7550, y1: 0, x2: 9050, y2: 1250 }
    },
    {
      id: "schauenburg",
      text: "SCHAUENBURG",
      x: 945, y: 1750,
      direction: "left",
      glow: "#ffffff",
      trigger: { x1: 0, y1: 1100, x2: 1750, y2: 2400 }
    },
    {
      id: "ringelbach",
      text: "RINGELBACH",
      x: 770, y: 2680,
      direction: "left",
      glow: "#ffffff",
      darkGlow: true,
      trigger: { x1: 0, y1: 2050, x2: 1650, y2: 3350 }
    },
    {
      id: "butschbach",
      text: "BUTSCHBACH",
      x: 9150, y: 2390,
      direction: "right",
      glow: "#ffffff",
      trigger: { x1: 8400, y1: 1700, x2: 10000, y2: 3100 }
    },
    {
      id: "bottenau",
      text: "BOTTENAU",
      x: 9180, y: 4140,
      direction: "right",
      glow: "#ffffff",
      trigger: { x1: 8400, y1: 3450, x2: 10000, y2: 4800 }
    },
    {
      id: "tiergarten-haslach",
      text: "TIERGARTEN HASLACH",
      x: 945, y: 5980,
      direction: "left",
      glow: "#ffffff",
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
      glow: "#ffffff",
      trigger: { x1: 6500, y1: 5350, x2: 8050, y2: 6667 }
    },
    {
      id: "nussbach",
      text: "NUSSBACH",
      x: 9430, y: 6110,
      direction: "down",
      glow: "#ffffff",
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
        z-index: 1;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        white-space: nowrap;
        color: #000000;
        font-family: "Old English Text MT", "Lucida Blackletter", "UnifrakturCook", Georgia, serif;
        font-size: 168px;
        font-weight: 900;
        line-height: .95;
        letter-spacing: 5px;
        text-align: center;
        -webkit-text-stroke: 0;
        text-shadow:
          0 0 3px #ffffff,
          0 0 7px #ffffff,
          0 0 13px #ffffff,
          0 0 22px #ffffff,
          0 0 34px #ffffff;
        filter: drop-shadow(0 4px 1px rgba(0,0,0,.72));
      }

      .area-sign--dark .area-sign__label {
        color: #000000;
        -webkit-text-stroke: 0;
        text-shadow:
          0 0 3px #ffffff,
          0 0 7px #ffffff,
          0 0 13px #ffffff,
          0 0 22px #ffffff,
          0 0 34px #ffffff;
      }


      .area-sign--up    { --intro-y: 55px; --intro-x: 0px; }
      .area-sign--down  { --intro-y: -55px; --intro-x: 0px; }
      .area-sign--left  { --intro-y: 0px; --intro-x: 55px; }
      .area-sign--right { --intro-y: 0px; --intro-x: -55px; }





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

      inner.append(label);
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


  // ------------------------------------------------------------------
  // AMBIENT RABBITS
  // Four habitat polygons follow the WHITE outlined regions in the
  // supplied map reference. Each zone contains 1-2 freely hopping rabbits.
  // ------------------------------------------------------------------
  const RABBIT_FRAMES = Object.freeze([
    "assets/animals/rabbits/RABBIT 1.webp",
    "assets/animals/rabbits/RABBIT 2.webp",
    "assets/animals/rabbits/RABBIT 3.webp",
    "assets/animals/rabbits/RABBIT 4.webp"
  ]);

  const RABBIT_DEAD_FRAME = "assets/animals/rabbits/RABBIT DEAD.webp";

  const RABBIT_HIT_SOUNDS = Object.freeze([
    "assets/audio/rabbits/RABBIT HIT 1.mp3",
    "assets/audio/rabbits/RABBIT HIT 2.mp3",
    "assets/audio/rabbits/RABBIT HIT 3.mp3"
  ]);

  const rabbitHitAudios = RABBIT_HIT_SOUNDS.map((src) => {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = 1.0;
    return audio;
  });

  const RABBIT_MAX_HP = 100;

  // Hitbox is directional in MAP coordinates:
  // RIGHT attack only hits right, LEFT only left, DOWN only below.
  // When facing UP, the game already uses the last A/D attack sequence,
  // therefore the hitbox also follows that left/right sequence.
  const RABBIT_ATTACK_HITBOX = Object.freeze({
    sideForward: 820,
    sideBack: 40,
    sideHalfHeight: 390,
    downForward: 850,
    downBack: 40,
    downHalfWidth: 460
  });


  const RABBIT_ZONES = Object.freeze([
    {
      id: "rabbit-northwest",
      polygon: [
        [0, 0],
        [1775, 0],
        [856, 1011],
        [0, 624]
      ],
      exits: ["top", "left"],
      count: 2
    },
    {
      id: "rabbit-west",
      polygon: [
        [0, 2797],
        [1031, 3140],
        [0, 4588]
      ],
      exits: ["left"],
      count: 1
    },
    {
      id: "rabbit-northeast",
      polygon: [
        [9313, 0],
        [10000, 0],
        [10000, 1785],
        [9731, 1854],
        [8488, 693]
      ],
      exits: ["top", "right"],
      count: 2
    },
    {
      id: "rabbit-southeast",
      polygon: [
        [8913, 4257],
        [10000, 4257],
        [10000, 6249],
        [8700, 5019]
      ],
      exits: ["right"],
      count: 2
    }
  ]);

  let rabbitActors = [];

  function installRabbitStyles() {
    if (document.getElementById("rabbitStyles")) return;

    const style = document.createElement("style");
    style.id = "rabbitStyles";
    style.textContent = `
      .map-rabbit {
        position: absolute;
        z-index: 4;
        width: 330px;
        height: 260px;
        pointer-events: none;
        user-select: none;
        transform: translate(-50%, -82%);
        will-change: left, top, transform, opacity;
        opacity: 1;
        transition: opacity 420ms ease;
      }

      .map-rabbit--away {
        opacity: 0;
      }

      .map-rabbit__sprite {
        position: absolute;
        left: 50%;
        bottom: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: 50% 100%;
        transform: translateX(-50%) scaleX(var(--rabbit-facing, 1));
        transform-origin: 50% 100%;
        opacity: 0;
        transition: opacity 260ms ease;
        filter: drop-shadow(0 8px 5px rgba(0,0,0,.18));
      }

      .map-rabbit__sprite--visible {
        opacity: 1;
      }

      .map-rabbit__bob {
        position: absolute;
        inset: 0;
        animation: rabbitHopBob 620ms ease-in-out infinite;
        animation-play-state: paused;
      }

      .map-rabbit--moving .map-rabbit__bob {
        animation-play-state: running;
      }

      @keyframes rabbitHopBob {
        0%, 100% { transform: translateY(0); }
        45%      { transform: translateY(-22px); }
        70%      { transform: translateY(-6px); }
      }


      .rabbit-damage {
        position: absolute;
        z-index: 18;
        transform: translate(-50%, -50%);
        pointer-events: none;
        user-select: none;
        color: #ff2020;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 190px;
        font-weight: 900;
        line-height: .9;
        white-space: nowrap;
        text-shadow:
          0 0 4px #ff0000,
          0 0 10px #ff0000,
          0 0 22px rgba(255,0,0,.95),
          0 5px 3px rgba(0,0,0,.8);
        animation: rabbitDamageFloat 760ms ease-out forwards;
      }

      .rabbit-damage--crit {
        font-size: 205px;
      }

      .rabbit-damage__crit {
        display: block;
        margin-bottom: 12px;
        color: #ff3030;
        font-size: 120px;
        letter-spacing: 8px;
        text-align: center;
      }

      @keyframes rabbitDamageFloat {
        0%   { opacity: 0; transform: translate(-50%, -25%) scale(.72); }
        16%  { opacity: 1; transform: translate(-50%, -75%) scale(1.10); }
        72%  { opacity: 1; transform: translate(-50%, -130%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -175%) scale(.92); }
      }

      .rabbit-dust {
        position: absolute;
        z-index: 3;
        width: 330px;
        height: 105px;
        transform: translate(-50%, -50%);
        pointer-events: none;
        opacity: 0;
        animation: rabbitDustBurst 620ms ease-out forwards;
      }

      .rabbit-dust::before,
      .rabbit-dust::after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 0;
        width: 125px;
        height: 58px;
        border-radius: 50%;
        background:
          radial-gradient(ellipse at center,
            rgba(204,184,148,.78) 0%,
            rgba(168,145,111,.54) 40%,
            rgba(133,109,78,0) 76%);
        filter: blur(4px);
      }

      .rabbit-dust::before {
        transform: translateX(-105px) scale(1.35);
      }

      .rabbit-dust::after {
        transform: translateX(-15px) scale(1.65);
      }

      @keyframes rabbitDustBurst {
        0%   { opacity: 0; transform: translate(-50%, -15%) scale(.5); }
        18%  { opacity: 1; transform: translate(-50%, -35%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -80%) scale(1.8); }
      }

      .map-rabbit--critical-hit {
        transition:
          left 210ms ease-out,
          top 210ms cubic-bezier(.1,.75,.25,1),
          opacity 420ms ease !important;
      }

      .map-rabbit--dead .map-rabbit__bob {
        animation: none !important;
      }

      @media (prefers-reduced-motion: reduce) {
        .map-rabbit,
        .map-rabbit__sprite {
          transition-duration: 1ms !important;
        }

        .map-rabbit__bob {
          animation: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function rabbitPointInPolygon(x, y, polygon) {
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0];
      const yi = polygon[i][1];
      const xj = polygon[j][0];
      const yj = polygon[j][1];

      const intersect =
        ((yi > y) !== (yj > y)) &&
        (x < ((xj - xi) * (y - yi)) / ((yj - yi) || 0.000001) + xi);

      if (intersect) inside = !inside;
    }

    return inside;
  }

  function rabbitRandomPoint(zone, inset = 85) {
    const xs = zone.polygon.map((p) => p[0]);
    const ys = zone.polygon.map((p) => p[1]);

    const minX = Math.min(...xs) + inset;
    const maxX = Math.max(...xs) - inset;
    const minY = Math.min(...ys) + inset;
    const maxY = Math.max(...ys) - inset;

    for (let attempt = 0; attempt < 120; attempt += 1) {
      const x = minX + Math.random() * Math.max(1, maxX - minX);
      const y = minY + Math.random() * Math.max(1, maxY - minY);

      if (rabbitPointInPolygon(x, y, zone.polygon)) {
        return { x, y };
      }
    }

    const p = zone.polygon[Math.floor(Math.random() * zone.polygon.length)];
    return { x: p[0], y: p[1] };
  }

  function rabbitExitPoint(zone, side) {
    const interior = rabbitRandomPoint(zone, 40);
    const margin = 260;

    if (side === "left") {
      return { x: -margin, y: interior.y };
    }

    if (side === "right") {
      return { x: MAP.width + margin, y: interior.y };
    }

    if (side === "top") {
      return { x: interior.x, y: -margin };
    }

    return { x: interior.x, y: MAP.height + margin };
  }

  function rabbitEntryPoint(zone, side) {
    return rabbitExitPoint(zone, side);
  }

  function rabbitPickFrame(actor, forceDifferent = true) {
    let next = Math.floor(Math.random() * RABBIT_FRAMES.length);

    if (forceDifferent && RABBIT_FRAMES.length > 1) {
      while (next === actor.frameIndex) {
        next = Math.floor(Math.random() * RABBIT_FRAMES.length);
      }
    }

    actor.frameIndex = next;
    const incoming = 1 - actor.visibleLayer;

    actor.images[incoming].src = encodeURI(RABBIT_FRAMES[next]);
    actor.images[incoming].classList.add("map-rabbit__sprite--visible");
    actor.images[actor.visibleLayer].classList.remove("map-rabbit__sprite--visible");
    actor.visibleLayer = incoming;

    actor.nextFrameChange =
      performance.now() + 520 + Math.random() * 1100;
  }

  function rabbitChooseInteriorTarget(actor, now) {
    const target = rabbitRandomPoint(actor.zone, 120);

    actor.targetX = target.x;
    actor.targetY = target.y;
    actor.speed = 150 + Math.random() * 150;
    actor.moving = true;
    actor.element.classList.add("map-rabbit--moving");
    actor.pauseUntil = 0;

    const dx = actor.targetX - actor.x;
    if (Math.abs(dx) > 25) {
      actor.facing = dx < 0 ? -1 : 1;
      actor.element.style.setProperty("--rabbit-facing", actor.facing);
    }

    actor.nextDecision =
      now + 1500 + Math.random() * 3500;
  }

  function rabbitStartExit(actor, now) {
    if (!actor.zone.exits.length) {
      rabbitChooseInteriorTarget(actor, now);
      return;
    }

    actor.exitSide =
      actor.zone.exits[Math.floor(Math.random() * actor.zone.exits.length)];

    const target = rabbitExitPoint(actor.zone, actor.exitSide);
    actor.targetX = target.x;
    actor.targetY = target.y;
    actor.speed = 190 + Math.random() * 130;
    actor.moving = true;
    actor.exiting = true;
    actor.element.classList.add("map-rabbit--moving");

    const dx = actor.targetX - actor.x;
    if (Math.abs(dx) > 25) {
      actor.facing = dx < 0 ? -1 : 1;
      actor.element.style.setProperty("--rabbit-facing", actor.facing);
    }
  }

  function rabbitGoAway(actor, now) {
    actor.away = true;
    actor.exiting = false;
    actor.moving = false;
    actor.element.classList.remove("map-rabbit--moving");
    actor.element.classList.add("map-rabbit--away");
    actor.returnAt = now + 3500 + Math.random() * 8500;
  }

  function rabbitReturn(actor, now) {
    const side =
      actor.zone.exits[Math.floor(Math.random() * actor.zone.exits.length)];

    const start = rabbitEntryPoint(actor.zone, side);
    const target = rabbitRandomPoint(actor.zone, 180);

    actor.x = start.x;
    actor.y = start.y;
    actor.targetX = target.x;
    actor.targetY = target.y;
    actor.speed = 190 + Math.random() * 120;
    actor.away = false;
    actor.entering = true;
    actor.moving = true;
    actor.element.style.left = `${actor.x}px`;
    actor.element.style.top = `${actor.y}px`;

    const dx = actor.targetX - actor.x;
    actor.facing = dx < 0 ? -1 : 1;
    actor.element.style.setProperty("--rabbit-facing", actor.facing);

    rabbitPickFrame(actor, false);
    actor.element.classList.remove("map-rabbit--away");
    actor.element.classList.add("map-rabbit--moving");
    actor.nextDecision = now + 2000 + Math.random() * 3000;
  }


  function playRabbitHitSound() {
    const source =
      rabbitHitAudios[Math.floor(Math.random() * rabbitHitAudios.length)];

    // Clone so rapid consecutive hits can overlap instead of cutting each other off.
    const audio = source.cloneNode();
    audio.volume = 1.0;
    audio.play().catch(() => {});
  }

  function rabbitAttackDirection() {
    if (attackSequence === ATTACK_DOWN) return "down";
    if (attackSequence === ATTACK_LEFT) return "left";
    return "right";
  }

  function rabbitInsideAttackHitbox(actor, direction) {
    if (actor.dead || actor.away) return false;

    const dx = actor.x - playerX;
    const dy = actor.y - playerY;

    if (direction === "right") {
      return (
        dx >= -RABBIT_ATTACK_HITBOX.sideBack &&
        dx <= RABBIT_ATTACK_HITBOX.sideForward &&
        Math.abs(dy) <= RABBIT_ATTACK_HITBOX.sideHalfHeight
      );
    }

    if (direction === "left") {
      return (
        dx <= RABBIT_ATTACK_HITBOX.sideBack &&
        dx >= -RABBIT_ATTACK_HITBOX.sideForward &&
        Math.abs(dy) <= RABBIT_ATTACK_HITBOX.sideHalfHeight
      );
    }

    return (
      dy >= -RABBIT_ATTACK_HITBOX.downBack &&
      dy <= RABBIT_ATTACK_HITBOX.downForward &&
      Math.abs(dx) <= RABBIT_ATTACK_HITBOX.downHalfWidth
    );
  }

  function createRabbitDamageText(actor, amount, critical) {
    const popup = document.createElement("div");
    popup.className =
      "rabbit-damage" + (critical ? " rabbit-damage--crit" : "");
    popup.style.left = `${actor.x}px`;
    popup.style.top = `${actor.y - 215}px`;

    if (critical) {
      const crit = document.createElement("span");
      crit.className = "rabbit-damage__crit";
      crit.textContent = "KRIT";

      const value = document.createElement("span");
      value.textContent = `-${amount}`;

      popup.append(crit, value);
    } else {
      popup.textContent = `-${amount}`;
    }

    world.appendChild(popup);
    window.setTimeout(() => popup.remove(), 820);
  }

  function createRabbitDust(actor) {
    const dust = document.createElement("div");
    dust.className = "rabbit-dust";
    dust.style.left = `${actor.x}px`;
    dust.style.top = `${actor.y + 20}px`;
    world.appendChild(dust);
    window.setTimeout(() => dust.remove(), 680);
  }

  function rabbitCriticalKnockback(actor, direction) {
    actor.element.classList.add("map-rabbit--critical-hit");

    let knockX = 0;
    let knockY = -45;

    if (direction === "right") {
      knockX = 190;
    } else if (direction === "left") {
      knockX = -190;
    } else {
      knockY = 185;
    }

    actor.x += knockX;
    actor.y += knockY;
    actor.element.style.left = `${actor.x}px`;
    actor.element.style.top = `${actor.y}px`;

    window.setTimeout(() => {
      actor.element.classList.remove("map-rabbit--critical-hit");
    }, 240);
  }

  function rabbitForceEscape(actor, now) {
    if (actor.dead || actor.away) return;

    // Hit rabbits immediately try to flee toward a valid map-edge exit.
    if (actor.zone.exits.length) {
      actor.pauseUntil = 0;
      actor.nextDecision = 0;
      rabbitStartExit(actor, now);
      actor.speed = 330 + Math.random() * 110;
      return;
    }

    rabbitChooseInteriorTarget(actor, now);
    actor.speed = 300 + Math.random() * 90;
  }

  function killRabbit(actor, now) {
    if (actor.dead) return;

    actor.dead = true;
    actor.hp = 0;
    actor.moving = false;
    actor.exiting = false;
    actor.entering = false;
    actor.pauseUntil = Infinity;
    actor.nextDecision = Infinity;
    actor.nextFrameChange = Infinity;

    actor.element.classList.remove("map-rabbit--moving");
    actor.element.classList.add("map-rabbit--dead");

    const active = actor.visibleLayer;
    const hidden = 1 - active;

    actor.images[active].src = encodeURI(RABBIT_DEAD_FRAME);
    actor.images[active].classList.add("map-rabbit__sprite--visible");
    actor.images[hidden].classList.remove("map-rabbit__sprite--visible");

    // Keep the dead rabbit visible briefly, then remove it and allow a later respawn.
    actor.respawnAt = now + 6500 + Math.random() * 5000;
  }

  function respawnRabbit(actor, now) {
    const start = rabbitRandomPoint(actor.zone, 160);

    actor.hp = RABBIT_MAX_HP;
    actor.dead = false;
    actor.away = false;
    actor.exiting = false;
    actor.entering = false;
    actor.moving = false;
    actor.x = start.x;
    actor.y = start.y;
    actor.targetX = start.x;
    actor.targetY = start.y;
    actor.pauseUntil = now + 700 + Math.random() * 1800;
    actor.nextDecision = now + 1500 + Math.random() * 2500;
    actor.nextFrameChange = now + 350 + Math.random() * 900;
    actor.respawnAt = 0;

    actor.element.classList.remove(
      "map-rabbit--dead",
      "map-rabbit--away",
      "map-rabbit--critical-hit"
    );

    actor.element.style.left = `${actor.x}px`;
    actor.element.style.top = `${actor.y}px`;
    rabbitPickFrame(actor, false);
  }

  function damageRabbit(actor, amount, critical, direction, now) {
    if (actor.dead || actor.away) return;

    actor.hp = Math.max(0, actor.hp - amount);

    createRabbitDamageText(actor, amount, critical);
    playRabbitHitSound();

    if (critical) {
      createRabbitDust(actor);
      rabbitCriticalKnockback(actor, direction);
    }

    if (actor.hp <= 0) {
      killRabbit(actor, now);
      return;
    }

    rabbitForceEscape(actor, now);
  }

  function resolveRabbitAttackFrame(frame) {
    if (!frame || !frame.hit) return;

    const direction = rabbitAttackDirection();
    const now = performance.now();

    for (const actor of rabbitActors) {
      if (rabbitInsideAttackHitbox(actor, direction)) {
        damageRabbit(
          actor,
          frame.damage || 20,
          Boolean(frame.critical),
          direction,
          now
        );
      }
    }
  }

  function createRabbitActor(zone, index) {
    const start = rabbitRandomPoint(zone, 150);

    const element = document.createElement("div");
    element.className = "map-rabbit";
    element.dataset.rabbitZone = zone.id;
    element.dataset.rabbitIndex = String(index);

    const bob = document.createElement("div");
    bob.className = "map-rabbit__bob";

    const imageA = document.createElement("img");
    imageA.className = "map-rabbit__sprite map-rabbit__sprite--visible";
    imageA.alt = "";
    imageA.draggable = false;

    const imageB = document.createElement("img");
    imageB.className = "map-rabbit__sprite";
    imageB.alt = "";
    imageB.draggable = false;

    bob.append(imageA, imageB);
    element.appendChild(bob);
    world.appendChild(element);

    const firstFrame = Math.floor(Math.random() * RABBIT_FRAMES.length);
    imageA.src = encodeURI(RABBIT_FRAMES[firstFrame]);

    const actor = {
      zone,
      element,
      images: [imageA, imageB],
      visibleLayer: 0,
      frameIndex: firstFrame,

      x: start.x,
      y: start.y,
      targetX: start.x,
      targetY: start.y,
      speed: 170,
      facing: Math.random() < 0.5 ? -1 : 1,

      moving: false,
      away: false,
      exiting: false,
      entering: false,

      hp: RABBIT_MAX_HP,
      dead: false,
      respawnAt: 0,

      pauseUntil: performance.now() + 500 + Math.random() * 2000,
      nextDecision: performance.now() + 1000 + Math.random() * 3000,
      nextFrameChange: performance.now() + 350 + Math.random() * 1000,
      returnAt: 0
    };

    element.style.left = `${actor.x}px`;
    element.style.top = `${actor.y}px`;
    element.style.setProperty("--rabbit-facing", actor.facing);

    return actor;
  }

  function createRabbits() {
    installRabbitStyles();

    for (const src of [...RABBIT_FRAMES, RABBIT_DEAD_FRAME]) {
      const preload = new Image();
      preload.src = src;
    }

    rabbitActors = [];

    for (const zone of RABBIT_ZONES) {
      for (let i = 0; i < zone.count; i += 1) {
        rabbitActors.push(createRabbitActor(zone, i));
      }
    }
  }

  function updateRabbits(deltaSeconds, now) {
    for (const actor of rabbitActors) {
      if (actor.dead) {
        if (actor.respawnAt && now >= actor.respawnAt) {
          respawnRabbit(actor, now);
        }
        continue;
      }

      if (actor.away) {
        if (now >= actor.returnAt) {
          rabbitReturn(actor, now);
        }
        continue;
      }

      if (now >= actor.nextFrameChange) {
        rabbitPickFrame(actor);
      }

      if (actor.moving) {
        const dx = actor.targetX - actor.x;
        const dy = actor.targetY - actor.y;
        const distance = Math.hypot(dx, dy);

        if (distance <= 12) {
          actor.x = actor.targetX;
          actor.y = actor.targetY;
          actor.moving = false;
          actor.element.classList.remove("map-rabbit--moving");

          if (actor.exiting) {
            rabbitGoAway(actor, now);
            continue;
          }

          actor.entering = false;
          actor.pauseUntil = now + 500 + Math.random() * 2400;
          actor.nextDecision = actor.pauseUntil;
        } else {
          const step = Math.min(distance, actor.speed * deltaSeconds);
          actor.x += (dx / distance) * step;
          actor.y += (dy / distance) * step;
        }

        actor.element.style.left = `${actor.x}px`;
        actor.element.style.top = `${actor.y}px`;
        continue;
      }

      if (now < actor.pauseUntil || now < actor.nextDecision) {
        continue;
      }

      // Occasionally leave the map completely, then return later.
      if (actor.zone.exits.length && Math.random() < 0.16) {
        rabbitStartExit(actor, now);
      } else {
        rabbitChooseInteriorTarget(actor, now);
      }
    }
  }


  // ------------------------------------------------------------------
  // RARE MOLE EVENT + BLACK PENNY DROP
  // ------------------------------------------------------------------
  const MOLE_CONFIG = Object.freeze({
    checkInterval: 30000,
    spawnChance: 0.33,
    maxHp: 100,
    digDuration: 8673,
    exposedDuration: 5000,
    deadDuration: 5000,
    fadeDuration: 420,
    pickupRadius: 820
  });

  const MOLE_IMAGES = Object.freeze({
    mound: "assets/animals/moles/MOLE MOUND.webp",
    alive: "assets/animals/moles/MOLE ALIVE.webp",
    dead: "assets/animals/moles/MOLE DEAD.webp"
  });

  const BLACK_PENNY_ITEM = Object.freeze({
    id: "black-penny",
    name: "SCHWARZER PFENNIG",
    description: "MAULWURFKOT"
  });

  const moleDigAudio = new Audio("assets/audio/moles/MOLE DIG.mp3");
  moleDigAudio.preload = "auto";
  moleDigAudio.loop = false;
  moleDigAudio.volume = 1.0;

  let moleEvent = null;
  let nextMoleCheckAt = 0;
  let blackPennyCount = 0;
  let blackPennyDrops = [];

  function installMoleStyles() {
    if (document.getElementById("moleStyles")) return;

    const style = document.createElement("style");
    style.id = "moleStyles";
    style.textContent = `
      .map-mole {
        position: absolute;
        z-index: 5;
        width: 610px;
        height: 430px;
        transform: translate(-50%, -82%);
        pointer-events: none;
        user-select: none;
        opacity: 1;
        transition: opacity 420ms ease;
      }

      .map-mole--fading {
        opacity: 0;
      }

      .map-mole__image {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: 50% 100%;
        opacity: 0;
        transition: opacity 420ms ease;
        filter: drop-shadow(0 8px 5px rgba(0,0,0,.18));
      }

      .map-mole__image--visible {
        opacity: 1;
      }

      .mole-dust-field {
        position: absolute;
        left: 50%;
        bottom: 35px;
        width: 620px;
        height: 210px;
        transform: translateX(-50%);
        opacity: 0;
        pointer-events: none;
      }

      .map-mole--digging .mole-dust-field {
        opacity: 1;
      }

      .mole-dust-field::before,
      .mole-dust-field::after {
        content: "";
        position: absolute;
        bottom: 0;
        width: 260px;
        height: 120px;
        border-radius: 50%;
        background:
          radial-gradient(
            ellipse at center,
            rgba(190,164,120,.64) 0%,
            rgba(153,126,86,.42) 45%,
            rgba(112,86,53,0) 76%
          );
        filter: blur(8px);
        animation: moleDustLoop 1150ms ease-in-out infinite alternate;
      }

      .mole-dust-field::before {
        left: 20px;
      }

      .mole-dust-field::after {
        right: 20px;
        animation-delay: -520ms;
      }

      @keyframes moleDustLoop {
        0% {
          opacity: .38;
          transform: translateY(26px) scale(.72);
        }
        55% {
          opacity: .86;
          transform: translateY(-12px) scale(1.10);
        }
        100% {
          opacity: .18;
          transform: translateY(-42px) scale(1.42);
        }
      }

      .black-penny-drop {
        position: absolute;
        z-index: 11;
        width: 115px;
        height: 115px;
        transform: translate(-50%, -50%) scale(1);
        border-radius: 50%;
        pointer-events: none;
        opacity: 1;
        transition:
          opacity 360ms ease,
          transform 360ms ease;
        filter:
          drop-shadow(0 0 7px rgba(255,255,255,.80))
          drop-shadow(0 8px 5px rgba(0,0,0,.48));
      }

      .black-penny-drop::before {
        content: "";
        position: absolute;
        inset: 8px;
        border-radius: 50%;
        background:
          radial-gradient(circle at 35% 30%,
            #414141 0%,
            #151515 27%,
            #050505 62%,
            #000000 100%);
        border: 7px ridge #4b4b4b;
        box-shadow:
          inset 0 0 0 5px #090909,
          inset 7px 8px 14px rgba(255,255,255,.12);
      }

      .black-penny-drop::after {
        content: "●";
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        color: #090909;
        font-size: 47px;
        text-shadow:
          1px 1px 0 #555,
          -1px -1px 0 #000;
      }

      .black-penny-drop--pickup {
        opacity: 0;
        transform: translate(-50%, -90%) scale(.42);
      }

      .black-penny-plus {
        position: absolute;
        z-index: 30;
        transform: translate(-50%, -50%);
        pointer-events: none;
        user-select: none;
        white-space: nowrap;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 130px;
        font-weight: 900;
        color: #050505;
        -webkit-text-stroke: 4px #ffffff;
        text-shadow:
          0 0 5px #ffffff,
          0 0 12px #ffffff,
          0 0 22px rgba(255,255,255,.85);
        animation: blackPennyPlus 1100ms ease-out forwards;
      }

      .black-penny-plus__coin {
        display: inline-grid;
        place-items: center;
        width: 76px;
        height: 76px;
        margin-right: 18px;
        border-radius: 50%;
        vertical-align: middle;
        background: #050505;
        border: 5px ridge #595959;
        -webkit-text-stroke: 0;
        box-shadow:
          0 0 8px #ffffff,
          inset 5px 5px 8px rgba(255,255,255,.10);
      }

      @keyframes blackPennyPlus {
        0% {
          opacity: 0;
          transform: translate(-50%, -15%) scale(.72);
        }
        18% {
          opacity: 1;
          transform: translate(-50%, -80%) scale(1.08);
        }
        76% {
          opacity: 1;
          transform: translate(-50%, -145%) scale(1);
        }
        100% {
          opacity: 0;
          transform: translate(-50%, -190%) scale(.9);
        }
      }
    `;

    document.head.appendChild(style);
  }

  function moleSpawnPoint() {
    // Use the existing agricultural edge regions as the valid field areas.
    const zone =
      RABBIT_ZONES[Math.floor(Math.random() * RABBIT_ZONES.length)];

    return rabbitRandomPoint(zone, 210);
  }

  function scheduleNextMoleCheck(now = performance.now()) {
    nextMoleCheckAt = now + MOLE_CONFIG.checkInterval;
  }

  function setMoleImage(src) {
    if (!moleEvent) return;

    const incoming = 1 - moleEvent.visibleLayer;
    const outgoing = moleEvent.visibleLayer;

    moleEvent.images[incoming].src = encodeURI(src);
    moleEvent.images[incoming].classList.add("map-mole__image--visible");
    moleEvent.images[outgoing].classList.remove("map-mole__image--visible");

    moleEvent.visibleLayer = incoming;
  }

  function createMoleEvent(now) {
    const point = moleSpawnPoint();

    const element = document.createElement("div");
    element.className = "map-mole map-mole--digging";
    element.style.left = `${point.x}px`;
    element.style.top = `${point.y}px`;

    const imageA = document.createElement("img");
    imageA.className = "map-mole__image map-mole__image--visible";
    imageA.alt = "";
    imageA.draggable = false;
    imageA.src = encodeURI(MOLE_IMAGES.mound);

    const imageB = document.createElement("img");
    imageB.className = "map-mole__image";
    imageB.alt = "";
    imageB.draggable = false;

    const dust = document.createElement("div");
    dust.className = "mole-dust-field";

    element.append(imageA, imageB, dust);
    world.appendChild(element);

    moleEvent = {
      element,
      images: [imageA, imageB],
      visibleLayer: 0,
      x: point.x,
      y: point.y,
      hp: MOLE_CONFIG.maxHp,
      phase: "digging",
      phaseEndAt: now + MOLE_CONFIG.digDuration,
      dead: false
    };

    moleDigAudio.pause();
    try {
      moleDigAudio.currentTime = 0;
    } catch (_) {}
    moleDigAudio.play().catch(() => {});
  }

  function exposeMole(now) {
    if (!moleEvent || moleEvent.phase !== "digging") return;

    moleEvent.phase = "exposed";
    moleEvent.phaseEndAt = now + MOLE_CONFIG.exposedDuration;
    moleEvent.element.classList.remove("map-mole--digging");
    setMoleImage(MOLE_IMAGES.alive);
  }

  function killMole(now) {
    if (!moleEvent || moleEvent.dead) return;

    moleEvent.dead = true;
    moleEvent.hp = 0;
    moleEvent.phase = "dead";
    moleEvent.phaseEndAt = now + MOLE_CONFIG.deadDuration;
    moleEvent.element.classList.remove("map-mole--digging");
    setMoleImage(MOLE_IMAGES.dead);
  }

  function spawnBlackPenny(x, y) {
    const element = document.createElement("div");
    element.className = "black-penny-drop";
    element.dataset.itemId = BLACK_PENNY_ITEM.id;
    element.title =
      `${BLACK_PENNY_ITEM.name} — ${BLACK_PENNY_ITEM.description}`;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;

    world.appendChild(element);

    blackPennyDrops.push({
      element,
      x,
      y,
      collected: false
    });
  }

  function removeMole(now, dropItem) {
    if (!moleEvent) return;

    const finished = moleEvent;
    finished.element.classList.add("map-mole--fading");

    if (dropItem) {
      spawnBlackPenny(finished.x, finished.y);
    }

    window.setTimeout(() => {
      finished.element.remove();
    }, MOLE_CONFIG.fadeDuration + 30);

    moleEvent = null;
    scheduleNextMoleCheck(now);
  }

  function updateMole(now) {
    if (!moleEvent) {
      if (now < nextMoleCheckAt) return;

      // EXACT RULE:
      // every 30 seconds -> 33% spawn chance.
      // on failure -> new 30 second timer.
      if (Math.random() < MOLE_CONFIG.spawnChance) {
        createMoleEvent(now);
      } else {
        scheduleNextMoleCheck(now);
      }

      return;
    }

    if (now < moleEvent.phaseEndAt) return;

    if (moleEvent.phase === "digging") {
      exposeMole(now);
      return;
    }

    if (moleEvent.phase === "exposed") {
      // Player failed to kill it within the exact 5 second attack window.
      removeMole(now, false);
      return;
    }

    if (moleEvent.phase === "dead") {
      // Dead image stayed visible for exactly five seconds.
      // Drop appears when the mole despawns.
      removeMole(now, true);
    }
  }

  function moleInsideAttackHitbox(direction) {
    if (!moleEvent || moleEvent.phase !== "exposed" || moleEvent.dead) {
      return false;
    }

    const dx = moleEvent.x - playerX;
    const dy = moleEvent.y - playerY;

    if (direction === "right") {
      return (
        dx >= -RABBIT_ATTACK_HITBOX.sideBack &&
        dx <= RABBIT_ATTACK_HITBOX.sideForward &&
        Math.abs(dy) <= RABBIT_ATTACK_HITBOX.sideHalfHeight
      );
    }

    if (direction === "left") {
      return (
        dx <= RABBIT_ATTACK_HITBOX.sideBack &&
        dx >= -RABBIT_ATTACK_HITBOX.sideForward &&
        Math.abs(dy) <= RABBIT_ATTACK_HITBOX.sideHalfHeight
      );
    }

    return (
      dy >= -RABBIT_ATTACK_HITBOX.downBack &&
      dy <= RABBIT_ATTACK_HITBOX.downForward &&
      Math.abs(dx) <= RABBIT_ATTACK_HITBOX.downHalfWidth
    );
  }

  function resolveMoleAttackFrame(frame) {
    if (!frame || !frame.hit || !moleEvent) return;
    if (moleEvent.phase !== "exposed" || moleEvent.dead) return;

    const direction = rabbitAttackDirection();
    if (!moleInsideAttackHitbox(direction)) return;

    const amount = frame.damage || 20;
    const critical = Boolean(frame.critical);

    moleEvent.hp = Math.max(0, moleEvent.hp - amount);

    // Same damage popup and same hit sound as rabbits.
    createRabbitDamageText(moleEvent, amount, critical);
    playRabbitHitSound();

    if (moleEvent.hp <= 0) {
      killMole(performance.now());
    }
  }

  function showBlackPennyPlusOne() {
    const popup = document.createElement("div");
    popup.className = "black-penny-plus";
    popup.style.left = `${playerX}px`;
    popup.style.top = `${playerY - 360}px`;

    const coin = document.createElement("span");
    coin.className = "black-penny-plus__coin";

    const value = document.createElement("span");
    value.textContent = "+1";

    popup.append(coin, value);
    world.appendChild(popup);

    window.setTimeout(() => popup.remove(), 1160);
  }

  function collectBlackPenny() {
    let nearest = null;
    let nearestDistance = Infinity;

    for (const drop of blackPennyDrops) {
      if (drop.collected) continue;

      const distance = Math.hypot(
        drop.x - playerX,
        drop.y - playerY
      );

      if (
        distance <= MOLE_CONFIG.pickupRadius &&
        distance < nearestDistance
      ) {
        nearest = drop;
        nearestDistance = distance;
      }
    }

    if (!nearest) return;

    nearest.collected = true;
    blackPennyCount += 1;

    nearest.element.classList.add("black-penny-drop--pickup");
    showBlackPennyPlusOne();

    window.setTimeout(() => {
      nearest.element.remove();
      blackPennyDrops =
        blackPennyDrops.filter((drop) => drop !== nearest);
    }, 390);
  }

  function createMoleSystem() {
    installMoleStyles();

    for (const src of Object.values(MOLE_IMAGES)) {
      const image = new Image();
      image.src = src;
    }

    scheduleNextMoleCheck(performance.now());
  }


  // ------------------------------------------------------------------
  // RIVER COLLISION + TWO BRIDGE PATHS
  // Coordinates are mapped from the supplied 10000 x 6667 map reference.
  // Only the player's FOOT ANCHOR (playerX/playerY) participates in collision.
  // ------------------------------------------------------------------
  const RIVER_BLOCK_ZONES = Object.freeze([
    // Upper river, north of the covered bridge.
    Object.freeze([
      [3896, 0], [4115, 821], [5164, 839], [5146, 565], [4982, 383], [4909, 0]
    ]),
    // Upper river, south of the covered bridge down to the central plaza.
    Object.freeze([
      [4097, 1450], [4170, 2107], [4069, 2645], [5109, 2645], [5274, 1450]
    ]),
    // Lower river, central plaza down to the stone bridge.
    Object.freeze([
      [3495, 5664], [4407, 5454], [5995, 5609], [5602, 5253],
      [5310, 4633], [4352, 4624], [4279, 5281]
    ]),
    // Lower river, south of the stone bridge to the map edge.
    Object.freeze([
      [6250, 6147], [5237, 5910], [4316, 5937], [3057, 6211],
      [2984, 6658], [5584, 6658], [5593, 6330]
    ])
  ]);

  const STONE_BRIDGE_PATH = Object.freeze([
    Object.freeze([3490, 5871]),
    Object.freeze([3855, 5791]),
    Object.freeze([4220, 5725]),
    Object.freeze([4585, 5693]),
    Object.freeze([4950, 5691]),
    Object.freeze([5315, 5722]),
    Object.freeze([5680, 5785]),
    Object.freeze([6045, 5871]),
    Object.freeze([6410, 5981]),
    Object.freeze([6775, 5977]),
    Object.freeze([7016, 5966])
  ]);

  const COVERED_BRIDGE_PATH = Object.freeze([
    Object.freeze([3600, 1130]),
    Object.freeze([5700, 1130])
  ]);

  const BRIDGE_CONFIG = Object.freeze({
    stoneCorridor: 150,
    coveredCorridor: 150,
    engageDistance: 260,
    coveredFadeMs: 190,
    coveredInterior: Object.freeze({ x1: 3680, y1: 850, x2: 5660, y2: 1450 })
  });

  const bridgePathCache = new Map();
  let activeBridge = null;

  function worldPointInPolygon(x, y, polygon) {
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0];
      const yi = polygon[i][1];
      const xj = polygon[j][0];
      const yj = polygon[j][1];

      const intersects =
        ((yi > y) !== (yj > y)) &&
        (x < ((xj - xi) * (y - yi)) / ((yj - yi) || 0.000001) + xi);

      if (intersects) inside = !inside;
    }

    return inside;
  }

  function getPathMetrics(path) {
    if (bridgePathCache.has(path)) return bridgePathCache.get(path);

    const cumulative = [0];
    let total = 0;

    for (let i = 1; i < path.length; i += 1) {
      total += Math.hypot(
        path[i][0] - path[i - 1][0],
        path[i][1] - path[i - 1][1]
      );
      cumulative.push(total);
    }

    const metrics = { cumulative, total };
    bridgePathCache.set(path, metrics);
    return metrics;
  }

  function closestPointOnBridgePath(x, y, path) {
    const metrics = getPathMetrics(path);
    let best = null;

    for (let i = 0; i < path.length - 1; i += 1) {
      const ax = path[i][0];
      const ay = path[i][1];
      const bx = path[i + 1][0];
      const by = path[i + 1][1];
      const vx = bx - ax;
      const vy = by - ay;
      const len2 = vx * vx + vy * vy || 1;
      const t = Math.max(0, Math.min(1, ((x - ax) * vx + (y - ay) * vy) / len2));
      const px = ax + vx * t;
      const py = ay + vy * t;
      const distance = Math.hypot(x - px, y - py);
      const segmentLength = Math.hypot(vx, vy);
      const pathDistance = metrics.cumulative[i] + segmentLength * t;

      if (!best || distance < best.distance) {
        best = {
          x: px,
          y: py,
          distance,
          pathDistance,
          progress: metrics.total ? pathDistance / metrics.total : 0
        };
      }
    }

    return best;
  }

  function pointAtBridgeDistance(path, distance) {
    const metrics = getPathMetrics(path);
    const d = Math.max(0, Math.min(metrics.total, distance));

    for (let i = 0; i < path.length - 1; i += 1) {
      const start = metrics.cumulative[i];
      const end = metrics.cumulative[i + 1];

      if (d <= end || i === path.length - 2) {
        const span = Math.max(0.000001, end - start);
        const t = Math.max(0, Math.min(1, (d - start) / span));
        return {
          x: path[i][0] + (path[i + 1][0] - path[i][0]) * t,
          y: path[i][1] + (path[i + 1][1] - path[i][1]) * t,
          distance: d
        };
      }
    }

    return { x: path[0][0], y: path[0][1], distance: 0 };
  }

  function bridgeDefinition(id) {
    if (id === "stone") {
      return {
        id: "stone",
        path: STONE_BRIDGE_PATH,
        corridor: BRIDGE_CONFIG.stoneCorridor
      };
    }

    return {
      id: "covered",
      path: COVERED_BRIDGE_PATH,
      corridor: BRIDGE_CONFIG.coveredCorridor
    };
  }

  function pointInsideBridgeCorridor(x, y, definition) {
    const closest = closestPointOnBridgePath(x, y, definition.path);
    return closest && closest.distance <= definition.corridor;
  }

  function isValidBridgeCrossingPoint(x, y) {
    return (
      pointInsideBridgeCorridor(x, y, bridgeDefinition("stone")) ||
      pointInsideBridgeCorridor(x, y, bridgeDefinition("covered"))
    );
  }

  function isRiverBlockedFootPoint(x, y) {
    // Bridge surfaces are the ONLY legal exception to the red river zones.
    if (isValidBridgeCrossingPoint(x, y)) return false;

    for (const polygon of RIVER_BLOCK_ZONES) {
      if (worldPointInPolygon(x, y, polygon)) return true;
    }

    return false;
  }

  function canMoveFootTo(x, y) {
    const halfW = PLAYER.width / 2;
    const minY = PLAYER.height;
    const maxY = MAP.height - 10;

    if (x < halfW || x > MAP.width - halfW) return false;
    if (y < minY || y > maxY) return false;

    // Existing river/bridge collision remains unchanged.
    if (isRiverBlockedFootPoint(x, y)) return false;

    // New hard collision for church body + tavern.
    // Only the player's foot anchor participates.
    if (isBuildingBlockedFootPoint(x, y)) return false;

    return true;
  }

  function tryEngageBridge(horizontalDirection) {
    if (!horizontalDirection) return false;

    let best = null;

    for (const id of ["stone", "covered"]) {
      const definition = bridgeDefinition(id);
      const closest = closestPointOnBridgePath(playerX, playerY, definition.path);
      if (!closest || closest.distance > BRIDGE_CONFIG.engageDistance) continue;

      // At an endpoint only engage when the player is moving INTO the bridge.
      if (closest.progress <= 0.035 && horizontalDirection < 0) continue;
      if (closest.progress >= 0.965 && horizontalDirection > 0) continue;

      if (!best || closest.distance < best.closest.distance) {
        best = { definition, closest };
      }
    }

    if (!best) return false;

    activeBridge = {
      id: best.definition.id,
      path: best.definition.path,
      distance: best.closest.pathDistance
    };

    // Smoothly converge to the path instead of teleporting hard to it.
    const anchor = pointAtBridgeDistance(activeBridge.path, activeBridge.distance);
    playerX += (anchor.x - playerX) * 0.42;
    playerY += (anchor.y - playerY) * 0.42;
    return true;
  }

  function moveAlongActiveBridge(horizontalDirection, deltaSeconds) {
    if (!activeBridge) return false;

    if (!horizontalDirection) {
      // Standing still in a bridge/tunnel freezes the real map position.
      return true;
    }

    const metrics = getPathMetrics(activeBridge.path);
    const step = horizontalDirection * PLAYER.speed * deltaSeconds;
    const nextDistance = Math.max(0, Math.min(metrics.total, activeBridge.distance + step));
    const point = pointAtBridgeDistance(activeBridge.path, nextDistance);

    activeBridge.distance = nextDistance;
    playerX = point.x;
    playerY = point.y;

    const reachedLeftEnd = nextDistance <= 0.001 && horizontalDirection < 0;
    const reachedRightEnd = nextDistance >= metrics.total - 0.001 && horizontalDirection > 0;

    if (reachedLeftEnd || reachedRightEnd) {
      activeBridge = null;
    }

    return true;
  }

  function movePlayerWithWorldCollision(dx, dy, deltaSeconds) {
    const horizontalDirection = dx > 0 ? 1 : dx < 0 ? -1 : 0;

    if (activeBridge || tryEngageBridge(horizontalDirection)) {
      moveAlongActiveBridge(horizontalDirection, deltaSeconds);
      clampPlayer();
      return;
    }

    const length = Math.hypot(dx, dy) || 1;
    const nx = dx / length;
    const ny = dy / length;
    const amount = PLAYER.speed * deltaSeconds;

    // Axis-separated collision gives natural sliding along river banks.
    const candidateX = playerX + nx * amount;
    if (canMoveFootTo(candidateX, playerY)) {
      playerX = candidateX;
    }

    const candidateY = playerY + ny * amount;
    if (canMoveFootTo(playerX, candidateY)) {
      playerY = candidateY;
    }

    clampPlayer();
  }

  function playerInsideCoveredBridgeInterior() {
    const b = BRIDGE_CONFIG.coveredInterior;
    if (
      playerX < b.x1 || playerX > b.x2 ||
      playerY < b.y1 || playerY > b.y2
    ) {
      return false;
    }

    return pointInsideBridgeCorridor(
      playerX,
      playerY,
      bridgeDefinition("covered")
    );
  }

  function updateCoveredBridgeVisibility() {
    if (!playerEl) return;

    if (!playerEl.dataset.coveredBridgeFadeReady) {
      playerEl.dataset.coveredBridgeFadeReady = "1";
      playerEl.style.transition =
        `opacity ${BRIDGE_CONFIG.coveredFadeMs}ms ease`;
      playerEl.style.willChange = "opacity";
    }

    playerEl.style.opacity = playerInsideCoveredBridgeInterior() ? "0" : "1";
  }


  // ------------------------------------------------------------------
  // OBERKIRCH BUILDINGS
  // Exact size/position mapped from the supplied reference composite.
  // Both images are the original supplied transparent PNGs, unchanged.
  // ------------------------------------------------------------------
  const OBERKIRCH_BUILDINGS = Object.freeze([
    {
      id: "oberkirch-kirche",
      src: "assets/buildings/OBERKIRCH KIRCHE.png",
      left: 1052.152,
      top: 824.217,
      width: 2827.409,
      height: 4241.113,
      className: "map-building map-building--church"
    },
    {
      id: "oberkirch-schenke",
      src: "assets/buildings/OBERKIRCH SCHENKE.png",
      left: 4997.233,
      top: 1252.397,
      width: 1384.006,
      height: 2076.009,
      className: "map-building map-building--tavern"
    }
  ]);

  const CHURCH_CONFIG = OBERKIRCH_BUILDINGS[0];

  // The church collision is read directly from the PNG alpha channel.
  // Transparent pixels are always walkable. Only the lower, physically
  // grounded part of the visible church can block the player's FOOT anchor.
  // The large central tower and the small tower at lower-right are explicit
  // walk-behind zones: they NEVER block movement; the already-foreground PNG
  // naturally occludes the player while he passes behind them.
  const CHURCH_COLLISION = Object.freeze({
    alphaThreshold: 28,
    // The old hand-made footprint started around this visual height.
    // Above it are roof/tower pixels that must not become invisible walls.
    groundedFromY: 0.485,

    // Coordinates are normalized to the original church PNG (0..1).
    // Large central clock/spire tower.
    walkBehindLargeTower: Object.freeze([
      [0.432, 0.000],
      [0.686, 0.000],
      [0.702, 0.505],
      [0.446, 0.505]
    ]),

    // Small tower / chapel at the lower-right edge of the church artwork.
    // Entire visible tower may be crossed so the character can pass behind it,
    // including its foreground/lower section.
    walkBehindSmallTower: Object.freeze([
      [0.892, 0.535],
      [0.958, 0.535],
      [0.972, 0.700],
      [0.898, 0.700]
    ])
  });

  // Tavern collision stays EXACTLY as before.
  const BUILDING_BLOCK_ZONES = Object.freeze([
    Object.freeze([
      [5010, 1960],
      [6260, 1960],
      [6430, 2200],
      [6420, 2760],
      [6250, 2860],
      [5030, 2860],
      [4930, 2720],
      [4930, 2140]
    ])
  ]);

  let churchAlphaMask = null;

  function pointInNormalizedPolygon(x, y, polygon) {
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0];
      const yi = polygon[i][1];
      const xj = polygon[j][0];
      const yj = polygon[j][1];

      const intersects =
        ((yi > y) !== (yj > y)) &&
        (x < ((xj - xi) * (y - yi)) / ((yj - yi) || 0.000001) + xi);

      if (intersects) inside = !inside;
    }

    return inside;
  }

  function churchPointIsWalkBehind(localX01, localY01) {
    return (
      pointInNormalizedPolygon(
        localX01,
        localY01,
        CHURCH_COLLISION.walkBehindLargeTower
      ) ||
      pointInNormalizedPolygon(
        localX01,
        localY01,
        CHURCH_COLLISION.walkBehindSmallTower
      )
    );
  }

  function prepareChurchAlphaMask(image) {
    if (!image || !image.naturalWidth || !image.naturalHeight) return;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);

      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      churchAlphaMask = {
        width: canvas.width,
        height: canvas.height,
        alpha: new Uint8Array(canvas.width * canvas.height)
      };

      for (let src = 3, dst = 0; src < pixels.length; src += 4, dst += 1) {
        churchAlphaMask.alpha[dst] = pixels[src];
      }
    } catch (error) {
      // If canvas pixel access is unavailable, do NOT reintroduce the huge
      // old church polygon. The church remains visually correct and the
      // tavern/river collision continues to work normally.
      churchAlphaMask = null;
      console.warn("Church alpha collision mask unavailable:", error);
    }
  }

  function isChurchBlockedFootPoint(x, y) {
    const c = CHURCH_CONFIG;

    // Completely outside the actual placed church image = walkable.
    if (
      x < c.left ||
      x > c.left + c.width ||
      y < c.top ||
      y > c.top + c.height
    ) {
      return false;
    }

    const localX01 = (x - c.left) / c.width;
    const localY01 = (y - c.top) / c.height;

    // Roofs / spires are not floor obstacles.
    if (localY01 < CHURCH_COLLISION.groundedFromY) return false;

    // Both requested towers are fully traversable and work purely as
    // foreground occluders because the church PNG itself stays at z-index 6.
    if (churchPointIsWalkBehind(localX01, localY01)) return false;

    // Until the image's alpha mask is ready, never fall back to the oversized
    // legacy polygon. This avoids blocking transparent PNG space at startup.
    if (!churchAlphaMask) return false;

    const px = Math.max(
      0,
      Math.min(
        churchAlphaMask.width - 1,
        Math.round(localX01 * (churchAlphaMask.width - 1))
      )
    );
    const py = Math.max(
      0,
      Math.min(
        churchAlphaMask.height - 1,
        Math.round(localY01 * (churchAlphaMask.height - 1))
      )
    );

    const alpha = churchAlphaMask.alpha[py * churchAlphaMask.width + px];

    // EXACT RULE: transparent church PNG pixel = walkable.
    return alpha >= CHURCH_COLLISION.alphaThreshold;
  }

  function installOberkirchBuildingStyles() {
    if (document.getElementById("oberkirchBuildingStyles")) return;

    const style = document.createElement("style");
    style.id = "oberkirchBuildingStyles";
    style.textContent = `
      .map-building {
        position: absolute;
        z-index: 6;
        display: block;
        pointer-events: none;
        user-select: none;
        -webkit-user-drag: none;
        object-fit: fill;
        max-width: none;
        max-height: none;
      }

      .map-building--church {
        left: 1052.152px;
        top: 824.217px;
        width: 2827.409px;
        height: 4241.113px;
        z-index: 4;
      }

      /* Main church body stays behind the player.
         ONLY the two requested traversable towers are duplicated above him,
         so the character disappears naturally behind their visible PNG pixels. */
      .map-building--church-foreground {
        left: 1052.152px;
        top: 824.217px;
        width: 2827.409px;
        height: 4241.113px;
        z-index: 7;
      }

      /* LARGE CHURCH TOWER: foreground occluder, NO collision. */
      .map-building--church-large-tower-foreground {
        clip-path: polygon(
          43.2% 0%,
          68.6% 0%,
          70.2% 50.5%,
          44.6% 50.5%
        );
      }

      /* SMALL LOWER-RIGHT TURRET ONLY: foreground occluder, NO collision.
         The neighbouring wall is deliberately NOT part of this mask. */
      .map-building--church-small-tower-foreground {
        clip-path: polygon(
          89.2% 53.5%,
          95.8% 53.5%,
          97.2% 70.0%,
          89.8% 70.0%
        );
      }

      .map-building--tavern {
        left: 4997.233px;
        top: 1252.397px;
        width: 1384.006px;
        height: 2076.009px;
      }
    `;

    document.head.appendChild(style);
  }

  function createOberkirchBuildings() {
    installOberkirchBuildingStyles();

    for (const config of OBERKIRCH_BUILDINGS) {
      const image = document.createElement("img");
      image.id = config.id;
      image.className = config.className;
      image.src = encodeURI(config.src);
      image.alt = "";
      image.draggable = false;

      // Main church image stays behind the player.
      // Dedicated foreground copies below place BOTH requested towers above him.
      if (config.id === "oberkirch-kirche") {
        image.addEventListener("load", () => prepareChurchAlphaMask(image), {
          once: true
        });
      }

      world.appendChild(image);

      if (config.id === "oberkirch-kirche") {
        // Two foreground copies of the SAME transparent PNG.
        // Only the large tower and the small lower-right turret render above
        // the player. Both regions stay fully walkable.
        const towerOverlays = [
          {
            id: "oberkirch-kirche-large-tower-foreground",
            className:
              "map-building map-building--church-foreground map-building--church-large-tower-foreground"
          },
          {
            id: "oberkirch-kirche-small-tower-foreground",
            className:
              "map-building map-building--church-foreground map-building--church-small-tower-foreground"
          }
        ];

        for (const overlayConfig of towerOverlays) {
          const foreground = document.createElement("img");
          foreground.id = overlayConfig.id;
          foreground.className = overlayConfig.className;
          foreground.src = encodeURI(config.src);
          foreground.alt = "";
          foreground.draggable = false;
          world.appendChild(foreground);
        }

        if (image.complete && image.naturalWidth > 0) {
          prepareChurchAlphaMask(image);
        }
      }
    }
  }

  function isBuildingBlockedFootPoint(x, y) {
    // Precise PNG-alpha collision for the church.
    if (isChurchBlockedFootPoint(x, y)) return true;

    // Existing tavern footprint remains untouched.
    for (const polygon of BUILDING_BLOCK_ZONES) {
      if (worldPointInPolygon(x, y, polygon)) return true;
    }

    return false;
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
    resolveRabbitAttackFrame(attackSequence[0]);
    resolveMoleAttackFrame(attackSequence[0]);
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
          resolveRabbitAttackFrame(attackSequence[0]);
    resolveMoleAttackFrame(attackSequence[0]);
        } else {
          finishAttackState();
        }
        return;
      }

      setSprite(attackSequence[attackStep].sprite);
      resolveRabbitAttackFrame(attackSequence[attackStep]);
      resolveMoleAttackFrame(attackSequence[attackStep]);
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

    movePlayerWithWorldCollision(dx, dy, deltaSeconds);
  }

  function renderPlayer() {
    playerEl.style.left = `${playerX}px`;
    playerEl.style.top = `${playerY}px`;
    updateCoveredBridgeVisibility();
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
    updateRabbits(deltaSeconds, now);
    updateMole(now);
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
      "Space", "ControlLeft", "ControlRight", "Backquote"
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

    if (
      event.code === "Backquote" ||
      event.key === "^" ||
      event.key === "°"
    ) {
      event.preventDefault();
      collectBlackPenny();
      return;
    }

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
    startBackgroundMusic();
    calculateFitScale();
    displayScale = scaleForLevel(0);
    targetScale = displayScale;

    facing = "right";
    lastHorizontalFacing = "right";
    activeSprite = "";
    currentAnimation = "idle";
    setIdleSprite();

    createAreaSigns();
    createRabbits();
    createMoleSystem();
    createOberkirchBuildings();

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