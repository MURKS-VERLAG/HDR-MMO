(() => {
  "use strict";

  const MAPS = Object.freeze({
    oberkirch: Object.freeze({
      id: "oberkirch-zentrum",
      name: "OBERKIRCH ZENTRUM",
      image: "assets/maps/OBERKIRCH ZENTRUM.webp",
      width: 10000,
      height: 6667
    }),
    winterbach: Object.freeze({
      id: "winterbach-ranglehen",
      name: "WINTERBACH · RANGLEHEN",
      image: "assets/maps/MAP 2 WINTERBACH.png",
      width: 10000,
      height: 6006
    }),
    lautenbach: Object.freeze({
      id: "lautenbach",
      name: "LAUTENBACH",
      image: "assets/maps/MAP 3 LAUTENBACH.jpg",
      width: 10000,
      height: 6656
    }),
    hubacker: Object.freeze({
      id: "hubacker",
      name: "HUBACKER",
      image: "assets/maps/MAP 4 HUBACKER.jpg",
      width: 10240,
      height: 6827
    }),
    renchtalstadion: Object.freeze({
      id: "renchtalstadion",
      name: "RENCHTALSTADION",
      image: "assets/maps/MAP 5 RENCHTALSTADION.jpg",
      width: 10240,
      height: 5763
    })
  });

  let MAP = MAPS.oberkirch;
  let mapTransitioning = false;

  const MAP_EXIT_CONFIG = Object.freeze({
    // Blue-arrow exit at the upper edge of OBERKIRCH.
    oberkirchNorth: Object.freeze({
      x1: 2150,
      x2: 3250,
      leaveY: -18
    }),
    // R10 FINAL: exact lower exit lane at the marked blue arrow / black box.
    winterbachSouth: Object.freeze({
      // R17 RED ARROW — new OBERKIRCH return lane at lower-right edge.
      x1: 7750,
      x2: 8600,
      leavePadding: 18
    }),
    winterbachSpawn: Object.freeze({
      // Existing original north exit pair remains untouched.
      x: 5485,
      y: 5925
    }),

    // R18 NEW GREEN ARROW on MAP 1.
    oberkirchGreenNorth: Object.freeze({
      x1: 5750,
      x2: 6750,
      leaveY: -18
    }),

    // R17 RED ARROW on MAP 2 — spawn when entering from the new green arrow.
    winterbachRedSpawn: Object.freeze({
      x: 8175,
      y: 5925
    }),

    oberkirchReturnSpawn: Object.freeze({
      // Existing R18 YELLOW ARROW return point remains untouched.
      x: 6225,
      y: 760
    }),

    // R26 MAP 2 -> MAP 3: two marked north exits.
    winterbachNorthLeft: Object.freeze({
      x1: 4900,
      x2: 6150,
      leaveY: -18
    }),
    winterbachNorthRight: Object.freeze({
      x1: 6700,
      x2: 7950,
      leaveY: -18
    }),

    // R26 MAP 3 spawns: exact bottom roads from the cyan arrows.
    lautenbachSouthLeftSpawn: Object.freeze({
      x: 4845,
      y: 6535
    }),
    lautenbachSouthRightSpawn: Object.freeze({
      x: 7980,
      y: 6535
    }),

    // R26 MAP 3 -> MAP 2: both cyan bottom exits.
    lautenbachSouthLeft: Object.freeze({
      x1: 4420,
      x2: 5260,
      leavePadding: 18
    }),
    lautenbachSouthRight: Object.freeze({
      x1: 7560,
      x2: 8400,
      leavePadding: 18
    }),

    // Spawn just inside the two MAP 2 north roads when returning.
    winterbachNorthLeftReturnSpawn: Object.freeze({
      x: 5520,
      y: 165
    }),
    winterbachNorthRightReturnSpawn: Object.freeze({
      x: 7330,
      y: 165
    }),

    // R38 MAP 3 -> MAP 4: the two existing HUBACKER north roads.
    lautenbachNorthLeft: Object.freeze({
      x1: 4650,
      x2: 6050,
      leaveY: -18
    }),
    lautenbachNorthRight: Object.freeze({
      x1: 6850,
      x2: 8200,
      leaveY: -18
    }),

    // R38 MAP 4 arrival points: two separate lower roads, LEFT stays LEFT / RIGHT stays RIGHT.
    hubackerSouthLeftSpawn: Object.freeze({
      x: 3050,
      y: 6700
    }),
    // R41: LAUTENBACH upper-right -> HUBACKER red-circle arrival point.
    hubackerSouthRightSpawn: Object.freeze({
      x: 5990,
      y: 4895
    }),

    // R38 MAP 4 -> MAP 3: both lower HUBACKER roads return to the matching LAUTENBACH north road.
    hubackerSouthLeft: Object.freeze({
      x1: 2550,
      x2: 3550,
      leavePadding: 18
    }),
    // Spawn just inside the two MAP 3 north roads when returning from HUBACKER.
    lautenbachNorthLeftReturnSpawn: Object.freeze({
      x: 5325,
      y: 165
    }),

    // R51 OBERKIRCH -> RENCHTALSTADION:
    // existing red south arrow / ZUSENHOFEN-side lane on MAP 1.
    oberkirchStadiumSouth: Object.freeze({
      x1: 6500,
      x2: 8050,
      leavePadding: 18
    }),

    // Yellow-square arrival inside the stadium, directly above the main south gate.
    stadiumFromOberkirchSpawn: Object.freeze({
      x: 5120,
      y: 4740
    }),

    // Red-arrow stadium return lane through the main bottom gate.
    stadiumOberkirchSouth: Object.freeze({
      x1: 4580,
      x2: 5660,
      leavePadding: 18
    }),

    // Return to the matching red-arrow lane at the bottom of OBERKIRCH.
    oberkirchFromStadiumSpawn: Object.freeze({
      x: 7310,
      y: 6490
    })
  });

  const PLAYER = Object.freeze({
    standDown: "assets/player/PLAYER STAND DOWN.png",
    standRight: "assets/player/PLAYER STAND RIGHT.png",
    standLeft: "assets/player/PLAYER STAND LEFT.png",
    standUp: "assets/player/PLAYER STAND UP.png",

    // R43 SIDE WALK: existing frame, new in-between frame, repeated 4x.
    // Existing 4-frame order stays untouched; supplied new sheet stays 1 -> 4.
    walkRight: Object.freeze([
      "assets/player/PLAYER WALK RIGHT 1.png",
      "assets/player/PLAYER WALK RIGHT BETWEEN 1.png",
      "assets/player/PLAYER WALK RIGHT 2.png",
      "assets/player/PLAYER WALK RIGHT BETWEEN 2.png",
      "assets/player/PLAYER WALK RIGHT 3.png",
      "assets/player/PLAYER WALK RIGHT BETWEEN 3.png",
      "assets/player/PLAYER WALK RIGHT 4.png",
      "assets/player/PLAYER WALK RIGHT BETWEEN 4.png"
    ]),

    // LEFT uses the exact mirrored versions of the four new RIGHT in-between poses.
    walkLeft: Object.freeze([
      "assets/player/PLAYER WALK LEFT 1.png",
      "assets/player/PLAYER WALK LEFT BETWEEN 1.png",
      "assets/player/PLAYER WALK LEFT 2.png",
      "assets/player/PLAYER WALK LEFT BETWEEN 2.png",
      "assets/player/PLAYER WALK LEFT 3.png",
      "assets/player/PLAYER WALK LEFT BETWEEN 3.png",
      "assets/player/PLAYER WALK LEFT 4.png",
      "assets/player/PLAYER WALK LEFT BETWEEN 4.png"
    ]),

    // S / S+A / S+D: requested cadence = original sheet 1, 2, 3, 2.
    walkDown: Object.freeze([
      "assets/player/PLAYER WALK DOWN 1.png",
      "assets/player/PLAYER WALK DOWN 2.png",
      "assets/player/PLAYER WALK DOWN 3.png",
      "assets/player/PLAYER WALK DOWN 2.png"
    ]),

    walkUp: Object.freeze([
      "assets/player/PLAYER WALK UP 1.png",
      "assets/player/PLAYER WALK UP 2.png",
      "assets/player/PLAYER WALK UP 3.png",
      "assets/player/PLAYER WALK UP 4.png"
    ]),

    combatBase: "assets/player/combat/PLAYER COMBAT BASE.webp",
    combatBaseLeft: "assets/player/combat/PLAYER COMBAT BASE LEFT.webp",

    // R45 COMBAT IMAGE SWAP — four dedicated attack poses per direction.
    attackRight1: "assets/player/combat/PLAYER ATTACK V3 RIGHT 1.webp",
    attackRight2: "assets/player/combat/PLAYER ATTACK V3 RIGHT 2.webp",
    attackRight3: "assets/player/combat/PLAYER ATTACK V3 RIGHT 3.webp",
    attackRight4: "assets/player/combat/PLAYER ATTACK V3 RIGHT 4.webp",

    attackLeft1: "assets/player/combat/PLAYER ATTACK V3 LEFT 1.webp",
    attackLeft2: "assets/player/combat/PLAYER ATTACK V3 LEFT 2.webp",
    attackLeft3: "assets/player/combat/PLAYER ATTACK V3 LEFT 3.webp",
    attackLeft4: "assets/player/combat/PLAYER ATTACK V3 LEFT 4.webp",

    attackDown1: "assets/player/combat/PLAYER ATTACK V3 DOWN 1.webp",
    attackDown2: "assets/player/combat/PLAYER ATTACK V3 DOWN 2.webp",
    attackDown3: "assets/player/combat/PLAYER ATTACK V3 DOWN 3.webp",
    attackDown4: "assets/player/combat/PLAYER ATTACK V3 DOWN 4.webp",

    attackUp1: "assets/player/combat/PLAYER ATTACK V3 UP 1.webp",
    attackUp2: "assets/player/combat/PLAYER ATTACK V3 UP 2.webp",
    attackUp3: "assets/player/combat/PLAYER ATTACK V3 UP 3.webp",
    attackUp4: "assets/player/combat/PLAYER ATTACK V3 UP 4.webp",

    // Existing block/base artwork remains untouched.
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
    { sprite: PLAYER.standRight, duration: 100 },

    { sprite: PLAYER.attackRight2, duration: 500, hit: true, damage: 20, strike: 2 },
    { sprite: PLAYER.standRight, duration: 100 },

    { sprite: PLAYER.attackRight3, duration: 400, hit: true, damage: 20, strike: 4 },
    { sprite: PLAYER.standRight, duration: 100 },

    { sprite: PLAYER.attackRight4, duration: 500, hit: true, damage: 40, strike: 3, critical: true },
    { sprite: PLAYER.standRight, duration: 400 }
  ]);

  const ATTACK_LEFT = Object.freeze([
    { sprite: PLAYER.attackLeft1, duration: 400, hit: true, damage: 20, strike: 1 },
    { sprite: PLAYER.standLeft, duration: 100 },

    { sprite: PLAYER.attackLeft2, duration: 500, hit: true, damage: 20, strike: 2 },
    { sprite: PLAYER.standLeft, duration: 100 },

    { sprite: PLAYER.attackLeft3, duration: 400, hit: true, damage: 20, strike: 4 },
    { sprite: PLAYER.standLeft, duration: 100 },

    { sprite: PLAYER.attackLeft4, duration: 500, hit: true, damage: 40, strike: 3, critical: true },
    { sprite: PLAYER.standLeft, duration: 400 }
  ]);

  const ATTACK_DOWN = Object.freeze([
    { sprite: PLAYER.standDown, duration: 100 },

    { sprite: PLAYER.attackDown1, duration: 400, hit: true, damage: 20, strike: 1 },
    { sprite: PLAYER.standDown, duration: 100 },

    { sprite: PLAYER.attackDown2, duration: 500, hit: true, damage: 20, strike: 2 },
    { sprite: PLAYER.standDown, duration: 100 },

    { sprite: PLAYER.attackDown3, duration: 400, hit: true, damage: 20, strike: 4 },
    { sprite: PLAYER.standDown, duration: 100 },

    { sprite: PLAYER.attackDown4, duration: 500, hit: true, damage: 40, strike: 3, critical: true },
    { sprite: PLAYER.standDown, duration: 400 }
  ]);

  const ATTACK_UP = Object.freeze([
    { sprite: PLAYER.attackUp1, duration: 400, hit: true, damage: 20, strike: 1 },
    { sprite: PLAYER.standUp, duration: 100 },

    { sprite: PLAYER.attackUp2, duration: 500, hit: true, damage: 20, strike: 2 },
    { sprite: PLAYER.standUp, duration: 100 },

    { sprite: PLAYER.attackUp3, duration: 400, hit: true, damage: 20, strike: 4 },
    { sprite: PLAYER.standUp, duration: 100 },

    { sprite: PLAYER.attackUp4, duration: 500, hit: true, damage: 40, strike: 3, critical: true },
    { sprite: PLAYER.standUp, duration: 400 }
  ]);

  // ------------------------------------------------------------------
  // R67 WAFFE 1 — SCHWEINEKEULE (LV 1-10)
  // Finished character+weapon sprites; NO runtime weapon overlay.
  // ------------------------------------------------------------------
  const WEAPONS = Object.freeze({
    pinkPigClub: Object.freeze({
      id: "pink-pig-club",
      name: "SCHWEINEKEULE",
      icon: "assets/items/weapons/PINK PIG CLUB.png",
      inventoryWidth: 1,
      inventoryHeight: 2,
      levelMin: 1,
      levelMax: 10,

      // R68 SAUKEULE — weapon-specific combat values.
      damage: 40,
      criticalDamage: 80,
      saustarkChance: 0.05,
      saustarkDamage: 120,
      tooltipName: "SAUKEULE",
      tooltipDescription: "Für eine Keule Eures Ranges wirklich saustark!",

      attacks: Object.freeze({
        left: Object.freeze([
          "assets/player/weapons/pink-pig-club/PLAYER CLUB LEFT 1.webp",
          "assets/player/weapons/pink-pig-club/PLAYER CLUB LEFT 2.webp",
          "assets/player/weapons/pink-pig-club/PLAYER CLUB LEFT 3.webp",
          "assets/player/weapons/pink-pig-club/PLAYER CLUB LEFT 4.webp"
        ]),
        right: Object.freeze([
          "assets/player/weapons/pink-pig-club/PLAYER CLUB RIGHT 1.webp",
          "assets/player/weapons/pink-pig-club/PLAYER CLUB RIGHT 2.webp",
          "assets/player/weapons/pink-pig-club/PLAYER CLUB RIGHT 3.webp",
          "assets/player/weapons/pink-pig-club/PLAYER CLUB RIGHT 4.webp"
        ]),
        down: Object.freeze([
          "assets/player/weapons/pink-pig-club/PLAYER CLUB DOWN 1.webp",
          "assets/player/weapons/pink-pig-club/PLAYER CLUB DOWN 2.webp",
          "assets/player/weapons/pink-pig-club/PLAYER CLUB DOWN 3.webp",
          "assets/player/weapons/pink-pig-club/PLAYER CLUB DOWN 4.webp"
        ]),
        up: Object.freeze([
          "assets/player/weapons/pink-pig-club/PLAYER CLUB UP 1.webp",
          "assets/player/weapons/pink-pig-club/PLAYER CLUB UP 2.webp",
          "assets/player/weapons/pink-pig-club/PLAYER CLUB UP 3.webp",
          "assets/player/weapons/pink-pig-club/PLAYER CLUB UP 4.webp"
        ])
      })
    })
  });

  // ------------------------------------------------------------------
  // R69 SAUKEULE — FINAL ANIMATION ORDER
  // Hit timing is copied from the existing fist combo:
  // HIT 400 -> AUSHOL 100 -> HIT 500 -> AUSHOL 100 ->
  // HIT 400 -> AUSHOL 100 -> HIT 500 -> AUSHOL 400.
  // AUSHOL frames are visual ONLY and NEVER deal damage.
  // ------------------------------------------------------------------
  function makeClubSequence(direction) {
    const f = WEAPONS.pinkPigClub.attacks[direction];

    // LEFT / RIGHT / DOWN (S): 3 -> A1 -> 2 -> A1 -> 3 -> A1 -> 4 -> A1
    // UP (W):                  3 -> A2 -> 1 -> A2 -> 3 -> A2 -> 4 -> A2
    const isUp = direction === "up";
    const hit1 = f[2]; // Bild 3
    const pull = isUp ? f[1] : f[0]; // W = Bild 2; sonst Bild 1
    const hit2 = isUp ? f[0] : f[1]; // W = Bild 1; sonst Bild 2
    const hit3 = f[2]; // Bild 3
    const hit4 = f[3]; // Bild 4

    const entries = [
      { sprite: hit1, duration: 400, hit: true, damage: WEAPONS.pinkPigClub.damage, strike: 1 },
      { sprite: pull, duration: 100 },

      { sprite: hit2, duration: 500, hit: true, damage: WEAPONS.pinkPigClub.damage, strike: 2 },
      { sprite: pull, duration: 100 },

      { sprite: hit3, duration: 400, hit: true, damage: WEAPONS.pinkPigClub.damage, strike: 4 },
      { sprite: pull, duration: 100 },

      { sprite: hit4, duration: 500, hit: true, damage: WEAPONS.pinkPigClub.criticalDamage, strike: 3, critical: true },
      { sprite: pull, duration: 400 }
    ];

    return Object.freeze(entries.map((entry) => Object.freeze(entry)));
  }

  const CLUB_ATTACK_RIGHT = makeClubSequence("right");
  const CLUB_ATTACK_LEFT = makeClubSequence("left");
  const CLUB_ATTACK_DOWN = makeClubSequence("down");
  const CLUB_ATTACK_UP = makeClubSequence("up");

  const ZOOM_MULTIPLIERS = [1, 1.75, 3, 4.5];
  const ZOOM_DURATION = 300;

  const attackAudio = new Audio("assets/audio/PLAYER ATTACK.mp3");
  attackAudio.preload = "auto";
  attackAudio.loop = false;
  attackAudio.volume = 1.0;

  // ------------------------------------------------------------------
  // R33 MAP MUSIC — robust crossfade manager
  // OBERKIRCH keeps the ORIGINAL existing track.
  // WINTERBACH = Frostbound Ballad (1)
  // LAUTENBACH = Frostbound Ballad
  // ------------------------------------------------------------------
  const MAP_MUSIC = Object.freeze({
    "oberkirch-zentrum": "assets/audio/THE WEEPING STONE.mp3",
    "winterbach-ranglehen": "assets/audio/maps/WINTERBACH - FROSTBOUND BALLAD.mp3",
    "lautenbach": "assets/audio/maps/LAUTENBACH - FROSTBOUND BALLAD.mp3",
    // R52 dedicated HUBACKER track supplied by the user.
    "hubacker": "assets/audio/maps/HUBACKER - THE LAST KNIGHT'S LAMENT.mp3",
    // R52 dedicated RENCHTALSTADION track supplied by the user.
    "renchtalstadion": "assets/audio/maps/RENCHTALSTADION - MEDIEVAL BATTLE.mp3"
  });

  const MAP_MUSIC_VOLUME = 1.0;
  const MAP_MUSIC_FADE_MS = 1400;

  // R60 START FLOW MUSIC:
  // Both screens before OBERKIRCH use the EXACT existing RENCHTALSTADION track.
  // No duplicate audio file is needed; we reuse MAP_MUSIC["renchtalstadion"].
  function desiredBackgroundMusicId() {
    return (typeof startFlowState !== "undefined" && startFlowState !== "campaign")
      ? "renchtalstadion"
      : (MAP && MAP.id ? MAP.id : "oberkirch-zentrum");
  }

  const mapMusicPlayers = new Map();
  let musicUnlocked = false;
  let activeMapMusicId = null;
  let activeMapMusic = null;
  let musicFadeToken = 0;

  function getMapMusicPlayer(mapId) {
    const id = MAP_MUSIC[mapId] ? mapId : "oberkirch-zentrum";

    if (mapMusicPlayers.has(id)) {
      return mapMusicPlayers.get(id);
    }

    const audio = new Audio(MAP_MUSIC[id]);
    audio.preload = "auto";
    audio.loop = true;
    audio.volume = 0;
    mapMusicPlayers.set(id, audio);
    return audio;
  }

  function stopAllMapMusicExcept(exceptAudio = null) {
    for (const audio of mapMusicPlayers.values()) {
      if (audio === exceptAudio) continue;
      audio.pause();
      audio.volume = 0;
    }
  }

  function startBackgroundMusic() {
    const mapId = desiredBackgroundMusicId();
    const audio = getMapMusicPlayer(mapId);

    activeMapMusicId = mapId;
    activeMapMusic = audio;
    audio.volume = MAP_MUSIC_VOLUME;

    audio.play()
      .then(() => {
        musicUnlocked = true;
        stopAllMapMusicExcept(audio);
      })
      .catch(() => {
        // Browser waits for a genuine user gesture.
      });
  }

  function unlockBackgroundMusic() {
    const mapId = desiredBackgroundMusicId();
    const audio = getMapMusicPlayer(mapId);

    activeMapMusicId = mapId;
    activeMapMusic = audio;
    audio.volume = MAP_MUSIC_VOLUME;

    audio.play()
      .then(() => {
        musicUnlocked = true;
        stopAllMapMusicExcept(audio);

        window.removeEventListener("pointerdown", unlockBackgroundMusic);
        window.removeEventListener("keydown", unlockBackgroundMusic);
        window.removeEventListener("touchstart", unlockBackgroundMusic);
      })
      .catch(() => {});
  }

  function crossfadeMapMusic(nextMapId, duration = MAP_MUSIC_FADE_MS) {
    const next = getMapMusicPlayer(nextMapId);

    // If audio is not yet unlocked, simply arm the correct track.
    if (!musicUnlocked) {
      activeMapMusicId = nextMapId;
      activeMapMusic = next;
      return;
    }

    // Already correct track.
    if (activeMapMusicId === nextMapId && activeMapMusic === next) {
      if (next.paused) {
        next.volume = MAP_MUSIC_VOLUME;
        next.play().catch(() => {});
      }
      return;
    }

    const old = activeMapMusic;
    const oldStartVolume = old && !old.paused ? old.volume : 0;

    activeMapMusicId = nextMapId;
    activeMapMusic = next;

    // New area's music starts fresh on entry, then loops forever.
    try { next.currentTime = 0; } catch (_) {}
    next.volume = 0;

    const token = ++musicFadeToken;

    next.play()
      .then(() => {
        const startedAt = performance.now();

        function step(now) {
          if (token !== musicFadeToken) return;

          const t = Math.min(1, (now - startedAt) / duration);
          const eased = t * t * (3 - 2 * t);

          if (old && old !== next) {
            old.volume = Math.max(0, oldStartVolume * (1 - eased));
          }
          next.volume = Math.min(
            MAP_MUSIC_VOLUME,
            MAP_MUSIC_VOLUME * eased
          );

          if (t < 1) {
            requestAnimationFrame(step);
            return;
          }

          if (old && old !== next) {
            old.pause();
            old.volume = 0;
          }

          next.volume = MAP_MUSIC_VOLUME;
        }

        requestAnimationFrame(step);
      })
      .catch(() => {});
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
      x: 1300, y: 5980,
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
    },
    {
      id: "oberkirch-return",
      mapId: "winterbach-ranglehen",
      text: "OBERKIRCH",
      x: 8175, y: 5550,
      direction: "down",
      glow: "#ffffff",
      trigger: { x1: 7550, y1: 5000, x2: 8800, y2: 6006 }
    },
    {
      id: "lautenbach",
      mapId: "winterbach-ranglehen",
      text: "LAUTENBACH",
      x: 5520, y: 420,
      direction: "up",
      glow: "#ffffff",
      trigger: { x1: 4900, y1: 0, x2: 6150, y2: 1150 }
    },
    {
      id: "sendelbach",
      mapId: "winterbach-ranglehen",
      text: "SENDELBACH",
      x: 7330, y: 420,
      direction: "up",
      glow: "#ffffff",
      trigger: { x1: 6700, y1: 0, x2: 7950, y2: 1150 }
    },
    {
      id: "oedsbach-winterbach-east",
      mapId: "winterbach-ranglehen",
      text: "ÖDSBACH",
      x: 9580, y: 2715,
      direction: "right",
      glow: "#ffffff",
      trigger: { x1: 8950, y1: 2050, x2: 10000, y2: 3420 }
    },

    // R26 MAP 3 — LAUTENBACH route labels from the marked arrows.
    {
      id: "lautenbach-winterbach-left",
      mapId: "lautenbach",
      text: "WINTERBACH",
      x: 4845, y: 6200,
      direction: "down",
      glow: "#ffffff",
      trigger: { x1: 4200, y1: 5450, x2: 5550, y2: 6656 }
    },
    {
      id: "lautenbach-winterbach-right",
      mapId: "lautenbach",
      text: "WINTERBACH",
      x: 7980, y: 6200,
      direction: "down",
      glow: "#ffffff",
      trigger: { x1: 7300, y1: 5450, x2: 8650, y2: 6656 }
    },
    {
      id: "lautenbach-ottenhoefen",
      mapId: "lautenbach",
      text: "OTTENHÖFEN",
      x: 530, y: 430,
      direction: "up",
      glow: "#ffffff",
      trigger: { x1: 0, y1: 0, x2: 1250, y2: 1200 }
    },
    {
      id: "lautenbach-hubacker-left",
      mapId: "lautenbach",
      text: "HUBACKER",
      x: 5325, y: 430,
      direction: "up",
      glow: "#ffffff",
      trigger: { x1: 4650, y1: 0, x2: 6050, y2: 1200 }
    },
    {
      id: "lautenbach-hubacker-right",
      mapId: "lautenbach",
      text: "HUBACKER",
      x: 7520, y: 430,
      direction: "up",
      glow: "#ffffff",
      trigger: { x1: 6850, y1: 0, x2: 8200, y2: 1200 }
    },
    {
      id: "lautenbach-sendelbach",
      mapId: "lautenbach",
      text: "SENDELBACH",
      x: 9550, y: 6000,
      direction: "right",
      glow: "#ffffff",
      trigger: { x1: 8850, y1: 5150, x2: 10000, y2: 6656 }
    },

    // R38 MAP 4 — HUBACKER route labels from the supplied final-map reference.
    {
      id: "hubacker-sulzbach",
      mapId: "hubacker",
      text: "SULZBACH",
      x: 620, y: 2450,
      direction: "left",
      glow: "#ffffff",
      trigger: { x1: 0, y1: 1750, x2: 1500, y2: 3250 }
    },
    {
      id: "hubacker-ramsbach",
      mapId: "hubacker",
      text: "RAMSBACH",
      x: 4050, y: 430,
      direction: "up",
      glow: "#ffffff",
      trigger: { x1: 3350, y1: 0, x2: 4750, y2: 1250 }
    },
    {
      id: "hubacker-lautenbach-left",
      mapId: "hubacker",
      text: "LAUTENBACH",
      x: 3050, y: 6350,
      direction: "down",
      glow: "#ffffff",
      trigger: { x1: 2400, y1: 5550, x2: 3750, y2: 6827 }
    },

    // R51 MAP 5 — RENCHTALSTADION route labels.
    {
      id: "stadium-oberkirch",
      mapId: "renchtalstadion",
      text: "OBERKIRCH",
      x: 5120, y: 5260,
      direction: "down",
      glow: "#ffffff",
      trigger: { x1: 4300, y1: 4450, x2: 5900, y2: 5763 }
    },
    {
      id: "stadium-nesselried",
      mapId: "renchtalstadion",
      text: "NESSELRIED",
      x: 9300, y: 780,
      direction: "right",
      glow: "#ffffff",
      trigger: { x1: 8550, y1: 0, x2: 10240, y2: 1700 }
    },
    {
      id: "stadium-zusenhofen",
      mapId: "renchtalstadion",
      text: "ZUSENHOFEN",
      x: 7860, y: 5180,
      direction: "down",
      glow: "#ffffff",
      trigger: { x1: 6900, y1: 4450, x2: 8850, y2: 5763 }
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
      const config = sign.config;
      const signMapId = config.mapId || "oberkirch-zentrum";
      const t = config.trigger;

      const visible =
        config.id !== "stadium-oberkirch" &&
        MAP.id === signMapId &&
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
  // TRUNKENBOLD — R14 NPC V1
  // Only moves inside the black marked courtyard rectangle.
  // May randomly enter/leave either yellow tavern door.
  // ------------------------------------------------------------------
  const TRUNKENBOLD_CONFIG = Object.freeze({
    outsideSprite: "assets/npcs/TRUNKENBOLD OUTSIDE.png",
    enterSprite: "assets/npcs/TRUNKENBOLD ENTER.png",

    // R15 FINAL outdoor rectangle:
    // His FOOT anchor may NEVER rise above the red tavern line.
    bounds: Object.freeze({
      x1: 5130,
      y1: 2720,
      x2: 6295,
      y2: 3220
    }),

    // Door approach points sit ON the red line.
    // The sprite visually reaches the doors, but his FEET never walk onto the tavern.
    doors: Object.freeze([
      Object.freeze({ id: "left",  x: 5505, y: 2720 }),
      Object.freeze({ id: "right", x: 5985, y: 2720 })
    ]),

    // Match the player's configured world size exactly.
    width: 420,
    height: 630,
    speedMin: 82,
    speedMax: 138,

    // Random outdoor behaviour.
    outdoorPauseMin: 900,
    outdoorPauseMax: 3800,
    enterChancePerDecision: 0.22,

    // Once inside, duration is random.
    indoorMin: 4500,
    indoorMax: 15000,

    // Exact requested door animation length.
    doorPoseDuration: 1000,
    fadeDuration: 420,

    // Outside sprite flips every exact second.
    flipEvery: 1000
  });

  let trunkenbold = null;
  let trunkenboldAlphaMask = null;

  function prepareTrunkenboldAlphaMask(image) {
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
      const alpha = new Uint8Array(canvas.width * canvas.height);

      for (let src = 3, dst = 0; src < pixels.length; src += 4, dst += 1) {
        alpha[dst] = pixels[src];
      }

      trunkenboldAlphaMask = {
        width: canvas.width,
        height: canvas.height,
        alpha
      };
    } catch (error) {
      trunkenboldAlphaMask = null;
      console.warn("Trunkenbold alpha collision mask unavailable:", error);
    }
  }

  function isTrunkenboldBlockedFootPoint(x, y) {
    if (MAP.id !== "oberkirch-zentrum") return false;
    if (!trunkenbold || !trunkenboldAlphaMask) return false;
    if (trunkenbold.phase === "inside") return false;
    if (trunkenbold.element.classList.contains("trunkenbold--hidden")) return false;

    const left = trunkenbold.x - TRUNKENBOLD_CONFIG.width / 2;
    const top = trunkenbold.y - TRUNKENBOLD_CONFIG.height;

    let localX01 = (x - left) / TRUNKENBOLD_CONFIG.width;
    const localY01 = (y - top) / TRUNKENBOLD_CONFIG.height;

    if (
      localX01 < 0 || localX01 > 1 ||
      localY01 < 0 || localY01 > 1
    ) {
      return false;
    }

    // Outside image alternates mirrored every second.
    if (trunkenbold.phase !== "door-entry" && trunkenbold.flip < 0) {
      localX01 = 1 - localX01;
    }

    const mask = trunkenboldAlphaMask;
    const px = Math.max(
      0,
      Math.min(mask.width - 1, Math.round(localX01 * (mask.width - 1)))
    );
    const py = Math.max(
      0,
      Math.min(mask.height - 1, Math.round(localY01 * (mask.height - 1)))
    );

    // Actual opaque silhouette only — transparent PNG space remains walkable.
    return mask.alpha[py * mask.width + px] >= 28;
  }

  function installTrunkenboldStyles() {
    if (document.getElementById("trunkenboldStyles")) return;

    const style = document.createElement("style");
    style.id = "trunkenboldStyles";
    style.textContent = `
      .trunkenbold {
        position: absolute;
        z-index: 7;
        width: ${TRUNKENBOLD_CONFIG.width}px;
        height: ${TRUNKENBOLD_CONFIG.height}px;
        transform: translate(-50%, -100%);
        transform-origin: 50% 100%;
        pointer-events: none;
        user-select: none;
        opacity: 1;
        transition: opacity ${TRUNKENBOLD_CONFIG.fadeDuration}ms ease;
        will-change: left, top, opacity, transform;
      }

      .trunkenbold--hidden {
        opacity: 0;
      }

      .trunkenbold__sway {
        position: absolute;
        inset: 0;
        transform-origin: 50% 100%;
      }

      .trunkenbold--moving .trunkenbold__sway {
        animation: trunkenboldSway 1450ms ease-in-out infinite alternate;
      }

      .trunkenbold__sprite {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: 50% 100%;
        transform-origin: 50% 100%;
        transition: transform 240ms ease;
        filter: drop-shadow(0 9px 5px rgba(0,0,0,.26));
      }

      @keyframes trunkenboldSway {
        0% {
          transform: translate(-17px, 2px) rotate(-5.8deg);
        }
        34% {
          transform: translate(8px, -5px) rotate(2.8deg);
        }
        68% {
          transform: translate(-5px, 1px) rotate(-2.2deg);
        }
        100% {
          transform: translate(19px, -3px) rotate(6.5deg);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .trunkenbold--moving .trunkenbold__sway {
          animation: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function trunkenboldRandom(min, max) {
    return min + Math.random() * (max - min);
  }

  function trunkenboldRandomOutdoorPoint() {
    const b = TRUNKENBOLD_CONFIG.bounds;
    return {
      x: trunkenboldRandom(b.x1 + 95, b.x2 - 95),
      y: trunkenboldRandom(b.y1 + 65, b.y2 - 70)
    };
  }

  function trunkenboldPickDoor() {
    return TRUNKENBOLD_CONFIG.doors[
      Math.floor(Math.random() * TRUNKENBOLD_CONFIG.doors.length)
    ];
  }

  function setTrunkenboldOutsideSprite() {
    if (!trunkenbold) return;
    trunkenbold.image.src = encodeURI(TRUNKENBOLD_CONFIG.outsideSprite);
  }

  function setTrunkenboldDoorSprite() {
    if (!trunkenbold) return;
    trunkenbold.image.src = encodeURI(TRUNKENBOLD_CONFIG.enterSprite);
    trunkenbold.image.style.transform = "scaleX(1)";
  }

  function trunkenboldStartOutdoorWalk(now, explicitTarget = null) {
    if (!trunkenbold) return;

    const target = explicitTarget || trunkenboldRandomOutdoorPoint();

    trunkenbold.targetX = target.x;
    trunkenbold.targetY = target.y;
    trunkenbold.speed = trunkenboldRandom(
      TRUNKENBOLD_CONFIG.speedMin,
      TRUNKENBOLD_CONFIG.speedMax
    );
    trunkenbold.phase = "outdoor-walk";
    trunkenbold.phaseEndAt = 0;
    trunkenbold.element.classList.add("trunkenbold--moving");
    trunkenbold.nextFlipAt = now + TRUNKENBOLD_CONFIG.flipEvery;
  }

  function trunkenboldStartOutdoorPause(now) {
    if (!trunkenbold) return;

    trunkenbold.phase = "outdoor-pause";
    trunkenbold.element.classList.remove("trunkenbold--moving");
    trunkenbold.phaseEndAt =
      now + trunkenboldRandom(
        TRUNKENBOLD_CONFIG.outdoorPauseMin,
        TRUNKENBOLD_CONFIG.outdoorPauseMax
      );
  }

  function trunkenboldWalkToDoor(now) {
    if (!trunkenbold) return;

    const door = trunkenboldPickDoor();
    trunkenbold.door = door;
    trunkenbold.targetX = door.x;
    trunkenbold.targetY = door.y;
    trunkenbold.speed = trunkenboldRandom(92, 126);
    trunkenbold.phase = "to-door";
    trunkenbold.phaseEndAt = 0;
    trunkenbold.element.classList.add("trunkenbold--moving");
    trunkenbold.nextFlipAt = now + TRUNKENBOLD_CONFIG.flipEvery;
  }

  function trunkenboldBeginDoorEntry(now) {
    if (!trunkenbold) return;

    trunkenbold.phase = "door-entry";
    trunkenbold.phaseEndAt = now + TRUNKENBOLD_CONFIG.doorPoseDuration;
    trunkenbold.element.classList.remove("trunkenbold--moving");
    setTrunkenboldDoorSprite();
  }

  function trunkenboldDisappearInside(now) {
    if (!trunkenbold) return;

    trunkenbold.phase = "inside";
    trunkenbold.element.classList.add("trunkenbold--hidden");
    trunkenbold.phaseEndAt =
      now + trunkenboldRandom(
        TRUNKENBOLD_CONFIG.indoorMin,
        TRUNKENBOLD_CONFIG.indoorMax
      );
  }

  function trunkenboldLeaveTavern(now) {
    if (!trunkenbold) return;

    const door = trunkenboldPickDoor();
    trunkenbold.door = door;
    trunkenbold.x = door.x;
    trunkenbold.y = door.y;
    trunkenbold.element.style.left = `${trunkenbold.x}px`;
    trunkenbold.element.style.top = `${trunkenbold.y}px`;

    setTrunkenboldOutsideSprite();
    trunkenbold.flip = 1;
    trunkenbold.image.style.transform = "scaleX(1)";
    trunkenbold.element.classList.remove("trunkenbold--hidden");

    // He immediately staggers back into the black outdoor rectangle.
    const target = trunkenboldRandomOutdoorPoint();
    trunkenboldStartOutdoorWalk(now, target);
  }

  function createTrunkenbold() {
    installTrunkenboldStyles();

    for (const src of [
      TRUNKENBOLD_CONFIG.outsideSprite,
      TRUNKENBOLD_CONFIG.enterSprite
    ]) {
      const preload = new Image();
      preload.src = encodeURI(src);
    }

    const element = document.createElement("div");
    element.id = "trunkenbold";
    element.className = "trunkenbold";

    const sway = document.createElement("div");
    sway.className = "trunkenbold__sway";

    const image = document.createElement("img");
    image.className = "trunkenbold__sprite";
    image.src = encodeURI(TRUNKENBOLD_CONFIG.outsideSprite);
    image.alt = "";
    image.draggable = false;

    image.addEventListener("load", () => {
      // Build once from the normal standing/walking silhouette.
      if (!trunkenboldAlphaMask) {
        prepareTrunkenboldAlphaMask(image);
      }
    });

    sway.appendChild(image);
    element.appendChild(sway);
    world.appendChild(element);

    const start = {
      x: 5680,
      y: 2995
    };

    trunkenbold = {
      element,
      sway,
      image,
      x: start.x,
      y: start.y,
      targetX: start.x,
      targetY: start.y,
      speed: 100,
      phase: "outdoor-pause",
      phaseEndAt: performance.now() + 1500,
      nextFlipAt: performance.now() + TRUNKENBOLD_CONFIG.flipEvery,
      flip: 1,
      door: null
    };

    element.style.left = `${trunkenbold.x}px`;
    element.style.top = `${trunkenbold.y}px`;

    if (image.complete && image.naturalWidth > 0 && !trunkenboldAlphaMask) {
      prepareTrunkenboldAlphaMask(image);
    }
  }

  function updateTrunkenbold(deltaSeconds, now) {
    if (!trunkenbold) return;

    if (MAP.id !== "oberkirch-zentrum") {
      trunkenbold.element.style.display = "none";
      return;
    }

    trunkenbold.element.style.display = "";

    if (
      (trunkenbold.phase === "outdoor-walk" ||
       trunkenbold.phase === "to-door") &&
      now >= trunkenbold.nextFlipAt
    ) {
      trunkenbold.flip *= -1;
      trunkenbold.image.style.transform = `scaleX(${trunkenbold.flip})`;
      trunkenbold.nextFlipAt += TRUNKENBOLD_CONFIG.flipEvery;
    }

    if (
      trunkenbold.phase === "outdoor-walk" ||
      trunkenbold.phase === "to-door"
    ) {
      const dx = trunkenbold.targetX - trunkenbold.x;
      const dy = trunkenbold.targetY - trunkenbold.y;
      const distance = Math.hypot(dx, dy);

      if (distance <= 9) {
        trunkenbold.x = trunkenbold.targetX;
        trunkenbold.y = trunkenbold.targetY;
        trunkenbold.element.style.left = `${trunkenbold.x}px`;
        trunkenbold.element.style.top = `${trunkenbold.y}px`;

        if (trunkenbold.phase === "to-door") {
          trunkenboldBeginDoorEntry(now);
        } else {
          trunkenboldStartOutdoorPause(now);
        }
        return;
      }

      const step = Math.min(distance, trunkenbold.speed * deltaSeconds);
      trunkenbold.x += (dx / distance) * step;
      trunkenbold.y += (dy / distance) * step;
      trunkenbold.element.style.left = `${trunkenbold.x}px`;
      trunkenbold.element.style.top = `${trunkenbold.y}px`;
      return;
    }

    if (trunkenbold.phase === "outdoor-pause") {
      if (now < trunkenbold.phaseEndAt) return;

      if (Math.random() < TRUNKENBOLD_CONFIG.enterChancePerDecision) {
        trunkenboldWalkToDoor(now);
      } else {
        trunkenboldStartOutdoorWalk(now);
      }
      return;
    }

    if (trunkenbold.phase === "door-entry") {
      if (now < trunkenbold.phaseEndAt) return;
      trunkenboldDisappearInside(now);
      return;
    }

    if (trunkenbold.phase === "inside") {
      if (now < trunkenbold.phaseEndAt) return;
      trunkenboldLeaveTavern(now);
    }
  }



  // ------------------------------------------------------------------
  // R16 MAP 2 — WOLVES
  // Maximum five wolves inside the black marked winter habitat.
  // ------------------------------------------------------------------
  const WOLF_CONFIG = Object.freeze({
    mapId: "winterbach-ranglehen",
    frames: Object.freeze([
      "assets/animals/wolves/WOLF WALK 1.png",
      "assets/animals/wolves/WOLF WALK 2.png"
    ]),
    howlFrame: "assets/animals/wolves/WOLF HOWL.png",
    deadFrame: "assets/animals/wolves/WOLF DEAD.png",
    howlSound: "assets/audio/wolves/WOLF HOWL.mp3",
    maxHp: 750,
    deadDuration: 6500,
    fadeDuration: 420,
    count: 5,
    // R17: one tick larger.
    // R18: another very small size increase.
    width: 735,
    height: 592,
    speedMin: 150,
    speedMax: 250,
    frameDuration: 430,
    howlInterval: 30000,
    howlDuration: 5500,
    habitat: Object.freeze({
      // R16 black oval: clipped/open only at the TOP map edge.
      cx: 2950,
      cy: 420,
      rx: 1750,
      ry: 880
    })
  });

  const LAUTENBACH_WOLF_HABITAT = Object.freeze({
    mapId: "lautenbach",
    count: 5,
    canExitTop: false,
    cx: 520,
    cy: 4700,
    rx: 930,
    ry: 1900
  });

  // R48 MAP 4 — seven wolves ONLY inside the red Neuenstein meadow polygon.
  const HUBACKER_WOLF_HABITAT = Object.freeze({
    mapId: "hubacker",
    count: 7,
    canExitTop: false,
    polygon: Object.freeze([
      Object.freeze([7565, 376]),
      Object.freeze([6325, 586]),
      Object.freeze([5847, 924]),
      Object.freeze([5759, 1390]),
      Object.freeze([6212, 3468]),
      Object.freeze([6583, 3531]),
      Object.freeze([6457, 2116]),
      Object.freeze([6671, 1906]),
      Object.freeze([6999, 1638])
    ])
  });

  // R48 PINK rectangle: while a HUBACKER wolf stands here,
  // NEUENSTEIN is explicitly foreground for that wolf.
  const HUBACKER_WOLF_NEUENSTEIN_FOREGROUND = Object.freeze([
    Object.freeze([6218, 198]),
    Object.freeze([9057, 198]),
    Object.freeze([9057, 1931]),
    Object.freeze([6218, 1931])
  ]);

  let wolfActors = [];
  let nextWolfHowlAt = 0;
  const wolfHowlAudio = new Audio(WOLF_CONFIG.howlSound);
  wolfHowlAudio.preload = "auto";
  wolfHowlAudio.loop = false;
  wolfHowlAudio.volume = 1.0;

  function installWolfStyles() {
    if (document.getElementById("wolfStyles")) return;

    const style = document.createElement("style");
    style.id = "wolfStyles";
    style.textContent = `
      .map-wolf {
        position: absolute;
        z-index: 5;
        width: ${WOLF_CONFIG.width}px;
        height: ${WOLF_CONFIG.height}px;
        transform: translate(-50%, -82%);
        pointer-events: none;
        user-select: none;
        opacity: 1;
        transition: opacity 420ms ease;
        will-change: left, top, opacity;
      }

      .map-wolf--away,
      .map-wolf--death-fading {
        opacity: 0;
      }

      .map-wolf--critical-hit {
        transition: left 210ms ease-out, top 210ms cubic-bezier(.1,.75,.25,1), opacity 420ms ease !important;
      }

      .map-wolf__sprite {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: 50% 100%;
        transform: scaleX(var(--wolf-facing, 1));
        transform-origin: 50% 100%;
        opacity: 0;
        visibility: hidden;
        /* R18 HARD NO-FLICKER:
           no crossfade. Different transparent silhouettes caused a luminance pulse. */
        transition: none !important;
        filter: drop-shadow(0 9px 5px rgba(0,0,0,.24));
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }

      .map-wolf__sprite--dead {
        transform: scaleX(var(--wolf-facing, 1)) scale(.75);
        transform-origin: 50% 100%;
      }

      .map-wolf__sprite--visible {
        opacity: 1;
        visibility: visible;
      }
    `;
    document.head.appendChild(style);
  }

  function wolfPolygonContains(x, y, polygon) {
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

  function wolfPointInsideHabitat(x, y, habitat = WOLF_CONFIG.habitat) {
    const h = habitat;

    // R48: HUBACKER uses the exact red polygon; all previous ellipse habitats
    // retain their original behaviour unchanged.
    if (h.polygon) {
      return wolfPolygonContains(x, y, h.polygon);
    }

    const dx = (x - h.cx) / h.rx;
    const dy = (y - h.cy) / h.ry;
    return dx * dx + dy * dy <= 1;
  }

  function wolfRandomPoint(inset = 90, habitat = WOLF_CONFIG.habitat, mapId = WOLF_CONFIG.mapId) {
    const h = habitat;

    if (h.polygon) {
      const xs = h.polygon.map((p) => p[0]);
      const ys = h.polygon.map((p) => p[1]);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      for (let i = 0; i < 400; i += 1) {
        const x = minX + inset + Math.random() * Math.max(1, maxX - minX - inset * 2);
        const y = minY + inset + Math.random() * Math.max(1, maxY - minY - inset * 2);

        if (wolfPointInsideHabitat(x, y, habitat)) {
          return { x, y };
        }
      }

      // Safe polygon fallback near its visual center.
      return {
        x: (minX + maxX) / 2,
        y: (minY + maxY) / 2
      };
    }

    for (let i = 0; i < 120; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random());
      const x = h.cx + Math.cos(angle) * Math.max(100, h.rx - inset) * r;
      const y = h.cy + Math.sin(angle) * Math.max(100, h.ry - inset) * r;

      if (
        y >= 90 &&
        wolfPointInsideHabitat(x, y, habitat) &&
        !(mapId === "lautenbach" && isLautenbachBlockedWorldPoint(x, y))
      ) {
        return { x, y };
      }
    }

    return { x: h.cx, y: Math.max(100, h.cy) };
  }

  function wolfShowStaticLayer(actor, layerIndex) {
    if (!actor || actor.visibleLayer === layerIndex) return;
    if (!actor.ready) return;

    // Remove every visible class first, then show exactly ONE already-decoded layer.
    // No overlap, no opacity interpolation, no brightness pulse.
    for (let i = 0; i < actor.images.length; i += 1) {
      actor.images[i].classList.toggle(
        "map-wolf__sprite--visible",
        i === layerIndex
      );
    }

    actor.visibleLayer = layerIndex;
  }

  function wolfPickWalkFrame(actor) {
    if (actor.howling || actor.away) return;

    actor.frameIndex = 1 - actor.frameIndex;

    // R17 anti-flicker:
    // both walk frames are permanent, already-loaded DOM images.
    // Only opacity visibility changes; src is NEVER reassigned.
    wolfShowStaticLayer(actor, actor.frameIndex);
    actor.nextFrameAt = performance.now() + WOLF_CONFIG.frameDuration;
  }

  function wolfChooseTarget(actor, now) {
    const target = wolfRandomPoint(120, actor.habitat, actor.mapId);
    actor.targetX = target.x;
    actor.targetY = target.y;
    actor.speed =
      WOLF_CONFIG.speedMin +
      Math.random() * (WOLF_CONFIG.speedMax - WOLF_CONFIG.speedMin);
    actor.moving = true;
    actor.pauseUntil = 0;
    actor.nextDecision = now + 2200 + Math.random() * 4200;

    const dx = actor.targetX - actor.x;
    if (Math.abs(dx) > 20) {
      actor.facing = dx < 0 ? -1 : 1;
      actor.element.style.setProperty("--wolf-facing", actor.facing);
    }
  }

  function wolfStartTopExit(actor, now) {
    actor.targetX =
      Math.max(
        actor.habitat.cx - actor.habitat.rx * 0.72,
        Math.min(
          actor.habitat.cx + actor.habitat.rx * 0.72,
          actor.x + (Math.random() - 0.5) * 650
        )
      );
    actor.targetY = -300;
    actor.speed = 210 + Math.random() * 120;
    actor.moving = true;
    actor.exiting = true;
    actor.pauseUntil = 0;

    const dx = actor.targetX - actor.x;
    if (Math.abs(dx) > 20) {
      actor.facing = dx < 0 ? -1 : 1;
      actor.element.style.setProperty("--wolf-facing", actor.facing);
    }
  }

  function wolfGoAway(actor, now) {
    actor.away = true;
    actor.exiting = false;
    actor.moving = false;
    actor.element.classList.add("map-wolf--away");
    actor.returnAt = now + 3500 + Math.random() * 8000;
  }

  function wolfReturn(actor, now) {
    const h = actor.habitat;
    actor.x =
      h.cx - h.rx * 0.62 +
      Math.random() * h.rx * 1.24;
    actor.y = -260;
    actor.away = false;
    actor.entering = true;
    actor.moving = true;
    actor.element.classList.remove("map-wolf--away");

    const target = wolfRandomPoint(180, actor.habitat, actor.mapId);
    actor.targetX = target.x;
    actor.targetY = target.y;
    actor.speed = 210 + Math.random() * 110;

    const dx = actor.targetX - actor.x;
    actor.facing = dx < 0 ? -1 : 1;
    actor.element.style.setProperty("--wolf-facing", actor.facing);
    actor.element.style.left = `${actor.x}px`;
    actor.element.style.top = `${actor.y}px`;
    actor.nextDecision = now + 2500 + Math.random() * 3000;
  }

  function wolfSetHowl(actor, now, delay) {
    window.setTimeout(() => {
      if (
        !actor ||
        !actor.ready ||
        actor.away ||
        actor.dead ||
        actor.tierbannAggressive ||
        MAP.id !== actor.mapId
      ) return;

      actor.howling = true;
      actor.moving = false;
      actor.exiting = false;
      actor.entering = false;

      // Dedicated permanently loaded howl layer = index 2.
      wolfShowStaticLayer(actor, 2);

      actor.howlEndAt = performance.now() + WOLF_CONFIG.howlDuration;
    }, delay);
  }

  function startWolfHowlEvent(now) {
    nextWolfHowlAt = now + WOLF_CONFIG.howlInterval;

    wolfHowlAudio.pause();
    try {
      wolfHowlAudio.currentTime = 0;
    } catch (_) {}
    wolfHowlAudio.play().catch(() => {});

    let accumulatedDelay = 0;
    for (const actor of wolfActors) {
      if (actor.mapId !== MAP.id) continue;
      accumulatedDelay += 100 + Math.random() * 100;
      wolfSetHowl(actor, now, accumulatedDelay);
    }
  }

  function createWolfActor(
    index,
    mapId = WOLF_CONFIG.mapId,
    habitat = WOLF_CONFIG.habitat,
    canExitTop = true,
    options = {}
  ) {
    const start = options.start || wolfRandomPoint(180, habitat, mapId);

    const element = document.createElement("div");
    element.className = "map-wolf";
    element.dataset.wolfIndex = String(index);

    const imageA = document.createElement("img");
    imageA.className = "map-wolf__sprite map-wolf__sprite--visible";
    imageA.src = encodeURI(WOLF_CONFIG.frames[0]);
    imageA.alt = "";
    imageA.draggable = false;
    imageA.decoding = "async";

    const imageB = document.createElement("img");
    imageB.className = "map-wolf__sprite";
    imageB.src = encodeURI(WOLF_CONFIG.frames[1]);
    imageB.alt = "";
    imageB.draggable = false;
    imageB.decoding = "async";

    const imageHowl = document.createElement("img");
    imageHowl.className = "map-wolf__sprite";
    imageHowl.src = encodeURI(WOLF_CONFIG.howlFrame);
    imageHowl.alt = "";
    imageHowl.draggable = false;
    imageHowl.decoding = "async";

    const imageDead = document.createElement("img");
    imageDead.className = "map-wolf__sprite map-wolf__sprite--dead";
    imageDead.src = encodeURI(WOLF_CONFIG.deadFrame);
    imageDead.alt = "";
    imageDead.draggable = false;
    imageDead.decoding = "async";

    // Walk 1 / Walk 2 / Howl / KO are all permanently loaded.
    element.append(imageA, imageB, imageHowl, imageDead);
    world.appendChild(element);

    const actor = {
      element,
      mapId,
      habitat,
      canExitTop,
      images: [imageA, imageB, imageHowl, imageDead],
      visibleLayer: 0,
      hp: WOLF_CONFIG.maxHp,
      dead: false,
      respawnAt: 0,
      fadeAt: 0,
      fadeStarted: false,
      pendingLoot: [],
      lootSpawned: false,
      frameIndex: 0,
      x: start.x,
      y: start.y,
      targetX: start.x,
      targetY: start.y,
      speed: 190,
      facing: Math.random() < 0.5 ? -1 : 1,
      moving: false,
      exiting: false,
      entering: false,
      away: false,
      returnAt: 0,
      pauseUntil: performance.now() + Math.random() * 1800,
      nextDecision: performance.now() + 900 + Math.random() * 2500,
      nextFrameAt: performance.now() + WOLF_CONFIG.frameDuration,
      howling: false,
      howlEndAt: 0,
      ready: false,

      // R67 optional Tierbann event metadata.
      tierbannSummon: Boolean(options.tierbannSummon),
      tierbannAggressive: Boolean(options.tierbannAggressive),
      noRespawn: Boolean(options.noRespawn)
    };

    element.style.left = `${actor.x}px`;
    element.style.top = `${actor.y}px`;
    element.style.setProperty("--wolf-facing", actor.facing);
    element.style.display = MAP.id === mapId ? "" : "none";

    const waitForWolfImage = (img) => {
      if (img.complete && img.naturalWidth > 0) {
        if (typeof img.decode === "function") {
          return img.decode().catch(() => {});
        }
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        const done = () => resolve();
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      }).then(() => {
        if (typeof img.decode === "function") {
          return img.decode().catch(() => {});
        }
      });
    };

    Promise.all(actor.images.map(waitForWolfImage)).then(() => {
      actor.ready = true;

      // Establish one deterministic first frame after every source is decoded.
      for (let i = 0; i < actor.images.length; i += 1) {
        actor.images[i].classList.toggle(
          "map-wolf__sprite--visible",
          i === 0
        );
      }
      actor.visibleLayer = 0;
      actor.frameIndex = 0;
      actor.nextFrameAt = performance.now() + WOLF_CONFIG.frameDuration;
    });

    return actor;
  }

  function createWolves() {
    installWolfStyles();

    for (const src of [...WOLF_CONFIG.frames, WOLF_CONFIG.howlFrame, WOLF_CONFIG.deadFrame]) {
      const image = new Image();
      image.decoding = "async";
      image.src = encodeURI(src);
      if (typeof image.decode === "function") {
        image.decode().catch(() => {});
      }
    }

    wolfActors = [];
    for (let i = 0; i < WOLF_CONFIG.count; i += 1) {
      wolfActors.push(createWolfActor(i, WOLF_CONFIG.mapId, WOLF_CONFIG.habitat, true));
    }
    for (let i = 0; i < LAUTENBACH_WOLF_HABITAT.count; i += 1) {
      wolfActors.push(
        createWolfActor(
          i,
          LAUTENBACH_WOLF_HABITAT.mapId,
          LAUTENBACH_WOLF_HABITAT,
          LAUTENBACH_WOLF_HABITAT.canExitTop
        )
      );
    }

    for (let i = 0; i < HUBACKER_WOLF_HABITAT.count; i += 1) {
      wolfActors.push(
        createWolfActor(
          i,
          HUBACKER_WOLF_HABITAT.mapId,
          HUBACKER_WOLF_HABITAT,
          HUBACKER_WOLF_HABITAT.canExitTop
        )
      );
    }

    nextWolfHowlAt = performance.now() + WOLF_CONFIG.howlInterval;
  }

  function updateWolves(deltaSeconds, now) {
    const activeActors = wolfActors.filter(actor => actor.mapId === MAP.id);

    for (const actor of wolfActors) {
      actor.element.style.display = actor.mapId === MAP.id ? "" : "none";

      // R48 HUBACKER wolf depth:
      // Outside the pink Neuenstein overlap wolves remain above the castle artwork;
      // inside the pink rectangle the castle is foreground and hides them.
      if (actor.mapId === "hubacker") {
        const behindNeuenstein = wolfPolygonContains(
          actor.x,
          actor.y,
          HUBACKER_WOLF_NEUENSTEIN_FOREGROUND
        );
        actor.element.style.zIndex = behindNeuenstein ? "5" : "111";
      } else {
        actor.element.style.zIndex = "5";
      }
    }

    if (!activeActors.length) return;

    if (now >= nextWolfHowlAt) {
      startWolfHowlEvent(now);
    }

    for (const actor of activeActors) {
      if (!actor.ready) continue;

      if (actor.dead) {
        if (!actor.fadeStarted && actor.fadeAt && now >= actor.fadeAt) {
          actor.fadeStarted = true;
          actor.element.classList.add("map-wolf--death-fading");
        }
        if (actor.respawnAt && now >= actor.respawnAt) respawnWolf(actor, now);
        continue;
      }

      if (actor.away) {
        if (now >= actor.returnAt) wolfReturn(actor, now);
        continue;
      }

      if (actor.tierbannAggressive) {
        updateTierbannAggressiveWolf(actor, deltaSeconds, now);
        continue;
      }

      if (actor.howling) {
        if (now >= actor.howlEndAt) {
          actor.howling = false;
          actor.frameIndex = 0;
          // Return to already-loaded walk frame 1; no runtime src swap.
          wolfShowStaticLayer(actor, 0);
          actor.nextFrameAt = now + WOLF_CONFIG.frameDuration;
          actor.pauseUntil = now + 250 + Math.random() * 550;
          actor.nextDecision = actor.pauseUntil;
        }
        continue;
      }

      if (now >= actor.nextFrameAt) {
        wolfPickWalkFrame(actor);
      }

      if (actor.moving) {
        const dx = actor.targetX - actor.x;
        const dy = actor.targetY - actor.y;
        const distance = Math.hypot(dx, dy);

        if (distance <= 12) {
          actor.x = actor.targetX;
          actor.y = actor.targetY;
          actor.moving = false;

          if (actor.exiting) {
            wolfGoAway(actor, now);
            continue;
          }

          actor.entering = false;
          actor.pauseUntil = now + 350 + Math.random() * 1500;
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

      if (now < actor.pauseUntil || now < actor.nextDecision) continue;

      // Black circle touches/open at top: wolves may leave only there.
      if (actor.canExitTop && Math.random() < 0.13) {
        wolfStartTopExit(actor, now);
      } else {
        wolfChooseTarget(actor, now);
      }
    }
  }




  // ------------------------------------------------------------------
  // R24 MAP 2 — ZIEGE IM OBSTHOF-GEHEGE
  // One goat only. Strictly confined to the exact RED pen polygon.
  // A1 = stand, A2 = one small step. Left uses mirrored versions.
  // ------------------------------------------------------------------
  const GOAT_CONFIG = Object.freeze({
    mapId: "winterbach-ranglehen",
    idleFrame: "assets/animals/goats/ZIEGE STAND.png",
    stepFrame: "assets/animals/goats/ZIEGE SCHRITT.png",

    width: 470,
    height: 400,

    pen: Object.freeze([
      [265, 4130],
      [965, 3760],
      [1500, 3945],
      [1535, 4175],
      [1315, 4300],
      [775, 4415]
    ]),

    boundaryClearance: 105,
    speed: 105,
    stepDistanceMin: 70,
    stepDistanceMax: 155,
    pauseMin: 1400,
    pauseMax: 4200,
    stepFrameMs: 480
  });

  let goatActor = null;

  function goatPointToSegmentDistance(px, py, ax, ay, bx, by) {
    const abx = bx - ax;
    const aby = by - ay;
    const apx = px - ax;
    const apy = py - ay;
    const denom = abx * abx + aby * aby;

    if (denom <= 0.000001) return Math.hypot(px - ax, py - ay);

    const t = Math.max(0, Math.min(1, (apx * abx + apy * aby) / denom));
    const qx = ax + abx * t;
    const qy = ay + aby * t;
    return Math.hypot(px - qx, py - qy);
  }

  function goatClearanceAt(x, y) {
    const polygon = GOAT_CONFIG.pen;
    let clearance = Infinity;

    for (let i = 0; i < polygon.length; i += 1) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];
      clearance = Math.min(
        clearance,
        goatPointToSegmentDistance(x, y, a[0], a[1], b[0], b[1])
      );
    }

    return clearance;
  }

  function goatPointAllowed(x, y) {
    return (
      worldPointInPolygon(x, y, GOAT_CONFIG.pen) &&
      goatClearanceAt(x, y) >= GOAT_CONFIG.boundaryClearance
    );
  }

  function goatRandomSafePoint() {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    for (const [x, y] of GOAT_CONFIG.pen) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }

    let best = { x: 970, y: 4070 };
    let bestClearance = -1;

    for (let i = 0; i < 700; i += 1) {
      const x = minX + Math.random() * (maxX - minX);
      const y = minY + Math.random() * (maxY - minY);

      if (!worldPointInPolygon(x, y, GOAT_CONFIG.pen)) continue;

      const clearance = goatClearanceAt(x, y);
      if (clearance > bestClearance) {
        bestClearance = clearance;
        best = { x, y };
      }

      if (clearance >= GOAT_CONFIG.boundaryClearance) return { x, y };
    }

    return best;
  }

  function installGoatStyles() {
    if (document.getElementById("goatStyles")) return;

    const style = document.createElement("style");
    style.id = "goatStyles";
    style.textContent = `
      .map-goat {
        position: absolute;
        /* R25: goat must always render in FRONT of the Obsthof (building z-index 6). */
        z-index: 7;
        width: ${GOAT_CONFIG.width}px;
        height: ${GOAT_CONFIG.height}px;
        transform: translate(-50%, -88%);
        pointer-events: none;
        user-select: none;
        will-change: left, top;
      }

      .map-goat__sprite {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: 50% 100%;
        transform: scaleX(var(--goat-facing, 1));
        transform-origin: 50% 100%;
        opacity: 0;
        visibility: hidden;
        transition: none !important;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        filter: drop-shadow(0 7px 4px rgba(0,0,0,.20));
      }

      .map-goat__sprite--visible {
        opacity: 1;
        visibility: visible;
      }
    `;

    document.head.appendChild(style);
  }

  function goatShowLayer(index) {
    if (!goatActor || !goatActor.ready || goatActor.visibleLayer === index) return;

    goatActor.images.forEach((image, i) => {
      image.classList.toggle("map-goat__sprite--visible", i === index);
    });

    goatActor.visibleLayer = index;
  }

  function goatSetFacing(direction) {
    if (!goatActor) return;
    goatActor.facing = direction < 0 ? -1 : 1;
    goatActor.element.style.setProperty("--goat-facing", goatActor.facing);
  }

  function goatChooseOneStep(now) {
    if (!goatActor) return;

    const distance =
      GOAT_CONFIG.stepDistanceMin +
      Math.random() * (GOAT_CONFIG.stepDistanceMax - GOAT_CONFIG.stepDistanceMin);

    // Try small one-step targets only. Never teleport and never cross the red line.
    for (let i = 0; i < 80; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const x = goatActor.x + Math.cos(angle) * distance;
      const y = goatActor.y + Math.sin(angle) * distance;

      if (!goatPointAllowed(x, y)) continue;

      goatActor.targetX = x;
      goatActor.targetY = y;
      goatActor.moving = true;
      goatActor.stepStartedAt = now;
      goatActor.stepEndsAt = now + GOAT_CONFIG.stepFrameMs;

      const dx = x - goatActor.x;
      if (Math.abs(dx) > 4) goatSetFacing(dx < 0 ? -1 : 1);

      // A2 / mirrored A2 for the one movement step.
      goatShowLayer(1);
      return;
    }

    goatActor.pauseUntil = now + 700;
  }

  function goatStartPause(now) {
    if (!goatActor) return;

    goatActor.moving = false;
    goatActor.targetX = goatActor.x;
    goatActor.targetY = goatActor.y;

    // A1 / mirrored A1 while standing.
    goatShowLayer(0);

    goatActor.pauseUntil =
      now +
      GOAT_CONFIG.pauseMin +
      Math.random() * (GOAT_CONFIG.pauseMax - GOAT_CONFIG.pauseMin);

    // Sometimes simply turn while standing so both A1 variants appear naturally.
    if (Math.random() < 0.30) goatSetFacing(goatActor.facing * -1);
  }

  function createGoat() {
    installGoatStyles();

    const root = document.createElement("div");
    root.className = "map-goat";

    const idle = document.createElement("img");
    idle.className = "map-goat__sprite map-goat__sprite--visible";
    idle.src = encodeURI(GOAT_CONFIG.idleFrame);
    idle.alt = "";
    idle.draggable = false;
    idle.decoding = "async";

    const step = document.createElement("img");
    step.className = "map-goat__sprite";
    step.src = encodeURI(GOAT_CONFIG.stepFrame);
    step.alt = "";
    step.draggable = false;
    step.decoding = "async";

    root.append(idle, step);
    world.appendChild(root);

    const start = goatRandomSafePoint();

    goatActor = {
      element: root,
      images: [idle, step],
      visibleLayer: 0,
      ready: false,
      x: start.x,
      y: start.y,
      targetX: start.x,
      targetY: start.y,
      moving: false,
      facing: Math.random() < 0.5 ? -1 : 1,
      pauseUntil: performance.now() + 800 + Math.random() * 1800,
      stepStartedAt: 0,
      stepEndsAt: 0
    };

    root.style.left = `${goatActor.x}px`;
    root.style.top = `${goatActor.y}px`;
    root.style.setProperty("--goat-facing", goatActor.facing);
    root.style.display = MAP.id === GOAT_CONFIG.mapId ? "" : "none";

    const waitFor = (img) => {
      if (img.complete && img.naturalWidth > 0) {
        return typeof img.decode === "function"
          ? img.decode().catch(() => {})
          : Promise.resolve();
      }

      return new Promise((resolve) => {
        const done = () => resolve();
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      }).then(() => {
        if (typeof img.decode === "function") return img.decode().catch(() => {});
      });
    };

    Promise.all(goatActor.images.map(waitFor)).then(() => {
      goatActor.ready = true;
      goatActor.images[0].classList.add("map-goat__sprite--visible");
      goatActor.images[1].classList.remove("map-goat__sprite--visible");
      goatActor.visibleLayer = 0;
    });
  }

  function updateGoat(deltaSeconds, now) {
    if (!goatActor) return;

    const active = MAP.id === GOAT_CONFIG.mapId;
    goatActor.element.style.display = active ? "" : "none";

    if (!active || !goatActor.ready) return;

    if (goatActor.moving) {
      const dx = goatActor.targetX - goatActor.x;
      const dy = goatActor.targetY - goatActor.y;
      const distance = Math.hypot(dx, dy);

      if (distance <= 5 || now >= goatActor.stepEndsAt) {
        // Snap only if target is still legal — it always should be.
        if (goatPointAllowed(goatActor.targetX, goatActor.targetY)) {
          goatActor.x = goatActor.targetX;
          goatActor.y = goatActor.targetY;
        }

        goatActor.element.style.left = `${goatActor.x}px`;
        goatActor.element.style.top = `${goatActor.y}px`;
        goatStartPause(now);
        return;
      }

      const stepDistance = Math.min(distance, GOAT_CONFIG.speed * deltaSeconds);
      const nx = goatActor.x + (dx / distance) * stepDistance;
      const ny = goatActor.y + (dy / distance) * stepDistance;

      if (goatPointAllowed(nx, ny)) {
        goatActor.x = nx;
        goatActor.y = ny;
        goatActor.element.style.left = `${goatActor.x}px`;
        goatActor.element.style.top = `${goatActor.y}px`;
      } else {
        goatStartPause(now);
      }

      return;
    }

    if (now >= goatActor.pauseUntil) {
      goatChooseOneStep(now);
    }
  }


  // ------------------------------------------------------------------
  // R19 MAP 2 — WILDSCHWEINE
  // Exactly the three red fenced field regions from the supplied reference.
  // Maximum two boars per field. They may leave only through the open RIGHT edge.
  // ------------------------------------------------------------------
  const BOAR_CONFIG = Object.freeze({
    mapId: "winterbach-ranglehen",

    idleFrame: "assets/animals/boars/WILDSCHWEIN STAND.png",
    runFrame: "assets/animals/boars/WILDSCHWEIN LAUF.png",
    deadFrame: "assets/animals/boars/WILDSCHWEIN DEAD.png",
    maxHp: 500,
    deadDuration: 6500,
    fadeDuration: 420,

    sounds: Object.freeze([
      "assets/audio/boars/WILDSCHWEIN 1.mp3",
      "assets/audio/boars/WILDSCHWEIN 2.mp3",
      "assets/audio/boars/WILDSCHWEIN 3.mp3"
    ]),

    // R20: deutlich größer als R19 (> 1/3; knapp Richtung doppelte Wirkung).
    width: 820,
    height: 647,

    // R20: sichtbarer Körper darf die roten Zaunlinien beim normalen
    // Herumlaufen nicht mehr überschneiden.
    fenceClearance: 330,

    // Small bursts only; then the animal stops again.
    speedMin: 120,
    speedMax: 195,
    moveDurationMin: 650,
    moveDurationMax: 1450,
    pauseMin: 1200,
    pauseMax: 4200,

    // If player is close, one nearby boar makes one random sound every 7 seconds.
    soundDistance: 1500,
    soundInterval: 7000,

    zones: Object.freeze([
      {
        id: "boar-field-upper",
        count: 2,
        exits: ["right"],
        polygon: [
          [8820, 1260],
          [10000, 930],
          [10000, 2410],
          [9570, 2510]
        ]
      },
      {
        id: "boar-field-middle",
        count: 2,
        exits: ["right"],
        // R20: exact wheat-field fence boundary from the red markup.
        polygon: [
          [9015, 3160],
          [10000, 2825],
          [10000, 4375],
          [9335, 4445]
        ]
      },
      {
        id: "boar-field-lower",
        count: 2,
        exits: ["right"],
        polygon: [
          [8650, 4840],
          [10000, 4410],
          [10000, 6006],
          [9410, 6006]
        ]
      },
      {
        id: "lautenbach-boar-east",
        mapId: "lautenbach",
        count: 3,
        exits: ["right"],
        polygon: [
          [8550,3500],[9100,3300],[9700,3380],[10000,3700],
          [10000,5200],[9570,5400],[8950,5250],[8500,4850]
        ]
      },
      {
        id: "hubacker-boar-fields",
        mapId: "hubacker",
        count: 2,
        exits: [],
        polygon: [
          [1674, 3480],
          [434, 4978],
          [2335, 5858],
          [3493, 4213]
        ]
      }
    ])
  });

  const boarSoundAudios = BOAR_CONFIG.sounds.map((src) => {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = 1.0;
    return audio;
  });

  let boarActors = [];
  let nextBoarNearbySoundAt = 0;

  function installBoarStyles() {
    if (document.getElementById("boarStyles")) return;

    const style = document.createElement("style");
    style.id = "boarStyles";
    style.textContent = `
      .map-boar {
        position: absolute;
        z-index: 5;
        width: ${BOAR_CONFIG.width}px;
        height: ${BOAR_CONFIG.height}px;
        transform: translate(-50%, -84%);
        pointer-events: none;
        user-select: none;
        opacity: 1;
        transition: opacity 360ms ease;
        will-change: left, top, opacity;
      }

      .map-boar--away,
      .map-boar--death-fading {
        opacity: 0;
      }

      .map-boar--critical-hit {
        transition: left 210ms ease-out, top 210ms cubic-bezier(.1,.75,.25,1), opacity 420ms ease !important;
      }

      .map-boar__sprite {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: 50% 100%;
        transform: scaleX(var(--boar-facing, 1));
        transform-origin: 50% 100%;
        opacity: 0;
        visibility: hidden;
        transition: none !important;
        filter: drop-shadow(0 8px 5px rgba(0,0,0,.22));
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }

      .map-boar__sprite--dead {
        transform: scaleX(var(--boar-facing, 1)) scale(.75);
        transform-origin: 50% 100%;
      }

      .map-boar__sprite--visible {
        opacity: 1;
        visibility: visible;
      }
    `;

    document.head.appendChild(style);
  }

  function boarPointInPolygon(x, y, polygon) {
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

  function boarBounds(zone) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const [x, y] of zone.polygon) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }

    return { minX, minY, maxX, maxY };
  }

  function boarPointToSegmentDistance(px, py, ax, ay, bx, by) {
    const abx = bx - ax;
    const aby = by - ay;
    const apx = px - ax;
    const apy = py - ay;
    const denom = abx * abx + aby * aby;

    if (denom <= 0.000001) {
      return Math.hypot(px - ax, py - ay);
    }

    const t = Math.max(
      0,
      Math.min(1, (apx * abx + apy * aby) / denom)
    );

    const qx = ax + abx * t;
    const qy = ay + aby * t;
    return Math.hypot(px - qx, py - qy);
  }

  function boarFenceClearanceAt(zone, x, y) {
    let clearance = Infinity;
    const polygon = zone.polygon;

    for (let i = 0; i < polygon.length; i += 1) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];
      clearance = Math.min(
        clearance,
        boarPointToSegmentDistance(
          x, y,
          a[0], a[1],
          b[0], b[1]
        )
      );
    }

    return clearance;
  }

  function boarRandomPoint(zone, inset = 80) {
    const b = boarBounds(zone);
    const requiredClearance = Math.max(
      inset,
      BOAR_CONFIG.fenceClearance
    );

    let best = null;
    let bestClearance = -Infinity;

    // R20: sample inside the ACTUAL red polygon and additionally keep
    // the foot anchor far enough from EVERY fence edge. This is what
    // prevents the much larger boar artwork from visibly crossing the fence.
    for (let i = 0; i < 900; i += 1) {
      const x = b.minX + Math.random() * (b.maxX - b.minX);
      const y = b.minY + Math.random() * (b.maxY - b.minY);

      if (!boarPointInPolygon(x, y, zone.polygon)) continue;
      if (zone.mapId === "lautenbach" && isLautenbachBlockedWorldPoint(x, y)) continue;

      const clearance = boarFenceClearanceAt(zone, x, y);

      if (clearance > bestClearance) {
        bestClearance = clearance;
        best = { x, y };
      }

      if (clearance >= requiredClearance) {
        return { x, y };
      }
    }

    // Extremely narrow fallback: use the safest sampled point rather than
    // ever falling back outside / directly onto a fence line.
    if (best) return best;

    return {
      x: (b.minX + b.maxX) / 2,
      y: (b.minY + b.maxY) / 2
    };
  }

  function boarShowLayer(actor, index) {
    if (!actor || !actor.ready || actor.visibleLayer === index) return;

    for (let i = 0; i < actor.images.length; i += 1) {
      actor.images[i].classList.toggle(
        "map-boar__sprite--visible",
        i === index
      );
    }

    actor.visibleLayer = index;
  }

  function boarSetFacing(actor, facing) {
    actor.facing = facing < 0 ? -1 : 1;
    actor.element.style.setProperty("--boar-facing", actor.facing);
  }

  function boarStartPause(actor, now) {
    actor.moving = false;
    actor.moveEndAt = 0;
    actor.pauseUntil =
      now +
      BOAR_CONFIG.pauseMin +
      Math.random() * (BOAR_CONFIG.pauseMax - BOAR_CONFIG.pauseMin);

    // Stand frame, left/right variant comes only from mirroring.
    boarShowLayer(actor, 0);

    // While idle, sometimes turn around so both standing variants appear naturally.
    if (Math.random() < 0.36) {
      boarSetFacing(actor, actor.facing * -1);
    }
  }

  function boarChooseShortMove(actor, now) {
    const target = boarRandomPoint(actor.zone, 100);

    actor.targetX = target.x;
    actor.targetY = target.y;
    actor.speed =
      BOAR_CONFIG.speedMin +
      Math.random() * (BOAR_CONFIG.speedMax - BOAR_CONFIG.speedMin);

    actor.moveEndAt =
      now +
      BOAR_CONFIG.moveDurationMin +
      Math.random() * (BOAR_CONFIG.moveDurationMax - BOAR_CONFIG.moveDurationMin);

    actor.moving = true;
    actor.exiting = false;

    const dx = actor.targetX - actor.x;
    if (Math.abs(dx) > 12) {
      boarSetFacing(actor, dx < 0 ? -1 : 1);
    }

    boarShowLayer(actor, 1);
  }

  function boarStartRightExit(actor, now) {
    actor.targetX = MAP.width + 320;
    actor.targetY = actor.y + (Math.random() - 0.5) * 220;
    actor.speed = 165 + Math.random() * 110;
    actor.moveEndAt = now + 9000;
    actor.moving = true;
    actor.exiting = true;

    boarSetFacing(actor, 1);
    boarShowLayer(actor, 1);
  }

  function boarGoAway(actor, now) {
    actor.away = true;
    actor.exiting = false;
    actor.moving = false;
    actor.element.classList.add("map-boar--away");
    actor.returnAt = now + 3500 + Math.random() * 8500;
  }

  function boarReturnFromRight(actor, now) {
    const b = boarBounds(actor.zone);

    actor.x = MAP.width + 280;
    actor.y =
      Math.max(
        b.minY + 120,
        Math.min(
          b.maxY - 120,
          b.minY + 120 + Math.random() * Math.max(10, b.maxY - b.minY - 240)
        )
      );

    const target = boarRandomPoint(actor.zone, 140);

    actor.targetX = target.x;
    actor.targetY = target.y;
    actor.speed = 175 + Math.random() * 95;
    actor.moveEndAt = now + 8500;
    actor.away = false;
    actor.exiting = false;
    actor.entering = true;
    actor.moving = true;

    actor.element.classList.remove("map-boar--away");
    boarSetFacing(actor, -1);
    boarShowLayer(actor, 1);

    actor.element.style.left = `${actor.x}px`;
    actor.element.style.top = `${actor.y}px`;
  }

  function createBoarActor(zone, index, options = {}) {
    const start = options.start || boarRandomPoint(zone, 130);

    const element = document.createElement("div");
    element.className = "map-boar";
    element.dataset.boarZone = zone.id;
    element.dataset.boarIndex = String(index);

    const idleImage = document.createElement("img");
    idleImage.className = "map-boar__sprite map-boar__sprite--visible";
    idleImage.src = encodeURI(BOAR_CONFIG.idleFrame);
    idleImage.alt = "";
    idleImage.draggable = false;
    idleImage.decoding = "async";

    const runImage = document.createElement("img");
    runImage.className = "map-boar__sprite";
    runImage.src = encodeURI(BOAR_CONFIG.runFrame);
    runImage.alt = "";
    runImage.draggable = false;
    runImage.decoding = "async";

    const deadImage = document.createElement("img");
    deadImage.className = "map-boar__sprite map-boar__sprite--dead";
    deadImage.src = encodeURI(BOAR_CONFIG.deadFrame);
    deadImage.alt = "";
    deadImage.draggable = false;
    deadImage.decoding = "async";

    element.append(idleImage, runImage, deadImage);
    world.appendChild(element);

    const actor = {
      element,
      images: [idleImage, runImage, deadImage],
      visibleLayer: 0,
      hp: BOAR_CONFIG.maxHp,
      dead: false,
      respawnAt: 0,
      fadeAt: 0,
      fadeStarted: false,
      pendingLoot: [],
      lootSpawned: false,
      zone,
      x: start.x,
      y: start.y,
      targetX: start.x,
      targetY: start.y,
      facing: Math.random() < 0.5 ? -1 : 1,
      speed: 150,
      moving: false,
      exiting: false,
      entering: false,
      away: false,
      returnAt: 0,
      pauseUntil: performance.now() + 500 + Math.random() * 2500,
      moveEndAt: 0,
      ready: false,

      // R67 optional Tierbann event metadata.
      tierbannSummon: Boolean(options.tierbannSummon),
      tierbannAggressive: Boolean(options.tierbannAggressive),
      noRespawn: Boolean(options.noRespawn)
    };

    element.style.left = `${actor.x}px`;
    element.style.top = `${actor.y}px`;
    element.style.setProperty("--boar-facing", actor.facing);
    element.style.display =
      MAP.id === (zone.mapId || BOAR_CONFIG.mapId) ? "" : "none";

    const waitForImage = (img) => {
      if (img.complete && img.naturalWidth > 0) {
        if (typeof img.decode === "function") {
          return img.decode().catch(() => {});
        }
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        const done = () => resolve();
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      }).then(() => {
        if (typeof img.decode === "function") {
          return img.decode().catch(() => {});
        }
      });
    };

    Promise.all(actor.images.map(waitForImage)).then(() => {
      actor.ready = true;
      actor.images[0].classList.add("map-boar__sprite--visible");
      actor.images[1].classList.remove("map-boar__sprite--visible");
      actor.visibleLayer = 0;
    });

    return actor;
  }

  function createBoars() {
    installBoarStyles();

    for (const src of [BOAR_CONFIG.idleFrame, BOAR_CONFIG.runFrame, BOAR_CONFIG.deadFrame]) {
      const image = new Image();
      image.decoding = "async";
      image.src = encodeURI(src);
      if (typeof image.decode === "function") {
        image.decode().catch(() => {});
      }
    }

    boarActors = [];

    for (const zone of BOAR_CONFIG.zones) {
      for (let i = 0; i < zone.count; i += 1) {
        boarActors.push(createBoarActor(zone, i));
      }
    }

    nextBoarNearbySoundAt = performance.now() + BOAR_CONFIG.soundInterval;
  }

  function playRandomBoarNearbySound(now) {
    if (now < nextBoarNearbySoundAt) return;

    const nearby = boarActors.filter((actor) => {
      const actorMapId = actor.zone.mapId || BOAR_CONFIG.mapId;
      if (actorMapId !== MAP.id) return false;
      if (!actor.ready || actor.away || actor.dead) return false;
      return (
        Math.hypot(playerX - actor.x, playerY - actor.y) <=
        BOAR_CONFIG.soundDistance
      );
    });

    if (!nearby.length) {
      // Check again soon, but do not consume a full seven-second cycle
      // when the player is nowhere near a boar.
      nextBoarNearbySoundAt = now + 900;
      return;
    }

    const actor = nearby[Math.floor(Math.random() * nearby.length)];
    const audio = boarSoundAudios[
      Math.floor(Math.random() * boarSoundAudios.length)
    ];

    // Actor selection is intentional even though sound is non-spatial.
    // It guarantees "one nearby wild boar" is responsible for each call.
    void actor;

    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (_) {}

    audio.play().catch(() => {});
    nextBoarNearbySoundAt = now + BOAR_CONFIG.soundInterval;
  }

  function updateBoars(deltaSeconds, now) {
    let anyActive = false;

    for (const actor of boarActors) {
      const actorMapId = actor.zone.mapId || BOAR_CONFIG.mapId;
      const active = actorMapId === MAP.id;
      actor.element.style.display = active ? "" : "none";
      if (active) anyActive = true;
    }

    if (!anyActive) return;

    playRandomBoarNearbySound(now);

    for (const actor of boarActors) {
      const actorMapId = actor.zone.mapId || BOAR_CONFIG.mapId;
      if (actorMapId !== MAP.id) continue;
      if (!actor.ready) continue;

      if (actor.dead) {
        if (!actor.fadeStarted && actor.fadeAt && now >= actor.fadeAt) {
          actor.fadeStarted = true;
          actor.element.classList.add("map-boar--death-fading");
        }
        if (actor.respawnAt && now >= actor.respawnAt) respawnBoar(actor, now);
        continue;
      }

      if (actor.away) {
        if (now >= actor.returnAt) {
          boarReturnFromRight(actor, now);
        }
        continue;
      }

      if (actor.tierbannAggressive) {
        updateTierbannAggressiveBoar(actor, deltaSeconds, now);
        continue;
      }

      if (actor.moving) {
        const dx = actor.targetX - actor.x;
        const dy = actor.targetY - actor.y;
        const distance = Math.hypot(dx, dy);

        if (distance <= 10) {
          actor.x = actor.targetX;
          actor.y = actor.targetY;
          actor.moving = false;

          if (actor.exiting) {
            boarGoAway(actor, now);
            continue;
          }

          actor.entering = false;
          boarStartPause(actor, now);
        } else {
          const step = Math.min(distance, actor.speed * deltaSeconds);
          actor.x += (dx / distance) * step;
          actor.y += (dy / distance) * step;
        }

        actor.element.style.left = `${actor.x}px`;
        actor.element.style.top = `${actor.y}px`;

        // Normal movement is deliberately short.
        // Return/exit movement is allowed to finish its map-edge traversal.
        if (
          !actor.exiting &&
          !actor.entering &&
          now >= actor.moveEndAt
        ) {
          boarStartPause(actor, now);
        }

        continue;
      }

      if (now < actor.pauseUntil) continue;

      // Rarely leave only when this zone explicitly has an open RIGHT edge.
      // R48 HUBACKER farm has exits: [] and is therefore strictly enclosed.
      if (
        actor.zone.exits &&
        actor.zone.exits.includes("right") &&
        Math.random() < 0.10
      ) {
        boarStartRightExit(actor, now);
      } else {
        boarChooseShortMove(actor, now);
      }
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
      mapId: "oberkirch-zentrum",
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
      mapId: "oberkirch-zentrum",
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
      mapId: "oberkirch-zentrum",
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
      mapId: "oberkirch-zentrum",
      polygon: [
        [8913, 4257],
        [10000, 4257],
        [10000, 6249],
        [8700, 5019]
      ],
      exits: ["right"],
      count: 2
    },

    // R16 MAP 2 — upper pink circle: four rabbits, fully enclosed.
    {
      id: "winterbach-rabbit-upper",
      mapId: "winterbach-ranglehen",
      polygon: [
        [1820, 2860],
        [2240, 2580],
        [3050, 2470],
        [3900, 2580],
        [4450, 2860],
        [4560, 3140],
        [4230, 3380],
        [3420, 3490],
        [2600, 3430],
        [2020, 3230]
      ],
      exits: [],
      count: 4
    },

    // R16 MAP 2 — lower-left pink circle: four rabbits.
    // Circle reaches left/bottom map edge, so they may leave and later return there.
    {
      id: "winterbach-rabbit-lower-left",
      mapId: "winterbach-ranglehen",
      polygon: [
        [0, 4630],
        [430, 4510],
        [980, 4530],
        [1540, 4720],
        [1910, 5080],
        [2010, 5480],
        [1860, 5850],
        [1660, 6006],
        [0, 6006]
      ],
      exits: ["left", "bottom"],
      count: 4
    },
    {
      id: "lautenbach-rabbits-west",
      mapId: "lautenbach",
      polygon: [
        [0,1050],[430,1150],[850,1550],[1040,2300],
        [1030,3150],[810,3900],[420,4420],[0,4520]
      ],
      exits: ["left"],
      count: 6
    },
    {
      id: "hubacker-rabbits-fields",
      mapId: "hubacker",
      polygon: [
        [1674, 3480],
        [434, 4978],
        [2335, 5858],
        [3493, 4213]
      ],
      exits: [],
      count: 3
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

      /* R68 SAUKEULE: damage stays red; SAUSTARK appears beside it in pink. */
      .rabbit-damage--saustark {
        display: flex;
        align-items: center;
        gap: 34px;
      }

      .rabbit-damage__value {
        color: #ff2020;
      }

      .rabbit-damage__saustark {
        color: #ff5fb7;
        font-size: 108px;
        letter-spacing: 5px;
        text-shadow:
          0 0 4px #ff4fae,
          0 0 10px #ff4fae,
          0 0 22px rgba(255,79,174,.92),
          0 5px 3px rgba(0,0,0,.8);
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

      /* R61: corpse fades first; loot becomes visible only after that fade completes. */
      .map-rabbit--loot-fading {
        opacity: 0 !important;
        transition: opacity 420ms ease !important;
      }

      .rabbit-loot-drop {
        position: absolute;
        z-index: 11;
        width: 150px;
        height: 150px;
        transform: translate(-50%, -50%) scale(1);
        pointer-events: none;
        user-select: none;
        opacity: 1;
        transition: opacity 360ms ease, transform 360ms ease;
        filter: drop-shadow(0 0 7px rgba(255,255,255,.78)) drop-shadow(0 8px 5px rgba(0,0,0,.48));
      }

      .rabbit-loot-drop__icon {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .rabbit-loot-drop--pickup {
        opacity: 0;
        transform: translate(-50%, -90%) scale(.42);
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

      if (
        rabbitPointInPolygon(x, y, zone.polygon) &&
        !(zone.mapId === "lautenbach" && isLautenbachBlockedWorldPoint(x, y))
      ) {
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

  // R64 LARGE ANIMAL HIT AUDIO — species-specific, interruptible.
  const WOLF_HIT_SOUNDS = Object.freeze([
    "assets/audio/wolves/WOLF HIT 1.mp3",
    "assets/audio/wolves/WOLF HIT 2.mp3",
    "assets/audio/wolves/WOLF HIT 3.mp3"
  ]);
  const BOAR_HIT_SOUNDS = Object.freeze([
    "assets/audio/boars/WILDSCHWEIN HIT 1.mp3",
    "assets/audio/boars/WILDSCHWEIN HIT 2.mp3",
    "assets/audio/boars/WILDSCHWEIN HIT 3.mp3"
  ]);

  let activeWolfHitAudio = null;
  let activeBoarHitAudio = null;
  let wolfHitFadeToken = 0;
  let boarHitFadeToken = 0;

  function playInterruptibleAnimalHitSound(kind) {
    const isWolf = kind === "wolf";
    const sounds = isWolf ? WOLF_HIT_SOUNDS : BOAR_HIT_SOUNDS;
    const old = isWolf ? activeWolfHitAudio : activeBoarHitAudio;
    const token = isWolf ? ++wolfHitFadeToken : ++boarHitFadeToken;

    // A new hit must sound immediately. The previous cry fades out very fast.
    if (old && !old.paused) {
      const startVolume = old.volume;
      const startedAt = performance.now();
      const fadeMs = 85;
      const fade = (now) => {
        const currentToken = isWolf ? wolfHitFadeToken : boarHitFadeToken;
        if (token !== currentToken) return;
        const t = Math.min(1, (now - startedAt) / fadeMs);
        old.volume = Math.max(0, startVolume * (1 - t));
        if (t < 1) requestAnimationFrame(fade);
        else { old.pause(); old.currentTime = 0; old.volume = 1; }
      };
      requestAnimationFrame(fade);
    }

    const audio = new Audio(sounds[Math.floor(Math.random() * sounds.length)]);
    audio.preload = "auto";
    audio.loop = false;
    audio.volume = 1.0;
    if (isWolf) activeWolfHitAudio = audio;
    else activeBoarHitAudio = audio;
    audio.play().catch(() => {});
  }

  function playWolfHitSound() { playInterruptibleAnimalHitSound("wolf"); }
  function playBoarHitSound() { playInterruptibleAnimalHitSound("boar"); }

  function rabbitAttackDirection() {
    if (attackSequence === ATTACK_DOWN || attackSequence === CLUB_ATTACK_DOWN) return "down";
    if (attackSequence === ATTACK_LEFT || attackSequence === CLUB_ATTACK_LEFT) return "left";
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

  function createRabbitDamageText(actor, amount, critical, saustark = false) {
    const popup = document.createElement("div");
    popup.className =
      "rabbit-damage" +
      (critical && !saustark ? " rabbit-damage--crit" : "") +
      (saustark ? " rabbit-damage--saustark" : "");
    popup.style.left = `${actor.x}px`;
    popup.style.top = `${actor.y - 215}px`;

    if (saustark) {
      const value = document.createElement("span");
      value.className = "rabbit-damage__value";
      value.textContent = `-${amount}`;

      const special = document.createElement("span");
      special.className = "rabbit-damage__saustark";
      special.textContent = "SAUSTARK";

      popup.append(value, special);
    } else if (critical) {
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

    if (actor.tierbannSummon) {
      tierbannRabbitFleeFromPlayer(actor, now);
      return;
    }

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

  function rollRabbitLoot() {
    const drops = [];
    if (Math.random() < RABBIT_LOOT_CONFIG.carrotChance) drops.push(CARROT_ITEM);
    if (Math.random() < RABBIT_LOOT_CONFIG.rabbitFootChance) drops.push(RABBIT_FOOT_ITEM);
    return drops;
  }

  function rollWolfLoot() {
    const drops = [];
    if (Math.random() < WOLF_LOOT_CONFIG.peltChance) drops.push(WOLF_PELT_ITEM);
    if (Math.random() < WOLF_LOOT_CONFIG.clawChance) drops.push(WOLF_CLAW_ITEM);
    if (Math.random() < WOLF_LOOT_CONFIG.bagChance) drops.push(WANDERER_BAG_ITEM);
    return drops;
  }

  function rollBoarLoot() {
    const drops = [];
    if (Math.random() < BOAR_LOOT_CONFIG.radishChance) drops.push(RADISH_ITEM);
    if (Math.random() < BOAR_LOOT_CONFIG.cabbageChance) drops.push(CABBAGE_ITEM);
    if (Math.random() < BOAR_LOOT_CONFIG.lettuceChance) drops.push(LETTUCE_ITEM);
    if (Math.random() < BOAR_LOOT_CONFIG.tuskChance) drops.push(BOAR_TUSK_ITEM);
    return drops;
  }

  function spawnRabbitLoot(item, x, y, mapId = MAP.id, offsetIndex = 0) {
    const element = document.createElement("div");
    element.className = "rabbit-loot-drop";
    element.dataset.mapId = mapId;
    element.dataset.itemId = item.id;
    element.title = item.name;

    const spread = offsetIndex === 0 ? 0 : (offsetIndex % 2 ? 85 : -85);
    const dropX = x + spread;
    const dropY = y - (offsetIndex > 1 ? 55 : 0);
    element.style.left = `${dropX}px`;
    element.style.top = `${dropY}px`;

    const icon = document.createElement("img");
    icon.className = "rabbit-loot-drop__icon";
    icon.src = encodeURI(item.icon);
    icon.alt = "";
    icon.draggable = false;
    element.appendChild(icon);
    world.appendChild(element);

    rabbitLootDrops.push({ element, item, x: dropX, y: dropY, mapId, collected: false });
    element.style.display = mapId === MAP.id ? "" : "none";
  }

  function showRabbitLootPlusOne(item) {
    const popup = document.createElement("div");
    popup.className = "black-penny-plus";
    popup.style.left = `${playerX}px`;
    popup.style.top = `${playerY - 360}px`;

    const icon = document.createElement("img");
    icon.src = encodeURI(item.icon);
    icon.alt = "";
    icon.style.width = "92px";
    icon.style.height = "92px";
    icon.style.objectFit = "contain";
    icon.style.verticalAlign = "middle";
    icon.style.marginRight = "18px";

    const value = document.createElement("span");
    value.textContent = "+1";
    popup.append(icon, value);
    world.appendChild(popup);
    window.setTimeout(() => popup.remove(), 1160);
  }

  function collectRabbitLoot() {
    let nearest = null;
    let nearestDistance = Infinity;
    for (const drop of rabbitLootDrops) {
      if (drop.collected || drop.mapId !== MAP.id) continue;
      const distance = Math.hypot(drop.x - playerX, drop.y - playerY);
      if (distance <= RABBIT_LOOT_CONFIG.pickupRadius && distance < nearestDistance) {
        nearest = drop;
        nearestDistance = distance;
      }
    }
    if (!nearest) return false;
    if (!addItemToInventory(nearest.item)) return false;

    nearest.collected = true;
    nearest.element.classList.add("rabbit-loot-drop--pickup");
    showRabbitLootPlusOne(nearest.item);
    window.setTimeout(() => {
      nearest.element.remove();
      rabbitLootDrops = rabbitLootDrops.filter((drop) => drop !== nearest);
    }, 390);
    return true;
  }

  function updateRabbitLootVisibility() {
    for (const drop of rabbitLootDrops) {
      drop.element.style.display = drop.mapId === MAP.id ? "" : "none";
    }
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

    // Keep existing respawn timing. Loot roll happens exactly once on death,
    // but the loot is not shown until the corpse has fully faded away.
    actor.pendingLoot = rollRabbitLoot();
    actor.lootSpawned = false;
    actor.fadeStarted = false;
    actor.respawnAt = now + 6500 + Math.random() * 5000;
    actor.fadeAt = actor.respawnAt - RABBIT_LOOT_CONFIG.fadeDuration;
  }

  function respawnRabbit(actor, now) {
    // Corpse fade is complete now: reveal any rolled loot at the exact death position.
    if (!actor.lootSpawned && actor.pendingLoot && actor.pendingLoot.length) {
      actor.pendingLoot.forEach((item, index) =>
        spawnRabbitLoot(item, actor.x, actor.y, actor.zone.mapId || "oberkirch-zentrum", index)
      );
      actor.lootSpawned = true;
    }

    // R67 Tierbann summons do not create an infinite respawn population.
    // They behave normally until killed, drop normal rabbit loot, then are gone.
    if (actor.noRespawn) {
      actor.element.remove();
      rabbitActors = rabbitActors.filter((entry) => entry !== actor);
      return;
    }

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
    actor.fadeAt = 0;
    actor.fadeStarted = false;
    actor.pendingLoot = [];
    actor.lootSpawned = false;

    actor.element.classList.remove(
      "map-rabbit--dead",
      "map-rabbit--away",
      "map-rabbit--critical-hit",
      "map-rabbit--loot-fading"
    );

    actor.element.style.left = `${actor.x}px`;
    actor.element.style.top = `${actor.y}px`;
    rabbitPickFrame(actor, false);
  }

  function damageRabbit(actor, amount, critical, direction, now, saustark = false) {
    if (actor.dead || actor.away) return;

    actor.hp = Math.max(0, actor.hp - amount);

    createRabbitDamageText(actor, amount, critical, saustark);
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

  // ------------------------------------------------------------------
  // R63 LARGE ANIMAL COMBAT — WOLF + WILDSCHWEIN
  // Same player damage table / same directional strike geometry as rabbits.
  // ------------------------------------------------------------------
  function largeAnimalCriticalKnockback(actor, direction, cssClass) {
    actor.element.classList.add(cssClass);

    let knockX = 0;
    let knockY = -45;
    if (direction === "right") knockX = 190;
    else if (direction === "left") knockX = -190;
    else knockY = 185;

    actor.x += knockX;
    actor.y += knockY;
    actor.element.style.left = `${actor.x}px`;
    actor.element.style.top = `${actor.y}px`;

    window.setTimeout(() => actor.element.classList.remove(cssClass), 240);
  }

  function killWolf(actor, now) {
    if (!actor || actor.dead) return;
    actor.dead = true;
    actor.hp = 0;
    actor.moving = false;
    actor.exiting = false;
    actor.entering = false;
    actor.away = false;
    actor.howling = false;
    actor.pauseUntil = Infinity;
    actor.nextDecision = Infinity;
    actor.nextFrameAt = Infinity;
    actor.element.classList.remove("map-wolf--away");
    actor.element.classList.remove("map-wolf--death-fading");
    wolfShowStaticLayer(actor, 3);
    actor.pendingLoot = rollWolfLoot();
    actor.lootSpawned = false;
    actor.fadeStarted = false;
    actor.respawnAt = now + WOLF_CONFIG.deadDuration;
    actor.fadeAt = actor.respawnAt - WOLF_CONFIG.fadeDuration;
  }

  function respawnWolf(actor, now) {
    if (!actor.lootSpawned && actor.pendingLoot && actor.pendingLoot.length) {
      actor.pendingLoot.forEach((item, i) => spawnRabbitLoot(item, actor.x, actor.y, actor.mapId, i));
    }
    actor.lootSpawned = true;
    actor.pendingLoot = [];

    if (actor.noRespawn) {
      actor.element.remove();
      wolfActors = wolfActors.filter((entry) => entry !== actor);
      return;
    }

    const start = wolfRandomPoint(180, actor.habitat, actor.mapId);
    actor.hp = WOLF_CONFIG.maxHp;
    actor.dead = false;
    actor.away = false;
    actor.exiting = false;
    actor.entering = false;
    actor.moving = false;
    actor.howling = false;
    actor.x = start.x;
    actor.y = start.y;
    actor.targetX = start.x;
    actor.targetY = start.y;
    actor.respawnAt = 0;
    actor.fadeAt = 0;
    actor.fadeStarted = false;
    actor.pauseUntil = now + 600 + Math.random() * 1600;
    actor.nextDecision = actor.pauseUntil;
    actor.nextFrameAt = now + WOLF_CONFIG.frameDuration;
    actor.frameIndex = 0;
    actor.element.classList.remove("map-wolf--death-fading", "map-wolf--critical-hit", "map-wolf--away");
    actor.element.style.left = `${actor.x}px`;
    actor.element.style.top = `${actor.y}px`;
    wolfShowStaticLayer(actor, 0);
  }

  function damageWolf(actor, amount, critical, direction, now, saustark = false) {
    if (!actor || actor.dead || actor.away) return;
    actor.hp = Math.max(0, actor.hp - amount);
    createRabbitDamageText(actor, amount, critical, saustark);
    playWolfHitSound();
    actor.moving = false;
    actor.howling = false;
    if (critical) {
      createRabbitDust(actor);
      largeAnimalCriticalKnockback(actor, direction, "map-wolf--critical-hit");
    }
    if (actor.hp <= 0) killWolf(actor, now);
    else {
      actor.pauseUntil = now + 250;
      actor.nextDecision = now + 250;
    }
  }

  function resolveWolfAttackFrame(frame) {
    if (!frame || !frame.hit) return;
    const direction = rabbitAttackDirection();
    const now = performance.now();
    for (const actor of wolfActors) {
      if (actor.mapId !== MAP.id || actor.dead || actor.away || !actor.ready) continue;
      if (!rabbitInsideAttackHitbox(actor, direction)) continue;
      damageWolf(actor, frame.damage || 20, Boolean(frame.critical), direction, now, Boolean(frame.saustark));
    }
  }

  function killBoar(actor, now) {
    if (!actor || actor.dead) return;
    actor.dead = true;
    actor.hp = 0;
    actor.moving = false;
    actor.exiting = false;
    actor.entering = false;
    actor.away = false;
    actor.pauseUntil = Infinity;
    actor.moveEndAt = 0;
    actor.element.classList.remove("map-boar--away");
    actor.element.classList.remove("map-boar--death-fading");
    boarShowLayer(actor, 2);
    actor.pendingLoot = rollBoarLoot();
    actor.lootSpawned = false;
    actor.fadeStarted = false;
    actor.respawnAt = now + BOAR_CONFIG.deadDuration;
    actor.fadeAt = actor.respawnAt - BOAR_CONFIG.fadeDuration;
  }

  function respawnBoar(actor, now) {
    if (!actor.lootSpawned && actor.pendingLoot && actor.pendingLoot.length) {
      const mapId = actor.zone.mapId || BOAR_CONFIG.mapId;
      actor.pendingLoot.forEach((item, i) => spawnRabbitLoot(item, actor.x, actor.y, mapId, i));
    }
    actor.lootSpawned = true;
    actor.pendingLoot = [];

    if (actor.noRespawn) {
      actor.element.remove();
      boarActors = boarActors.filter((entry) => entry !== actor);
      return;
    }

    const start = boarRandomPoint(actor.zone, 130);
    actor.hp = BOAR_CONFIG.maxHp;
    actor.dead = false;
    actor.away = false;
    actor.exiting = false;
    actor.entering = false;
    actor.moving = false;
    actor.x = start.x;
    actor.y = start.y;
    actor.targetX = start.x;
    actor.targetY = start.y;
    actor.respawnAt = 0;
    actor.fadeAt = 0;
    actor.fadeStarted = false;
    actor.pauseUntil = now + 700 + Math.random() * 1800;
    actor.moveEndAt = 0;
    actor.element.classList.remove("map-boar--death-fading", "map-boar--critical-hit", "map-boar--away");
    actor.element.style.left = `${actor.x}px`;
    actor.element.style.top = `${actor.y}px`;
    boarShowLayer(actor, 0);
  }

  function damageBoar(actor, amount, critical, direction, now, saustark = false) {
    if (!actor || actor.dead || actor.away) return;
    actor.hp = Math.max(0, actor.hp - amount);
    createRabbitDamageText(actor, amount, critical, saustark);
    playBoarHitSound();
    actor.moving = false;
    if (critical) {
      createRabbitDust(actor);
      largeAnimalCriticalKnockback(actor, direction, "map-boar--critical-hit");
    }
    if (actor.hp <= 0) killBoar(actor, now);
    else boarStartPause(actor, now);
  }

  function resolveBoarAttackFrame(frame) {
    if (!frame || !frame.hit) return;
    const direction = rabbitAttackDirection();
    const now = performance.now();
    for (const actor of boarActors) {
      const actorMapId = actor.zone.mapId || BOAR_CONFIG.mapId;
      if (actorMapId !== MAP.id || actor.dead || actor.away || !actor.ready) continue;
      if (!rabbitInsideAttackHitbox(actor, direction)) continue;
      damageBoar(actor, frame.damage || 20, Boolean(frame.critical), direction, now, Boolean(frame.saustark));
    }
  }

  function resolveRabbitAttackFrame(frame) {
    if (!frame || !frame.hit) return;

    const direction = rabbitAttackDirection();
    const now = performance.now();

    for (const actor of rabbitActors) {
      const actorMapId = actor.zone.mapId || "oberkirch-zentrum";
      if (actorMapId !== MAP.id) continue;

      if (rabbitInsideAttackHitbox(actor, direction)) {
        damageRabbit(
          actor,
          frame.damage || 20,
          Boolean(frame.critical),
          direction,
          now,
          Boolean(frame.saustark)
        );
      }
    }
  }

  function createRabbitActor(zone, index, options = {}) {
    const start = options.start || rabbitRandomPoint(zone, 150);

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
      fadeAt: 0,
      fadeStarted: false,
      pendingLoot: [],
      lootSpawned: false,

      pauseUntil: performance.now() + 500 + Math.random() * 2000,
      nextDecision: performance.now() + 1000 + Math.random() * 3000,
      nextFrameChange: performance.now() + 350 + Math.random() * 1000,
      returnAt: 0,

      // R67 optional event metadata; normal rabbits keep all values false.
      tierbannSummon: Boolean(options.tierbannSummon),
      noRespawn: Boolean(options.noRespawn),
      tierbannMode: options.tierbannSummon ? "escape" : null,
      tierbannEscapeAngle: 0,
      tierbannEscapeUntil: 0
    };

    element.style.left = `${actor.x}px`;
    element.style.top = `${actor.y}px`;
    element.style.setProperty("--rabbit-facing", actor.facing);
    element.style.display = (zone.mapId || "oberkirch-zentrum") === MAP.id ? "" : "none";

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
      const actorMapId = actor.zone.mapId || "oberkirch-zentrum";
      const activeOnMap = actorMapId === MAP.id;
      actor.element.style.display = activeOnMap ? "" : "none";
      if (!activeOnMap) continue;

      if (actor.dead) {
        if (!actor.fadeStarted && actor.fadeAt && now >= actor.fadeAt) {
          actor.fadeStarted = true;
          actor.element.classList.add("map-rabbit--loot-fading");
        }
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

      if (actor.tierbannSummon) {
        updateTierbannRabbit(actor, deltaSeconds, now);
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
  // R67 TIERBANNSTEIN LEVEL 1
  // ONLY MAP 2 WINTERBACH + MAP 3 LAUTENBACH
  // Independent 2-minute / 25% spawn checks per map.
  // ------------------------------------------------------------------
  const TIERBANNSTEIN_CONFIG = Object.freeze({
    image: "assets/events/TIERBANNSTEIN LEVEL 1.png",
    maxHp: 2000,
    checkInterval: 120000,
    spawnChance: 0.25,

    // Tall world-size container. The supplied transparent stone artwork
    // is bottom-centered so its ground anchor stays fixed.
    width: 650,
    height: 900,

    // About a small visual drop from above before impact.
    landingDrop: 185,
    landingDuration: 720,

    // Enemy summons appear clearly away from the stone/player.
    enemyRadiusMin: 900,
    enemyRadiusMax: 1450,

    maps: Object.freeze({
      "winterbach-ranglehen": Object.freeze({
        // Exact blue-circle centers converted from the supplied MAP 2 screenshot
        // using the map's own 10000 x 6006 coordinate system.
        spawns: Object.freeze([
          Object.freeze({ x: 2502, y: 656 }),
          Object.freeze({ x: 8368, y: 1349 }),
          Object.freeze({ x: 4274, y: 2097 }),
          Object.freeze({ x: 2085, y: 2666 }),
          Object.freeze({ x: 4781, y: 3530 }),
          Object.freeze({ x: 3121, y: 4169 })
        ])
      }),
      "lautenbach": Object.freeze({
        // Exact blue-circle centers converted from the supplied MAP 3 screenshot
        // using the map's own 10000 x 6656 coordinate system.
        spawns: Object.freeze([
          Object.freeze({ x: 8822, y: 1026 }),
          Object.freeze({ x: 8599, y: 2412 }),
          Object.freeze({ x: 8614, y: 5049 })
        ])
      })
    }),

    thresholds: Object.freeze([
      Object.freeze({ hp: 1900, type: "rabbit", count: 10 }),
      Object.freeze({ hp: 1700, type: "boar",   count: 1  }),
      Object.freeze({ hp: 1500, type: "rabbit", count: 10 }),
      Object.freeze({ hp: 1300, type: "boar",   count: 3  }),
      Object.freeze({ hp: 1000, type: "rabbit", count: 10 }),
      Object.freeze({ hp: 800,  type: "boar",   count: 3  }),
      Object.freeze({ hp: 500,  type: "rabbit", count: 15 }),
      Object.freeze({ hp: 300,  type: "boar",   count: 2  }),
      Object.freeze({ hp: 100,  type: "wolf",   count: 1  })
    ])
  });

  let tierbannSteine = [];
  const tierbannMapTimers = new Map();

  function installTierbannsteinStyles() {
    if (document.getElementById("tierbannsteinStyles")) return;

    const style = document.createElement("style");
    style.id = "tierbannsteinStyles";
    style.textContent = `
      .tierbannstein {
        position: absolute;
        z-index: 6;
        width: ${TIERBANNSTEIN_CONFIG.width}px;
        height: ${TIERBANNSTEIN_CONFIG.height}px;
        transform: translate(-50%, -100%);
        transform-origin: 50% 100%;
        pointer-events: none;
        user-select: none;
        opacity: 1;
        will-change: left, top, opacity, transform;
      }

      .tierbannstein__body {
        position: absolute;
        inset: 0;
        transform-origin: 50% 100%;
        will-change: transform;
      }

      .tierbannstein__sprite {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: 50% 100%;
        filter: drop-shadow(0 16px 8px rgba(0,0,0,.34));
        -webkit-user-drag: none;
      }

      .tierbannstein--landing .tierbannstein__body {
        animation: tierbannsteinLanding ${TIERBANNSTEIN_CONFIG.landingDuration}ms
          cubic-bezier(.19,.82,.2,1) both;
      }

      /* Every ordinary hit gives one short rigid-rock wobble. */
      .tierbannstein__body--hit {
        animation: tierbannsteinHit 185ms ease-out both;
      }

      .tierbannstein--destroying {
        animation: tierbannsteinDestroy 520ms ease-out forwards;
      }

      @keyframes tierbannsteinLanding {
        0%   { transform: translateY(-${TIERBANNSTEIN_CONFIG.landingDrop}px) rotate(0deg); }
        49%  { transform: translateY(-8px) rotate(0deg); }
        58%  { transform: translateY(0) rotate(-4.2deg); }
        68%  { transform: translateY(0) rotate(4deg); }
        78%  { transform: translateY(0) rotate(-2.8deg); }
        88%  { transform: translateY(0) rotate(2.1deg); }
        100% { transform: translateY(0) rotate(0deg); }
      }

      @keyframes tierbannsteinHit {
        0%   { transform: rotate(0deg); }
        22%  { transform: rotate(-2.7deg); }
        47%  { transform: rotate(2.5deg); }
        72%  { transform: rotate(-1.5deg); }
        100% { transform: rotate(0deg); }
      }

      @keyframes tierbannsteinDestroy {
        0%   { opacity: 1; transform: translate(-50%, -100%) scale(1); }
        40%  { opacity: 1; transform: translate(-50%, -100%) scale(.96); }
        100% { opacity: 0; transform: translate(-50%, -100%) scale(.74); }
      }

      .tierbannstein-impact-dust {
        position: absolute;
        z-index: 5;
        width: 780px;
        height: 250px;
        transform: translate(-50%, -50%);
        pointer-events: none;
        opacity: 0;
        animation: tierbannsteinDust 900ms ease-out forwards;
      }

      .tierbannstein-impact-dust::before,
      .tierbannstein-impact-dust::after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 0;
        width: 310px;
        height: 135px;
        border-radius: 50%;
        background:
          radial-gradient(ellipse at center,
            rgba(205,190,162,.88) 0%,
            rgba(169,145,111,.68) 38%,
            rgba(120,97,69,0) 77%);
        filter: blur(7px);
      }

      .tierbannstein-impact-dust::before {
        transform: translateX(-285px) scale(1.4);
      }

      .tierbannstein-impact-dust::after {
        transform: translateX(-25px) scale(1.7);
      }

      @keyframes tierbannsteinDust {
        0%   { opacity: 0; transform: translate(-50%, -30%) scale(.4); }
        15%  { opacity: 1; transform: translate(-50%, -42%) scale(.95); }
        100% { opacity: 0; transform: translate(-50%, -82%) scale(1.75); }
      }

      @media (prefers-reduced-motion: reduce) {
        .tierbannstein--landing .tierbannstein__body,
        .tierbannstein__body--hit,
        .tierbannstein--destroying,
        .tierbannstein-impact-dust {
          animation-duration: 1ms !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function tierbannMapDimensions(mapId) {
    if (mapId === "winterbach-ranglehen") return { width: 10000, height: 6006 };
    return { width: 10000, height: 6656 };
  }

  function tierbannOpenRabbitZone(mapId) {
    const d = tierbannMapDimensions(mapId);
    return {
      id: `tierbann-rabbit-${mapId}-${Math.random().toString(36).slice(2)}`,
      mapId,
      polygon: [
        [240, 650],
        [d.width - 240, 650],
        [d.width - 240, d.height - 160],
        [240, d.height - 160]
      ],
      exits: [],
      count: 0,
      tierbannFreeRoam: true
    };
  }

  function tierbannOpenBoarZone(mapId) {
    const d = tierbannMapDimensions(mapId);
    return {
      id: `tierbann-boar-${mapId}-${Math.random().toString(36).slice(2)}`,
      mapId,
      polygon: [
        [650, 700],
        [d.width - 650, 700],
        [d.width - 650, d.height - 300],
        [650, d.height - 300]
      ],
      exits: [],
      count: 0,
      tierbannFreeRoam: true
    };
  }

  function tierbannOpenWolfHabitat(mapId) {
    const d = tierbannMapDimensions(mapId);
    return {
      mapId,
      count: 0,
      canExitTop: false,
      cx: d.width / 2,
      cy: d.height / 2,
      rx: d.width / 2 - 500,
      ry: d.height / 2 - 500,
      tierbannFreeRoam: true
    };
  }

  function tierbannPointAllowed(x, y) {
    // Reuse the game's existing hard landscape/river/building collision.
    // Tierbann summons are only updated on their active map, therefore MAP is correct.
    return canMoveFootTo(x, y);
  }

  function tierbannStepWithCollision(actor, vx, vy, amount) {
    const len = Math.hypot(vx, vy) || 1;
    const nx = vx / len;
    const ny = vy / len;

    let moved = false;
    const nextX = actor.x + nx * amount;
    if (tierbannPointAllowed(nextX, actor.y)) {
      actor.x = nextX;
      moved = true;
    }

    const nextY = actor.y + ny * amount;
    if (tierbannPointAllowed(actor.x, nextY)) {
      actor.y = nextY;
      moved = true;
    }

    actor.element.style.left = `${actor.x}px`;
    actor.element.style.top = `${actor.y}px`;
    return moved;
  }

  function createTierbannImpactDust(x, y) {
    const dust = document.createElement("div");
    dust.className = "tierbannstein-impact-dust";
    dust.style.left = `${x}px`;
    dust.style.top = `${y + 30}px`;
    world.appendChild(dust);
    window.setTimeout(() => dust.remove(), 980);
  }

  function tierbannStoneWobble(stone) {
    if (!stone || stone.dead) return;
    const body = stone.body;
    body.classList.remove("tierbannstein__body--hit");
    void body.offsetWidth;
    body.classList.add("tierbannstein__body--hit");
    window.setTimeout(() => {
      if (body) body.classList.remove("tierbannstein__body--hit");
    }, 210);
  }

  function spawnTierbannstein(mapId, spawnIndex, now) {
    const mapConfig = TIERBANNSTEIN_CONFIG.maps[mapId];
    if (!mapConfig) return null;

    // Hard occupancy guarantee: NEVER put a second stone on the same blue point.
    if (
      tierbannSteine.some(
        (stone) =>
          !stone.removed &&
          stone.mapId === mapId &&
          stone.spawnIndex === spawnIndex
      )
    ) {
      return null;
    }

    const point = mapConfig.spawns[spawnIndex];
    if (!point) return null;

    const element = document.createElement("div");
    element.className = "tierbannstein tierbannstein--landing";
    element.dataset.mapId = mapId;
    element.dataset.spawnIndex = String(spawnIndex);
    element.style.left = `${point.x}px`;
    element.style.top = `${point.y}px`;
    element.style.display = MAP.id === mapId ? "" : "none";

    const body = document.createElement("div");
    body.className = "tierbannstein__body";

    const image = document.createElement("img");
    image.className = "tierbannstein__sprite";
    image.src = encodeURI(TIERBANNSTEIN_CONFIG.image);
    image.alt = "";
    image.draggable = false;
    image.decoding = "async";

    body.appendChild(image);
    element.appendChild(body);
    world.appendChild(element);

    const stone = {
      element,
      body,
      image,
      mapId,
      spawnIndex,
      x: point.x,
      y: point.y,
      hp: TIERBANNSTEIN_CONFIG.maxHp,
      dead: false,
      removed: false,
      triggered: new Set()
    };

    tierbannSteine.push(stone);

    // Only show the impact effect when the player can actually see this map.
    if (MAP.id === mapId) {
      window.setTimeout(() => {
        if (!stone.removed && MAP.id === mapId) {
          createTierbannImpactDust(stone.x, stone.y);
        }
      }, 350);
    }

    window.setTimeout(() => {
      if (!stone.removed) element.classList.remove("tierbannstein--landing");
    }, TIERBANNSTEIN_CONFIG.landingDuration + 30);

    return stone;
  }

  function tryTierbannsteinMapSpawn(mapId, now) {
    const config = TIERBANNSTEIN_CONFIG.maps[mapId];
    if (!config) return;

    const free = [];
    for (let i = 0; i < config.spawns.length; i += 1) {
      const occupied = tierbannSteine.some(
        (stone) =>
          !stone.removed &&
          stone.mapId === mapId &&
          stone.spawnIndex === i
      );
      if (!occupied) free.push(i);
    }

    if (!free.length) return;
    if (Math.random() >= TIERBANNSTEIN_CONFIG.spawnChance) return;

    const spawnIndex = free[Math.floor(Math.random() * free.length)];
    spawnTierbannstein(mapId, spawnIndex, now);
  }

  function tierbannFindEnemySpawn(stone, ordinal, count) {
    const d = tierbannMapDimensions(stone.mapId);
    let best = null;
    let bestPlayerDistance = -Infinity;

    const evenlySpacedAngle =
      (Math.PI * 2 * ordinal) / Math.max(1, count) +
      Math.random() * 0.45;

    for (let attempt = 0; attempt < 90; attempt += 1) {
      const angle =
        attempt < 12
          ? evenlySpacedAngle + (Math.random() - 0.5) * 0.38
          : Math.random() * Math.PI * 2;

      const radius =
        TIERBANNSTEIN_CONFIG.enemyRadiusMin +
        Math.random() *
          (TIERBANNSTEIN_CONFIG.enemyRadiusMax -
           TIERBANNSTEIN_CONFIG.enemyRadiusMin);

      const x = stone.x + Math.cos(angle) * radius;
      const y = stone.y + Math.sin(angle) * radius;

      if (x < 650 || x > d.width - 650 || y < 700 || y > d.height - 250) {
        continue;
      }
      if (!tierbannPointAllowed(x, y)) continue;

      // Prefer the valid candidate furthest from the player so summons never
      // pop directly on top of the character.
      const playerDistance = Math.hypot(x - playerX, y - playerY);
      if (playerDistance > bestPlayerDistance) {
        bestPlayerDistance = playerDistance;
        best = { x, y };
      }

      if (playerDistance >= 1150 && attempt >= 8) break;
    }

    if (best) return best;

    // Conservative fallback on open ground near the stone.
    return {
      x: Math.max(650, Math.min(d.width - 650, stone.x + 1050)),
      y: Math.max(700, Math.min(d.height - 250, stone.y + 850))
    };
  }

  function spawnTierbannRabbits(stone, count, now) {
    const zone = tierbannOpenRabbitZone(stone.mapId);

    for (let i = 0; i < count; i += 1) {
      const angle =
        (Math.PI * 2 * i) / Math.max(1, count) +
        (Math.random() - 0.5) * 0.22;

      // They visibly originate at the stone, with only a tiny separation
      // so ten/fifteen sprites do not occupy one exact pixel.
      const start = {
        x: stone.x + Math.cos(angle) * (28 + Math.random() * 35),
        y: stone.y + Math.sin(angle) * (20 + Math.random() * 28)
      };

      const actor = createRabbitActor(zone, rabbitActors.length, {
        start,
        tierbannSummon: true,
        noRespawn: true
      });

      actor.tierbannMode = "escape";
      actor.tierbannEscapeAngle = angle;
      actor.tierbannEscapeUntil = now + 2400 + Math.random() * 1100;
      actor.speed = 410 + Math.random() * 125;
      actor.moving = true;
      actor.pauseUntil = 0;
      actor.nextDecision = 0;
      actor.element.classList.add("map-rabbit--moving");
      actor.facing = Math.cos(angle) < 0 ? -1 : 1;
      actor.element.style.setProperty("--rabbit-facing", actor.facing);

      rabbitActors.push(actor);
    }
  }

  function spawnTierbannBoars(stone, count, now) {
    const zone = tierbannOpenBoarZone(stone.mapId);

    for (let i = 0; i < count; i += 1) {
      const start = tierbannFindEnemySpawn(stone, i, count);
      const actor = createBoarActor(zone, boarActors.length, {
        start,
        tierbannSummon: true,
        tierbannAggressive: true,
        noRespawn: true
      });

      actor.tierbannAggressive = true;
      actor.tierbannSummon = true;
      actor.noRespawn = true;
      actor.speed = 285 + Math.random() * 55;
      actor.pauseUntil = 0;
      actor.moving = true;
      boarShowLayer(actor, 1);

      boarActors.push(actor);
    }
  }

  function spawnTierbannWolf(stone, now) {
    const start = tierbannFindEnemySpawn(stone, 0, 1);
    const habitat = tierbannOpenWolfHabitat(stone.mapId);

    const actor = createWolfActor(
      wolfActors.length,
      stone.mapId,
      habitat,
      false,
      {
        start,
        tierbannSummon: true,
        tierbannAggressive: true,
        noRespawn: true
      }
    );

    actor.tierbannAggressive = true;
    actor.tierbannSummon = true;
    actor.noRespawn = true;
    actor.speed = 315 + Math.random() * 55;
    actor.pauseUntil = 0;
    actor.nextDecision = 0;
    actor.moving = true;

    wolfActors.push(actor);
  }

  function triggerTierbannWave(stone, definition, now) {
    if (!stone || stone.dead || stone.triggered.has(definition.hp)) return;
    stone.triggered.add(definition.hp);

    if (definition.type === "rabbit") {
      spawnTierbannRabbits(stone, definition.count, now);
    } else if (definition.type === "boar") {
      spawnTierbannBoars(stone, definition.count, now);
    } else if (definition.type === "wolf") {
      spawnTierbannWolf(stone, now);
    }
  }

  function destroyTierbannstein(stone) {
    if (!stone || stone.dead) return;
    stone.dead = true;
    stone.hp = 0;

    createTierbannImpactDust(stone.x, stone.y);
    stone.element.classList.add("tierbannstein--destroying");

    window.setTimeout(() => {
      stone.removed = true;
      stone.element.remove();
      tierbannSteine = tierbannSteine.filter((entry) => entry !== stone);
      // Its blue spawn point is now immediately free for future checks.
    }, 540);
  }

  function damageTierbannstein(stone, amount, critical, now, saustark = false) {
    if (!stone || stone.dead || stone.removed) return;

    const oldHp = stone.hp;
    stone.hp = Math.max(0, stone.hp - amount);

    // Same damage readout and critical label as all current animals.
    createRabbitDamageText(stone, amount, critical, saustark);

    // The rock NEVER receives knockback. It only wobbles in place.
    tierbannStoneWobble(stone);

    if (critical) {
      createRabbitDust(stone);
    }

    for (const definition of TIERBANNSTEIN_CONFIG.thresholds) {
      if (
        oldHp > definition.hp &&
        stone.hp <= definition.hp &&
        !stone.triggered.has(definition.hp)
      ) {
        triggerTierbannWave(stone, definition, now);
      }
    }

    if (stone.hp <= 0) {
      destroyTierbannstein(stone);
    }
  }

  function resolveTierbannsteinAttackFrame(frame) {
    if (!frame || !frame.hit) return;

    const direction = rabbitAttackDirection();
    const now = performance.now();

    for (const stone of tierbannSteine) {
      if (stone.mapId !== MAP.id || stone.dead || stone.removed) continue;

      // Reuse the exact same player attack reach used by rabbits/wolves/boars.
      // Supply the minimal actor shape expected by rabbitInsideAttackHitbox().
      const target = {
        x: stone.x,
        y: stone.y,
        dead: false,
        away: false
      };

      if (!rabbitInsideAttackHitbox(target, direction)) continue;

      damageTierbannstein(
        stone,
        frame.damage || 20,
        Boolean(frame.critical),
        now,
        Boolean(frame.saustark)
      );
    }
  }

  function tierbannRabbitChooseRoam(actor, now) {
    const d = tierbannMapDimensions(actor.zone.mapId);

    for (let attempt = 0; attempt < 70; attempt += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 450 + Math.random() * 1150;
      const x = actor.x + Math.cos(angle) * radius;
      const y = actor.y + Math.sin(angle) * radius;

      if (x < 240 || x > d.width - 240 || y < 650 || y > d.height - 160) {
        continue;
      }
      if (!tierbannPointAllowed(x, y)) continue;

      actor.targetX = x;
      actor.targetY = y;
      actor.speed = 155 + Math.random() * 145;
      actor.moving = true;
      actor.pauseUntil = 0;
      actor.nextDecision = now + 1800 + Math.random() * 2800;
      actor.element.classList.add("map-rabbit--moving");

      const dx = x - actor.x;
      if (Math.abs(dx) > 12) {
        actor.facing = dx < 0 ? -1 : 1;
        actor.element.style.setProperty("--rabbit-facing", actor.facing);
      }
      return;
    }

    actor.moving = false;
    actor.pauseUntil = now + 450 + Math.random() * 900;
    actor.nextDecision = actor.pauseUntil;
    actor.element.classList.remove("map-rabbit--moving");
  }

  function tierbannRabbitFleeFromPlayer(actor, now) {
    const angle =
      Math.atan2(actor.y - playerY, actor.x - playerX) +
      (Math.random() - 0.5) * 0.5;

    actor.tierbannMode = "escape";
    actor.tierbannEscapeAngle = angle;
    actor.tierbannEscapeUntil = now + 1500 + Math.random() * 700;
    actor.speed = 380 + Math.random() * 100;
    actor.moving = true;
    actor.element.classList.add("map-rabbit--moving");
  }

  function updateTierbannRabbit(actor, deltaSeconds, now) {
    if (actor.dead || actor.away) return;

    if (now >= actor.nextFrameChange) rabbitPickFrame(actor);

    if (actor.tierbannMode === "escape") {
      if (now >= actor.tierbannEscapeUntil) {
        actor.tierbannMode = "roam";
        actor.moving = false;
        actor.element.classList.remove("map-rabbit--moving");
        actor.pauseUntil = now + 350 + Math.random() * 850;
        actor.nextDecision = actor.pauseUntil;
        return;
      }

      const angle = actor.tierbannEscapeAngle;
      const amount = actor.speed * deltaSeconds;
      const moved = tierbannStepWithCollision(
        actor,
        Math.cos(angle),
        Math.sin(angle),
        amount
      );

      // If terrain blocks the initial direction, fan away to a nearby open angle.
      if (!moved) {
        actor.tierbannEscapeAngle +=
          (Math.random() < 0.5 ? -1 : 1) * (0.55 + Math.random() * 0.65);
      }

      actor.facing = Math.cos(actor.tierbannEscapeAngle) < 0 ? -1 : 1;
      actor.element.style.setProperty("--rabbit-facing", actor.facing);
      return;
    }

    if (actor.moving) {
      const dx = actor.targetX - actor.x;
      const dy = actor.targetY - actor.y;
      const distance = Math.hypot(dx, dy);

      if (distance <= 14) {
        actor.moving = false;
        actor.element.classList.remove("map-rabbit--moving");
        actor.pauseUntil = now + 550 + Math.random() * 2100;
        actor.nextDecision = actor.pauseUntil;
        return;
      }

      const step = Math.min(distance, actor.speed * deltaSeconds);
      const moved = tierbannStepWithCollision(actor, dx, dy, step);
      if (!moved) {
        actor.moving = false;
        actor.element.classList.remove("map-rabbit--moving");
        actor.pauseUntil = now + 300 + Math.random() * 700;
        actor.nextDecision = actor.pauseUntil;
      }
      return;
    }

    if (now >= actor.pauseUntil && now >= actor.nextDecision) {
      tierbannRabbitChooseRoam(actor, now);
    }
  }

  function updateTierbannAggressiveBoar(actor, deltaSeconds, now) {
    if (actor.dead || actor.away) return;

    const dx = playerX - actor.x;
    const dy = playerY - actor.y;
    const distance = Math.hypot(dx, dy);

    if (Math.abs(dx) > 12) boarSetFacing(actor, dx < 0 ? -1 : 1);
    boarShowLayer(actor, 1);
    actor.moving = true;

    // Stop just short of the player's foot anchor; still actively tracks him.
    if (distance > 225) {
      tierbannStepWithCollision(actor, dx, dy, actor.speed * deltaSeconds);
    }
  }

  function updateTierbannAggressiveWolf(actor, deltaSeconds, now) {
    if (actor.dead || actor.away) return;

    actor.howling = false;

    const dx = playerX - actor.x;
    const dy = playerY - actor.y;
    const distance = Math.hypot(dx, dy);

    if (Math.abs(dx) > 12) {
      actor.facing = dx < 0 ? -1 : 1;
      actor.element.style.setProperty("--wolf-facing", actor.facing);
    }

    actor.moving = true;
    if (now >= actor.nextFrameAt) wolfPickWalkFrame(actor);

    if (distance > 225) {
      tierbannStepWithCollision(actor, dx, dy, actor.speed * deltaSeconds);
    }
  }

  function createTierbannsteinSystem() {
    installTierbannsteinStyles();

    const preload = new Image();
    preload.src = encodeURI(TIERBANNSTEIN_CONFIG.image);
    if (typeof preload.decode === "function") preload.decode().catch(() => {});

    tierbannSteine = [];
    const firstCheck = performance.now() + TIERBANNSTEIN_CONFIG.checkInterval;

    for (const mapId of Object.keys(TIERBANNSTEIN_CONFIG.maps)) {
      // Separate timer/state per map = fully independent 25% rolls.
      tierbannMapTimers.set(mapId, firstCheck);
    }
  }

  function updateTierbannsteine(deltaSeconds, now) {
    // Independent two-minute rolls for BOTH maps, even if one map is currently hidden.
    for (const mapId of Object.keys(TIERBANNSTEIN_CONFIG.maps)) {
      let nextCheck = tierbannMapTimers.get(mapId);
      if (!Number.isFinite(nextCheck)) {
        nextCheck = now + TIERBANNSTEIN_CONFIG.checkInterval;
      }

      while (now >= nextCheck) {
        tryTierbannsteinMapSpawn(mapId, now);
        nextCheck += TIERBANNSTEIN_CONFIG.checkInterval;
      }

      tierbannMapTimers.set(mapId, nextCheck);
    }

    for (const stone of tierbannSteine) {
      if (stone.removed) continue;
      stone.element.style.display = stone.mapId === MAP.id ? "" : "none";
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

  // R61 RABBIT LOOT — exact requested independent death rolls.
  // 5% carrot + 1% rabbit foot. Both can theoretically drop from the same rabbit.
  const CARROT_ITEM = Object.freeze({
    id: "carrot",
    name: "KAROTTE",
    description: "HASENLOOT",
    icon: "assets/items/KAROTTE.svg",
    stackable: true
  });

  const RABBIT_FOOT_ITEM = Object.freeze({
    id: "rabbit-foot",
    name: "HASENPFOTE",
    description: "SELTENER HASENLOOT",
    icon: "assets/items/HASENPFOTE.svg",
    stackable: true
  });

  const RABBIT_LOOT_CONFIG = Object.freeze({
    carrotChance: 0.05,
    rabbitFootChance: 0.01,
    fadeDuration: 420,
    pickupRadius: 820
  });

  // R65 WOLF + BOAR LOOT — independent death rolls, same pickup/inventory pipeline as rabbit loot.
  const WOLF_PELT_ITEM = Object.freeze({ id: "wolf-pelt", name: "WOLFSPELZ", description: "WOLFSLOOT", icon: "assets/items/WOLFSPELZ.svg", stackable: true });
  const WOLF_CLAW_ITEM = Object.freeze({ id: "wolf-claw", name: "WOLFSKRALLE", description: "SELTENER WOLFSLOOT", icon: "assets/items/WOLFSKRALLE.svg", stackable: true });
  const WANDERER_BAG_ITEM = Object.freeze({ id: "wanderer-bag", name: "SÄCKCHEN EINES WANDERERS", description: "SEHR SELTENER WOLFSLOOT", icon: "assets/items/SAECKCHEN EINES WANDERERS.svg", stackable: true });
  const RADISH_ITEM = Object.freeze({ id: "radish", name: "RETTICH", description: "KEILERLOOT", icon: "assets/items/RETTICH.svg", stackable: true });
  const CABBAGE_ITEM = Object.freeze({ id: "cabbage", name: "KOHL", description: "KEILERLOOT", icon: "assets/items/KOHL.svg", stackable: true });
  const LETTUCE_ITEM = Object.freeze({ id: "lettuce", name: "SALATKOPF", description: "KEILERLOOT", icon: "assets/items/SALATKOPF.svg", stackable: true });
  const BOAR_TUSK_ITEM = Object.freeze({ id: "boar-tusk", name: "KEILERSTOSSZAHN", description: "SELTENER KEILERLOOT", icon: "assets/items/KEILERSTOSSZAHN.svg", stackable: true });

  const PINK_PIG_CLUB_ITEM = Object.freeze({
    id: WEAPONS.pinkPigClub.id,
    name: WEAPONS.pinkPigClub.name,
    description: "PRIMITIVE HOLZKEULE · LEVEL 1–10",
    icon: WEAPONS.pinkPigClub.icon,
    stackable: false,
    width: WEAPONS.pinkPigClub.inventoryWidth,
    height: WEAPONS.pinkPigClub.inventoryHeight,
    type: "weapon",
    levelMin: WEAPONS.pinkPigClub.levelMin,
    levelMax: WEAPONS.pinkPigClub.levelMax
  });

  const WOLF_LOOT_CONFIG = Object.freeze({ peltChance: .05, clawChance: .02, bagChance: .01 });
  const BOAR_LOOT_CONFIG = Object.freeze({ radishChance: .20, cabbageChance: .10, lettuceChance: .05, tuskChance: .02 });

  let rabbitLootDrops = [];

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
    if (MAP.id === "winterbach-ranglehen") {
      // R16 BLUE CIRCLE, MAP 2 only.
      // Uniform random point inside the marked ellipse.
      const cx = 8420;
      const cy = 4020;
      const rx = 430;
      const ry = 360;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random());

      return {
        x: cx + Math.cos(angle) * rx * radius,
        y: cy + Math.sin(angle) * ry * radius
      };
    }

    if (MAP.id === "hubacker") {
      // R48: HUBACKER mole may spawn ONLY inside one of the two marked blue circles.
      // Choose a circle first, then distribute uniformly inside that circle.
      const circles = [
        { cx: 894, cy: 1766, rx: 176, ry: 178 },
        { cx: 5463, cy: 931, rx: 126, ry: 127 }
      ];
      const circle = circles[Math.floor(Math.random() * circles.length)];
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random());

      return {
        x: circle.cx + Math.cos(angle) * circle.rx * radius,
        y: circle.cy + Math.sin(angle) * circle.ry * radius
      };
    }

    // Preserve the original OBERKIRCH agricultural spawn behavior exactly.
    const oberkirchZones = RABBIT_ZONES.filter(
      (zone) => (zone.mapId || "oberkirch-zentrum") === "oberkirch-zentrum"
    );
    const zone =
      oberkirchZones[Math.floor(Math.random() * oberkirchZones.length)];

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
      mapId: MAP.id,
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

  function spawnBlackPenny(x, y, mapId = MAP.id) {
    const element = document.createElement("div");
    element.className = "black-penny-drop";
    element.dataset.mapId = mapId;
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
      mapId,
      collected: false
    });

    element.style.display = mapId === MAP.id ? "" : "none";
  }

  function removeMole(now, dropItem) {
    if (!moleEvent) return;

    const finished = moleEvent;
    finished.element.classList.add("map-mole--fading");

    if (dropItem) {
      spawnBlackPenny(finished.x, finished.y, finished.mapId || MAP.id);
    }

    window.setTimeout(() => {
      finished.element.remove();
    }, MOLE_CONFIG.fadeDuration + 30);

    moleEvent = null;
    scheduleNextMoleCheck(now);
  }

  function updateMole(now) {
    for (const drop of blackPennyDrops) {
      drop.element.style.display =
        (drop.mapId || "oberkirch-zentrum") === MAP.id ? "" : "none";
    }

    // R27 MINIFIX: MAP 3 LAUTENBACH never shows or spawns a mole.
    // Existing OBERKIRCH / WINTERBACH spawn fields and rules remain untouched.
    if (MAP.id === "lautenbach") {
      if (moleEvent) {
        moleEvent.element.style.display = "none";
      }
      return;
    }

    if (moleEvent) {
      const eventMapId = moleEvent.mapId || "oberkirch-zentrum";
      moleEvent.element.style.display = eventMapId === MAP.id ? "" : "none";
      if (eventMapId !== MAP.id) return;
    }

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
    if ((moleEvent.mapId || "oberkirch-zentrum") !== MAP.id) return;
    if (moleEvent.phase !== "exposed" || moleEvent.dead) return;

    const direction = rabbitAttackDirection();
    if (!moleInsideAttackHitbox(direction)) return;

    const amount = frame.damage || 20;
    const critical = Boolean(frame.critical);

    moleEvent.hp = Math.max(0, moleEvent.hp - amount);

    // Same damage popup and same hit sound as rabbits.
    createRabbitDamageText(moleEvent, amount, critical, Boolean(frame.saustark));
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
      if ((drop.mapId || "oberkirch-zentrum") !== MAP.id) continue;

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

    // R56 INVENTORY: never delete world loot if both inventory pages are full.
    if (!addItemToInventory(BLACK_PENNY_ITEM)) return;

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
    // Precisely follows the marked pink river banks from the supplied reference:
    // the player's FOOT anchor may not cross these banks; the covered bridge
    // corridor remains the only legal exception.
    Object.freeze([
      [4140, 1450], [4140, 2380], [4005, 2710], [5220, 2710],
      [5220, 2650], [5740, 2645], [6165, 2250], [5990, 1770], [5870, 1450]
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
    // FINAL: only the short straight bridge corridor is forced.
    // The road junctions inside the blue circles stay completely free.
    Object.freeze([3500, 1305]),
    Object.freeze([6020, 1305])
  ]);

  const BRIDGE_CONFIG = Object.freeze({
    stoneCorridor: 150,
    coveredCorridor: 72,
    engageDistance: 285,
    coveredFadeMs: 145,

    // FINAL R9: left invisibility starts exactly at the red vertical line.
    // The confirmed-perfect right boundary stays unchanged.
    coveredInterior: Object.freeze({
      x1: 3650,
      y1: 800,
      x2: 5790,
      y2: 1470
    }),

    // FINAL R9: capture zones exist only immediately before the bridge.
    // They no longer reach into either blue-circled road junction.
    coveredCaptureLeft: Object.freeze({
      x1: 3435, y1: 1080, x2: 3735, y2: 1535
    }),
    coveredCaptureRight: Object.freeze({
      x1: 5700, y1: 1080, x2: 6050, y2: 1535
    })
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

  // ------------------------------------------------------------------
  // R21 MAP 2 — WORLD COLLISION + ICE
  // ------------------------------------------------------------------
  const WINTERBACH_TERRAIN = Object.freeze({
    boundaryPadding: 16,
    blocked: Object.freeze([
      Object.freeze([[0,0],[915,0],[940,350],[1255,585],[1725,910],[1725,1125],[1495,1575],[1825,2160],[1825,2320],[1570,2825],[1220,3150],[1075,3585],[485,3865],[0,3970]]),
      Object.freeze([[6070,1840],[6480,1960],[6795,1860],[7020,2300],[7070,3020],[6875,3650],[6895,4410],[7040,5000],[7000,6006],[6180,6006],[6035,5480],[6100,4650],[5980,4020],[6025,3260],[5860,2670]])
    ]),
    ice: Object.freeze([
      Object.freeze([[5725,0],[6570,0],[6635,380],[6815,645],[6720,950],[6810,1240],[6725,1710],[6500,1910],[6070,1840],[5970,1450],[5850,1080],[5740,780],[5710,430]])
    ])
  });

  const ICE_PHYSICS = Object.freeze({
    // R23: ice speed = exactly 2x normal PLAYER speed.
    acceleration: 5200,
    maxSpeed: PLAYER.speed * 2,
    dragMoving: 0.985,
    dragNoInput: 0.975,
    minSpeed: 14,
    swayAngle: 4.6,
    swayX: 8
  });

  // ------------------------------------------------------------------
  // R28 MAP 3 — LAUTENBACH TERRAIN / ICE / HILLSIDE PATH
  // RED = blocked for player + ambient animals.
  // BLUE = same ice physics as WINTERBACH.
  // WHITE dashed line = forced hillside route.
  // ------------------------------------------------------------------
  const LAUTENBACH_TERRAIN = Object.freeze({
    boundaryPadding: 18,
    blocked: Object.freeze([
      Object.freeze([
        [0,0],[980,0],[1080,470],[1410,820],[1480,1260],[1260,1640],
        [1450,2140],[1320,2600],[1510,3020],[1360,3480],[1480,3990],
        [1220,4520],[1050,5230],[760,5630],[0,5630]
      ]),
      Object.freeze([
        [1030,0],[1750,0],[1870,430],[2060,750],[2050,1230],[1870,1600],
        [2190,2070],[2170,2450],[1960,2790],[2300,3230],[2370,3630],
        [2240,4090],[1960,4420],[1880,4890],[1670,5330],[1450,5330],
        [1460,4620],[1650,4210],[1630,3680],[1750,3270],[1600,2820],
        [1730,2320],[1580,1860],[1690,1360],[1510,900]
      ]),
      Object.freeze([
        [1820,0],[2620,0],[2630,590],[2470,1000],[2510,1430],[2380,1810],
        [2570,2220],[2550,2670],[2700,3140],[2700,3550],[2470,3740],
        [2240,3500],[2160,3050],[2040,2650],[2150,2200],[2010,1780],
        [2130,1290],[2010,820]
      ]),
      Object.freeze([
        [6500,0],[7270,0],[7350,620],[7190,900],[7420,1210],[7430,1840],
        [7350,2450],[7310,3080],[7220,3730],[7290,4250],[7180,4620],
        [6590,4620],[6500,4190],[6490,3670],[6550,3120],[6470,2610],
        [6500,2070],[6420,1500],[6460,900]
      ])
    ]),
    ice: Object.freeze([
      Object.freeze([
        [6587,4612],[7317,4637],[7358,6656],[5693,6656],
        [5710,6016],[6079,5326],[6481,4900]
      ])
    ]),
    hillPath: Object.freeze([
      [361,0],[574,369],[812,796],[1107,1190],[1058,1559],[1255,1871],
      [1526,2109],[1698,2479],[1870,2905],[1936,3349],[2108,3513],
      [2428,3611],[2863,3800]
    ]),
    hillSnapDistance: 330,
    hillTravelSpeed: PLAYER.speed * 0.92,

    // R29: narrow lower-left PLAYER passage to the rabbit side.
    // This is a player-only exception; animals still treat the red terrain as blocked.
    playerPassages: Object.freeze([
      Object.freeze([
        [620, 4920],
        [1325, 4920],
        [1325, 5355],
        [620, 5355]
      ])
    ])
  });

  let activeLautenbachHillPath = false;
  let lautenbachHillDistance = 0;
  let lautenbachHillSnapping = false;

  // ------------------------------------------------------------------
  // R40 MAP 4 — HUBACKER TERRAIN / RED RIVER / PURPLE PLATEAUS
  // Coordinates are mapped directly from the supplied R31 overlay.
  // Only the player's FOOT anchor is tested.
  // ------------------------------------------------------------------
  const HUBACKER_TERRAIN = Object.freeze({
    boundaryPadding: 18,

    // RED painted river: completely non-walkable.
    // The bridge itself is handled separately by the forced A/D snap.
    riverBlocked: Object.freeze([
      Object.freeze([
        [4533,4],[4782,1030],[4642,1789],[4770,3177],
        [4640,4012],[5428,4030],[5291,2529],[5367,4]
      ]),
      Object.freeze([
        [5493,4475],[4472,4485],[4601,4819],
        [4526,5496],[3967,6834],[4915,6834]
      ])
    ]),

    // PURPLE marked regions: inaccessible plateaus/terrain.
    blockedEllipses: Object.freeze([
      Object.freeze({ cx: 2676, cy: 2007, rx: 1298, ry: 1041 }),
      Object.freeze({ cx: 8139, cy: 2472, rx: 2646, ry: 2473 })
    ]),

    // The visible bridge gap may not be free-walked.
    // Only HUBACKER_WOOD_BRIDGE snap movement may cross it.
    bridgeLockedZone: Object.freeze({
      x1: 4440, y1: 4050, x2: 5585, y2: 4465
    }),

    // WHITE curved line beside the river.
    // Stored TOP -> BOTTOM: W moves toward index 0, S moves downward.
    cliffPath: Object.freeze([
      Object.freeze([5505,1020]),
      Object.freeze([5468,1298]),
      Object.freeze([5449,1622]),
      Object.freeze([5430,1946]),
      Object.freeze([5430,2270]),
      Object.freeze([5458,2594]),
      Object.freeze([5513,2918]),
      Object.freeze([5568,3242]),
      Object.freeze([5624,3566]),
      Object.freeze([5661,3752])
    ]),
    cliffSnapDistance: 175,
    cliffTravelSpeed: PLAYER.speed * 0.92,

    // R47 NEUENSTEIN: two additional WHITE W/S-only snap routes from the supplied map overlay.
    // Both are stored TOP -> BOTTOM. W moves toward index 0; S moves toward the last point.
    neuensteinRuinPath: Object.freeze([
      // R49 exact new WHITE line from the supplied markup.
      // TOP -> BOTTOM; visibly shifted left from the previous path.
      Object.freeze([2635, 1650]),
      Object.freeze([2632, 1925]),
      Object.freeze([2629, 2200]),
      Object.freeze([2626, 2475]),
      Object.freeze([2623, 2750]),
      Object.freeze([2620, 3035])
    ]),

    neuensteinCastlePath: Object.freeze([
      // R49 exact new WHITE line through both Neuenstein gates/courtyards.
      // TOP -> BOTTOM; shifted left onto the marked central stair/door axis.
      Object.freeze([8085, 2000]),
      Object.freeze([8080, 2350]),
      Object.freeze([8076, 2700]),
      Object.freeze([8072, 3050]),
      Object.freeze([8068, 3400]),
      Object.freeze([8064, 3750]),
      Object.freeze([8060, 4100]),
      Object.freeze([8056, 4500]),
      Object.freeze([8052, 4905])
    ]),

    neuensteinSnapDistance: 185,
    neuensteinTravelSpeed: PLAYER.speed * 0.92
  });

  let activeHubackerCliffPath = false;
  let hubackerCliffDistance = 0;
  let hubackerCliffSnapping = false;
  let hubackerCliffReleaseUntil = 0;

  // R47: independent Neuenstein W/S snap state.
  // Existing Hubacker river/cliff snap remains completely untouched.
  let activeNeuensteinSnap = null; // "ruin" | "castle" | null
  let neuensteinSnapDistance = 0;
  let neuensteinSnapping = false;
  let neuensteinReleaseUntil = 0;

  function pointInsideHubackerEllipse(x, y, ellipse) {
    const dx = (x - ellipse.cx) / ellipse.rx;
    const dy = (y - ellipse.cy) / ellipse.ry;
    return dx * dx + dy * dy <= 1;
  }

  function isHubackerBlockedFootPoint(x, y) {
    if (MAP.id !== "hubacker") return false;

    for (const polygon of HUBACKER_TERRAIN.riverBlocked) {
      if (
        worldPointInPolygon(x, y, polygon) ||
        pointNearPolygonBoundaryR21(
          x, y, polygon, HUBACKER_TERRAIN.boundaryPadding
        )
      ) {
        return true;
      }
    }

    for (const ellipse of HUBACKER_TERRAIN.blockedEllipses) {
      if (pointInsideHubackerEllipse(x, y, ellipse)) return true;
    }

    // The bridge deck/gap is NEVER freely walkable.
    // Crossing is possible only while the existing bridge snap owns movement.
    const b = HUBACKER_TERRAIN.bridgeLockedZone;
    if (
      x >= b.x1 && x <= b.x2 &&
      y >= b.y1 && y <= b.y2 &&
      !(activeBridge && activeBridge.id === "hubacker-wood")
    ) {
      return true;
    }

    return false;
  }

  function hubackerCliffPathMetrics() {
    return getPathMetrics(HUBACKER_TERRAIN.cliffPath);
  }

  function tryEngageHubackerCliffPath(dx, dy) {
    if (MAP.id !== "hubacker" || activeHubackerCliffPath) return false;
    if (performance.now() < hubackerCliffReleaseUntil) return false;

    // This line is W/S ONLY.
    const verticalDirection = dy < 0 ? -1 : dy > 0 ? 1 : 0;
    if (!verticalDirection) return false;

    const closest = closestPointOnBridgePath(
      playerX,
      playerY,
      HUBACKER_TERRAIN.cliffPath
    );

    if (
      !closest ||
      closest.distance > HUBACKER_TERRAIN.cliffSnapDistance
    ) {
      return false;
    }

    // At the TOP end W must not release into the blocked plateau.
    // Touching the line still captures the player; only S can take him back.
    activeHubackerCliffPath = true;
    hubackerCliffDistance = closest.pathDistance;
    hubackerCliffSnapping = true;

    clearIceVelocity();
    updateIceVisual();
    return true;
  }

  function moveAlongHubackerCliffPath(dx, dy, deltaSeconds) {
    if (!activeHubackerCliffPath) return false;

    const path = HUBACKER_TERRAIN.cliffPath;
    const closest = closestPointOnBridgePath(playerX, playerY, path);

    if (hubackerCliffSnapping && closest) {
      const pull = Math.min(1, 10 * deltaSeconds);
      playerX += (closest.x - playerX) * pull;
      playerY += (closest.y - playerY) * pull;

      if (closest.distance <= 7) {
        playerX = closest.x;
        playerY = closest.y;
        hubackerCliffDistance = closest.pathDistance;
        hubackerCliffSnapping = false;
      }
      return true;
    }

    // While captured, A/D does absolutely nothing.
    // W = upward along the white line, S = downward.
    const verticalDirection = dy < 0 ? -1 : dy > 0 ? 1 : 0;
    if (!verticalDirection) return true;

    const metrics = hubackerCliffPathMetrics();
    const nextDistance = Math.max(
      0,
      Math.min(
        metrics.total,
        hubackerCliffDistance +
          verticalDirection *
          HUBACKER_TERRAIN.cliffTravelSpeed *
          deltaSeconds
      )
    );

    const p = pointAtBridgeDistance(path, nextDistance);
    playerX = p.x;
    playerY = p.y;
    hubackerCliffDistance = nextDistance;

    // TOP: stay locked. W cannot push farther; only S can return.
    if (nextDistance <= 0.001 && verticalDirection < 0) {
      hubackerCliffDistance = 0;
      return true;
    }

    // BOTTOM: S leaves the forced route and immediately restores free movement.
    if (
      nextDistance >= metrics.total - 0.001 &&
      verticalDirection > 0
    ) {
      activeHubackerCliffPath = false;
      hubackerCliffSnapping = false;
      hubackerCliffReleaseUntil = performance.now() + 520;

      // Deliberate outward S-release.  This places the foot anchor beyond the
      // capture tube and the cooldown prevents an immediate next-frame regrab.
      playerY += 96;
    }

    return true;
  }

  // R47 MAP 4 — ALT-NEUENSTEIN + NEUENSTEIN vertical WHITE snap routes.
  function neuensteinPathFor(id) {
    if (id === "ruin") return HUBACKER_TERRAIN.neuensteinRuinPath;
    if (id === "castle") return HUBACKER_TERRAIN.neuensteinCastlePath;
    return null;
  }

  function tryEngageNeuensteinSnap(dx, dy) {
    if (MAP.id !== "hubacker" || activeNeuensteinSnap) return false;
    if (performance.now() < neuensteinReleaseUntil) return false;

    // WHITE routes are W/S ONLY. A/D never captures them.
    const verticalDirection = dy < 0 ? -1 : dy > 0 ? 1 : 0;
    if (!verticalDirection) return false;

    let best = null;
    for (const id of ["ruin", "castle"]) {
      const path = neuensteinPathFor(id);
      const closest = closestPointOnBridgePath(playerX, playerY, path);
      if (!closest || closest.distance > HUBACKER_TERRAIN.neuensteinSnapDistance) continue;
      if (!best || closest.distance < best.closest.distance) {
        best = { id, path, closest };
      }
    }

    if (!best) return false;

    activeNeuensteinSnap = best.id;
    neuensteinSnapDistance = best.closest.pathDistance;
    neuensteinSnapping = true;
    clearIceVelocity();
    updateIceVisual();
    return true;
  }

  function moveAlongNeuensteinSnap(dx, dy, deltaSeconds) {
    if (!activeNeuensteinSnap) return false;

    const path = neuensteinPathFor(activeNeuensteinSnap);
    if (!path) {
      activeNeuensteinSnap = null;
      neuensteinSnapping = false;
      return false;
    }

    const closest = closestPointOnBridgePath(playerX, playerY, path);

    if (neuensteinSnapping && closest) {
      const pull = Math.min(1, 10 * deltaSeconds);
      playerX += (closest.x - playerX) * pull;
      playerY += (closest.y - playerY) * pull;

      if (closest.distance <= 7) {
        playerX = closest.x;
        playerY = closest.y;
        neuensteinSnapDistance = closest.pathDistance;
        neuensteinSnapping = false;
      }
      return true;
    }

    // Captured: ONLY W/S works. A/D and diagonal horizontal input have no effect.
    const verticalDirection = dy < 0 ? -1 : dy > 0 ? 1 : 0;
    if (!verticalDirection) return true;

    const metrics = getPathMetrics(path);
    const nextDistance = Math.max(
      0,
      Math.min(
        metrics.total,
        neuensteinSnapDistance +
          verticalDirection *
          HUBACKER_TERRAIN.neuensteinTravelSpeed *
          deltaSeconds
      )
    );

    const p = pointAtBridgeDistance(path, nextDistance);
    playerX = p.x;
    playerY = p.y;
    neuensteinSnapDistance = nextDistance;

    // TOP: hard lock. W can never release upward; only S can return.
    if (nextDistance <= 0.001 && verticalDirection < 0) {
      neuensteinSnapDistance = 0;
      return true;
    }

    // BOTTOM: S cleanly releases into free movement, matching the existing cliff snap.
    if (nextDistance >= metrics.total - 0.001 && verticalDirection > 0) {
      activeNeuensteinSnap = null;
      neuensteinSnapping = false;
      neuensteinReleaseUntil = performance.now() + 520;
      playerY += 96;
    }

    return true;
  }

  let iceVelocityX=0, iceVelocityY=0, iceVisualActive=false;

  function pointToSegmentDistanceR21(px,py,ax,ay,bx,by){
    const abx=bx-ax, aby=by-ay, apx=px-ax, apy=py-ay, denom=abx*abx+aby*aby;
    if(denom<=0.000001) return Math.hypot(px-ax,py-ay);
    const t=Math.max(0,Math.min(1,(apx*abx+apy*aby)/denom));
    return Math.hypot(px-(ax+abx*t),py-(ay+aby*t));
  }
  function pointNearPolygonBoundaryR21(x,y,polygon,padding){
    for(let i=0;i<polygon.length;i++){ const a=polygon[i],b=polygon[(i+1)%polygon.length]; if(pointToSegmentDistanceR21(x,y,a[0],a[1],b[0],b[1])<=padding) return true; }
    return false;
  }
  function isWinterbachBlockedFootPoint(x,y){
    if(MAP.id!=="winterbach-ranglehen") return false;
    return WINTERBACH_TERRAIN.blocked.some(p=>worldPointInPolygon(x,y,p)||pointNearPolygonBoundaryR21(x,y,p,WINTERBACH_TERRAIN.boundaryPadding));
  }
  function isWinterbachIceFootPoint(x,y){
    if(MAP.id==="winterbach-ranglehen") {
      return WINTERBACH_TERRAIN.ice.some(p=>worldPointInPolygon(x,y,p));
    }
    if(MAP.id==="lautenbach") {
      return LAUTENBACH_TERRAIN.ice.some(p=>worldPointInPolygon(x,y,p));
    }
    return false;
  }

  function isLautenbachBlockedFootPoint(x,y){
    if(MAP.id!=="lautenbach") return false;

    // R29: exact lower-left narrow PLAYER-only passage.
    if (
      LAUTENBACH_TERRAIN.playerPassages &&
      LAUTENBACH_TERRAIN.playerPassages.some(
        p => worldPointInPolygon(x, y, p)
      )
    ) {
      return false;
    }

    return LAUTENBACH_TERRAIN.blocked.some(
      p=>worldPointInPolygon(x,y,p) ||
         pointNearPolygonBoundaryR21(x,y,p,LAUTENBACH_TERRAIN.boundaryPadding)
    );
  }

  function isLautenbachBlockedWorldPoint(x,y){
    return LAUTENBACH_TERRAIN.blocked.some(p=>worldPointInPolygon(x,y,p));
  }
  function clearIceVelocity(){ iceVelocityX=0; iceVelocityY=0; }
  function installIcePlayerStyles(){
    if(document.getElementById("r21IcePlayerStyles")) return;
    const style=document.createElement("style"); style.id="r21IcePlayerStyles";
    style.textContent=`#player.player--ice-sliding #playerSprite{animation:r21IceSway 820ms ease-in-out infinite alternate!important;transform-origin:50% 100%}@keyframes r21IceSway{0%{transform:translateX(-${ICE_PHYSICS.swayX}px) rotate(-${ICE_PHYSICS.swayAngle}deg)}50%{transform:translateX(2px) rotate(1deg)}100%{transform:translateX(${ICE_PHYSICS.swayX}px) rotate(${ICE_PHYSICS.swayAngle}deg)}}`;
    document.head.appendChild(style);
  }
  function updateIceVisual(){
    if(!playerEl) return;
    const sliding=(MAP.id==="winterbach-ranglehen"||MAP.id==="lautenbach")&&isWinterbachIceFootPoint(playerX,playerY)&&Math.hypot(iceVelocityX,iceVelocityY)>ICE_PHYSICS.minSpeed;
    if(sliding===iceVisualActive) return; iceVisualActive=sliding; playerEl.classList.toggle("player--ice-sliding",sliding);
  }
  function movePlayerOnIce(inputX,inputY,deltaSeconds){
    const inputLength=Math.hypot(inputX,inputY),hasInput=inputLength>0;
    if(hasInput){ iceVelocityX+=(inputX/inputLength)*ICE_PHYSICS.acceleration*deltaSeconds; iceVelocityY+=(inputY/inputLength)*ICE_PHYSICS.acceleration*deltaSeconds; }
    const speed=Math.hypot(iceVelocityX,iceVelocityY); if(speed>ICE_PHYSICS.maxSpeed){ const s=ICE_PHYSICS.maxSpeed/speed; iceVelocityX*=s; iceVelocityY*=s; }
    const drag=Math.pow(hasInput?ICE_PHYSICS.dragMoving:ICE_PHYSICS.dragNoInput,deltaSeconds*60); iceVelocityX*=drag; iceVelocityY*=drag;
    if(Math.hypot(iceVelocityX,iceVelocityY)<ICE_PHYSICS.minSpeed&&!hasInput){ clearIceVelocity(); updateIceVisual(); return; }
    const cx=playerX+iceVelocityX*deltaSeconds; if(canMoveFootTo(cx,playerY)) playerX=cx; else iceVelocityX=0;
    const cy=playerY+iceVelocityY*deltaSeconds; if(canMoveFootTo(playerX,cy)) playerY=cy; else iceVelocityY=0;
    clampPlayer(); updateIceVisual();
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
    if (MAP.id !== "oberkirch-zentrum") return false;

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

    const inOberkirchNorthExit =
      MAP.id === "oberkirch-zentrum" &&
      (
        (
          x >= MAP_EXIT_CONFIG.oberkirchNorth.x1 &&
          x <= MAP_EXIT_CONFIG.oberkirchNorth.x2
        ) ||
        (
          x >= MAP_EXIT_CONFIG.oberkirchGreenNorth.x1 &&
          x <= MAP_EXIT_CONFIG.oberkirchGreenNorth.x2
        )
      );

    const inWinterbachSouthExit =
      MAP.id === "winterbach-ranglehen" &&
      x >= MAP_EXIT_CONFIG.winterbachSouth.x1 &&
      x <= MAP_EXIT_CONFIG.winterbachSouth.x2;

    const inWinterbachNorthExit =
      MAP.id === "winterbach-ranglehen" &&
      (
        (
          x >= MAP_EXIT_CONFIG.winterbachNorthLeft.x1 &&
          x <= MAP_EXIT_CONFIG.winterbachNorthLeft.x2
        ) ||
        (
          x >= MAP_EXIT_CONFIG.winterbachNorthRight.x1 &&
          x <= MAP_EXIT_CONFIG.winterbachNorthRight.x2
        )
      );

    const inLautenbachSouthExit =
      MAP.id === "lautenbach" &&
      (
        (
          x >= MAP_EXIT_CONFIG.lautenbachSouthLeft.x1 &&
          x <= MAP_EXIT_CONFIG.lautenbachSouthLeft.x2
        ) ||
        (
          x >= MAP_EXIT_CONFIG.lautenbachSouthRight.x1 &&
          x <= MAP_EXIT_CONFIG.lautenbachSouthRight.x2
        )
      );

    const inLautenbachNorthExit =
      MAP.id === "lautenbach" &&
      (
        (
          x >= MAP_EXIT_CONFIG.lautenbachNorthLeft.x1 &&
          x <= MAP_EXIT_CONFIG.lautenbachNorthLeft.x2
        ) ||
        (
          x >= MAP_EXIT_CONFIG.lautenbachNorthRight.x1 &&
          x <= MAP_EXIT_CONFIG.lautenbachNorthRight.x2
        )
      );

    const inHubackerSouthExit =
      MAP.id === "hubacker" &&
      x >= MAP_EXIT_CONFIG.hubackerSouthLeft.x1 &&
      x <= MAP_EXIT_CONFIG.hubackerSouthLeft.x2;

    // R53 FINAL STADIUM EXIT FIX:
    // These two lanes were already known by clampPlayer() and checkMapExit(),
    // but canMoveFootTo() still rejected every step past MAP.height - 10.
    // Without these flags the player could NEVER physically reach the
    // transition threshold.
    const inOberkirchStadiumSouthExit =
      MAP.id === "oberkirch-zentrum" &&
      x >= MAP_EXIT_CONFIG.oberkirchStadiumSouth.x1 &&
      x <= MAP_EXIT_CONFIG.oberkirchStadiumSouth.x2;

    const inStadiumOberkirchSouthExit =
      MAP.id === "renchtalstadion" &&
      x >= MAP_EXIT_CONFIG.stadiumOberkirchSouth.x1 &&
      x <= MAP_EXIT_CONFIG.stadiumOberkirchSouth.x2;

    if (y < minY) {
      const oberkirchNorthLeaveFloor = Math.min(
        MAP_EXIT_CONFIG.oberkirchNorth.leaveY,
        MAP_EXIT_CONFIG.oberkirchGreenNorth.leaveY
      ) - 80;
      const winterbachNorthLeaveFloor = Math.min(
        MAP_EXIT_CONFIG.winterbachNorthLeft.leaveY,
        MAP_EXIT_CONFIG.winterbachNorthRight.leaveY
      ) - 80;
      const lautenbachNorthLeaveFloor = Math.min(
        MAP_EXIT_CONFIG.lautenbachNorthLeft.leaveY,
        MAP_EXIT_CONFIG.lautenbachNorthRight.leaveY
      ) - 80;

      const allowedNorth =
        (inOberkirchNorthExit && y >= oberkirchNorthLeaveFloor) ||
        (inWinterbachNorthExit && y >= winterbachNorthLeaveFloor) ||
        (inLautenbachNorthExit && y >= lautenbachNorthLeaveFloor);

      if (!allowedNorth) return false;
    }

    if (y > maxY) {
      const winterbachSouthAllowed =
        inWinterbachSouthExit &&
        y <= MAP.height + MAP_EXIT_CONFIG.winterbachSouth.leavePadding + 80;

      const lautenbachSouthAllowed =
        inLautenbachSouthExit &&
        y <= MAP.height + Math.max(
          MAP_EXIT_CONFIG.lautenbachSouthLeft.leavePadding,
          MAP_EXIT_CONFIG.lautenbachSouthRight.leavePadding
        ) + 80;

      const hubackerSouthAllowed =
        inHubackerSouthExit &&
        y <= MAP.height + MAP_EXIT_CONFIG.hubackerSouthLeft.leavePadding + 80;

      const oberkirchStadiumSouthAllowed =
        inOberkirchStadiumSouthExit &&
        y <= MAP.height + MAP_EXIT_CONFIG.oberkirchStadiumSouth.leavePadding + 80;

      const stadiumOberkirchSouthAllowed =
        inStadiumOberkirchSouthExit &&
        y <= MAP.height + MAP_EXIT_CONFIG.stadiumOberkirchSouth.leavePadding + 80;

      if (
        !winterbachSouthAllowed &&
        !lautenbachSouthAllowed &&
        !hubackerSouthAllowed &&
        !oberkirchStadiumSouthAllowed &&
        !stadiumOberkirchSouthAllowed
      ) {
        return false;
      }
    }

    // Existing river/bridge collision remains unchanged.
    if (isRiverBlockedFootPoint(x, y)) return false;

    // R21 MAP 2: red terrain is hard-blocked for the player's FOOT anchor.
    if (isWinterbachBlockedFootPoint(x, y)) return false;

    // R28 MAP 3: every RED marked Lautenbach region is hard-blocked.
    if (isLautenbachBlockedFootPoint(x, y)) return false;

    // R40 MAP 4: RED river + both PURPLE regions + locked bridge gap.
    if (isHubackerBlockedFootPoint(x, y)) return false;

    // New hard collision for church body + tavern.
    // Only the player's foot anchor participates.
    if (isBuildingBlockedFootPoint(x, y)) return false;

    // R15: TRUNKENBOLD has a precise PNG-alpha silhouette collision.
    if (isTrunkenboldBlockedFootPoint(x, y)) return false;

    return true;
  }

  function pointInRect(x, y, rect) {
    return x >= rect.x1 && x <= rect.x2 && y >= rect.y1 && y <= rect.y2;
  }

  function tryEngageBridge(dx, dy) {
    const horizontalDirection = dx > 0 ? 1 : dx < 0 ? -1 : 0;
    const movingAnyDirection = dx !== 0 || dy !== 0;

    // FINAL COVERED BRIDGE:
    // the thick white line is the forced path; the thin feeder regions on both
    // sides catch the player from any approach direction and smoothly converge
    // the foot anchor onto that straight line.
    if (MAP.id === "oberkirch-zentrum" && movingAnyDirection) {
      const covered = bridgeDefinition("covered");
      const closest = closestPointOnBridgePath(playerX, playerY, covered.path);
      const inLeftFeeder = pointInRect(
        playerX, playerY, BRIDGE_CONFIG.coveredCaptureLeft
      );
      const inRightFeeder = pointInRect(
        playerX, playerY, BRIDGE_CONFIG.coveredCaptureRight
      );

      if (closest && (inLeftFeeder || inRightFeeder)) {
        // RELEASE RULE:
        // Wenn der Spieler ein Brückenende erreicht hat und NACH AUSSEN läuft,
        // darf die Zuführungszone ihn nicht im nächsten Frame erneut fangen.
        const leavingLeft =
          closest.progress <= 0.04 && horizontalDirection < 0;
        const leavingRight =
          closest.progress >= 0.96 && horizontalDirection > 0;

        if (!leavingLeft && !leavingRight) {
          activeBridge = {
            id: "covered",
            path: covered.path,
            distance: closest.pathDistance,
            snapping: true
          };
          return true;
        }
      }
    }

    if (!horizontalDirection) return false;

    let best = null;

    // Lower stone bridge stays exactly on its existing curved forced path.
    for (const id of ["stone"]) {
      const definition = bridgeDefinition(id);
      const closest = closestPointOnBridgePath(playerX, playerY, definition.path);
      if (!closest || closest.distance > BRIDGE_CONFIG.engageDistance) continue;

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
      distance: best.closest.pathDistance,
      snapping: true
    };

    return true;
  }

  function moveAlongActiveBridge(horizontalDirection, deltaSeconds) {
    if (!activeBridge) return false;

    const anchor = pointAtBridgeDistance(activeBridge.path, activeBridge.distance);

    if (activeBridge.snapping) {
      const dx = anchor.x - playerX;
      const dy = anchor.y - playerY;
      const distance = Math.hypot(dx, dy);

      if (distance > 5) {
        const pull = Math.min(1, 10 * deltaSeconds);
        playerX += dx * pull;
        playerY += dy * pull;
        return true;
      }

      playerX = anchor.x;
      playerY = anchor.y;
      activeBridge.snapping = false;
    }

    if (!horizontalDirection) {
      // Standing still in the covered bridge/tunnel freezes the real position.
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
      const finishedBridgeId = activeBridge.id;
      activeBridge = null;

      if (finishedBridgeId === "covered") {
        // Kleiner sauberer Austrittsschritt hinter das Linienende.
        // Danach übernimmt sofort wieder die normale freie Bewegung.
        playerX += horizontalDirection * 18;
      }
    }

    return true;
  }


  // ------------------------------------------------------------------
  // R29 MAP 3 — YELLOW ARROW / WOODEN BRIDGE SNAP
  // Horizontal A/D passage across the Rench.
  // ------------------------------------------------------------------
  const LAUTENBACH_WOOD_BRIDGE = Object.freeze({
    path: Object.freeze([
      Object.freeze([6250, 930]),
      Object.freeze([7545, 930])
    ]),
    engageDistance: 225
  });

  // ------------------------------------------------------------------
  // R39 MAP 4 — HUBACKER WOODEN BRIDGE SNAP
  // Exact horizontal deck from the supplied white reference line.
  // On contact the player snaps to the bridge centreline and, while
  // captured, ONLY A/D (or left/right arrows) moves along the bridge.
  // At either end the bridge releases and normal controls resume.
  // ------------------------------------------------------------------
  const HUBACKER_WOOD_BRIDGE = Object.freeze({
    path: Object.freeze([
      Object.freeze([4360, 4255]),
      Object.freeze([5620, 4255])
    ]),
    engageDistance: 165
  });

  function tryEngageHubackerWoodBridge(dx, dy) {
    if (MAP.id !== "hubacker") return false;

    const horizontalDirection = dx > 0 ? 1 : dx < 0 ? -1 : 0;
    if (!horizontalDirection) return false;

    const closest = closestPointOnBridgePath(
      playerX,
      playerY,
      HUBACKER_WOOD_BRIDGE.path
    );

    if (
      !closest ||
      closest.distance > HUBACKER_WOOD_BRIDGE.engageDistance
    ) {
      return false;
    }

    // Leaving outward at either bridge end immediately restores free movement.
    if (closest.progress <= 0.035 && horizontalDirection < 0) return false;
    if (closest.progress >= 0.965 && horizontalDirection > 0) return false;

    activeBridge = {
      id: "hubacker-wood",
      path: HUBACKER_WOOD_BRIDGE.path,
      distance: closest.pathDistance,
      snapping: true
    };

    clearIceVelocity();
    updateIceVisual();
    return true;
  }

  function tryEngageLautenbachWoodBridge(dx, dy) {
    if (MAP.id !== "lautenbach") return false;

    const horizontalDirection = dx > 0 ? 1 : dx < 0 ? -1 : 0;
    if (!horizontalDirection) return false;

    const closest = closestPointOnBridgePath(
      playerX,
      playerY,
      LAUTENBACH_WOOD_BRIDGE.path
    );

    if (
      !closest ||
      closest.distance > LAUTENBACH_WOOD_BRIDGE.engageDistance
    ) {
      return false;
    }

    // At either end, moving outward releases immediately.
    if (closest.progress <= 0.035 && horizontalDirection < 0) return false;
    if (closest.progress >= 0.965 && horizontalDirection > 0) return false;

    activeBridge = {
      id: "lautenbach-wood",
      path: LAUTENBACH_WOOD_BRIDGE.path,
      distance: closest.pathDistance,
      snapping: true
    };

    clearIceVelocity();
    updateIceVisual();
    return true;
  }


  function lautenbachHillPathMetrics() {
    return getPathMetrics(LAUTENBACH_TERRAIN.hillPath);
  }

  function tryEngageLautenbachHillPath(dx, dy) {
    if (MAP.id !== "lautenbach" || activeLautenbachHillPath) return false;

    const upDiagonal = dy < 0 && dx !== 0;
    const downDiagonal = dy > 0 && dx !== 0;
    if (!upDiagonal && !downDiagonal) return false;

    const path = LAUTENBACH_TERRAIN.hillPath;
    const closest = closestPointOnBridgePath(playerX, playerY, path);
    if (!closest || closest.distance > LAUTENBACH_TERRAIN.hillSnapDistance) return false;

    // Climb from the lower clearing; descend from the upper hill end.
    if (upDiagonal && closest.progress < 0.58) return false;
    if (downDiagonal && closest.progress > 0.42) return false;

    activeLautenbachHillPath = true;
    lautenbachHillDistance = closest.pathDistance;
    lautenbachHillSnapping = true;
    clearIceVelocity();
    updateIceVisual();
    return true;
  }

  function moveAlongLautenbachHillPath(dx, dy, deltaSeconds) {
    if (!activeLautenbachHillPath) return false;

    const path = LAUTENBACH_TERRAIN.hillPath;
    const closest = closestPointOnBridgePath(playerX, playerY, path);

    if (lautenbachHillSnapping && closest) {
      const pull = Math.min(1, 10 * deltaSeconds);
      playerX += (closest.x - playerX) * pull;
      playerY += (closest.y - playerY) * pull;
      if (closest.distance <= 7) {
        playerX = closest.x;
        playerY = closest.y;
        lautenbachHillDistance = closest.pathDistance;
        lautenbachHillSnapping = false;
      }
      return true;
    }

    const movingUpDiagonal = dy < 0 && dx !== 0;
    const movingDownDiagonal = dy > 0 && dx !== 0;
    if (!movingUpDiagonal && !movingDownDiagonal) return true;

    const metrics = lautenbachHillPathMetrics();
    const direction = movingUpDiagonal ? -1 : 1;
    const nextDistance = Math.max(
      0,
      Math.min(
        metrics.total,
        lautenbachHillDistance +
          direction * LAUTENBACH_TERRAIN.hillTravelSpeed * deltaSeconds
      )
    );
    const p = pointAtBridgeDistance(path, nextDistance);
    playerX = p.x;
    playerY = p.y;
    lautenbachHillDistance = nextDistance;

    if (
      (nextDistance <= 0.001 && direction < 0) ||
      (nextDistance >= metrics.total - 0.001 && direction > 0)
    ) {
      activeLautenbachHillPath = false;
      lautenbachHillSnapping = false;
    }
    return true;
  }

  function movePlayerWithWorldCollision(dx, dy, deltaSeconds) {
    const horizontalDirection = dx > 0 ? 1 : dx < 0 ? -1 : 0;

    if (MAP.id !== "hubacker" && activeHubackerCliffPath) {
      activeHubackerCliffPath = false;
      hubackerCliffSnapping = false;
    }

    if (MAP.id !== "hubacker" && activeNeuensteinSnap) {
      activeNeuensteinSnap = null;
      neuensteinSnapping = false;
    }

    // R47 MAP 4: the two WHITE Neuenstein W/S-only snap routes.
    // They own movement completely while active; A/D cannot drift off the line.
    if (
      MAP.id === "hubacker" &&
      (activeNeuensteinSnap || tryEngageNeuensteinSnap(dx, dy))
    ) {
      moveAlongNeuensteinSnap(dx, dy, deltaSeconds);
      clampPlayer();
      return;
    }

    // R39 MAP 4: exact white-marked HUBACKER bridge snap.
    if (
      MAP.id === "hubacker" &&
      (
        (activeBridge && activeBridge.id === "hubacker-wood") ||
        tryEngageHubackerWoodBridge(dx, dy)
      )
    ) {
      moveAlongActiveBridge(horizontalDirection, deltaSeconds);
      clampPlayer();
      return;
    }

    // R40 MAP 4: WHITE curved riverside line.
    // Once captured, only W/S can move the player along it.
    if (
      MAP.id === "hubacker" &&
      (
        activeHubackerCliffPath ||
        tryEngageHubackerCliffPath(dx, dy)
      )
    ) {
      moveAlongHubackerCliffPath(dx, dy, deltaSeconds);
      clampPlayer();
      return;
    }

    // R29: yellow-arrow wooden bridge gets first priority on MAP 3.
    if (
      MAP.id === "lautenbach" &&
      (
        (activeBridge && activeBridge.id === "lautenbach-wood") ||
        tryEngageLautenbachWoodBridge(dx, dy)
      )
    ) {
      moveAlongActiveBridge(horizontalDirection, deltaSeconds);
      clampPlayer();
      return;
    }

    if (
      MAP.id === "lautenbach" &&
      (activeLautenbachHillPath || tryEngageLautenbachHillPath(dx, dy))
    ) {
      moveAlongLautenbachHillPath(dx, dy, deltaSeconds);
      clampPlayer();
      return;
    }

    if (
      MAP.id === "oberkirch-zentrum" &&
      (activeBridge || tryEngageBridge(dx, dy))
    ) {
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
    if (MAP.id !== "oberkirch-zentrum") return false;

    // Unsichtbar nur während aktiver Brückenpassage UND exakt innerhalb
    // der roten Dach-Hitbox. Außerhalb bleibt der Spieler sichtbar.
    if (!activeBridge || activeBridge.id !== "covered") return false;

    const b = BRIDGE_CONFIG.coveredInterior;
    return (
      playerX >= b.x1 && playerX <= b.x2 &&
      playerY >= b.y1 && playerY <= b.y2
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

  // ------------------------------------------------------------------
  // R11 ADDITIONAL OBERKIRCH BUILDINGS
  // Exact size/position reconstructed from the supplied R11 composite.
  // IMPORTANT: NEUENSTEINER HOF is intentionally mirrored horizontally,
  // exactly as clarified by the user.
  // ------------------------------------------------------------------
  const R11_BUILDINGS = Object.freeze([
    Object.freeze({
      id: "oberkirch-huette-holzfaeller",
      src: "assets/buildings/HÜTTE 2 HOLZFÄLLER.png",
      left: 1073,
      top: 449,
      width: 1133,
      height: 1698,
      mirrored: false,
      groundedFromY: 0.31
    }),
    Object.freeze({
      id: "oberkirch-neuensteiner-hof",
      src: "assets/buildings/NEUENSTEINER HOF.png",
      left: 2760,
      top: 922,
      width: 1445,
      height: 2167,
      mirrored: true,
      groundedFromY: 0.34,
      // Upper / first roof plane is intentionally traversable.
      // While the player's FOOT anchor is inside this roof region,
      // he is rendered one layer behind the house, like the church towers.
      walkBehind: Object.freeze([
        [0.03, 0.13],
        [0.94, 0.13],
        [0.97, 0.40],
        [0.02, 0.40]
      ])
    }),
    Object.freeze({
      id: "oberkirch-huette-rund",
      src: "assets/buildings/HÜTTE 1.png",
      left: 7109,
      top: 2375,
      width: 1004,
      height: 1508,
      mirrored: false,
      groundedFromY: 0.30,

      // R13 BLUE CIRCLE ONLY:
      // exact upper roof crossing area is walkable and drawn in front of player.
      // The lower hut / wall / foundation keeps its existing collision.
      walkBehind: Object.freeze([
        // Existing R13 roof passage retained...
        [0.03, 0.16],
        [0.97, 0.16],
        [0.93, 0.46],

        // ...plus ONLY the additional R15 blue-marked lower-left roof wedge.
        // The player may walk here and is rendered BEHIND the roof.
        [0.70, 0.46],
        [0.08, 0.62],
        [0.00, 0.40],
        [0.03, 0.16]
      ])
    })
  ]);

  const r11AlphaMasks = new Map();

  function prepareR11AlphaMask(config, image) {
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
      const alpha = new Uint8Array(canvas.width * canvas.height);

      for (let src = 3, dst = 0; src < pixels.length; src += 4, dst += 1) {
        alpha[dst] = pixels[src];
      }

      r11AlphaMasks.set(config.id, {
        width: canvas.width,
        height: canvas.height,
        alpha
      });
    } catch (error) {
      console.warn("R11 building alpha mask unavailable:", config.id, error);
    }
  }

  function r11LocalPoint(config, x, y) {
    let localX01 = (x - config.left) / config.width;
    const localY01 = (y - config.top) / config.height;

    // Visual is mirrored with CSS; alpha-space must mirror too.
    if (config.mirrored) localX01 = 1 - localX01;

    return { localX01, localY01 };
  }

  function r11PointInWalkBehind(config, x, y) {
    if (!config.walkBehind) return false;

    const { localX01, localY01 } = r11LocalPoint(config, x, y);
    return pointInNormalizedPolygon(
      localX01,
      localY01,
      config.walkBehind
    );
  }

  function isR11BuildingBlockedFootPoint(config, x, y) {
    if (
      x < config.left ||
      x > config.left + config.width ||
      y < config.top ||
      y > config.top + config.height
    ) {
      return false;
    }

    const { localX01, localY01 } = r11LocalPoint(config, x, y);

    // Transparent / upper decorative space never becomes an invisible wall.
    if (localY01 < config.groundedFromY) return false;

    // Neuensteiner Hof: first / upper roof plane is explicitly walk-behind.
    if (config.walkBehind && pointInNormalizedPolygon(
      localX01,
      localY01,
      config.walkBehind
    )) {
      return false;
    }

    const mask = r11AlphaMasks.get(config.id);
    if (!mask) return false;

    const px = Math.max(
      0,
      Math.min(mask.width - 1, Math.round(localX01 * (mask.width - 1)))
    );
    const py = Math.max(
      0,
      Math.min(mask.height - 1, Math.round(localY01 * (mask.height - 1)))
    );

    return mask.alpha[py * mask.width + px] >= 28;
  }

  function createR11Buildings() {
    for (const config of R11_BUILDINGS) {
      const image = document.createElement("img");
      image.id = config.id;
      image.className = "map-building map-building--r11";
      image.src = encodeURI(config.src);
      image.alt = "";
      image.draggable = false;

      image.style.left = `${config.left}px`;
      image.style.top = `${config.top}px`;
      image.style.width = `${config.width}px`;
      image.style.height = `${config.height}px`;
      // R11 buildings stay below the special church-tower depth layer.
      // This prevents the Neuensteiner Hof from covering the player when
      // the player is only supposed to be behind the church tower.
      image.style.zIndex = "2";
      image.style.transformOrigin = "50% 50%";
      if (config.mirrored) image.style.transform = "scaleX(-1)";

      image.addEventListener("load", () => {
        prepareR11AlphaMask(config, image);
      }, { once: true });

      world.appendChild(image);

      if (image.complete && image.naturalWidth > 0) {
        prepareR11AlphaMask(config, image);
      }
    }
  }

  function playerBehindNeuensteinerHofRoof() {
    if (MAP.id !== "oberkirch-zentrum") return false;

    const hof = R11_BUILDINGS.find(
      (building) => building.id === "oberkirch-neuensteiner-hof"
    );

    return hof ? r11PointInWalkBehind(hof, playerX, playerY) : false;
  }

  function playerBehindRoundHutRoof() {
    if (MAP.id !== "oberkirch-zentrum") return false;

    const hut = R11_BUILDINGS.find(
      (building) => building.id === "oberkirch-huette-rund"
    );

    return hut ? r11PointInWalkBehind(hut, playerX, playerY) : false;
  }



  // ------------------------------------------------------------------
  // R20 MAP 2 — OBSTHOF / HAUS
  // Position and scale are mapped directly from the supplied R20 composite.
  // Rabbits ignore this collision entirely; only the PLAYER foot anchor uses it.
  // ------------------------------------------------------------------
  const WINTERBACH_OBSTHOF = Object.freeze({
    id: "winterbach-obsthof",
    src: "assets/buildings/WINTERBACH OBSTHOF.png",

    // Exact full transparent PNG placement reconstructed from R20.
    // Visible painted content lands at the exact supplied lower-left position.
    left: 155,
    top: 2548,
    width: 2190,
    height: 3285,

    alphaThreshold: 28,

    // Upper tree / decorative canopy is visual only; grounded visible pixels
    // below this line participate in PLAYER collision unless they are inside
    // one of the two explicitly marked BLUE walkable zones from R22.
    groundedFromY: 0.345,

    // R22 BLUE + GREEN STRIPES:
    // walkable and PLAYER stays in FRONT of the Obsthof.
    // Coordinates are normalized to the original Obsthof PNG placement.
    walkableFront: Object.freeze([
      [0.339, 0.349],
      [0.679, 0.392],
      [0.848, 0.304],
      [0.900, 0.329],
      [0.781, 0.399],
      [0.473, 0.502],
      [0.132, 0.431]
    ]),

    // R22 BLUE + PURPLE STRIPES:
    // walkable, but PLAYER is rendered BEHIND the roof.
    walkBehindRoof: Object.freeze([
      [0.487, 0.292],
      [0.869, 0.378],
      [0.786, 0.446],
      [0.425, 0.360]
    ]),

    // R24 RED PEN from the supplied markup:
    // fully walkable for PLAYER and PLAYER ALWAYS stays in foreground.
    // World-space coordinates traced from the exact map screenshot.
    goatPenFrontWorld: Object.freeze([
      [265, 4130],
      [965, 3760],
      [1500, 3945],
      [1535, 4175],
      [1315, 4300],
      [775, 4415]
    ]),

    // R24 BLUE ROOF extension:
    // fully walkable, but PLAYER is rendered behind the house/roof.
    // This EXTENDS the existing R22 purple walk-behind zone; it does not replace it.
    walkBehindRoofWorld: Object.freeze([
      // R25 MINIFIX: only the LEFT edge is extended slightly toward the blue arrow.
      // All other edges remain unchanged.
      [1395, 3745],
      [2355, 3700],
      [2520, 3845],
      [2525, 4195],
      [2025, 4180],
      [1295, 4080]
    ])
  });

  let winterbachObsthofAlphaMask = null;
  let winterbachObsthofElement = null;

  function prepareWinterbachObsthofAlphaMask(image) {
    if (!image || !image.naturalWidth || !image.naturalHeight) return;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);

      const pixels = ctx.getImageData(
        0, 0, canvas.width, canvas.height
      ).data;

      const alpha = new Uint8Array(canvas.width * canvas.height);

      for (let src = 3, dst = 0; src < pixels.length; src += 4, dst += 1) {
        alpha[dst] = pixels[src];
      }

      winterbachObsthofAlphaMask = {
        width: canvas.width,
        height: canvas.height,
        alpha
      };
    } catch (error) {
      winterbachObsthofAlphaMask = null;
      console.warn("Winterbach Obsthof alpha mask unavailable:", error);
    }
  }

  function winterbachObsthofLocalPoint(x, y) {
    const c = WINTERBACH_OBSTHOF;
    return {
      localX01: (x - c.left) / c.width,
      localY01: (y - c.top) / c.height
    };
  }

  function playerBehindWinterbachObsthofFront() {
    if (MAP.id !== "winterbach-ranglehen") return false;

    const c = WINTERBACH_OBSTHOF;

    // R24 RED PEN has absolute foreground priority.
    if (worldPointInPolygon(
      playerX,
      playerY,
      c.goatPenFrontWorld
    )) {
      return false;
    }

    // R24 BLUE extension: player walks behind house/roof.
    if (worldPointInPolygon(
      playerX,
      playerY,
      c.walkBehindRoofWorld
    )) {
      return true;
    }

    const { localX01, localY01 } =
      winterbachObsthofLocalPoint(playerX, playerY);

    if (
      localX01 < 0 || localX01 > 1 ||
      localY01 < 0 || localY01 > 1
    ) {
      return false;
    }

    // Existing R22 purple roof zone remains valid too.
    return pointInNormalizedPolygon(
      localX01,
      localY01,
      c.walkBehindRoof
    );
  }

  function isWinterbachObsthofBlockedFootPoint(x, y) {
    if (MAP.id !== "winterbach-ranglehen") return false;

    const c = WINTERBACH_OBSTHOF;

    if (
      x < c.left ||
      x > c.left + c.width ||
      y < c.top ||
      y > c.top + c.height
    ) {
      return false;
    }

    // R24 exact world-space exceptions from the screenshot.
    // RED goat pen = walkable + player foreground.
    // BLUE roof extension = walkable + player behind house.
    if (
      worldPointInPolygon(x, y, c.goatPenFrontWorld) ||
      worldPointInPolygon(x, y, c.walkBehindRoofWorld)
    ) {
      return false;
    }

    const { localX01, localY01 } =
      winterbachObsthofLocalPoint(x, y);

    // Roof / tree canopy / decorative upper pixels never become invisible walls.
    if (localY01 < c.groundedFromY) return false;

    // R22: both BLUE-marked polygons are intentionally walkable.
    // GREEN interior => player foreground.
    // PURPLE interior => player behind roof (handled by depth function).
    if (
      pointInNormalizedPolygon(
        localX01,
        localY01,
        c.walkableFront
      ) ||
      pointInNormalizedPolygon(
        localX01,
        localY01,
        c.walkBehindRoof
      )
    ) {
      return false;
    }

    if (!winterbachObsthofAlphaMask) return false;

    const mask = winterbachObsthofAlphaMask;
    const px = Math.max(
      0,
      Math.min(
        mask.width - 1,
        Math.round(localX01 * (mask.width - 1))
      )
    );
    const py = Math.max(
      0,
      Math.min(
        mask.height - 1,
        Math.round(localY01 * (mask.height - 1))
      )
    );

    // Exact PNG silhouette collision: transparent asset space is walkable.
    return mask.alpha[py * mask.width + px] >= c.alphaThreshold;
  }

  function installWinterbachObsthofStyles() {
    if (document.getElementById("winterbachObsthofStyles")) return;

    const c = WINTERBACH_OBSTHOF;
    const style = document.createElement("style");
    style.id = "winterbachObsthofStyles";
    style.textContent = `
      .winterbach-building--obsthof {
        position: absolute;
        left: ${c.left}px;
        top: ${c.top}px;
        width: ${c.width}px;
        height: ${c.height}px;
        z-index: 6;
        display: block;
        object-fit: fill;
        max-width: none;
        max-height: none;
        pointer-events: none;
        user-select: none;
        -webkit-user-drag: none;
      }
    `;

    document.head.appendChild(style);
  }

  function createWinterbachObsthof() {
    installWinterbachObsthofStyles();

    const image = document.createElement("img");
    image.id = WINTERBACH_OBSTHOF.id;
    image.className = "winterbach-building winterbach-building--obsthof";
    image.src = encodeURI(WINTERBACH_OBSTHOF.src);
    image.alt = "";
    image.draggable = false;
    image.style.display =
      MAP.id === "winterbach-ranglehen" ? "" : "none";

    image.addEventListener("load", () => {
      prepareWinterbachObsthofAlphaMask(image);
    }, { once: true });

    world.appendChild(image);
    winterbachObsthofElement = image;

    if (image.complete && image.naturalWidth > 0) {
      prepareWinterbachObsthofAlphaMask(image);
    }
  }

  function setWinterbachWorldVisibility(visible) {
    for (const element of world.querySelectorAll(".winterbach-building")) {
      element.style.display = visible ? "" : "none";
    }
  }



  // ------------------------------------------------------------------
  // R41 MAP 4 — HUBACKER BUILDINGS
  // Exact image registration against the supplied R32 reference composite.
  // The source PNGs themselves are unchanged.
  //
  // ALT-NEUENSTEIN: NO extra collision — existing left purple plateau owns it.
  // NEUENSTEIN: existing right purple plateau is the hard terrain hitbox.
  // HUBACKERHOF: blue polygon is the only walk-behind opening; its lower and
  // right boundaries are hard stops exactly as requested.
  // ------------------------------------------------------------------
  const HUBACKER_BUILDINGS = Object.freeze([
    Object.freeze({
      id: "hubacker-alt-neuenstein",
      src: "assets/buildings/HUBACKER ALT-NEUENSTEIN RUINE.png",
      left: 362.731,
      top: -321.456,
      width: 4511.935,
      height: 3007.956,
      zIndex: 110,
      collision: "none"
    }),
    Object.freeze({
      id: "hubacker-neuenstein",
      src: "assets/buildings/HUBACKER NEUENSTEIN.png",
      left: 6602.589,
      top: -128.403,
      width: 3155.363,
      height: 4733.044,
      zIndex: 110,
      collision: "plateau"
    }),
    Object.freeze({
      id: "hubacker-hof",
      src: "assets/buildings/HUBACKER HOF.png",
      left: 4931.435,
      top: 4011.639,
      width: 5603.741,
      height: 3735.827,
      zIndex: 6,
      collision: "hof",

      // Exact BLUE marked walk-behind polygon from R32.
      behindZone: Object.freeze([
        Object.freeze([5316.493, 5547.509]),
        Object.freeze([5316.493, 5894.799]),
        Object.freeze([8378.133, 5227.636]),
        Object.freeze([8332.437, 4459.941]),
        Object.freeze([6952.414, 4469.080])
      ]),

      // Hard boundary BELOW the blue area.
      lowerBlockedZone: Object.freeze([
        Object.freeze([5316.493, 5894.799]),
        Object.freeze([8378.133, 5227.636]),
        Object.freeze([10240.000, 5227.636]),
        Object.freeze([10240.000, 6827.000]),
        Object.freeze([5316.493, 6827.000])
      ]),

      // Hard boundary RIGHT of the blue area.
      rightBlockedZone: Object.freeze([
        Object.freeze([8332.437, 4459.941]),
        Object.freeze([10240.000, 4459.941]),
        Object.freeze([10240.000, 6827.000]),
        Object.freeze([8378.133, 5227.636])
      ])
    })
  ]);

  const hubackerBuildingElements = new Map();

  function hubackerHofConfig() {
    return HUBACKER_BUILDINGS.find((config) => config.id === "hubacker-hof");
  }

  function playerBehindHubackerHof() {
    if (MAP.id !== "hubacker") return false;
    const hof = hubackerHofConfig();
    return !!hof && worldPointInPolygon(playerX, playerY, hof.behindZone);
  }

  // R47 depth zones taken from the supplied blue/red overlay.
  // RUIN RED remains exactly as before (player behind, z=100 vs ruin z=110).
  // RUIN BLUE and the complete NEUENSTEIN BLUE rectangle put the player in front.
  const HUBACKER_NEUENSTEIN_DEPTH = Object.freeze({
    // R49 RUIN — FINAL / LOCKED.
    ruinFrontZone: Object.freeze([
      Object.freeze([1405, 1245]),
      Object.freeze([4265, 1245]),
      Object.freeze([4265, 3350]),
      Object.freeze([1405, 3350])
    ]),

    // Existing Neuenstein foreground zone remains unchanged.
    castleFrontZone: Object.freeze([
      Object.freeze([6595, 255]),
      Object.freeze([10030, 255]),
      Object.freeze([10030, 5050]),
      Object.freeze([6595, 5050])
    ]),

    // R50 FINAL MINIFIX:
    // Tight lower-castle override for the exact Hubacker-Hof overlap strip.
    castleLowerFrontOverride: Object.freeze([
      Object.freeze([6610, 4060]),
      Object.freeze([9140, 4060]),
      Object.freeze([9190, 4350]),
      Object.freeze([8990, 4560]),
      Object.freeze([8400, 4675]),
      Object.freeze([7650, 4695]),
      Object.freeze([7000, 4625]),
      Object.freeze([6600, 4460])
    ]),

    // R52 FINAL MICRO-FIX:
    // ONLY the tiny yellow-marked stair/gate strip is extended downward.
    // At X≈8054 the former foreground seam ended around Y≈4684; the
    // screenshot shows the remaining half-body dropout at Y≈4759.
    // This narrow patch closes exactly that final gap without widening
    // the Hubacker-Hof overlap rule elsewhere.
    castleGateFrontMicroOverride: Object.freeze([
      Object.freeze([7870, 4630]),
      Object.freeze([8235, 4630]),
      // R54 FINAL NEUENSTEIN MICRO-EXTENSION:
      // same narrow yellow gate/stair strip, only ~1/3 player height farther down.
      Object.freeze([8235, 5075]),
      Object.freeze([7870, 5075])
    ])
  });

  function playerInNeuensteinForegroundZone() {
    if (MAP.id !== "hubacker") return false;
    return (
      worldPointInPolygon(
        playerX, playerY, HUBACKER_NEUENSTEIN_DEPTH.ruinFrontZone
      ) ||
      worldPointInPolygon(
        playerX, playerY, HUBACKER_NEUENSTEIN_DEPTH.castleFrontZone
      )
    );
  }

  function playerInNeuensteinLowerFrontOverride() {
    if (MAP.id !== "hubacker") return false;
    return worldPointInPolygon(
      playerX,
      playerY,
      HUBACKER_NEUENSTEIN_DEPTH.castleLowerFrontOverride
    );
  }

  function playerInNeuensteinGateFrontMicroOverride() {
    if (MAP.id !== "hubacker") return false;
    return worldPointInPolygon(
      playerX,
      playerY,
      HUBACKER_NEUENSTEIN_DEPTH.castleGateFrontMicroOverride
    );
  }

  function isHubackerBuildingBlockedFootPoint(x, y) {
    if (MAP.id !== "hubacker") return false;

    const hof = hubackerHofConfig();
    if (!hof) return false;

    // BLUE area has absolute priority: walkable, player renders behind the Hof.
    if (worldPointInPolygon(x, y, hof.behindZone)) return false;

    // Exact requested hard limits: never deeper than the blue lower edge,
    // never farther right than the blue right edge.
    if (worldPointInPolygon(x, y, hof.lowerBlockedZone)) return true;
    if (worldPointInPolygon(x, y, hof.rightBlockedZone)) return true;

    // ALT-NEUENSTEIN deliberately has no additional building collision.
    // Both castles continue to use the existing purple terrain regions.
    return false;
  }

  function installHubackerBuildingStyles() {
    if (document.getElementById("hubackerBuildingStyles")) return;

    const style = document.createElement("style");
    style.id = "hubackerBuildingStyles";
    style.textContent = `
      .hubacker-building {
        position: absolute;
        display: block;
        object-fit: fill;
        max-width: none;
        max-height: none;
        pointer-events: none;
        user-select: none;
        -webkit-user-drag: none;
      }
    `;
    document.head.appendChild(style);
  }

  function createHubackerBuildings() {
    installHubackerBuildingStyles();

    for (const config of HUBACKER_BUILDINGS) {
      const image = document.createElement("img");
      image.id = config.id;
      image.className = "hubacker-building";
      image.src = encodeURI(config.src);
      image.alt = "";
      image.draggable = false;
      image.style.left = `${config.left}px`;
      image.style.top = `${config.top}px`;
      image.style.width = `${config.width}px`;
      image.style.height = `${config.height}px`;
      image.style.zIndex = String(config.zIndex);
      image.style.display = MAP.id === "hubacker" ? "" : "none";
      world.appendChild(image);
      hubackerBuildingElements.set(config.id, image);
    }
  }

  function updateHubackerBuildingDepth() {
    const onHubacker = MAP.id === "hubacker";

    for (const element of hubackerBuildingElements.values()) {
      element.style.display = onHubacker ? "" : "none";
    }

    if (!onHubacker || !playerEl) return;

    // R50 FINAL DEPTH PRIORITY:
    // Tiny lower-Neuenstein overlap strip wins FIRST.
    // Outside it, Hubacker Hof keeps its old priority exactly.
    if (
      playerInNeuensteinGateFrontMicroOverride() ||
      playerInNeuensteinLowerFrontOverride()
    ) {
      playerEl.style.zIndex = "120";
    } else if (playerBehindHubackerHof()) {
      playerEl.style.zIndex = "5";
    } else if (playerInNeuensteinForegroundZone()) {
      playerEl.style.zIndex = "120";
    } else {
      playerEl.style.zIndex = "100";
    }
  }


  // ------------------------------------------------------------------
  // R29 MAP 3 — LAUTENBACH BUILDINGS
  // Exact placement follows the supplied marked composite.
  // PINK rectangles: walkable, player is BEHIND the building.
  // ORANGE rectangles: hard foot collision, player stays in foreground.
  // ------------------------------------------------------------------
  const LAUTENBACH_BUILDINGS = Object.freeze([
    Object.freeze({
      id: "lautenbach-wallfahrtskirche",
      src: "assets/buildings/LAUTENBACH WALLFAHRTSKIRCHE.png",
      left: 2510,
      top: 1220,
      width: 2660,
      height: 2485,

      // R36 — EXAKT AUS DER REFERENZ R27 GEMESSEN.
      // ROSA QUADRAT = begehbar, Spieler HINTER der Kirche.
      // Unterkante ist EXAKT dieselbe Linie wie die Oberkante des orangefarbenen Quadrats.
      behindZone: Object.freeze([
        [2520, 1225],
        [5110, 1225],
        [5110, 2785],
        [2520, 2785]
      ]),

      // ORANGES QUADRAT = harte Fuß-Kollision, Spieler VOR der Kirche.
      // KEIN Spalt zwischen Rosa und Orange: gemeinsame Linie y = 2785.
      blockedZone: Object.freeze([
        [2515, 2785],
        [5175, 2785],
        [5175, 3730],
        [2515, 3730]
      ])
    }),
    Object.freeze({
      id: "lautenbach-schwanenwirt",
      src: "assets/buildings/LAUTENBACH SCHWANENWIRTSCHAFT.png",
      left: 3045,
      top: 3695,
      width: 2050,
      height: 1710,
      behindZone: Object.freeze([
        [3045, 3695],
        [5095, 3695],
        [5095, 4500],
        [3045, 4500]
      ]),
      blockedZone: Object.freeze([
        [3045, 4500],
        [5095, 4500],
        [5095, 5395],
        [3045, 5395]
      ])
    })
  ]);

  // R37 — runtime references only. Building data/positions stay untouched.
  const lautenbachBuildingElements = new Map();
  const lautenbachBuildingAlphaMasks = new Map();

  function prepareLautenbachBuildingAlphaMask(config, image) {
    if (!config || !image || !image.naturalWidth || !image.naturalHeight) return;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);

      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const alpha = new Uint8Array(canvas.width * canvas.height);

      for (let src = 3, dst = 0; src < pixels.length; src += 4, dst += 1) {
        alpha[dst] = pixels[src];
      }

      lautenbachBuildingAlphaMasks.set(config.id, {
        width: canvas.width,
        height: canvas.height,
        alpha
      });
    } catch (error) {
      console.warn("Lautenbach building alpha mask unavailable:", config.id, error);
    }
  }

  function lautenbachBuildingOpaqueAtWorldPoint(config, x, y, threshold = 28) {
    const mask = lautenbachBuildingAlphaMasks.get(config.id);
    if (!mask) return null;

    const localX01 = (x - config.left) / config.width;
    const localY01 = (y - config.top) / config.height;

    if (
      localX01 < 0 || localX01 > 1 ||
      localY01 < 0 || localY01 > 1
    ) {
      return false;
    }

    const px = Math.max(
      0,
      Math.min(mask.width - 1, Math.round(localX01 * (mask.width - 1)))
    );
    const py = Math.max(
      0,
      Math.min(mask.height - 1, Math.round(localY01 * (mask.height - 1)))
    );

    // Small foot-radius sample: still follows the actual motif edge,
    // but prevents slipping through 1px anti-aliased holes.
    const radius = 2;
    for (let oy = -radius; oy <= radius; oy += 1) {
      for (let ox = -radius; ox <= radius; ox += 1) {
        const sx = Math.max(0, Math.min(mask.width - 1, px + ox));
        const sy = Math.max(0, Math.min(mask.height - 1, py + oy));
        if (mask.alpha[sy * mask.width + sx] >= threshold) return true;
      }
    }

    return false;
  }


  function getLautenbachPlayerDepthState() {
    if (MAP.id !== "lautenbach") {
      return { behindChurch: false, behindSchwanen: false };
    }

    const church = LAUTENBACH_BUILDINGS.find(
      config => config.id === "lautenbach-wallfahrtskirche"
    );
    const schwanen = LAUTENBACH_BUILDINGS.find(
      config => config.id === "lautenbach-schwanenwirt"
    );

    // UPPER church area stays EXACTLY as before:
    // pink rectangle = player behind church.
    const behindChurch =
      !!church &&
      playerX >= 2520 &&
      playerX <= 5110 &&
      playerY >= 1225 &&
      playerY < 2785;

    // Schwanenwirt data itself is untouched.
    const behindSchwanen =
      !!schwanen &&
      worldPointInPolygon(playerX, playerY, schwanen.behindZone) &&
      !worldPointInPolygon(playerX, playerY, schwanen.blockedZone);

    return { behindChurch, behindSchwanen };
  }

  function playerBehindLautenbachBuilding() {
    const state = getLautenbachPlayerDepthState();
    return state.behindChurch || state.behindSchwanen;
  }

  function updateLautenbachBuildingDepth() {
    if (MAP.id !== "lautenbach" || !playerEl) return;

    const state = getLautenbachPlayerDepthState();
    const churchEl = lautenbachBuildingElements.get("lautenbach-wallfahrtskirche");
    const schwanenEl = lautenbachBuildingElements.get("lautenbach-schwanenwirt");

    // Default building layer.
    if (churchEl) churchEl.style.zIndex = "6";
    if (schwanenEl) schwanenEl.style.zIndex = "6";

    if (state.behindChurch) {
      // Upper pink church area: unchanged — player behind church.
      playerEl.style.zIndex = "5";
      return;
    }

    if (state.behindSchwanen) {
      // CRITICAL R37 FIX:
      // player remains behind Schwanen, BUT in front of the church.
      // This is exactly the strip directly below the church where the old
      // single global z-index made him disappear behind both buildings.
      if (churchEl) churchEl.style.zIndex = "4";
      playerEl.style.zIndex = "5";
      return;
    }

    // Everywhere else, including the church's lower third/front:
    // player is fully foreground.
    playerEl.style.zIndex = "100";
  }

  function isLautenbachBuildingBlockedFootPoint(x, y) {
    if (MAP.id !== "lautenbach") return false;

    for (const config of LAUTENBACH_BUILDINGS) {
      if (config.id === "lautenbach-wallfahrtskirche") {
        // UPPER church area is deliberately walk-behind and remains untouched.
        if (y < 2785) continue;

        // LOWER THIRD ONLY:
        // collide with the visible motif pixels, NOT transparent PNG space.
        const opaque = lautenbachBuildingOpaqueAtWorldPoint(config, x, y);

        if (opaque === true) return true;
        if (opaque === false) continue;

        // Safe fallback before image alpha is ready:
        // preserve the already-working R36 orange collision.
        if (worldPointInPolygon(x, y, config.blockedZone)) return true;
        continue;
      }

      // Schwanenwirtschaft and every other Lautenbach building:
      // absolutely unchanged.
      if (worldPointInPolygon(x, y, config.blockedZone)) return true;
    }

    return false;
  }

  function installLautenbachBuildingStyles() {
    if (document.getElementById("lautenbachBuildingStyles")) return;

    const style = document.createElement("style");
    style.id = "lautenbachBuildingStyles";
    style.textContent = `
      .lautenbach-building {
        position: absolute;
        z-index: 6;
        display: block;
        object-fit: fill;
        max-width: none;
        max-height: none;
        pointer-events: none;
        user-select: none;
        -webkit-user-drag: none;
      }
    `;
    document.head.appendChild(style);
  }

  function createLautenbachBuildings() {
    installLautenbachBuildingStyles();

    for (const config of LAUTENBACH_BUILDINGS) {
      const image = document.createElement("img");
      image.id = config.id;
      image.className = "lautenbach-building";
      image.src = encodeURI(config.src);
      image.alt = "";
      image.draggable = false;
      image.style.left = `${config.left}px`;
      image.style.top = `${config.top}px`;
      image.style.width = `${config.width}px`;
      image.style.height = `${config.height}px`;
      image.style.zIndex = "6";
      image.style.display = MAP.id === "lautenbach" ? "" : "none";

      // R37: only used to make the church's LOWER THIRD collision
      // follow visible pixels instead of transparent PNG padding.
      if (config.id === "lautenbach-wallfahrtskirche") {
        image.addEventListener("load", () => {
          prepareLautenbachBuildingAlphaMask(config, image);
        }, { once: true });
      }

      world.appendChild(image);
      lautenbachBuildingElements.set(config.id, image);

      if (
        config.id === "lautenbach-wallfahrtskirche" &&
        image.complete &&
        image.naturalWidth > 0
      ) {
        prepareLautenbachBuildingAlphaMask(config, image);
      }
    }
  }

  function setLautenbachWorldVisibility(visible) {
    for (const element of world.querySelectorAll(".lautenbach-building")) {
      element.style.display = visible ? "" : "none";
    }
  }


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

    // Marked ORANGE clearance beside the church: explicitly walkable.
    // This removes the last snag without changing any other church collision.
    orangePassage: Object.freeze([
      [0.640, 0.420],
      [0.825, 0.420],
      [0.825, 0.505],
      [0.640, 0.505]
    ]),

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

  // HARD DEPTH SWITCH FOR THE TWO WALK-BEHIND TOWERS.
  function updateChurchPlayerDepth() {
    if (!playerEl) return;

    // R54 FIX:
    // Hubacker-only building sprites must be hidden BEFORE any map-specific
    // early return. Previously the LAUTENBACH branch returned first, so
    // Hubacker Hof / Neuenstein / Alt-Neuenstein could remain visible after
    // switching MAP 4 -> MAP 3.
    if (MAP.id !== "hubacker") {
      for (const element of hubackerBuildingElements.values()) {
        element.style.display = "none";
      }
    }

    // R22 MAP 2 Obsthof:
    // only the blue/purple roof zone is walk-behind.
    // blue/green stays foreground; all Oberkirch depth rules remain untouched.
    if (MAP.id === "winterbach-ranglehen") {
      playerEl.style.zIndex =
        playerBehindWinterbachObsthofFront() ? "1" : "100";
      return;
    }

    if (MAP.id === "lautenbach") {
      updateLautenbachBuildingDepth();
      return;
    }

    if (MAP.id === "hubacker") {
      updateHubackerBuildingDepth();
      return;
    }

    if (MAP.id !== "oberkirch-zentrum") {
      playerEl.style.zIndex = "100";
      return;
    }

    const c = CHURCH_CONFIG;
    const localX01 = (playerX - c.left) / c.width;
    const localY01 = (playerY - c.top) / c.height;

    const insideChurchBounds =
      localX01 >= 0 && localX01 <= 1 &&
      localY01 >= 0 && localY01 <= 1;

    const behindTower =
      insideChurchBounds &&
      churchPointIsWalkBehind(localX01, localY01);

    const behindHofRoof = playerBehindNeuensteinerHofRoof();
    const behindRoundHutRoof = playerBehindRoundHutRoof();

    // Independent depth layers remain intact:
    // 100 = normal foreground
    //   3 = behind CHURCH tower only, but still IN FRONT of R11 buildings
    //   1 = behind a specifically walk-behind R11 roof
    //
    // R13 changes ONLY the blue-circled roof of the round hut.
    if (behindHofRoof || behindRoundHutRoof) {
      playerEl.style.zIndex = "1";
    } else if (behindTower) {
      playerEl.style.zIndex = "3";
    } else {
      playerEl.style.zIndex = "100";
    }
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

    // Exact marked ORANGE passage is always walkable.
    if (pointInNormalizedPolygon(
      localX01,
      localY01,
      CHURCH_COLLISION.orangePassage
    )) return false;

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
        z-index: 110;
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

      .map-building--r11 {
        z-index: 2;
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
    // R20 MAP 2 Obsthof: PLAYER-only precise PNG collision.
    // Rabbits/animals do not call canMoveFootTo(), therefore they keep
    // moving through this asset exactly as requested.
    if (MAP.id === "winterbach-ranglehen") {
      return isWinterbachObsthofBlockedFootPoint(x, y);
    }

    // R29 MAP 3: ONLY the orange marked lower building rectangles block.
    if (MAP.id === "lautenbach") {
      return isLautenbachBuildingBlockedFootPoint(x, y);
    }

    if (MAP.id === "hubacker") {
      return isHubackerBuildingBlockedFootPoint(x, y);
    }

    if (MAP.id !== "oberkirch-zentrum") return false;

    // Precise PNG-alpha collision for the church.
    if (isChurchBlockedFootPoint(x, y)) return true;

    // Existing tavern footprint remains untouched.
    for (const polygon of BUILDING_BLOCK_ZONES) {
      if (worldPointInPolygon(x, y, polygon)) return true;
    }

    // R11 additions use the ORIGINAL transparent PNG alpha silhouettes.
    // Transparent pixels stay walkable; visible grounded pixels block.
    for (const config of R11_BUILDINGS) {
      if (isR11BuildingBlockedFootPoint(config, x, y)) return true;
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
  const debugTitle = document.querySelector("#debug strong");

  if (!game || !world || !mapImage || !playerEl || !playerSprite) {
    throw new Error("Game DOM incomplete: map/player elements missing.");
  }



  // ------------------------------------------------------------------
  // R59 NEW GAME START FLOW
  // START_NAME -> HERO_SELECT -> CAMPAIGN
  // This is a screen-only layer in front of the existing game.
  // Existing maps, spawns, combat, inventory, NPCs and map transitions
  // remain untouched underneath it.
  // ------------------------------------------------------------------
  const START_FLOW = Object.freeze({
    startImage: "assets/ui/start/HDR START SCREEN.png",
    heroSelectImage: "assets/ui/start/HDR HERO SELECT.png",
    heroImage: "assets/ui/start/HDR HERO PLAYER.png",
    titleHoldMs: 3000,
    initialFadeMs: 1800,
    panelFadeMs: 620,
    blackFadeMs: 920,
    irisMs: 2700
  });

  let startFlowState = "start-name";
  let chosenPlayerName = "";
  let startFlowUI = null;

  function gameplayUnlocked() {
    return startFlowState === "campaign";
  }


  // ------------------------------------------------------------------
  // R70 RENCHTALSTADION PHASE 1
  // Scripted arrival -> choice menu -> locked spectator position.
  // This is deliberately isolated from the normal campaign movement.
  // ------------------------------------------------------------------
  const STADIUM = Object.freeze({
    mapId: "renchtalstadion",
    arrivalStart: Object.freeze({ x: 5220, y: -40 }),
    arrivalTarget: Object.freeze({ x: 6540, y: 725 }),
    arrivalSpeed: 410,
    spectatorPoint: Object.freeze({ x: 6910, y: 1680 }),
    bookmakerPoint: Object.freeze({ x: 6380, y: 1440 }),
    bookmakerWidth: 420,
    bookmakerHeight: 630,
    bookmakerBase: "assets/npcs/renchtalstadion/BUCHMACHER BASIS.png",
    bookmakerActions: Object.freeze([
      "assets/npcs/renchtalstadion/BUCHMACHER AKTION 1.png",
      "assets/npcs/renchtalstadion/BUCHMACHER AKTION 2.png",
      "assets/npcs/renchtalstadion/BUCHMACHER AKTION 3.png",
      "assets/npcs/renchtalstadion/BUCHMACHER AKTION 4.png"
    ]),
    bookmakerWaitMs: 2000,
    bookmakerActionMs: 1000,
    bookmakerFadeMs: 190,

    // R72 PHASE 2 — bookmaker interaction / derby betting UI.
    bookmakerHoverAlphaThreshold: 24,
    derby: Object.freeze({
      schauenburgName: "DIE HERREN VON SCHAUENBURG",
      neuensteinName: "DIE HERREN ROHART-NEUENSTEIN",
      schauenburgChance: 0.70,
      neuensteinChance: 0.30,
      schauenburgOdds: 1 / 0.70,
      neuensteinOdds: 1 / 0.30,
      schauenburgCrest: "assets/ui/renchtalstadion/WAPPEN SCHAUENBURG.png",
      neuensteinCrest: "assets/ui/renchtalstadion/WAPPEN ROHART-NEUENSTEIN.png"
    }),

    // Foreground slice from the existing 10K stadium map.
    gateForeground: Object.freeze({
      src: "assets/maps/foreground/RENCHTALSTADION TOR VORDERGRUND.png",
      x: 4450,
      y: 4250,
      width: 1120,
      height: 520
    }),

    // R73 — first arena fighter / scripted derby intro.
    fightIntro: Object.freeze({
      countdownStepMs: 1000,
      pruegelMs: 980,
      frameDuration: 190,
      victoryDuration: 2000,

      // World-space foot anchors derived from the marked stadium reference.
      start: Object.freeze({ x: 5000, y: 5585 }),
      linePoint: Object.freeze({ x: 5035, y: 2910 }),
      readyPoint: Object.freeze({ x: 7820, y: 3485 }),

      speedUp: 620,
      speedRight: 620,

      fighterWidth: 700,
      fighterHeight: 1080,

      walkUpFrames: Object.freeze([
        "assets/stadium/fighters/FLEGEL WALK UP 1.png",
        "assets/stadium/fighters/FLEGEL WALK UP 2.png"
      ]),
      victoryFrame: "assets/stadium/fighters/FLEGEL VICTORY.png",
      walkRightFrames: Object.freeze([
        "assets/stadium/fighters/FLEGEL WALK RIGHT 1.png",
        "assets/stadium/fighters/FLEGEL WALK RIGHT 2.png",
        "assets/stadium/fighters/FLEGEL WALK RIGHT 3.png",
        "assets/stadium/fighters/FLEGEL WALK RIGHT 2.png"
      ]),
      readyFrame: "assets/stadium/fighters/FLEGEL READY.png"
    }),

    arena: Object.freeze({
      cx: 5090,
      cy: 3422,
      rx: 3450,
      ry: 992,
      entrance: Object.freeze({ x: 5000, y: 4414 })
    })
  });

  let stadiumState = "inactive";
  let stadiumArrivalFromOberkirch = false;
  let stadiumUI = null;
  let stadiumBookmaker = null;
  let stadiumBookmakerNextAt = 0;
  let stadiumBookmakerActionEndAt = 0;
  let stadiumBookmakerShowingAction = false;

  // R72 PHASE 2
  let stadiumMenuOpen = false;
  let stadiumBetUI = null;
  let stadiumBetOpen = false;
  let stadiumBetSelectedTeam = null;
  let stadiumBookmakerAlphaMask = null;
  let stadiumBookmakerHovered = false;
  let stadiumGateForeground = null;

  // R73 — scripted fight intro.
  let stadiumFightOverlay = null;
  let stadiumFightFighter = null;
  let stadiumFightPhaseEndAt = 0;
  let stadiumFightFrameIndex = 0;
  let stadiumFightNextFrameAt = 0;
  let stadiumFightLastState = "";
  let stadiumFightStarted = false;

  // R74 — normalize every fighter frame to one visual body height + one foot line.
  // The source PNGs may contain different transparent margins; without this, swapping
  // frames makes the fighter appear to grow/shrink or bounce even though the CSS box is fixed.
  const stadiumFightFrameMetrics = new Map();
  let stadiumFightTargetOpaqueHeight = null;
  let stadiumFightSpriteToken = 0;

  function stadiumActive() {
    return MAP.id === STADIUM.mapId && stadiumState !== "inactive";
  }

  function installStadiumStyles() {
    if (document.getElementById("stadiumPhase1Styles")) return;

    const style = document.createElement("style");
    style.id = "stadiumPhase1Styles";
    style.textContent = `
      #stadiumChoiceUI {
        position: fixed;
        inset: 0;
        z-index: 24000;
        display: grid;
        place-items: center;
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        transition: opacity 300ms ease, visibility 300ms ease;
      }

      #stadiumChoiceUI.stadium-choice--visible {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      .stadium-choice__panel {
        min-width: min(620px, 78vw);
        padding: 30px 42px 34px;
        border: 1px solid rgba(198, 151, 60, .55);
        background: rgba(5, 5, 5, .80);
        box-shadow: 0 18px 60px rgba(0,0,0,.72), inset 0 0 24px rgba(158,108,33,.10);
        backdrop-filter: blur(3px);
        text-align: center;
        user-select: none;
      }

      .stadium-choice__title {
        margin: 0 0 24px;
        color: #d8ae55;
        font-family: "Old English Text MT", "Lucida Blackletter", "UnifrakturCook", Georgia, serif;
        font-size: clamp(34px, 4.1vw, 62px);
        font-weight: 900;
        letter-spacing: 2px;
        text-shadow: 0 2px 2px #000, 0 0 13px rgba(216,174,85,.28);
      }

      .stadium-choice__item {
        display: block;
        width: 100%;
        padding: 9px 14px;
        border: 0;
        background: transparent;
        color: rgba(245,238,220,.76);
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(18px, 1.75vw, 27px);
        font-weight: 700;
        letter-spacing: .8px;
        text-align: center;
        transition: color 150ms ease, text-shadow 150ms ease, transform 150ms ease;
      }

      .stadium-choice__item:hover {
        color: #fff4d2;
        text-shadow: 0 0 10px rgba(237,199,108,.72);
        transform: scale(1.018);
      }

      .stadium-choice__item--active { cursor: pointer; }
      .stadium-choice__item--locked { cursor: default; opacity: .58; }

      #stadiumSoftCurtain {
        position: fixed;
        inset: 0;
        z-index: 23990;
        pointer-events: none;
        background: #000;
        opacity: 0;
        visibility: hidden;
        transition: opacity 360ms ease, visibility 360ms ease;
      }

      #stadiumSoftCurtain.stadium-curtain--visible {
        opacity: 1;
        visibility: visible;
      }

      .stadium-bookmaker {
        position: absolute;
        z-index: 9;
        width: ${STADIUM.bookmakerWidth}px;
        height: ${STADIUM.bookmakerHeight}px;
        transform: translate(-50%, -100%);
        transform-origin: 50% 100%;
        pointer-events: none;
        user-select: none;
        display: none;
        transition: filter 150ms ease, transform 150ms ease;
      }

      .stadium-bookmaker--hovered {
        transform: translate(-50%, -100%) scale(1.018);
        filter:
          brightness(1.16)
          drop-shadow(0 0 12px rgba(236,190,91,.70))
          drop-shadow(0 0 24px rgba(236,190,91,.34));
      }

      .stadium-bookmaker__sprite {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: 50% 100%;
        opacity: 0;
        transition: opacity ${STADIUM.bookmakerFadeMs}ms ease;
        filter: drop-shadow(0 8px 5px rgba(0,0,0,.30));
      }

      .stadium-bookmaker__sprite--visible { opacity: 1; }

      #game.stadium-bookmaker-cursor {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath fill='%23e4d2a2' stroke='%235b4023' stroke-width='1.5' d='M8 5h17c2 0 3 1 3 3s-1 3-3 3H11v13c0 2-1 3-3 3s-3-1-3-3V8c0-2 1-3 3-3Z'/%3E%3Cpath fill='none' stroke='%2384663b' stroke-width='1.4' d='M11 13h12M11 17h10M11 21h8'/%3E%3C/svg%3E") 7 7, pointer;
      }

      #stadiumBetUI {
        position: fixed;
        inset: 0;
        z-index: 24100;
        display: grid;
        place-items: center;
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        transition: opacity 260ms ease, visibility 260ms ease;
      }

      #stadiumBetUI.stadium-bet--visible {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      .stadium-bet__panel {
        width: min(760px, 86vw);
        max-height: 90vh;
        overflow: auto;
        box-sizing: border-box;
        padding: 28px 38px 32px;
        border: 1px solid rgba(198,151,60,.62);
        background: rgba(4,4,4,.84);
        box-shadow: 0 20px 70px rgba(0,0,0,.78), inset 0 0 30px rgba(158,108,33,.10);
        backdrop-filter: blur(3px);
        text-align: center;
        color: #f4eddd;
      }

      .stadium-bet__title,
      .stadium-bet__today,
      .stadium-bet__odds-title {
        font-family: "Old English Text MT", "Lucida Blackletter", "UnifrakturCook", Georgia, serif;
        color: #ddb45d;
        font-weight: 900;
        text-shadow: 0 2px 2px #000, 0 0 12px rgba(221,180,93,.28);
      }

      .stadium-bet__title {
        font-size: clamp(32px, 4vw, 55px);
        letter-spacing: 1.8px;
        line-height: 1.02;
      }

      .stadium-bet__title span {
        display: block;
        white-space: nowrap;
      }

      .stadium-bet__today {
        margin-top: 9px;
        font-size: clamp(23px, 2.4vw, 34px);
      }

      .stadium-bet__matchup {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 18px;
        align-items: center;
        margin: 22px 0 18px;
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(17px, 1.65vw, 24px);
        font-weight: 900;
        line-height: 1.16;
      }

      .stadium-bet__team--schauenburg {
        color: #d9463f;
        text-shadow: 0 0 9px rgba(217,70,63,.25);
      }

      .stadium-bet__team--neuenstein {
        color: #70dce3;
        text-shadow: 0 0 9px rgba(112,220,227,.25);
      }

      .stadium-bet__swords {
        color: #e7dfce;
        font-size: 36px;
        text-shadow: 0 2px 3px #000;
      }

      .stadium-bet__odds-title {
        margin-top: 4px;
        font-size: 26px;
      }

      .stadium-bet__odds {
        display: flex;
        justify-content: center;
        gap: 42px;
        margin: 8px 0 18px;
        color: #ddb45d;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 20px;
        font-weight: 800;
      }

      .stadium-bet__crests {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 78px;
        min-height: 180px;
        margin: 8px 0 14px;
      }

      .stadium-bet__crest {
        width: 150px;
        height: 170px;
        border: 0;
        padding: 7px;
        background: transparent;
        cursor: pointer;
        transition: transform 150ms ease, filter 150ms ease;
      }

      .stadium-bet__crest img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        pointer-events: none;
      }

      .stadium-bet__crest:hover {
        transform: scale(1.055);
        filter: brightness(1.13) drop-shadow(0 0 10px rgba(237,199,108,.52));
      }

      .stadium-bet__crest--selected {
        transform: scale(1.065);
        filter:
          brightness(1.18)
          drop-shadow(0 0 11px rgba(237,199,108,.95))
          drop-shadow(0 0 24px rgba(237,199,108,.42));
      }

      .stadium-bet__stake-label {
        margin-top: 4px;
        color: #fff;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 21px;
        font-weight: 800;
      }

      .stadium-bet__stake-row {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 260px;
        min-height: 44px;
        margin: 9px auto 10px;
      }

      .stadium-bet__stake {
        display: block;
        width: 190px;
        box-sizing: border-box;
        margin: 0 auto;
        padding: 9px 12px;
        border: 1px solid rgba(216,174,85,.58);
        background: rgba(0,0,0,.64);
        color: #fff7e8;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 22px;
        text-align: center;
        outline: none;
      }

      .stadium-bet__penny {
        position: absolute;
        left: calc(50% + 105px);
        top: 50%;
        transform: translateY(-50%);
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        color: #d8ae55;
        border: 2px solid #a67d31;
        background: radial-gradient(circle at 35% 30%, #7d622f, #19150e 74%);
        font-family: Georgia, serif;
        font-weight: 900;
        box-shadow: 0 2px 4px rgba(0,0,0,.65);
      }

      .stadium-bet__submit {
        display: block;
        width: max-content;
        margin: 0 auto;
        border: 0;
        background: transparent;
        color: #fff;
        padding: 8px 18px;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 22px;
        font-weight: 800;
        text-align: center;
        cursor: pointer;
        transition: color 150ms ease, text-shadow 150ms ease, transform 150ms ease;
      }

      .stadium-bet__submit:hover {
        color: #fff1c9;
        text-shadow: 0 0 11px rgba(237,199,108,.75);
        transform: scale(1.025);
      }

      .stadium-fight-overlay {
        position: fixed;
        inset: 0;
        z-index: 24250;
        display: grid;
        place-items: center;
        pointer-events: none;
        user-select: none;
        opacity: 0;
        visibility: hidden;
      }

      .stadium-fight-overlay--visible {
        opacity: 1;
        visibility: visible;
      }

      .stadium-fight-countdown {
        color: #9e1717;
        font-family: "Old English Text MT", "Lucida Blackletter", "UnifrakturCook", Georgia, serif;
        font-size: clamp(92px, 12vw, 190px);
        font-weight: 900;
        line-height: 1;
        text-shadow:
          0 4px 2px rgba(0,0,0,.98),
          0 0 10px rgba(0,0,0,.95),
          0 0 22px rgba(116,0,0,.62);
      }

      .stadium-fight-pruegel {
        color: #a91818;
        font-family: "Old English Text MT", "Lucida Blackletter", "UnifrakturCook", Georgia, serif;
        font-size: clamp(78px, 11vw, 180px);
        font-weight: 900;
        line-height: .9;
        letter-spacing: 2px;
        text-shadow:
          0 5px 2px rgba(0,0,0,.98),
          0 0 13px rgba(0,0,0,.9),
          0 0 28px rgba(126,0,0,.72);
        animation: stadiumPruegelBurst ${STADIUM.fightIntro.pruegelMs}ms both;
        will-change: transform, opacity, filter;
      }

      @keyframes stadiumPruegelBurst {
        0% {
          opacity: 0;
          transform: scale(.05);
          filter: blur(2px);
        }
        42% {
          opacity: 1;
          transform: scale(1.08);
          filter: blur(0);
        }
        58% {
          opacity: 1;
          transform: scale(1);
          filter: blur(0);
        }
        72% {
          opacity: 1;
          transform: scale(1);
          filter: blur(0);
        }
        100% {
          opacity: 0;
          transform: scale(1.36);
          filter: blur(4px);
        }
      }

      .stadium-fighter {
        position: absolute;
        z-index: 17;
        width: ${STADIUM.fightIntro.fighterWidth}px;
        height: ${STADIUM.fightIntro.fighterHeight}px;
        transform: translate(-50%, -100%);
        transform-origin: 50% 100%;
        pointer-events: none;
        user-select: none;
        display: none;
        will-change: left, top;
      }

      .stadium-fighter--visible {
        display: block;
      }

      .stadium-fighter__sprite {
        position: absolute;
        left: 50%;
        bottom: 0;
        top: auto;
        right: auto;
        width: auto;
        height: auto;
        max-width: none;
        max-height: none;
        object-fit: fill;
        filter: drop-shadow(0 8px 5px rgba(0,0,0,.28));
        transform: translateX(-50%);
        transform-origin: 50% 100%;
        opacity: 0;
        visibility: hidden;
        transition: none !important;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }

      .stadium-fighter__sprite--active {
        opacity: 1;
        visibility: visible;
      }

      .stadium-gate-foreground {
        position: absolute;
        z-index: 18;
        pointer-events: none;
        user-select: none;
        object-fit: fill;
        display: none;
      }
    `;
    document.head.appendChild(style);
  }

  function createStadiumPhase1() {
    installStadiumStyles();

    const root = document.createElement("div");
    root.id = "stadiumChoiceUI";
    root.innerHTML = `
      <div class="stadium-choice__panel" role="dialog" aria-modal="true" aria-label="RENCHTALSTADION">
        <div class="stadium-choice__title">RENCHTALSTADION</div>
        <button type="button" class="stadium-choice__item stadium-choice__item--active" data-stadium-choice="spectator">AUF TRIBÜNE PLATZNEHMEN</button>
        <button type="button" class="stadium-choice__item stadium-choice__item--locked" data-stadium-choice="zusenhofen">WEITER NACH ZUSENHOFEN</button>
        <button type="button" class="stadium-choice__item stadium-choice__item--locked" data-stadium-choice="nussbach">WEITER RICHTUNG NUSSBACH</button>
        <button type="button" class="stadium-choice__item stadium-choice__item--active" data-stadium-choice="oberkirch">ZURÜCK NACH OBERKIRCH</button>
      </div>`;
    game.appendChild(root);

    const curtain = document.createElement("div");
    curtain.id = "stadiumSoftCurtain";
    game.appendChild(curtain);

    root.addEventListener("click", (event) => {
      const button = event.target.closest("[data-stadium-choice]");
      if (!button || !stadiumMenuOpen || MAP.id !== STADIUM.mapId) return;
      const choice = button.dataset.stadiumChoice;

      if (choice === "spectator") {
        if (stadiumState === "entrance-menu") {
          stadiumMoveToSpectator();
        } else {
          // R74: ESC menu may also be opened during countdown / arena intro / fight.
          // Returning to the current stadium view simply closes the menu.
          hideStadiumMenu();
        }
      } else if (choice === "oberkirch") {
        stadiumReturnToOberkirch();
      }
    });

    const bookmaker = document.createElement("div");
    bookmaker.id = "stadiumBookmaker";
    bookmaker.className = "stadium-bookmaker";
    bookmaker.style.left = `${STADIUM.bookmakerPoint.x}px`;
    bookmaker.style.top = `${STADIUM.bookmakerPoint.y}px`;

    const base = document.createElement("img");
    base.className = "stadium-bookmaker__sprite stadium-bookmaker__sprite--visible";
    base.src = encodeURI(STADIUM.bookmakerBase);
    base.alt = "";
    base.draggable = false;

    const action = document.createElement("img");
    action.className = "stadium-bookmaker__sprite";
    action.src = encodeURI(STADIUM.bookmakerActions[0]);
    action.alt = "";
    action.draggable = false;

    bookmaker.append(base, action);
    world.appendChild(bookmaker);

    base.addEventListener("load", () => prepareStadiumBookmakerAlphaMask(base));

    for (const src of [STADIUM.bookmakerBase, ...STADIUM.bookmakerActions]) {
      const preload = new Image();
      preload.src = encodeURI(src);
    }

    const betRoot = document.createElement("div");
    betRoot.id = "stadiumBetUI";
    betRoot.innerHTML = `
      <div class="stadium-bet__panel" role="dialog" aria-modal="true" aria-label="BUCHMACHER DON FREDO">
        <div class="stadium-bet__title">
          <span>BUCHMACHER</span>
          <span>DON FREDO</span>
        </div>
        <div class="stadium-bet__today">HEUTE: DERBY!</div>

        <div class="stadium-bet__matchup">
          <div class="stadium-bet__team stadium-bet__team--schauenburg">${STADIUM.derby.schauenburgName}</div>
          <div class="stadium-bet__swords" aria-label="fehdet gegen">⚔</div>
          <div class="stadium-bet__team stadium-bet__team--neuenstein">${STADIUM.derby.neuensteinName}</div>
        </div>

        <div class="stadium-bet__odds-title">QUOTE</div>
        <div class="stadium-bet__odds">
          <span>SCHAUENBURG&nbsp;&nbsp;${STADIUM.derby.schauenburgOdds.toFixed(2).replace(".", ",")}</span>
          <span>ROHART-NEUENSTEIN&nbsp;&nbsp;${STADIUM.derby.neuensteinOdds.toFixed(2).replace(".", ",")}</span>
        </div>

        <div class="stadium-bet__crests">
          <button type="button" class="stadium-bet__crest" data-bet-team="schauenburg" aria-label="Auf Schauenburg setzen">
            <img src="${encodeURI(STADIUM.derby.schauenburgCrest)}" alt="">
          </button>
          <button type="button" class="stadium-bet__crest" data-bet-team="neuenstein" aria-label="Auf Rohart-Neuenstein setzen">
            <img src="${encodeURI(STADIUM.derby.neuensteinCrest)}" alt="">
          </button>
        </div>

        <div class="stadium-bet__stake-label">EINSATZ</div>
        <div class="stadium-bet__stake-row">
          <input id="stadiumBetStake" class="stadium-bet__stake" type="text" inputmode="numeric" maxlength="9" autocomplete="off" aria-label="Einsatz in Pfennig">
          <span class="stadium-bet__penny" aria-hidden="true">₰</span>
        </div>

        <button type="button" class="stadium-bet__submit" id="stadiumBetSubmit">Wette abschließen</button>
      </div>`;
    game.appendChild(betRoot);

    const stake = betRoot.querySelector("#stadiumBetStake");
    stake.addEventListener("input", () => {
      stake.value = stake.value.replace(/\D+/g, "").replace(/^0+(?=\d)/, "");
    });

    betRoot.addEventListener("click", (event) => {
      const crest = event.target.closest("[data-bet-team]");
      if (crest) {
        stadiumBetSelectedTeam = crest.dataset.betTeam;
        for (const node of betRoot.querySelectorAll("[data-bet-team]")) {
          node.classList.toggle(
            "stadium-bet__crest--selected",
            node.dataset.betTeam === stadiumBetSelectedTeam
          );
        }
        return;
      }

      if (event.target.closest("#stadiumBetSubmit")) {
        // R73: close the bookmaker panel and begin the first scripted arena intro.
        // R73 FIX: during the current arena-intro test, submitting always starts
        // the scripted fight sequence. Bet validation will be restored later.
        closeStadiumBetUI();
        beginStadiumFightIntro();
        return;
      }
    });

    // R73 — screen-space countdown / PRÜGEL overlay.
    const fightOverlay = document.createElement("div");
    fightOverlay.id = "stadiumFightOverlay";
    fightOverlay.className = "stadium-fight-overlay";
    game.appendChild(fightOverlay);

    // R73 — world-space arena fighter. The existing gate foreground remains above it
    // so the fighter is progressively hidden while passing through the south gate.
    const fighterRoot = document.createElement("div");
    fighterRoot.id = "stadiumFighterA";
    fighterRoot.className = "stadium-fighter";
    fighterRoot.style.left = `${STADIUM.fightIntro.start.x}px`;
    fighterRoot.style.top = `${STADIUM.fightIntro.start.y}px`;

    // R75: double-buffered fighter sprites. Two image layers guarantee that
    // WALK UP 1 <-> WALK UP 2 and all side-running frames visibly alternate
    // without a blank frame while the next PNG is decoded.
    const fighterImageA = document.createElement("img");
    fighterImageA.className = "stadium-fighter__sprite stadium-fighter__sprite--active";
    fighterImageA.src = encodeURI(STADIUM.fightIntro.walkUpFrames[0]);
    fighterImageA.alt = "";
    fighterImageA.draggable = false;

    const fighterImageB = document.createElement("img");
    fighterImageB.className = "stadium-fighter__sprite";
    fighterImageB.alt = "";
    fighterImageB.draggable = false;

    fighterRoot.append(fighterImageA, fighterImageB);
    world.appendChild(fighterRoot);

    for (const fighterSrc of [
      ...STADIUM.fightIntro.walkUpFrames,
      STADIUM.fightIntro.victoryFrame,
      ...STADIUM.fightIntro.walkRightFrames,
      STADIUM.fightIntro.readyFrame
    ]) {
      const preload = new Image();
      preload.onload = () => {
        getStadiumFightOpaqueMetrics(preload);
        if (fighterSrc === STADIUM.fightIntro.readyFrame) {
          const metrics = getStadiumFightOpaqueMetrics(preload);
          if (metrics) {
            const fit = Math.min(
              STADIUM.fightIntro.fighterWidth / metrics.naturalWidth,
              STADIUM.fightIntro.fighterHeight / metrics.naturalHeight
            );
            stadiumFightTargetOpaqueHeight = metrics.height * fit;
          }
        }
      };
      preload.src = encodeURI(fighterSrc);
      if (preload.complete && preload.naturalWidth > 0) preload.onload();
    }

    const gate = document.createElement("img");
    gate.id = "stadiumGateForeground";
    gate.className = "stadium-gate-foreground";
    gate.src = encodeURI(STADIUM.gateForeground.src);
    gate.alt = "";
    gate.draggable = false;
    gate.style.left = `${STADIUM.gateForeground.x}px`;
    gate.style.top = `${STADIUM.gateForeground.y}px`;
    gate.style.width = `${STADIUM.gateForeground.width}px`;
    gate.style.height = `${STADIUM.gateForeground.height}px`;
    world.appendChild(gate);

    stadiumUI = { root, curtain };
    stadiumBookmaker = { root: bookmaker, base, action };
    stadiumBetUI = { root: betRoot, stake };
    stadiumFightOverlay = fightOverlay;
    stadiumFightFighter = {
      root: fighterRoot,
      images: [fighterImageA, fighterImageB],
      activeIndex: 0,
      currentSrc: STADIUM.fightIntro.walkUpFrames[0],
      x: STADIUM.fightIntro.start.x,
      y: STADIUM.fightIntro.start.y
    };
    stadiumGateForeground = gate;

    if (base.complete && base.naturalWidth > 0) {
      prepareStadiumBookmakerAlphaMask(base);
    }

    game.addEventListener("pointermove", updateStadiumBookmakerHoverFromPointer);
    game.addEventListener("pointerleave", clearStadiumBookmakerHover);
    game.addEventListener("click", (event) => {
      if (
        stadiumBookmakerHovered &&
        stadiumState === "spectator" &&
        !stadiumMenuOpen &&
        !stadiumBetOpen &&
        !event.target.closest("#stadiumBetUI")
      ) {
        openStadiumBetUI();
      }
    });
  }

  function prepareStadiumBookmakerAlphaMask(image) {
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
      const alpha = new Uint8Array(canvas.width * canvas.height);

      for (let srcIndex = 3, dst = 0; srcIndex < pixels.length; srcIndex += 4, dst += 1) {
        alpha[dst] = pixels[srcIndex];
      }

      stadiumBookmakerAlphaMask = {
        width: canvas.width,
        height: canvas.height,
        alpha
      };
    } catch (error) {
      stadiumBookmakerAlphaMask = null;
      console.warn("Stadium bookmaker alpha mask unavailable:", error);
    }
  }

  function clientPointToStadiumWorld(clientX, clientY) {
    const rect = world.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;

    return {
      x: ((clientX - rect.left) / rect.width) * MAP.width,
      y: ((clientY - rect.top) / rect.height) * MAP.height
    };
  }

  function stadiumBookmakerOpaqueAtWorldPoint(x, y) {
    if (!stadiumBookmakerAlphaMask) return false;

    const left = STADIUM.bookmakerPoint.x - STADIUM.bookmakerWidth / 2;
    const top = STADIUM.bookmakerPoint.y - STADIUM.bookmakerHeight;
    const u = (x - left) / STADIUM.bookmakerWidth;
    const v = (y - top) / STADIUM.bookmakerHeight;

    if (u < 0 || u > 1 || v < 0 || v > 1) return false;

    const mask = stadiumBookmakerAlphaMask;
    const px = Math.max(0, Math.min(mask.width - 1, Math.round(u * (mask.width - 1))));
    const py = Math.max(0, Math.min(mask.height - 1, Math.round(v * (mask.height - 1))));
    return mask.alpha[py * mask.width + px] >= STADIUM.bookmakerHoverAlphaThreshold;
  }

  function clearStadiumBookmakerHover() {
    stadiumBookmakerHovered = false;
    game.classList.remove("stadium-bookmaker-cursor");
    if (stadiumBookmaker) {
      stadiumBookmaker.root.classList.remove("stadium-bookmaker--hovered");
    }
  }

  function updateStadiumBookmakerHoverFromPointer(event) {
    if (
      MAP.id !== STADIUM.mapId ||
      stadiumState !== "spectator" ||
      stadiumMenuOpen ||
      stadiumBetOpen ||
      !stadiumBookmaker ||
      !stadiumBookmakerAlphaMask
    ) {
      clearStadiumBookmakerHover();
      return;
    }

    const point = clientPointToStadiumWorld(event.clientX, event.clientY);
    const hovered = !!point && stadiumBookmakerOpaqueAtWorldPoint(point.x, point.y);

    stadiumBookmakerHovered = hovered;
    game.classList.toggle("stadium-bookmaker-cursor", hovered);
    stadiumBookmaker.root.classList.toggle("stadium-bookmaker--hovered", hovered);
  }

  function openStadiumBetUI() {
    if (!stadiumBetUI || stadiumState !== "spectator" || stadiumMenuOpen) return;
    stadiumBetOpen = true;
    clearStadiumBookmakerHover();
    stadiumBetUI.root.classList.add("stadium-bet--visible");
  }

  function closeStadiumBetUI() {
    if (!stadiumBetUI) return;
    stadiumBetOpen = false;
    stadiumBetUI.root.classList.remove("stadium-bet--visible");
    if (document.activeElement === stadiumBetUI.stake) stadiumBetUI.stake.blur();
  }

  function setStadiumFightOverlay(kind, text = "") {
    if (!stadiumFightOverlay) return;
    stadiumFightOverlay.innerHTML = "";

    if (!kind) {
      stadiumFightOverlay.classList.remove("stadium-fight-overlay--visible");
      return;
    }

    const node = document.createElement("div");
    node.className = kind === "pruegel"
      ? "stadium-fight-pruegel"
      : "stadium-fight-countdown";
    node.textContent = text;
    stadiumFightOverlay.appendChild(node);
    stadiumFightOverlay.classList.add("stadium-fight-overlay--visible");
  }

  function getStadiumFightOpaqueMetrics(image) {
    if (!image || !image.naturalWidth || !image.naturalHeight) return null;

    const key = image.currentSrc || image.src;
    if (stadiumFightFrameMetrics.has(key)) return stadiumFightFrameMetrics.get(key);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      let minX = canvas.width, minY = canvas.height, maxX = -1, maxY = -1;
      for (let y = 0; y < canvas.height; y += 1) {
        for (let x = 0; x < canvas.width; x += 1) {
          if (data[(y * canvas.width + x) * 4 + 3] < 20) continue;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }

      if (maxX < minX || maxY < minY) return null;

      // Ground anchor: ignore only the extreme outer 8% of the canvas so a
      // dangling flail/cape edge can never pull the character's feet up/down.
      const footX1 = Math.floor(canvas.width * 0.08);
      const footX2 = Math.ceil(canvas.width * 0.92);
      let footBottomY = -1;
      for (let y = canvas.height - 1; y >= minY && footBottomY < 0; y -= 1) {
        for (let x = footX1; x <= footX2; x += 1) {
          if (data[(y * canvas.width + x) * 4 + 3] >= 20) {
            footBottomY = y;
            break;
          }
        }
      }
      if (footBottomY < 0) footBottomY = maxY;

      const metrics = {
        width: maxX - minX + 1,
        height: maxY - minY + 1,
        minY,
        maxY,
        footBottomY,
        naturalWidth: canvas.width,
        naturalHeight: canvas.height
      };
      stadiumFightFrameMetrics.set(key, metrics);
      return metrics;
    } catch (_) {
      return null;
    }
  }

  function ensureStadiumFightReadyReference() {
    if (stadiumFightTargetOpaqueHeight != null) return true;
    const reference = new Image();
    reference.src = encodeURI(STADIUM.fightIntro.readyFrame);
    if (!reference.complete || !reference.naturalWidth) return false;
    const metrics = getStadiumFightOpaqueMetrics(reference);
    if (!metrics) return false;
    const fit = Math.min(
      STADIUM.fightIntro.fighterWidth / metrics.naturalWidth,
      STADIUM.fightIntro.fighterHeight / metrics.naturalHeight
    );
    stadiumFightTargetOpaqueHeight = metrics.height * fit;
    return true;
  }

  function layoutStadiumFightSprite(image) {
    if (!stadiumFightFighter || !image || !image.naturalWidth || !image.naturalHeight) return;
    const metrics = getStadiumFightOpaqueMetrics(image);
    if (!metrics) return;

    // R75 BOUNCE FIX:
    // Do NOT use object-fit and do NOT scale the existing fixed box. Different
    // source PNG canvas sizes (for example 1024x1536 vs 1254x1254) otherwise
    // produce different rendered character sizes. Instead every frame receives
    // one explicit pixel size derived from the actual opaque figure height.
    if (stadiumFightTargetOpaqueHeight == null) ensureStadiumFightReadyReference();
    if (stadiumFightTargetOpaqueHeight == null) return;

    const scale = stadiumFightTargetOpaqueHeight / Math.max(1, metrics.height);
    const renderedWidth = metrics.naturalWidth * scale;
    const renderedHeight = metrics.naturalHeight * scale;

    // Pin the actual lower character silhouette to the root's world-space foot
    // anchor. Canvas padding and differing source aspect ratios can no longer
    // create vertical bouncing.
    const footGap = (metrics.naturalHeight - 1 - metrics.footBottomY) * scale;

    image.style.width = `${renderedWidth.toFixed(3)}px`;
    image.style.height = `${renderedHeight.toFixed(3)}px`;
    image.style.bottom = `${(-footGap).toFixed(3)}px`;
    image.style.transform = "translateX(-50%)";
  }

  function setStadiumFightSprite(src, force = false) {
    if (!stadiumFightFighter || !src) return;
    if (!force && stadiumFightFighter.currentSrc === src) return;

    const token = ++stadiumFightSpriteToken;
    const nextIndex = 1 - stadiumFightFighter.activeIndex;
    const nextImage = stadiumFightFighter.images[nextIndex];
    const oldImage = stadiumFightFighter.images[stadiumFightFighter.activeIndex];
    const encoded = encodeURI(src);

    const reveal = () => {
      if (token !== stadiumFightSpriteToken) return;
      layoutStadiumFightSprite(nextImage);
      nextImage.classList.add("stadium-fighter__sprite--active");
      oldImage.classList.remove("stadium-fighter__sprite--active");
      stadiumFightFighter.activeIndex = nextIndex;
      stadiumFightFighter.currentSrc = src;
    };

    nextImage.onload = reveal;
    nextImage.src = encoded;
    if (nextImage.complete && nextImage.naturalWidth > 0) reveal();
  }

  function setStadiumFightPosition(x, y) {
    if (!stadiumFightFighter) return;
    stadiumFightFighter.x = x;
    stadiumFightFighter.y = y;
    stadiumFightFighter.root.style.left = `${x}px`;
    stadiumFightFighter.root.style.top = `${y}px`;
  }

  function resetStadiumFightIntro() {
    stadiumFightStarted = false;
    stadiumFightPhaseEndAt = 0;
    stadiumFightFrameIndex = 0;
    stadiumFightNextFrameAt = 0;
    stadiumFightLastState = "";
    ensureStadiumFightReadyReference();
    setStadiumFightOverlay(null);

    if (stadiumFightFighter) {
      stadiumFightFighter.root.classList.remove("stadium-fighter--visible");
      setStadiumFightPosition(STADIUM.fightIntro.start.x, STADIUM.fightIntro.start.y);
      setStadiumFightSprite(STADIUM.fightIntro.walkUpFrames[0], true);
    }
  }

  function beginStadiumFightIntro(now = performance.now()) {
    if (
      MAP.id !== STADIUM.mapId ||
      stadiumState !== "spectator" ||
      stadiumFightStarted
    ) return;

    stadiumFightStarted = true;
    keys.clear();
    clearStadiumBookmakerHover();
    closeStadiumBetUI();

    if (stadiumFightFighter) {
      stadiumFightFighter.root.classList.remove("stadium-fighter--visible");
      setStadiumFightPosition(STADIUM.fightIntro.start.x, STADIUM.fightIntro.start.y);
      setStadiumFightSprite(STADIUM.fightIntro.walkUpFrames[0], true);
    }

    stadiumState = "fight-countdown-3";
    stadiumFightPhaseEndAt = now + STADIUM.fightIntro.countdownStepMs;
    setStadiumFightOverlay("countdown", "3");
  }

  function advanceStadiumFightCountdown(now) {
    if (stadiumState === "fight-countdown-3") {
      stadiumState = "fight-countdown-2";
      stadiumFightPhaseEndAt = now + STADIUM.fightIntro.countdownStepMs;
      setStadiumFightOverlay("countdown", "2");
      return true;
    }

    if (stadiumState === "fight-countdown-2") {
      stadiumState = "fight-countdown-1";
      stadiumFightPhaseEndAt = now + STADIUM.fightIntro.countdownStepMs;
      setStadiumFightOverlay("countdown", "1");
      return true;
    }

    if (stadiumState === "fight-countdown-1") {
      stadiumState = "fight-countdown-0";
      stadiumFightPhaseEndAt = now + STADIUM.fightIntro.countdownStepMs;
      setStadiumFightOverlay("countdown", "0");
      return true;
    }

    if (stadiumState === "fight-countdown-0") {
      stadiumState = "fight-pruegel";
      stadiumFightPhaseEndAt = now + STADIUM.fightIntro.pruegelMs;
      setStadiumFightOverlay("pruegel", "PRÜGEL!");
      return true;
    }

    return false;
  }

  function beginStadiumFighterWalkUp(now) {
    stadiumState = "fighter-entry-up";
    stadiumFightFrameIndex = 0;
    stadiumFightNextFrameAt = now + STADIUM.fightIntro.frameDuration;
    setStadiumFightOverlay(null);
    setStadiumFightPosition(STADIUM.fightIntro.start.x, STADIUM.fightIntro.start.y);
    setStadiumFightSprite(STADIUM.fightIntro.walkUpFrames[0], true);
    if (stadiumFightFighter) {
      stadiumFightFighter.root.classList.add("stadium-fighter--visible");
    }
  }

  function updateStadiumFighterWalkAnimation(now, frames) {
    if (!stadiumFightFighter || !frames.length) return;
    if (now < stadiumFightNextFrameAt) return;

    while (now >= stadiumFightNextFrameAt) {
      stadiumFightFrameIndex = (stadiumFightFrameIndex + 1) % frames.length;
      stadiumFightNextFrameAt += STADIUM.fightIntro.frameDuration;
    }
    setStadiumFightSprite(frames[stadiumFightFrameIndex]);
  }

  function moveStadiumFighterToward(target, speed, deltaSeconds) {
    if (!stadiumFightFighter) return true;

    const dx = target.x - stadiumFightFighter.x;
    const dy = target.y - stadiumFightFighter.y;
    const distance = Math.hypot(dx, dy);

    if (distance <= 4) {
      setStadiumFightPosition(target.x, target.y);
      return true;
    }

    const step = Math.min(distance, speed * deltaSeconds);
    setStadiumFightPosition(
      stadiumFightFighter.x + (dx / distance) * step,
      stadiumFightFighter.y + (dy / distance) * step
    );

    if (step >= distance) {
      setStadiumFightPosition(target.x, target.y);
      return true;
    }
    return false;
  }

  function updateStadiumFightIntro(deltaSeconds, now) {
    if (!stadiumFightStarted || MAP.id !== STADIUM.mapId) return;

    if (stadiumState.startsWith("fight-countdown-")) {
      if (now >= stadiumFightPhaseEndAt) advanceStadiumFightCountdown(now);
      return;
    }

    if (stadiumState === "fight-pruegel") {
      if (now >= stadiumFightPhaseEndAt) beginStadiumFighterWalkUp(now);
      return;
    }

    if (stadiumState === "fighter-entry-up") {
      updateStadiumFighterWalkAnimation(now, STADIUM.fightIntro.walkUpFrames);

      if (
        moveStadiumFighterToward(
          STADIUM.fightIntro.linePoint,
          STADIUM.fightIntro.speedUp,
          deltaSeconds
        )
      ) {
        stadiumState = "fighter-victory";
        stadiumFightPhaseEndAt = now + STADIUM.fightIntro.victoryDuration;
        setStadiumFightSprite(STADIUM.fightIntro.victoryFrame);
      }
      return;
    }

    if (stadiumState === "fighter-victory") {
      if (now < stadiumFightPhaseEndAt) return;

      stadiumState = "fighter-entry-right";
      stadiumFightFrameIndex = 0;
      stadiumFightNextFrameAt = now + STADIUM.fightIntro.frameDuration;
      setStadiumFightSprite(STADIUM.fightIntro.walkRightFrames[0]);
      return;
    }

    if (stadiumState === "fighter-entry-right") {
      updateStadiumFighterWalkAnimation(now, STADIUM.fightIntro.walkRightFrames);

      if (
        moveStadiumFighterToward(
          STADIUM.fightIntro.readyPoint,
          STADIUM.fightIntro.speedRight,
          deltaSeconds
        )
      ) {
        stadiumState = "fighter-ready";
        setStadiumFightSprite(STADIUM.fightIntro.readyFrame);
      }
      return;
    }
  }

  function setStadiumBookmakerVisibility() {
    if (!stadiumBookmaker) return;
    stadiumBookmaker.root.style.display = MAP.id === STADIUM.mapId ? "block" : "none";
    if (MAP.id !== STADIUM.mapId) clearStadiumBookmakerHover();
  }

  function setStadiumGateVisibility() {
    if (!stadiumGateForeground) return;
    stadiumGateForeground.style.display = MAP.id === STADIUM.mapId ? "block" : "none";
  }

  function resetStadiumBookmaker(now = performance.now()) {
    if (!stadiumBookmaker) return;
    stadiumBookmaker.base.classList.add("stadium-bookmaker__sprite--visible");
    stadiumBookmaker.action.classList.remove("stadium-bookmaker__sprite--visible");
    stadiumBookmakerShowingAction = false;
    stadiumBookmakerActionEndAt = 0;
    stadiumBookmakerNextAt = now + STADIUM.bookmakerWaitMs;
  }

  function updateStadiumBookmaker(now) {
    if (!stadiumBookmaker || MAP.id !== STADIUM.mapId) return;

    if (stadiumBookmakerShowingAction) {
      if (now < stadiumBookmakerActionEndAt) return;
      stadiumBookmaker.action.classList.remove("stadium-bookmaker__sprite--visible");
      stadiumBookmaker.base.classList.add("stadium-bookmaker__sprite--visible");
      stadiumBookmakerShowingAction = false;
      stadiumBookmakerNextAt = now + STADIUM.bookmakerWaitMs;
      return;
    }

    if (now < stadiumBookmakerNextAt) return;
    const src = STADIUM.bookmakerActions[Math.floor(Math.random() * STADIUM.bookmakerActions.length)];
    stadiumBookmaker.action.src = encodeURI(src);
    stadiumBookmaker.base.classList.remove("stadium-bookmaker__sprite--visible");
    stadiumBookmaker.action.classList.add("stadium-bookmaker__sprite--visible");
    stadiumBookmakerShowingAction = true;
    stadiumBookmakerActionEndAt = now + STADIUM.bookmakerActionMs;
  }

  function showStadiumMenu() {
    if (!stadiumUI || MAP.id !== STADIUM.mapId) return;
    closeStadiumBetUI();
    clearStadiumBookmakerHover();
    stadiumMenuOpen = true;
    stadiumUI.root.classList.add("stadium-choice--visible");
  }

  function hideStadiumMenu() {
    if (!stadiumUI) return;
    stadiumMenuOpen = false;
    stadiumUI.root.classList.remove("stadium-choice--visible");
  }

  function beginStadiumArrival() {
    if (MAP.id !== STADIUM.mapId) return;
    resetStadiumFightIntro();
    stadiumState = "arrival-walk";
    keys.clear();
    cancelAttackImmediately();
    if (blocking) stopBlocking();
    playerX = STADIUM.arrivalStart.x;
    playerY = STADIUM.arrivalStart.y;
    cameraX = playerX;
    cameraY = playerY;
    facing = "down";
    moving = true;
    playerEl.classList.add("player--moving");
    playerEl.classList.remove("player--idle");
    setAnimation("down");
    resetStadiumBookmaker();
    setStadiumBookmakerVisibility();
    renderPlayer();
  }

  function finishStadiumArrival() {
    playerX = STADIUM.arrivalTarget.x;
    playerY = STADIUM.arrivalTarget.y;
    cameraX = playerX;
    cameraY = playerY;
    moving = false;
    facing = "down";
    setAnimation("idle");
    forceSprite(PLAYER.standDown);
    playerEl.classList.remove("player--moving");
    playerEl.classList.add("player--idle");
    stadiumState = "entrance-menu";
    showStadiumMenu();
  }

  function updateStadiumArrival(deltaSeconds) {
    const dx = STADIUM.arrivalTarget.x - playerX;
    const dy = STADIUM.arrivalTarget.y - playerY;
    const distance = Math.hypot(dx, dy);

    if (distance <= 8) {
      finishStadiumArrival();
      return;
    }

    const step = Math.min(distance, STADIUM.arrivalSpeed * deltaSeconds);
    playerX += (dx / distance) * step;
    playerY += (dy / distance) * step;
    cameraX = playerX;
    cameraY = playerY;
    facing = "down";
    setAnimation("down");
    renderMovementFrame("down", deltaSeconds);
  }

  async function stadiumMoveToSpectator() {
    if (!stadiumUI || stadiumState !== "entrance-menu") return;
    stadiumState = "spectator-transition";
    hideStadiumMenu();
    stadiumUI.curtain.classList.add("stadium-curtain--visible");
    await waitMs(380);

    playerX = STADIUM.spectatorPoint.x;
    playerY = STADIUM.spectatorPoint.y;
    cameraX = playerX;
    cameraY = playerY;
    facing = "down";
    lastHorizontalFacing = "right";
    moving = false;
    forceSprite(PLAYER.standDown);
    renderPlayer();
    renderWorld();

    await waitMs(90);
    stadiumUI.curtain.classList.remove("stadium-curtain--visible");
    stadiumState = "spectator";
  }

  async function stadiumReturnToOberkirch() {
    if (MAP.id !== STADIUM.mapId || !stadiumMenuOpen || mapTransitioning) return;
    stadiumState = "spectator-transition";
    hideStadiumMenu();
    closeStadiumBetUI();
    await switchMap(MAPS.oberkirch, MAP_EXIT_CONFIG.oberkirchFromStadiumSpawn, true);
    stadiumState = "inactive";
    stadiumArrivalFromOberkirch = false;
    resetStadiumFightIntro();
    setStadiumBookmakerVisibility();
    setStadiumGateVisibility();
  }

  function setStadiumSpectatorFacing(code) {
    if (stadiumState !== "spectator") return false;
    if (code === "KeyW" || code === "ArrowUp") {
      facing = "up";
      forceSprite(PLAYER.standUp);
    } else if (code === "KeyS" || code === "ArrowDown") {
      facing = "down";
      forceSprite(PLAYER.standDown);
    } else if (code === "KeyA" || code === "ArrowLeft") {
      facing = "left";
      lastHorizontalFacing = "left";
      forceSprite(PLAYER.standLeft);
    } else if (code === "KeyD" || code === "ArrowRight") {
      facing = "right";
      lastHorizontalFacing = "right";
      forceSprite(PLAYER.standRight);
    } else {
      return false;
    }
    return true;
  }

  function updateStadiumPhase1(deltaSeconds, now) {
    setStadiumBookmakerVisibility();
    setStadiumGateVisibility();
    updateStadiumBookmaker(now);

    if (stadiumState === "arrival-walk") {
      updateStadiumArrival(deltaSeconds);
      return;
    }

    updateStadiumFightIntro(deltaSeconds, now);
  }

  function installStartFlowStyles() {
    if (document.getElementById("startFlowStyles")) return;

    const style = document.createElement("style");
    style.id = "startFlowStyles";
    style.textContent = `
      #startFlowUI {
        position: fixed;
        inset: 0;
        z-index: 30000;
        overflow: hidden;
        background: #000;
        color: #fff;
        user-select: none;
      }

      .start-flow__scene {
        position: absolute;
        inset: 0;
        opacity: 0;
        transition: opacity ${START_FLOW.initialFadeMs}ms ease;
      }

      .start-flow__scene--visible {
        opacity: 1;
      }

      .start-flow__background {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        /* R60: FULL artwork always visible.
           "cover" cropped top/bottom on wide desktop browser windows. */
        object-fit: contain;
        object-position: center center;
        background: #000;
        pointer-events: none;
        -webkit-user-drag: none;
      }

      .start-flow__name-panel {
        position: absolute;
        left: 50%;
        bottom: clamp(22px, 3.4vh, 48px);
        width: min(620px, 76vw);
        transform: translate(-50%, 18px);
        box-sizing: border-box;
        padding: 18px 26px 20px;
        border: 1px solid rgba(214, 198, 166, .46);
        border-radius: 5px;
        background:
          linear-gradient(rgba(8, 8, 8, .73), rgba(8, 8, 8, .73));
        box-shadow:
          inset 0 0 0 1px rgba(255,255,255,.035),
          0 10px 30px rgba(0,0,0,.42);
        opacity: 0;
        visibility: hidden;
        transition:
          opacity ${START_FLOW.panelFadeMs}ms ease,
          transform ${START_FLOW.panelFadeMs}ms cubic-bezier(.2,.76,.2,1),
          visibility ${START_FLOW.panelFadeMs}ms ease;
        text-align: center;
      }

      .start-flow__name-panel--visible {
        opacity: 1;
        visibility: visible;
        transform: translate(-50%, 0);
      }

      .start-flow__name-label {
        display: block;
        margin-bottom: 10px;
        color: #fff;
        font-family:
          "Old English Text MT",
          "Lucida Blackletter",
          "UnifrakturCook",
          Georgia,
          serif;
        font-size: clamp(21px, 2.2vw, 34px);
        font-weight: 900;
        letter-spacing: .055em;
        text-shadow: 0 3px 6px rgba(0,0,0,.9);
      }

      .start-flow__name-input {
        display: block;
        width: min(410px, 88%);
        margin: 0 auto;
        box-sizing: border-box;
        padding: 10px 14px 9px;
        border: 1px solid rgba(223, 210, 184, .62);
        border-radius: 2px;
        outline: none;
        background: rgba(0,0,0,.48);
        color: #fff;
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(18px, 1.65vw, 27px);
        text-align: center;
        letter-spacing: .035em;
        caret-color: #fff;
        box-shadow: inset 0 0 13px rgba(0,0,0,.7);
        user-select: text;
      }

      .start-flow__name-input:focus {
        border-color: rgba(255,255,255,.86);
        box-shadow:
          inset 0 0 13px rgba(0,0,0,.72),
          0 0 12px rgba(255,255,255,.18);
      }

      .start-flow__continue {
        display: inline-block;
        margin-top: 12px;
        padding: 7px 24px 8px;
        border: 1px solid rgba(218, 201, 169, .58);
        border-radius: 2px;
        background: rgba(17,17,17,.55);
        color: #fff;
        cursor: pointer;
        font-family:
          "Old English Text MT",
          "Lucida Blackletter",
          "UnifrakturCook",
          Georgia,
          serif;
        font-size: clamp(17px, 1.5vw, 24px);
        font-weight: 900;
        letter-spacing: .06em;
        transition:
          filter 160ms ease,
          text-shadow 160ms ease,
          border-color 160ms ease;
      }

      .start-flow__continue:hover,
      .start-flow__continue:focus-visible {
        filter: brightness(1.18);
        border-color: rgba(255,255,255,.88);
        text-shadow:
          0 0 5px rgba(255,255,255,.8),
          0 0 12px rgba(255,255,255,.35);
      }

      .start-flow__continue:disabled {
        opacity: .35;
        cursor: default;
        filter: none;
        text-shadow: none;
      }

      .start-flow__hero-stage {
        position: absolute;
        inset: 0;
        opacity: 0;
        visibility: hidden;
      }

      .start-flow__hero-stage--visible {
        opacity: 1;
        visibility: visible;
      }

      .start-flow__hero-choice {
        position: absolute;
        left: 50%;
        top: 56%;
        height: min(39vh, 395px);
        width: auto;
        transform: translate(-50%, -50%) scale(1);
        transform-origin: 50% 75%;
        cursor: pointer;
        pointer-events: auto;
        -webkit-user-drag: none;
        filter:
          drop-shadow(0 8px 8px rgba(0,0,0,.5));
        transition:
          transform 210ms cubic-bezier(.2,.8,.2,1),
          filter 210ms ease;
      }

      .start-flow__hero-choice:hover,
      .start-flow__hero-choice:focus-visible {
        transform: translate(-50%, -50%) scale(1.035);
        filter:
          brightness(1.13)
          drop-shadow(0 0 7px rgba(255,255,255,.9))
          drop-shadow(0 0 18px rgba(255,246,214,.55))
          drop-shadow(0 8px 8px rgba(0,0,0,.5));
        outline: none;
      }

      .start-flow__hero-name {
        position: absolute;
        left: 50%;
        bottom: clamp(8px, 1.3vh, 18px);
        max-width: 82vw;
        transform: translate(-50%, 7px);
        opacity: 0;
        visibility: hidden;
        white-space: nowrap;
        pointer-events: none;
        color: #fff;
        font-family:
          "Old English Text MT",
          "Lucida Blackletter",
          "UnifrakturCook",
          Georgia,
          serif;
        font-size: clamp(28px, 3.1vw, 52px);
        font-weight: 900;
        letter-spacing: .065em;
        line-height: 1;
        text-align: center;
        text-shadow:
          0 2px 3px #000,
          0 4px 9px #000,
          0 0 14px rgba(0,0,0,.92);
        transition:
          opacity 180ms ease,
          transform 180ms ease,
          visibility 180ms ease;
      }

      .start-flow__hero-choice:hover ~ .start-flow__hero-name,
      .start-flow__hero-choice:focus-visible ~ .start-flow__hero-name {
        opacity: 1;
        visibility: visible;
        transform: translate(-50%, 0);
      }

      .start-flow__black {
        position: absolute;
        inset: 0;
        z-index: 10;
        pointer-events: none;
        background: #000;
        opacity: 1;
        transition: opacity ${START_FLOW.initialFadeMs}ms ease;
      }

      .start-flow__black--clear {
        opacity: 0;
      }

      .start-flow__black--fade-in {
        opacity: 1;
        transition-duration: ${START_FLOW.blackFadeMs}ms;
      }

      .start-flow__iris {
        position: absolute;
        inset: 0;
        z-index: 11;
        pointer-events: none;
        background: #000;
        opacity: 0;
        --start-iris-radius: 0%;
        -webkit-mask-image:
          radial-gradient(circle at 50% 50%,
            transparent 0 var(--start-iris-radius),
            #000 calc(var(--start-iris-radius) + 1%));
        mask-image:
          radial-gradient(circle at 50% 50%,
            transparent 0 var(--start-iris-radius),
            #000 calc(var(--start-iris-radius) + 1%));
      }

      @media (max-aspect-ratio: 4/3) {
        .start-flow__hero-choice {
          top: 57%;
          height: min(34vh, 360px);
        }

        .start-flow__name-panel {
          width: min(600px, 88vw);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .start-flow__scene,
        .start-flow__name-panel,
        .start-flow__hero-choice,
        .start-flow__hero-name,
        .start-flow__black {
          transition-duration: 1ms !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function preloadStartFlowImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = encodeURI(src);
    });
  }

  function createStartFlowUI() {
    installStartFlowStyles();

    const root = document.createElement("div");
    root.id = "startFlowUI";
    root.setAttribute("aria-label", "Spielstart");

    const startScene = document.createElement("section");
    startScene.className = "start-flow__scene";

    const startImage = document.createElement("img");
    startImage.className = "start-flow__background";
    startImage.src = encodeURI(START_FLOW.startImage);
    startImage.alt = "";
    startImage.draggable = false;

    const namePanel = document.createElement("form");
    namePanel.className = "start-flow__name-panel";
    namePanel.autocomplete = "off";

    const nameLabel = document.createElement("label");
    nameLabel.className = "start-flow__name-label";
    nameLabel.htmlFor = "startPlayerName";
    nameLabel.textContent = "DEIN NAME:";

    const nameInput = document.createElement("input");
    nameInput.id = "startPlayerName";
    nameInput.className = "start-flow__name-input";
    nameInput.type = "text";
    nameInput.maxLength = 28;
    nameInput.spellcheck = false;
    nameInput.autocomplete = "off";
    nameInput.setAttribute("aria-label", "Dein Name");

    const continueButton = document.createElement("button");
    continueButton.className = "start-flow__continue";
    continueButton.type = "submit";
    continueButton.textContent = "WEITER";
    continueButton.disabled = true;

    namePanel.append(nameLabel, nameInput, continueButton);
    startScene.append(startImage, namePanel);

    const heroStage = document.createElement("section");
    heroStage.className = "start-flow__hero-stage";

    const heroBackground = document.createElement("img");
    heroBackground.className = "start-flow__background";
    heroBackground.src = encodeURI(START_FLOW.heroSelectImage);
    heroBackground.alt = "";
    heroBackground.draggable = false;

    const heroChoice = document.createElement("img");
    heroChoice.className = "start-flow__hero-choice";
    heroChoice.src = encodeURI(START_FLOW.heroImage);
    heroChoice.alt = "Spielcharakter auswählen";
    heroChoice.draggable = false;
    heroChoice.tabIndex = 0;
    heroChoice.setAttribute("role", "button");

    const heroName = document.createElement("div");
    heroName.className = "start-flow__hero-name";

    heroStage.append(heroBackground, heroChoice, heroName);

    const iris = document.createElement("div");
    iris.className = "start-flow__iris";

    const black = document.createElement("div");
    black.className = "start-flow__black";

    root.append(startScene, heroStage, iris, black);
    document.body.appendChild(root);

    startFlowUI = {
      root,
      startScene,
      startImage,
      namePanel,
      nameInput,
      continueButton,
      heroStage,
      heroBackground,
      heroChoice,
      heroName,
      iris,
      black,
      transitionBusy: false
    };

    nameInput.addEventListener("input", () => {
      continueButton.disabled = nameInput.value.trim().length === 0;
    });

    namePanel.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = nameInput.value.trim();
      if (!name || startFlowUI.transitionBusy) return;
      chosenPlayerName = name;
      showHeroSelection();
    });

    const selectHero = () => {
      if (startFlowState !== "hero-select" || startFlowUI.transitionBusy) return;
      enterCampaignFromHeroSelection();
    };

    heroChoice.addEventListener("click", selectHero);
    heroChoice.addEventListener("keydown", (event) => {
      if (event.code === "Enter" || event.code === "Space") {
        event.preventDefault();
        selectHero();
      }
    });
  }

  async function beginStartFlow() {
    if (!startFlowUI) createStartFlowUI();

    startFlowState = "start-name";
    startFlowUI.transitionBusy = true;
    keys.clear();
    attackHeld = false;
    cancelAttackImmediately();
    if (blocking) stopBlocking();
    if (inventoryState.open) closeInventory();

    // Both later screens are ready before the first fade starts.
    try {
      await Promise.all([
        preloadStartFlowImage(START_FLOW.startImage),
        preloadStartFlowImage(START_FLOW.heroSelectImage),
        preloadStartFlowImage(START_FLOW.heroImage)
      ]);
    } catch (error) {
      console.error("START FLOW asset preload failed:", error);
    }

    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    );

    startFlowUI.startScene.classList.add("start-flow__scene--visible");
    startFlowUI.black.classList.add("start-flow__black--clear");

    await waitMs(START_FLOW.initialFadeMs + START_FLOW.titleHoldMs);

    if (startFlowState !== "start-name") return;
    startFlowUI.namePanel.classList.add("start-flow__name-panel--visible");
    startFlowUI.transitionBusy = false;

    window.setTimeout(() => {
      if (startFlowState === "start-name") startFlowUI.nameInput.focus();
    }, START_FLOW.panelFadeMs + 40);
  }

  async function showHeroSelection() {
    if (!startFlowUI || startFlowUI.transitionBusy) return;

    startFlowUI.transitionBusy = true;
    startFlowUI.nameInput.blur();
    startFlowUI.black.classList.remove("start-flow__black--clear");
    startFlowUI.black.classList.add("start-flow__black--fade-in");

    await waitMs(START_FLOW.blackFadeMs);

    startFlowState = "hero-select";
    startFlowUI.heroName.textContent = chosenPlayerName;
    startFlowUI.startScene.classList.remove("start-flow__scene--visible");
    startFlowUI.heroStage.classList.add("start-flow__hero-stage--visible");

    // Iris opens the new hero-selection artwork from black.
    startFlowUI.black.style.opacity = "0";
    startFlowUI.black.style.transition = "none";
    startFlowUI.iris.style.opacity = "1";
    startFlowUI.iris.style.setProperty("--start-iris-radius", "0%");

    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    );

    startFlowUI.iris.style.transition =
      `--start-iris-radius ${START_FLOW.irisMs}ms cubic-bezier(.2,.72,.2,1)`;
    startFlowUI.iris.style.setProperty("--start-iris-radius", "150%");

    await waitMs(START_FLOW.irisMs + 40);

    startFlowUI.iris.style.opacity = "0";
    startFlowUI.iris.style.transition = "none";
    startFlowUI.iris.style.setProperty("--start-iris-radius", "0%");
    startFlowUI.transitionBusy = false;
    startFlowUI.heroChoice.focus({ preventScroll: true });
  }

  async function enterCampaignFromHeroSelection() {
    if (!startFlowUI || startFlowUI.transitionBusy) return;

    startFlowUI.transitionBusy = true;
    keys.clear();
    attackHeld = false;
    cancelAttackImmediately();
    if (blocking) stopBlocking();

    // Smooth fade to black first.
    startFlowUI.black.style.transition = `opacity ${START_FLOW.blackFadeMs}ms ease`;
    startFlowUI.black.style.opacity = "1";
    await waitMs(START_FLOW.blackFadeMs);

    // Prepare the EXISTING map-transition overlay as a full black curtain.
    const overlay = transitionOverlay();
    if (overlay) {
      overlay.style.transition = "none";
      overlay.style.opacity = "1";
      overlay.style.setProperty("--iris-radius", "0%");
      overlay.style.webkitMaskImage =
        "radial-gradient(circle at 50% 50%, transparent 0 var(--iris-radius), #000 calc(var(--iris-radius) + 1%))";
      overlay.style.maskImage =
        "radial-gradient(circle at 50% 50%, transparent 0 var(--iris-radius), #000 calc(var(--iris-radius) + 1%))";
    }

    startFlowUI.root.remove();
    startFlowUI = null;
    startFlowState = "campaign";

    // R60: NOW — and only now — leave the RENCHTALSTADION intro music
    // and enter OBERKIRCH's original existing music with the normal crossfade.
    crossfadeMapMusic("oberkirch-zentrum");

    lastFrame = performance.now();

    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    );

    // Existing HDR iris language now reveals OBERKIRCH.
    if (overlay) {
      overlay.style.transition =
        `--iris-radius ${START_FLOW.irisMs}ms cubic-bezier(.2,.72,.2,1)`;
      overlay.style.setProperty("--iris-radius", "150%");

      await waitMs(START_FLOW.irisMs + 40);

      overlay.style.transition = "none";
      overlay.style.opacity = "0";
      overlay.style.webkitMaskImage = "none";
      overlay.style.maskImage = "none";
      overlay.style.setProperty("--iris-radius", "0%");
    }
  }


  // ------------------------------------------------------------------
  // R56 INVENTORY V1 — two-page screen UI + BLACK PENNY pickup test.
  // Artwork is the supplied inventory sheet split into two fixed pages.
  // No equipment / drag-and-drop yet: this patch only establishes the
  // reusable inventory state, page switching and automatic loot placement.
  // ------------------------------------------------------------------
  const INVENTORY_CONFIG = Object.freeze({
    pageImages: Object.freeze([
      "assets/ui/inventory/INVENTORY PAGE 1.png",
      "assets/ui/inventory/INVENTORY PAGE 2.png"
    ]),
    // R61 RASTERFIX: supplied artwork is an exact 6 x 6 raster.
    columns: 6,
    rows: 6,
    slotCount: 36,

    // R66 PIXELFIX — measured directly against the painted 6x6 raster.
    // The visible metal grid-line centers on the 507x1241 source are:
    // X: 41,110,180,250,320,389,459
    // Y: 782,846,913,979,1047,1114,1182
    //
    // Every logical slot receives the EXACT SAME 64x60 hitbox and is
    // centered inside its painted cell. No slot touches the ornament frame.
    slotCentersX: Object.freeze([75.5, 145, 215, 285, 354.5, 424]),
    slotCentersY: Object.freeze([814, 879.5, 946, 1013, 1080.5, 1148]),
    slotWidth: 64,
    slotHeight: 60,

    // Invisible mouse hit areas over the painted controls.
    closeRect: Object.freeze({ x1: 430, y1: 16, x2: 490, y2: 77 }),
    page1Rect: Object.freeze({ x1: 18, y1: 713, x2: 246, y2: 772 }),
    page2Rect: Object.freeze({ x1: 252, y1: 713, x2: 490, y2: 772 }),

    // Painted top-left weapon equipment slot on the supplied inventory artwork.
    weaponEquipRect: Object.freeze({ x1: 45, y1: 196, x2: 125, y2: 300 })
  });

  let playerLevel = 1;
  let equippedWeapon = null;
  let equippedWeaponItem = null;

  const inventoryState = {
    open: false,
    currentPage: 0,
    pages: [
      new Array(INVENTORY_CONFIG.slotCount).fill(null),
      new Array(INVENTORY_CONFIG.slotCount).fill(null)
    ],
    root: null,
    panel: null,
    image: null,
    slotsLayer: null,
    closeButton: null,
    pageButtons: [],
    weaponEquipZone: null
  };

  function installInventoryStyles() {
    if (document.getElementById("inventoryStyles")) return;

    const style = document.createElement("style");
    style.id = "inventoryStyles";
    style.textContent = `
      #inventoryUI {
        position: fixed;
        inset: 0;
        z-index: 12000;
        display: none;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        user-select: none;
      }

      #inventoryUI.inventory-ui--open {
        display: flex;
      }

      .inventory-panel {
        position: relative;
        height: min(92vh, 1010px);
        aspect-ratio: 507 / 1241;
        pointer-events: auto;
        filter: drop-shadow(0 18px 20px rgba(0,0,0,.52));
      }

      .inventory-panel__image {
        position: absolute;
        z-index: 1;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: fill;
        pointer-events: none;
        -webkit-user-drag: none;
      }

      .inventory-hotspot {
        position: absolute;
        border: 0;
        margin: 0;
        padding: 0;
        background: transparent;
        cursor: pointer;
        outline: none;
      }

      /* R57 INVENTORY MINIFIX:
         no rectangular hover overlay. Only the painted control glyph itself
         (X / I / II) receives a subtle light glow. */
      .inventory-hotspot::after {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        opacity: 0;
        color: rgba(255,255,255,.96);
        line-height: 1;
        pointer-events: none;
        transition: opacity 110ms ease, text-shadow 110ms ease;
        text-shadow:
          0 0 4px rgba(255,255,255,.98),
          0 0 9px rgba(255,246,205,.88),
          0 0 15px rgba(255,246,205,.62);
      }

      .inventory-hotspot--close::after {
        content: "×";
        font-family: Georgia, "Times New Roman", serif;
        font-size: 46px;
        font-weight: 400;
        transform: translateY(-1px);
      }

      .inventory-hotspot--page-1::after,
      .inventory-hotspot--page-2::after {
        content: none;
        display: none;
      }


      .inventory-hotspot--close:hover::after,
      .inventory-hotspot--close:focus-visible::after {
        opacity: .82;
      }

      .inventory-slots-layer {
        position: absolute;
        z-index: 4;
        inset: 0;
        pointer-events: none;
      }

      .inventory-item {
        position: absolute;
        z-index: 1;
        display: block;
        pointer-events: auto;
        box-sizing: border-box;
        padding: 0;
        overflow: visible;
      }

      .inventory-item__icon {
        position: absolute;
        z-index: 3;
        left: 50%;
        top: 50%;
        width: 68%;
        height: 68%;
        transform: translate(-50%, -50%);
        transform-origin: 50% 50%;
        max-width: none !important;
        max-height: none !important;
        object-fit: contain;
        object-position: 50% 50%;
        display: block !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: none;
        filter: drop-shadow(0 2px 2px rgba(0,0,0,.7));
      }

      .inventory-item__penny {
        position: absolute;
        z-index: 3;
        left: 50%;
        top: 50%;
        width: 68%;
        height: 68%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background:
          radial-gradient(circle at 34% 28%, #444 0%, #171717 28%, #050505 63%, #000 100%);
        border: clamp(1px, .16vh, 3px) ridge #656565;
        box-shadow:
          0 3px 7px rgba(0,0,0,.62),
          inset 2px 2px 4px rgba(255,255,255,.13),
          inset -2px -2px 5px rgba(0,0,0,.9);
      }

      .inventory-item__penny::after {
        content: "•";
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        color: #111;
        font-family: Georgia, serif;
        font-size: 64%;
        font-weight: 900;
        text-shadow: 1px 1px 0 #555;
      }

      .inventory-item__quantity {
        position: absolute;
        z-index: 5;
        right: 0;
        bottom: 0;
        min-width: 24%;
        padding: 0;
        color: #fff;
        font: 900 clamp(10px, 1.45vh, 17px)/1 Georgia, "Times New Roman", serif;
        text-align: right;
        text-shadow:
          -1px -1px 0 #000,
          1px -1px 0 #000,
          -1px 1px 0 #000,
          1px 1px 0 #000,
          0 2px 3px #000;
      }

      .inventory-item--weapon {
        cursor: grab;
      }

      .inventory-item--weapon:active {
        cursor: grabbing;
      }

      /* R68 SAUKEULE hover tooltip. */
      .inventory-weapon-tooltip {
        position: absolute;
        z-index: 40;
        left: calc(100% + 14px);
        top: 50%;
        width: clamp(250px, 25vw, 390px);
        transform: translateY(-50%);
        box-sizing: border-box;
        padding: 18px 20px;
        border: 1px solid rgba(218,174,72,.72);
        border-radius: 7px;
        background: rgba(10,10,10,.94);
        box-shadow: 0 10px 28px rgba(0,0,0,.72);
        color: #f2f2f2;
        font-family: Georgia, "Times New Roman", serif;
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        transition: opacity 100ms ease, visibility 100ms ease;
        white-space: normal;
      }

      .inventory-item--weapon:hover .inventory-weapon-tooltip,
      .inventory-weapon-equip-zone:hover .inventory-weapon-tooltip {
        opacity: 1;
        visibility: visible;
      }

      .inventory-weapon-tooltip__title {
        margin-bottom: 10px;
        color: #e6bd55;
        font-size: clamp(18px, 2.1vh, 27px);
        font-weight: 900;
        letter-spacing: 1px;
      }

      .inventory-weapon-tooltip__description {
        margin-bottom: 14px;
        color: #f0eadb;
        font-size: clamp(13px, 1.55vh, 18px);
        font-style: italic;
        line-height: 1.3;
      }

      .inventory-weapon-tooltip__stat {
        margin-top: 5px;
        color: #ffffff;
        font-size: clamp(13px, 1.55vh, 18px);
        font-weight: 800;
        line-height: 1.25;
      }

      .inventory-weapon-tooltip__stat--saustark {
        color: #ff6fbd;
      }

      .inventory-item--equipped {
        filter:
          drop-shadow(0 0 4px rgba(255,245,195,.96))
          drop-shadow(0 0 8px rgba(255,218,130,.72));
      }

      .inventory-item--equipped::after {
        content: "E";
        position: absolute;
        z-index: 8;
        right: 2px;
        top: 2px;
        color: #fff7d6;
        font: 900 clamp(10px, 1.35vh, 16px)/1 Georgia, serif;
        text-shadow: 0 1px 2px #000, 0 0 4px #000;
        pointer-events: none;
      }

      .inventory-weapon-equip-zone {
        position: absolute;
        z-index: 7;
        box-sizing: border-box;
        pointer-events: auto;
        background: transparent;
      }

      .inventory-weapon-equip-zone.inventory-weapon-equip-zone--dragover {
        filter: drop-shadow(0 0 7px rgba(255,245,195,.9));
      }

      .inventory-weapon-equip-icon {
        position: absolute;
        inset: 5%;
        width: 90%;
        height: 90%;
        object-fit: contain;
        pointer-events: none;
        filter: drop-shadow(0 2px 2px rgba(0,0,0,.75));
      }

      @media (max-width: 680px) {
        .inventory-panel {
          height: min(89vh, 900px);
        }
      }
    `;
    document.head.appendChild(style);
  }

  function inventoryPercentX(px) {
    return (px / 507) * 100;
  }

  function inventoryPercentY(px) {
    return (px / 1241) * 100;
  }

  function setInventoryRect(element, rect) {
    element.style.left = `${inventoryPercentX(rect.x1)}%`;
    element.style.top = `${inventoryPercentY(rect.y1)}%`;
    element.style.width = `${inventoryPercentX(rect.x2 - rect.x1)}%`;
    element.style.height = `${inventoryPercentY(rect.y2 - rect.y1)}%`;
  }

  function inventorySlotRect(slotIndex) {
    const col = slotIndex % INVENTORY_CONFIG.columns;
    const row = Math.floor(slotIndex / INVENTORY_CONFIG.columns);

    const centerX = INVENTORY_CONFIG.slotCentersX[col];
    const centerY = INVENTORY_CONFIG.slotCentersY[row];
    const width = INVENTORY_CONFIG.slotWidth;
    const height = INVENTORY_CONFIG.slotHeight;

    return {
      x: centerX - width / 2,
      y: centerY - height / 2,
      width,
      height
    };
  }

  function inventoryItemRect(slotIndex, width = 1, height = 1) {
    const start = inventorySlotRect(slotIndex);
    const col = slotIndex % INVENTORY_CONFIG.columns;
    const row = Math.floor(slotIndex / INVENTORY_CONFIG.columns);
    const endIndex =
      (row + height - 1) * INVENTORY_CONFIG.columns + (col + width - 1);
    const end = inventorySlotRect(endIndex);

    return {
      x: start.x,
      y: start.y,
      width: (end.x + end.width) - start.x,
      height: (end.y + end.height) - start.y
    };
  }

  function isInventoryOccupancyMarker(value) {
    return Boolean(value && value.occupiedBy !== undefined);
  }

  function clearInventoryItem(pageIndex, slotIndex) {
    const page = inventoryState.pages[pageIndex];
    if (!page) return null;

    let anchorIndex = slotIndex;
    const found = page[slotIndex];
    if (isInventoryOccupancyMarker(found)) {
      anchorIndex = found.occupiedBy;
    }

    const stack = page[anchorIndex];
    if (!stack || isInventoryOccupancyMarker(stack)) return null;

    const width = Math.max(1, Number(stack.width) || 1);
    const height = Math.max(1, Number(stack.height) || 1);
    const col = anchorIndex % INVENTORY_CONFIG.columns;
    const row = Math.floor(anchorIndex / INVENTORY_CONFIG.columns);

    for (let dy = 0; dy < height; dy += 1) {
      for (let dx = 0; dx < width; dx += 1) {
        const index = (row + dy) * INVENTORY_CONFIG.columns + (col + dx);
        if (page[index] && (
          index === anchorIndex ||
          page[index].occupiedBy === anchorIndex
        )) {
          page[index] = null;
        }
      }
    }

    return stack;
  }

  function canPlaceInventoryItem(pageIndex, slotIndex, width = 1, height = 1) {
    const page = inventoryState.pages[pageIndex];
    if (!page) return false;

    const col = slotIndex % INVENTORY_CONFIG.columns;
    const row = Math.floor(slotIndex / INVENTORY_CONFIG.columns);
    if (col + width > INVENTORY_CONFIG.columns) return false;
    if (row + height > INVENTORY_CONFIG.rows) return false;

    for (let dy = 0; dy < height; dy += 1) {
      for (let dx = 0; dx < width; dx += 1) {
        const index = (row + dy) * INVENTORY_CONFIG.columns + (col + dx);
        if (page[index]) return false;
      }
    }
    return true;
  }

  function placeInventoryItem(pageIndex, slotIndex, stack) {
    if (!stack) return false;
    const width = Math.max(1, Number(stack.width) || 1);
    const height = Math.max(1, Number(stack.height) || 1);
    if (!canPlaceInventoryItem(pageIndex, slotIndex, width, height)) return false;

    const page = inventoryState.pages[pageIndex];
    const col = slotIndex % INVENTORY_CONFIG.columns;
    const row = Math.floor(slotIndex / INVENTORY_CONFIG.columns);

    page[slotIndex] = stack;
    for (let dy = 0; dy < height; dy += 1) {
      for (let dx = 0; dx < width; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        const index = (row + dy) * INVENTORY_CONFIG.columns + (col + dx);
        page[index] = { occupiedBy: slotIndex };
      }
    }
    return true;
  }

  function findFirstFreeInventoryArea(width = 1, height = 1) {
    for (let pageIndex = 0; pageIndex < inventoryState.pages.length; pageIndex += 1) {
      for (let slotIndex = 0; slotIndex < INVENTORY_CONFIG.slotCount; slotIndex += 1) {
        if (canPlaceInventoryItem(pageIndex, slotIndex, width, height)) {
          return { pageIndex, slotIndex };
        }
      }
    }
    return null;
  }

  function inventorySlotIndexFromClientPoint(clientX, clientY) {
    if (!inventoryState.panel) return -1;
    const box = inventoryState.panel.getBoundingClientRect();
    if (!box.width || !box.height) return -1;

    const px = ((clientX - box.left) / box.width) * 507;
    const py = ((clientY - box.top) / box.height) * 1241;

    for (let slotIndex = 0; slotIndex < INVENTORY_CONFIG.slotCount; slotIndex += 1) {
      const rect = inventorySlotRect(slotIndex);
      if (
        px >= rect.x && px <= rect.x + rect.width &&
        py >= rect.y && py <= rect.y + rect.height
      ) {
        return slotIndex;
      }
    }
    return -1;
  }

  function moveInventoryWeaponToSlot(fromPage, fromSlot, toPage, toSlot) {
    const page = inventoryState.pages[fromPage];
    if (!page) return false;
    let anchorIndex = fromSlot;
    if (isInventoryOccupancyMarker(page[fromSlot])) anchorIndex = page[fromSlot].occupiedBy;
    const original = page[anchorIndex];
    if (!original || original.type !== "weapon") return false;

    const removed = clearInventoryItem(fromPage, anchorIndex);
    if (!removed) return false;
    if (placeInventoryItem(toPage, toSlot, removed)) {
      renderInventory();
      return true;
    }

    placeInventoryItem(fromPage, anchorIndex, removed);
    renderInventory();
    return false;
  }

  function placeEquippedWeaponAtInventorySlot(pageIndex, slotIndex) {
    if (!equippedWeaponItem) return false;
    const item = equippedWeaponItem;
    if (!canPlaceInventoryItem(pageIndex, slotIndex, item.width || 1, item.height || 1)) return false;
    if (!placeInventoryItem(pageIndex, slotIndex, item)) return false;
    equippedWeaponItem = null;
    equippedWeapon = null;
    renderInventory();
    return true;
  }

  function weaponCanBeEquipped(stack) {
    if (!stack || stack.type !== "weapon") return false;
    const min = Number(stack.levelMin ?? 1);
    const max = Number(stack.levelMax ?? Infinity);
    return playerLevel >= min && playerLevel <= max;
  }

  function equipWeaponFromInventory(pageIndex, slotIndex) {
    const page = inventoryState.pages[pageIndex];
    if (!page) return false;

    let anchorIndex = slotIndex;
    if (isInventoryOccupancyMarker(page[slotIndex])) {
      anchorIndex = page[slotIndex].occupiedBy;
    }

    const stack = page[anchorIndex];
    if (!weaponCanBeEquipped(stack)) return false;

    // Only one weapon slot exists. Put the previous weapon back first.
    if (equippedWeaponItem) {
      const old = equippedWeaponItem;
      equippedWeaponItem = null;
      equippedWeapon = null;
      const freeOld = findFirstFreeInventoryArea(old.width || 1, old.height || 1);
      if (!freeOld || !placeInventoryItem(freeOld.pageIndex, freeOld.slotIndex, old)) {
        equippedWeaponItem = old;
        equippedWeapon = old.id;
        return false;
      }
    }

    const removed = clearInventoryItem(pageIndex, anchorIndex);
    if (!removed) return false;

    equippedWeaponItem = removed;
    equippedWeapon = removed.id;
    renderInventory();
    return true;
  }

  function unequipWeaponToInventory() {
    if (!equippedWeaponItem) return false;
    const item = equippedWeaponItem;
    const free = findFirstFreeInventoryArea(item.width || 1, item.height || 1);
    if (!free) return false;

    if (!placeInventoryItem(free.pageIndex, free.slotIndex, item)) return false;
    equippedWeaponItem = null;
    equippedWeapon = null;
    inventoryState.currentPage = free.pageIndex;
    renderInventory();
    return true;
  }

  function createSaukeuleTooltip() {
    const weapon = WEAPONS.pinkPigClub;
    const tooltip = document.createElement("div");
    tooltip.className = "inventory-weapon-tooltip";

    const title = document.createElement("div");
    title.className = "inventory-weapon-tooltip__title";
    title.textContent = weapon.tooltipName;

    const description = document.createElement("div");
    description.className = "inventory-weapon-tooltip__description";
    description.textContent = weapon.tooltipDescription;

    const damage = document.createElement("div");
    damage.className = "inventory-weapon-tooltip__stat";
    damage.textContent = `${weapon.damage} DMG`;

    const critical = document.createElement("div");
    critical.className = "inventory-weapon-tooltip__stat";
    critical.textContent = `${weapon.criticalDamage} KRIT`;

    const special = document.createElement("div");
    special.className = "inventory-weapon-tooltip__stat inventory-weapon-tooltip__stat--saustark";
    special.textContent = `${Math.round(weapon.saustarkChance * 100)}% CHANCE SAUSTARKER TREFFER`;

    tooltip.append(title, description, damage, critical, special);
    return tooltip;
  }


  function renderEquippedWeapon() {
    const zone = inventoryState.weaponEquipZone;
    if (!zone) return;
    zone.replaceChildren();
    zone.classList.remove("inventory-weapon-equip-zone--dragover");

    zone.draggable = Boolean(equippedWeaponItem);
    if (!equippedWeaponItem) return;
    const icon = document.createElement("img");
    icon.className = "inventory-weapon-equip-icon";
    icon.src = encodeURI(equippedWeaponItem.icon || WEAPONS.pinkPigClub.icon);
    icon.alt = "";
    icon.draggable = false;
    zone.appendChild(icon);

    if (equippedWeaponItem.id === WEAPONS.pinkPigClub.id) {
      zone.appendChild(createSaukeuleTooltip());
    }
  }

  function renderInventory() {
    if (!inventoryState.root || !inventoryState.image || !inventoryState.slotsLayer) return;

    inventoryState.image.src = encodeURI(
      INVENTORY_CONFIG.pageImages[inventoryState.currentPage]
    );

    inventoryState.pageButtons.forEach((button, index) => {
      if (!button) return;
      if (index === inventoryState.currentPage) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });

    inventoryState.slotsLayer.replaceChildren();

    const page = inventoryState.pages[inventoryState.currentPage];
    for (let slotIndex = 0; slotIndex < page.length; slotIndex += 1) {
      const stack = page[slotIndex];
      if (!stack || isInventoryOccupancyMarker(stack)) continue;

      const width = Math.max(1, Number(stack.width) || 1);
      const height = Math.max(1, Number(stack.height) || 1);
      const rect = inventoryItemRect(slotIndex, width, height);
      const item = document.createElement("div");
      item.className = "inventory-item" + (stack.type === "weapon" ? " inventory-item--weapon" : "");
      item.dataset.itemId = stack.id;
      item.dataset.slotIndex = String(slotIndex);
      item.dataset.pageIndex = String(inventoryState.currentPage);
      item.style.left = `${inventoryPercentX(rect.x)}%`;
      item.style.top = `${inventoryPercentY(rect.y)}%`;
      item.style.width = `${inventoryPercentX(rect.width)}%`;
      item.style.height = `${inventoryPercentY(rect.height)}%`;

      if (stack.id === "black-penny") {
        const icon = document.createElement("div");
        icon.className = "inventory-item__penny";
        item.appendChild(icon);
      } else if (stack.icon) {
        const icon = document.createElement("img");
        icon.className = "inventory-item__icon";
        icon.src = encodeURI(stack.icon);
        icon.alt = "";
        icon.draggable = false;
        icon.addEventListener("error", () => console.warn("Inventory icon failed to load:", stack.icon));
        item.appendChild(icon);
      }

      if (stack.stackable || (stack.quantity || 1) > 1) {
        const quantity = document.createElement("span");
        quantity.className = "inventory-item__quantity";
        quantity.textContent = String(stack.quantity || 1);
        item.appendChild(quantity);
      }

      if (stack.type === "weapon") {
        if (stack.id === WEAPONS.pinkPigClub.id) {
          item.appendChild(createSaukeuleTooltip());
        }

        item.draggable = true;
        item.addEventListener("contextmenu", (event) => {
          event.preventDefault();
          equipWeaponFromInventory(inventoryState.currentPage, slotIndex);
        });
        item.addEventListener("dragstart", (event) => {
          if (!event.dataTransfer) return;
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", JSON.stringify({
            kind: "inventory-weapon",
            pageIndex: inventoryState.currentPage,
            slotIndex
          }));
        });
      }

      inventoryState.slotsLayer.appendChild(item);
    }

    renderEquippedWeapon();
  }

  function setInventoryPage(pageIndex) {
    const safePage = Math.max(0, Math.min(1, Number(pageIndex) || 0));
    if (inventoryState.currentPage === safePage) return;
    inventoryState.currentPage = safePage;
    renderInventory();
  }

  function openInventory() {
    if (!inventoryState.root) return;
    inventoryState.currentPage = 0;
    inventoryState.open = true;
    keys.clear();
    attackHeld = false;
    cancelAttackImmediately();
    if (blocking) stopBlocking();
    renderInventory();
    inventoryState.root.classList.add("inventory-ui--open");
    inventoryState.root.setAttribute("aria-hidden", "false");
  }

  function closeInventory() {
    if (!inventoryState.root) return;
    inventoryState.open = false;
    keys.clear();
    inventoryState.root.classList.remove("inventory-ui--open");
    inventoryState.root.setAttribute("aria-hidden", "true");
  }

  function toggleInventory() {
    if (inventoryState.open) closeInventory();
    else openInventory();
  }

  function findInventoryStack(itemId) {
    for (let pageIndex = 0; pageIndex < inventoryState.pages.length; pageIndex += 1) {
      const page = inventoryState.pages[pageIndex];
      for (let slotIndex = 0; slotIndex < page.length; slotIndex += 1) {
        const stack = page[slotIndex];
        if (stack && !isInventoryOccupancyMarker(stack) && stack.id === itemId) {
          return { pageIndex, slotIndex, stack };
        }
      }
    }
    return null;
  }

  function findFirstFreeInventorySlot() {
    return findFirstFreeInventoryArea(1, 1);
  }

  function addItemToInventory(item) {
    if (!item || !item.id) return false;

    if (item.id === "black-penny" || item.stackable) {
      const existing = findInventoryStack(item.id);
      if (existing) {
        existing.stack.quantity += 1;
        if (inventoryState.open) renderInventory();
        return true;
      }
    }

    const width = Math.max(1, Number(item.width) || 1);
    const height = Math.max(1, Number(item.height) || 1);
    const free = findFirstFreeInventoryArea(width, height);
    if (!free) return false;

    const stack = {
      id: item.id,
      name: item.name || item.id,
      description: item.description || "",
      icon: item.icon || "",
      width,
      height,
      quantity: 1,
      stackable: Boolean(item.stackable),
      type: item.type || "resource",
      levelMin: item.levelMin,
      levelMax: item.levelMax
    };

    if (!placeInventoryItem(free.pageIndex, free.slotIndex, stack)) return false;
    if (inventoryState.open) renderInventory();
    return true;
  }

  function createInventorySystem() {
    installInventoryStyles();

    // Preload both supplied page artworks immediately so page II never flashes late.
    for (const src of INVENTORY_CONFIG.pageImages) {
      const preload = new Image();
      preload.src = encodeURI(src);
    }

    for (const src of [
      CARROT_ITEM.icon, RABBIT_FOOT_ITEM.icon,
      WOLF_PELT_ITEM.icon, WOLF_CLAW_ITEM.icon, WANDERER_BAG_ITEM.icon,
      RADISH_ITEM.icon, CABBAGE_ITEM.icon, LETTUCE_ITEM.icon, BOAR_TUSK_ITEM.icon,
      PINK_PIG_CLUB_ITEM.icon
    ]) {
      const preload = new Image();
      preload.src = encodeURI(src);
    }

    const root = document.createElement("div");
    root.id = "inventoryUI";
    root.setAttribute("aria-hidden", "true");

    const panel = document.createElement("div");
    panel.className = "inventory-panel";

    const image = document.createElement("img");
    image.className = "inventory-panel__image";
    image.src = encodeURI(INVENTORY_CONFIG.pageImages[0]);
    image.alt = "Inventar";
    image.draggable = false;

    const slotsLayer = document.createElement("div");
    slotsLayer.className = "inventory-slots-layer";

    const weaponEquipZone = document.createElement("div");
    weaponEquipZone.className = "inventory-weapon-equip-zone";
    setInventoryRect(weaponEquipZone, INVENTORY_CONFIG.weaponEquipRect);
    weaponEquipZone.setAttribute("aria-label", "Waffenplatz");
    weaponEquipZone.addEventListener("dragstart", (event) => {
      if (!equippedWeaponItem || !event.dataTransfer) {
        event.preventDefault();
        return;
      }
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", JSON.stringify({ kind: "equipped-weapon" }));
    });
    weaponEquipZone.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      if (equippedWeaponItem) unequipWeaponToInventory();
    });
    weaponEquipZone.addEventListener("dragover", (event) => {
      event.preventDefault();
      weaponEquipZone.classList.add("inventory-weapon-equip-zone--dragover");
      if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    });
    weaponEquipZone.addEventListener("dragleave", () => {
      weaponEquipZone.classList.remove("inventory-weapon-equip-zone--dragover");
    });
    weaponEquipZone.addEventListener("drop", (event) => {
      event.preventDefault();
      weaponEquipZone.classList.remove("inventory-weapon-equip-zone--dragover");
      if (!event.dataTransfer) return;
      try {
        const payload = JSON.parse(event.dataTransfer.getData("text/plain") || "{}");
        if (payload.kind === "inventory-weapon") {
          equipWeaponFromInventory(Number(payload.pageIndex), Number(payload.slotIndex));
        }
      } catch (_) {}
    });

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "inventory-hotspot inventory-hotspot--close";
    closeButton.setAttribute("aria-label", "Inventar schließen");
    setInventoryRect(closeButton, INVENTORY_CONFIG.closeRect);
    closeButton.addEventListener("click", closeInventory);

    const page1Button = document.createElement("button");
    page1Button.type = "button";
    page1Button.className = "inventory-hotspot inventory-hotspot--page-1";
    page1Button.setAttribute("aria-label", "Inventarseite I");
    setInventoryRect(page1Button, INVENTORY_CONFIG.page1Rect);
    page1Button.addEventListener("click", () => setInventoryPage(0));

    const page2Button = document.createElement("button");
    page2Button.type = "button";
    page2Button.className = "inventory-hotspot inventory-hotspot--page-2";
    page2Button.setAttribute("aria-label", "Inventarseite II");
    setInventoryRect(page2Button, INVENTORY_CONFIG.page2Rect);
    page2Button.addEventListener("click", () => setInventoryPage(1));

    panel.addEventListener("dragover", (event) => {
      const slotIndex = inventorySlotIndexFromClientPoint(event.clientX, event.clientY);
      if (slotIndex < 0) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    });

    panel.addEventListener("drop", (event) => {
      const slotIndex = inventorySlotIndexFromClientPoint(event.clientX, event.clientY);
      if (slotIndex < 0 || !event.dataTransfer) return;
      event.preventDefault();

      try {
        const payload = JSON.parse(event.dataTransfer.getData("text/plain") || "{}");
        if (payload.kind === "equipped-weapon") {
          placeEquippedWeaponAtInventorySlot(inventoryState.currentPage, slotIndex);
        } else if (payload.kind === "inventory-weapon") {
          moveInventoryWeaponToSlot(
            Number(payload.pageIndex),
            Number(payload.slotIndex),
            inventoryState.currentPage,
            slotIndex
          );
        }
      } catch (_) {}
    });

    panel.append(image, slotsLayer, weaponEquipZone, closeButton, page1Button, page2Button);
    root.appendChild(panel);
    document.body.appendChild(root);

    inventoryState.root = root;
    inventoryState.panel = panel;
    inventoryState.image = image;
    inventoryState.slotsLayer = slotsLayer;
    inventoryState.closeButton = closeButton;
    inventoryState.pageButtons = [page1Button, page2Button];
    inventoryState.weaponEquipZone = weaponEquipZone;

    renderInventory();
  }

  function installMapTransitionUI() {
    if (document.getElementById("mapTransitionStyles")) return;

    const style = document.createElement("style");
    style.id = "mapTransitionStyles";
    style.textContent = `
      @property --iris-radius {
        syntax: "<percentage>";
        inherits: false;
        initial-value: 0%;
      }

      #mapTransitionOverlay {
        position: absolute;
        inset: 0;
        z-index: 5000;
        pointer-events: none;
        background: #000;
        opacity: 0;
        --iris-radius: 0%;
        -webkit-mask-image:
          radial-gradient(circle at 50% 50%,
            transparent 0 var(--iris-radius),
            #000 calc(var(--iris-radius) + 1%));
        mask-image:
          radial-gradient(circle at 50% 50%,
            transparent 0 var(--iris-radius),
            #000 calc(var(--iris-radius) + 1%));
      }

      #mapRegionTitle {
        position: absolute;
        left: 50%;
        top: 46%;
        z-index: 5100;
        transform: translate(-50%, -50%) scale(.94);
        pointer-events: none;
        user-select: none;
        text-align: center;
        opacity: 0;
        transition:
          opacity 420ms ease,
          transform 420ms cubic-bezier(.2,.8,.2,1);
        color: #000000;
        font-family:
          "Old English Text MT",
          "Lucida Blackletter",
          "UnifrakturCook",
          Georgia,
          serif;
        font-weight: 900;
        text-shadow:
          0 0 3px #ffffff,
          0 0 8px #ffffff,
          0 0 16px #ffffff,
          0 0 28px #ffffff,
          0 5px 4px rgba(0,0,0,.78);
      }

      #mapRegionTitle.visible {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }

      #mapRegionTitle .main {
        display: block;
        font-size: clamp(54px, 7vw, 138px);
        letter-spacing: .08em;
        line-height: .92;
      }

      #mapRegionTitle .sub {
        display: block;
        margin-top: .18em;
        font-size: clamp(28px, 3.3vw, 66px);
        letter-spacing: .16em;
        line-height: 1;
      }
    `;
    document.head.appendChild(style);

    const transition = document.createElement("div");
    transition.id = "mapTransitionOverlay";
    game.appendChild(transition);

    const title = document.createElement("div");
    title.id = "mapRegionTitle";
    title.innerHTML =
      '<span class="main">WINTERBACH</span>' +
      '<span class="sub">RANGLEHEN</span>';
    game.appendChild(title);
  }

  function transitionOverlay() {
    return document.getElementById("mapTransitionOverlay");
  }

  function regionTitle() {
    return document.getElementById("mapRegionTitle");
  }

  function waitMs(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function waitForImage(image) {
    if (image.complete && image.naturalWidth > 0) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const onLoad = () => {
        cleanup();
        resolve();
      };
      const onError = () => {
        cleanup();
        reject(new Error("Map image failed to load."));
      };
      const cleanup = () => {
        image.removeEventListener("load", onLoad);
        image.removeEventListener("error", onError);
      };

      image.addEventListener("load", onLoad);
      image.addEventListener("error", onError);
    });
  }

  function setOberkirchWorldVisibility(visible) {
    // IMPORTANT:
    // Do NOT hide .area-sign globally here.
    // updateAreaSigns() already filters each sign by its mapId, including
    // the Map-2 "OBERKIRCH" return sign.
    const selectors = [
      ".map-building",
      ".trunkenbold"
    ];

    for (const element of world.querySelectorAll(selectors.join(","))) {
      element.style.display = visible ? "" : "none";
    }

    // Force a fresh sign-state evaluation immediately after every map switch.
    updateAreaSigns();
  }

  function resizeWorldForCurrentMap() {
    world.style.width = `${MAP.width}px`;
    world.style.height = `${MAP.height}px`;
    mapImage.style.width = `${MAP.width}px`;
    mapImage.style.height = `${MAP.height}px`;
  }

  function showMapRegionTitle(map) {
    const title = regionTitle();
    if (!title || !map) return;

    title.classList.remove("visible");

    let label = "";
    if (map.id === "winterbach-ranglehen") {
      label = "WINTERBACH";
    } else if (map.id === "lautenbach") {
      label = "LAUTENBACH";
    } else if (map.id === "hubacker") {
      label = "HUBACKER";
    } else if (map.id === "renchtalstadion") {
      label = "RENCHTALSTADION";
    } else if (map.id === "oberkirch-zentrum") {
      label = "OBERKIRCH";
    } else {
      label = map.name || "";
    }

    title.innerHTML = `<span class="main">${label}</span>`;

    void title.offsetWidth;
    title.classList.add("visible");

    window.setTimeout(() => {
      title.classList.remove("visible");
    }, 2000);
  }

  function showWinterbachTitle() {
    showMapRegionTitle(MAPS.winterbach);
  }

  async function switchMap(nextMap, spawn, showRegionTitle = false) {
    if (mapTransitioning) return;
    const sourceMapId = MAP.id;
    const scriptedStadiumArrival =
      sourceMapId === "oberkirch-zentrum" && nextMap.id === STADIUM.mapId;
    mapTransitioning = true;
    keys.clear();
    cancelAttackImmediately();
    if (blocking) stopBlocking();
    activeBridge = null;

    const overlay = transitionOverlay();

    // Exact requested exit: one-second fade to black.
    overlay.style.transition = "opacity 200ms ease";
    overlay.style.webkitMaskImage = "none";
    overlay.style.maskImage = "none";
    overlay.style.opacity = "1";

    // R33: music begins changing at the SAME moment as the visual map fade.
    crossfadeMapMusic(nextMap.id);

    await waitMs(200);

    MAP = nextMap;
    activeLautenbachHillPath = false;
    lautenbachHillSnapping = false;
    clearIceVelocity();
    updateIceVisual();
    resizeWorldForCurrentMap();

    mapImage.src = encodeURI(MAP.image);
    try {
      await waitForImage(mapImage);
    } catch (_) {
      mapTransitioning = false;
      return;
    }

    if (scriptedStadiumArrival) {
      playerX = STADIUM.arrivalStart.x;
      playerY = STADIUM.arrivalStart.y;
      stadiumState = "inactive";
      stadiumArrivalFromOberkirch = true;
      hideStadiumMenu();
    } else {
      playerX = spawn.x;
      playerY = spawn.y;
      if (nextMap.id !== STADIUM.mapId) {
        stadiumState = "inactive";
        stadiumArrivalFromOberkirch = false;
        hideStadiumMenu();
        closeStadiumBetUI();
        clearStadiumBookmakerHover();
      }
    }
    cameraX = playerX;
    cameraY = playerY;
    activeBridge = null;

    setOberkirchWorldVisibility(MAP.id === "oberkirch-zentrum");
    setWinterbachWorldVisibility(MAP.id === "winterbach-ranglehen");
    setLautenbachWorldVisibility(MAP.id === "lautenbach");

    // Sync map-specific animals while the transition overlay is still covering the map.
    updateRabbits(0, performance.now());
    updateWolves(0, performance.now());
    updateBoars(0, performance.now());
    updateMole(performance.now());

    if (debugTitle) debugTitle.textContent = MAP.name;

    calculateFitScale();
    displayScale = scaleForLevel(zoomLevel);
    targetScale = displayScale;
    zoomAnimating = false;

    renderPlayer();
    renderWorld();

    // Iris reveal: black opens smoothly from the centre and gives the new map free.
    overlay.style.transition = "none";
    overlay.style.opacity = "1";
    overlay.style.setProperty("--iris-radius", "0%");
    overlay.style.webkitMaskImage =
      "radial-gradient(circle at 50% 50%, transparent 0 var(--iris-radius), #000 calc(var(--iris-radius) + 1%))";
    overlay.style.maskImage =
      "radial-gradient(circle at 50% 50%, transparent 0 var(--iris-radius), #000 calc(var(--iris-radius) + 1%))";

    await new Promise((resolve) => requestAnimationFrame(() =>
      requestAnimationFrame(resolve)
    ));

    overlay.style.transition = "--iris-radius 2700ms cubic-bezier(.2,.72,.2,1)";
    overlay.style.setProperty("--iris-radius", "150%");

    if (showRegionTitle) {
      window.setTimeout(() => showMapRegionTitle(nextMap), 220);
    }

    await waitMs(2740);

    overlay.style.transition = "none";
    overlay.style.opacity = "0";
    overlay.style.webkitMaskImage = "none";
    overlay.style.maskImage = "none";
    overlay.style.setProperty("--iris-radius", "0%");

    lastFrame = performance.now();
    mapTransitioning = false;

    setStadiumBookmakerVisibility();
    if (scriptedStadiumArrival && stadiumArrivalFromOberkirch) {
      beginStadiumArrival();
    }
  }

  function playerInOberkirchNorthExitLane() {
    return (
      MAP.id === "oberkirch-zentrum" &&
      playerX >= MAP_EXIT_CONFIG.oberkirchNorth.x1 &&
      playerX <= MAP_EXIT_CONFIG.oberkirchNorth.x2
    );
  }

  function playerInOberkirchGreenNorthExitLane() {
    return (
      MAP.id === "oberkirch-zentrum" &&
      playerX >= MAP_EXIT_CONFIG.oberkirchGreenNorth.x1 &&
      playerX <= MAP_EXIT_CONFIG.oberkirchGreenNorth.x2
    );
  }

  function playerInWinterbachSouthExitLane() {
    return (
      MAP.id === "winterbach-ranglehen" &&
      playerX >= MAP_EXIT_CONFIG.winterbachSouth.x1 &&
      playerX <= MAP_EXIT_CONFIG.winterbachSouth.x2
    );
  }

  function playerInWinterbachNorthLeftExitLane() {
    return (
      MAP.id === "winterbach-ranglehen" &&
      playerX >= MAP_EXIT_CONFIG.winterbachNorthLeft.x1 &&
      playerX <= MAP_EXIT_CONFIG.winterbachNorthLeft.x2
    );
  }

  function playerInWinterbachNorthRightExitLane() {
    return (
      MAP.id === "winterbach-ranglehen" &&
      playerX >= MAP_EXIT_CONFIG.winterbachNorthRight.x1 &&
      playerX <= MAP_EXIT_CONFIG.winterbachNorthRight.x2
    );
  }

  function playerInLautenbachSouthLeftExitLane() {
    return (
      MAP.id === "lautenbach" &&
      playerX >= MAP_EXIT_CONFIG.lautenbachSouthLeft.x1 &&
      playerX <= MAP_EXIT_CONFIG.lautenbachSouthLeft.x2
    );
  }

  function playerInLautenbachSouthRightExitLane() {
    return (
      MAP.id === "lautenbach" &&
      playerX >= MAP_EXIT_CONFIG.lautenbachSouthRight.x1 &&
      playerX <= MAP_EXIT_CONFIG.lautenbachSouthRight.x2
    );
  }

  function playerInLautenbachNorthLeftExitLane() {
    return (
      MAP.id === "lautenbach" &&
      playerX >= MAP_EXIT_CONFIG.lautenbachNorthLeft.x1 &&
      playerX <= MAP_EXIT_CONFIG.lautenbachNorthLeft.x2
    );
  }

  function playerInLautenbachNorthRightExitLane() {
    return (
      MAP.id === "lautenbach" &&
      playerX >= MAP_EXIT_CONFIG.lautenbachNorthRight.x1 &&
      playerX <= MAP_EXIT_CONFIG.lautenbachNorthRight.x2
    );
  }

  function playerInHubackerSouthLeftExitLane() {
    return (
      MAP.id === "hubacker" &&
      playerX >= MAP_EXIT_CONFIG.hubackerSouthLeft.x1 &&
      playerX <= MAP_EXIT_CONFIG.hubackerSouthLeft.x2
    );
  }

  function playerInOberkirchStadiumSouthExitLane() {
    return (
      MAP.id === "oberkirch-zentrum" &&
      playerX >= MAP_EXIT_CONFIG.oberkirchStadiumSouth.x1 &&
      playerX <= MAP_EXIT_CONFIG.oberkirchStadiumSouth.x2
    );
  }

  function playerInStadiumOberkirchSouthExitLane() {
    return (
      MAP.id === "renchtalstadion" &&
      playerX >= MAP_EXIT_CONFIG.stadiumOberkirchSouth.x1 &&
      playerX <= MAP_EXIT_CONFIG.stadiumOberkirchSouth.x2
    );
  }

  function checkMapExit() {
    if (mapTransitioning) return false;

    const movingUp = keys.has("KeyW") || keys.has("ArrowUp");
    const movingDown = keys.has("KeyS") || keys.has("ArrowDown");

    // R18 GREEN ARROW: MAP 1 -> MAP 2 RED ARROW.
    // Same existing transition / iris system, only a second exit pair.
    if (
      playerInOberkirchGreenNorthExitLane() &&
      movingUp &&
      playerY <= MAP_EXIT_CONFIG.oberkirchGreenNorth.leaveY
    ) {
      switchMap(
        MAPS.winterbach,
        MAP_EXIT_CONFIG.winterbachRedSpawn,
        true
      );
      return true;
    }

    // Existing original MAP 1 north exit stays untouched.
    if (
      playerInOberkirchNorthExitLane() &&
      movingUp &&
      playerY <= MAP_EXIT_CONFIG.oberkirchNorth.leaveY
    ) {
      switchMap(
        MAPS.winterbach,
        MAP_EXIT_CONFIG.winterbachSpawn,
        true
      );
      return true;
    }

    // R26 MAP 2 upper-left LAUTENBACH road -> MAP 3 lower-left road.
    if (
      playerInWinterbachNorthLeftExitLane() &&
      movingUp &&
      playerY <= MAP_EXIT_CONFIG.winterbachNorthLeft.leaveY
    ) {
      switchMap(
        MAPS.lautenbach,
        MAP_EXIT_CONFIG.lautenbachSouthLeftSpawn,
        true
      );
      return true;
    }

    // R26 MAP 2 upper-right SENDELBACH-side road -> same MAP 3,
    // but spawn on the right-hand road exactly as marked.
    if (
      playerInWinterbachNorthRightExitLane() &&
      movingUp &&
      playerY <= MAP_EXIT_CONFIG.winterbachNorthRight.leaveY
    ) {
      switchMap(
        MAPS.lautenbach,
        MAP_EXIT_CONFIG.lautenbachSouthRightSpawn,
        true
      );
      return true;
    }

    // R38 MAP 3 upper-left HUBACKER road -> MAP 4 lower-left road.
    if (
      playerInLautenbachNorthLeftExitLane() &&
      movingUp &&
      playerY <= MAP_EXIT_CONFIG.lautenbachNorthLeft.leaveY
    ) {
      switchMap(
        MAPS.hubacker,
        MAP_EXIT_CONFIG.hubackerSouthLeftSpawn,
        true
      );
      return true;
    }

    // R38 MAP 3 upper-right HUBACKER road -> MAP 4 lower-right road.
    if (
      playerInLautenbachNorthRightExitLane() &&
      movingUp &&
      playerY <= MAP_EXIT_CONFIG.lautenbachNorthRight.leaveY
    ) {
      switchMap(
        MAPS.hubacker,
        MAP_EXIT_CONFIG.hubackerSouthRightSpawn,
        true
      );
      return true;
    }

    // R38 MAP 4 lower-left road -> corresponding MAP 3 north-left road.
    if (
      playerInHubackerSouthLeftExitLane() &&
      movingDown &&
      playerY >= MAP.height + MAP_EXIT_CONFIG.hubackerSouthLeft.leavePadding
    ) {
      switchMap(
        MAPS.lautenbach,
        MAP_EXIT_CONFIG.lautenbachNorthLeftReturnSpawn,
        true
      );
      return true;
    }

    // R51 MAP 1 red south arrow -> MAP 5 RENCHTALSTADION yellow spawn.
    if (
      playerInOberkirchStadiumSouthExitLane() &&
      movingDown &&
      playerY >= MAP.height + MAP_EXIT_CONFIG.oberkirchStadiumSouth.leavePadding
    ) {
      switchMap(
        MAPS.renchtalstadion,
        MAP_EXIT_CONFIG.stadiumFromOberkirchSpawn,
        true
      );
      return true;
    }

    // R70: RENCHTALSTADION no longer has a physical south exit.
    // Return to OBERKIRCH is now exclusively handled by the stadium choice menu.

    // R26 MAP 3 lower-left road -> corresponding MAP 2 north-left road.
    if (
      playerInLautenbachSouthLeftExitLane() &&
      movingDown &&
      playerY >= MAP.height + MAP_EXIT_CONFIG.lautenbachSouthLeft.leavePadding
    ) {
      switchMap(
        MAPS.winterbach,
        MAP_EXIT_CONFIG.winterbachNorthLeftReturnSpawn,
        true
      );
      return true;
    }

    // R26 MAP 3 lower-right road -> corresponding MAP 2 north-right road.
    if (
      playerInLautenbachSouthRightExitLane() &&
      movingDown &&
      playerY >= MAP.height + MAP_EXIT_CONFIG.lautenbachSouthRight.leavePadding
    ) {
      switchMap(
        MAPS.winterbach,
        MAP_EXIT_CONFIG.winterbachNorthRightReturnSpawn,
        true
      );
      return true;
    }

    // Existing MAP 2 lower OBERKIRCH return remains untouched.
    if (
      playerInWinterbachSouthExitLane() &&
      movingDown &&
      playerY >= MAP.height + MAP_EXIT_CONFIG.winterbachSouth.leavePadding
    ) {
      switchMap(
        MAPS.oberkirch,
        MAP_EXIT_CONFIG.oberkirchReturnSpawn,
        true
      );
      return true;
    }

    return false;
  }


  // R55 PLAYER STABILITY:
  // Keep EVERY player frame resident and decoded before gameplay starts.
  // This includes stand, all walking directions/intermediate frames,
  // all four attack frames in every direction, and block/base frames.
  const allSprites = [
    PLAYER.standDown,
    PLAYER.standRight,
    PLAYER.standLeft,
    PLAYER.standUp,

    ...PLAYER.walkRight,
    ...PLAYER.walkLeft,
    ...PLAYER.walkDown,
    ...PLAYER.walkUp,

    PLAYER.combatBase,
    PLAYER.combatBaseLeft,

    PLAYER.attackRight1,
    PLAYER.attackRight2,
    PLAYER.attackRight3,
    PLAYER.attackRight4,

    PLAYER.attackLeft1,
    PLAYER.attackLeft2,
    PLAYER.attackLeft3,
    PLAYER.attackLeft4,

    PLAYER.attackDown1,
    PLAYER.attackDown2,
    PLAYER.attackDown3,
    PLAYER.attackDown4,

    PLAYER.attackUp1,
    PLAYER.attackUp2,
    PLAYER.attackUp3,
    PLAYER.attackUp4,

    ...WEAPONS.pinkPigClub.attacks.left,
    ...WEAPONS.pinkPigClub.attacks.right,
    ...WEAPONS.pinkPigClub.attacks.down,
    ...WEAPONS.pinkPigClub.attacks.up,

    PLAYER.attackFinish,
    PLAYER.attackFinishLeft,
    PLAYER.blockRight,
    PLAYER.blockLeft
  ];

  // Remove duplicate paths while preserving their original order.
  const playerSpriteSources = [...new Set(allSprites)];
  const preloaded = {};

  function preloadAndDecodePlayerSprites() {
    const jobs = playerSpriteSources.map((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = encodeURI(src);
      preloaded[src] = img;

      // decode() forces the browser to prepare the bitmap now instead of
      // stalling on the first live walk/attack frame. Fall back safely on
      // browsers where decode() is unavailable or rejects.
      if (typeof img.decode === "function") {
        return img.decode().catch(() => new Promise((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        }));
      }

      return new Promise((resolve) => {
        if (img.complete) {
          resolve();
          return;
        }
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      });
    });

    return Promise.all(jobs);
  }

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

    const northExitOpen =
      (
        playerInOberkirchNorthExitLane() ||
        playerInOberkirchGreenNorthExitLane() ||
        playerInWinterbachNorthLeftExitLane() ||
        playerInWinterbachNorthRightExitLane() ||
        playerInLautenbachNorthLeftExitLane() ||
        playerInLautenbachNorthRightExitLane()
      ) &&
      (keys.has("KeyW") || keys.has("ArrowUp"));

    const southExitOpen =
      (
        playerInWinterbachSouthExitLane() ||
        playerInLautenbachSouthLeftExitLane() ||
        playerInLautenbachSouthRightExitLane() ||
        playerInHubackerSouthLeftExitLane() ||
        playerInOberkirchStadiumSouthExitLane() ||
        playerInStadiumOberkirchSouthExitLane()
      ) &&
      (keys.has("KeyS") || keys.has("ArrowDown"));

    if (northExitOpen) {
      let leaveFloor = -98;

      if (MAP.id === "oberkirch-zentrum") {
        leaveFloor = Math.min(
          MAP_EXIT_CONFIG.oberkirchNorth.leaveY,
          MAP_EXIT_CONFIG.oberkirchGreenNorth.leaveY
        ) - 80;
      } else if (MAP.id === "winterbach-ranglehen") {
        leaveFloor = Math.min(
          MAP_EXIT_CONFIG.winterbachNorthLeft.leaveY,
          MAP_EXIT_CONFIG.winterbachNorthRight.leaveY
        ) - 80;
      } else if (MAP.id === "lautenbach") {
        leaveFloor = Math.min(
          MAP_EXIT_CONFIG.lautenbachNorthLeft.leaveY,
          MAP_EXIT_CONFIG.lautenbachNorthRight.leaveY
        ) - 80;
      }

      playerY = Math.max(
        leaveFloor,
        Math.min(MAP.height - bottomClearance, playerY)
      );
      return;
    }

    if (southExitOpen) {
      let leavePadding = MAP_EXIT_CONFIG.winterbachSouth.leavePadding;

      if (MAP.id === "lautenbach") {
        leavePadding = Math.max(
          MAP_EXIT_CONFIG.lautenbachSouthLeft.leavePadding,
          MAP_EXIT_CONFIG.lautenbachSouthRight.leavePadding
        );
      } else if (MAP.id === "hubacker") {
        leavePadding = MAP_EXIT_CONFIG.hubackerSouthLeft.leavePadding;
      } else if (MAP.id === "oberkirch-zentrum") {
        leavePadding = MAP_EXIT_CONFIG.oberkirchStadiumSouth.leavePadding;
      } else if (MAP.id === "renchtalstadion") {
        leavePadding = MAP_EXIT_CONFIG.stadiumOberkirchSouth.leavePadding;
      }

      playerY = Math.max(
        topClearance,
        Math.min(
          MAP.height + leavePadding + 80,
          playerY
        )
      );
      return;
    }

    playerY = Math.max(
      topClearance,
      Math.min(MAP.height - bottomClearance, playerY)
    );
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
    // R46 COMBAT SIZE FIX:
    // DOWN attack already matches perfectly and stays 1:1.
    // LEFT/RIGHT attack poses were visibly too small -> +20%.
    // UP attack poses follow the same +16% scale family as the W stand.
    // Every scale is anchored bottom-center so the player's feet/world anchor never move.
    const isRightAttack =
      src === PLAYER.attackRight1 ||
      src === PLAYER.attackRight2 ||
      src === PLAYER.attackRight3 ||
      src === PLAYER.attackRight4;

    const isLeftAttack =
      src === PLAYER.attackLeft1 ||
      src === PLAYER.attackLeft2 ||
      src === PLAYER.attackLeft3 ||
      src === PLAYER.attackLeft4;

    const isUpAttack =
      src === PLAYER.attackUp1 ||
      src === PLAYER.attackUp2 ||
      src === PLAYER.attackUp3 ||
      src === PLAYER.attackUp4;

    let spriteScale = 1;

    const club = WEAPONS.pinkPigClub.attacks;
    const isClubLeft = club.left.includes(src);
    const isClubRight = club.right.includes(src);
    const isClubDown = club.down.includes(src);
    const isClubUp = club.up.includes(src);

    if (isClubLeft || isClubRight) {
      // Source sheet is a wide 2x2 composition; normalized 2:3 canvases need
      // this fixed bottom-center scale to match the existing player's world size.
      spriteScale = 2.50;
    } else if (isClubDown) {
      spriteScale = 1.25;
    } else if (isClubUp) {
      spriteScale = 1.75;
    } else if (src === PLAYER.standUp || isUpAttack) {
      spriteScale = 1.16;
    } else if (isRightAttack || isLeftAttack) {
      spriteScale = 1.20;
    }

    playerSprite.style.transformOrigin = "50% 100%";
    playerSprite.style.transform =
      spriteScale === 1 ? "" : `scale(${spriteScale})`;

    if (activeSprite === src) return;
    activeSprite = src;
    playerSprite.src = encodeURI(src);
  }

  function setIdleSprite() {
    if (facing === "down") {
      setSprite(PLAYER.standDown);
    } else if (facing === "up") {
      setSprite(PLAYER.standUp);
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
    const frames =
      animationName === "down" ? PLAYER.walkDown :
      animationName === "right" ? PLAYER.walkRight :
      animationName === "left" ? PLAYER.walkLeft :
      animationName === "up" ? PLAYER.walkUp : null;

    if (!frames) {
      setIdleSprite();
      return;
    }

    walkFrameTimer += deltaSeconds * 1000;

    // R44: every movement frame uses the exact same interval.
    // A/D therefore runs at the same 120 ms per image as W/S.
    const frameDuration = PLAYER.walkFrameDuration;

    while (walkFrameTimer >= frameDuration) {
      walkFrameTimer -= frameDuration;
      walkFrame = (walkFrame + 1) % frames.length;
    }

    setSprite(frames[walkFrame]);
  }

  function chooseAttackSequence() {
    if (equippedWeapon === WEAPONS.pinkPigClub.id) {
      if (facing === "down") return CLUB_ATTACK_DOWN;
      if (facing === "up") return CLUB_ATTACK_UP;
      if (facing === "left") return CLUB_ATTACK_LEFT;
      if (facing === "right") return CLUB_ATTACK_RIGHT;
      return lastHorizontalFacing === "left" ? CLUB_ATTACK_LEFT : CLUB_ATTACK_RIGHT;
    }

    if (facing === "down") return ATTACK_DOWN;
    if (facing === "up") return ATTACK_UP;
    if (facing === "left") return ATTACK_LEFT;
    if (facing === "right") return ATTACK_RIGHT;

    return lastHorizontalFacing === "left" ? ATTACK_LEFT : ATTACK_RIGHT;
  }


  // R68 SAUKEULE — resolve one combat result per strike, not once per target.
  // A SAUSTARKER TREFFER overrides the strike's normal/critical damage with 120.
  function resolvePlayerAttackFrame(frame) {
    if (!frame) return;

    let resolvedFrame = frame;

    if (
      frame.hit &&
      equippedWeapon === WEAPONS.pinkPigClub.id &&
      Math.random() < WEAPONS.pinkPigClub.saustarkChance
    ) {
      resolvedFrame = {
        ...frame,
        damage: WEAPONS.pinkPigClub.saustarkDamage,
        critical: false,
        saustark: true
      };
    }

    resolveRabbitAttackFrame(resolvedFrame);
    resolveWolfAttackFrame(resolvedFrame);
    resolveBoarAttackFrame(resolvedFrame);
    resolveTierbannsteinAttackFrame(resolvedFrame);
    resolveMoleAttackFrame(resolvedFrame);
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
    resolvePlayerAttackFrame(attackSequence[0]);
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
          resolvePlayerAttackFrame(attackSequence[0]);
        } else {
          finishAttackState();
        }
        return;
      }

      setSprite(attackSequence[attackStep].sprite);
      resolvePlayerAttackFrame(attackSequence[attackStep]);
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
      forceSprite(PLAYER.standDown);
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
    if (blocking) { clearIceVelocity(); updateIceVisual(); setSprite(getBlockSprite()); return; }
    if (attacking) { clearIceVelocity(); updateIceVisual(); updateAttack(deltaSeconds); return; }

    let dx = 0, dy = 0;
    if (keys.has("KeyW") || keys.has("ArrowUp")) dy -= 1;
    if (keys.has("KeyS") || keys.has("ArrowDown")) dy += 1;
    if (keys.has("KeyA") || keys.has("ArrowLeft")) dx -= 1;
    if (keys.has("KeyD") || keys.has("ArrowRight")) dx += 1;

    const hasInput = dx !== 0 || dy !== 0;
    const onIce = isWinterbachIceFootPoint(playerX, playerY);

    // R23: ice state exists ONLY while the player's FOOT anchor is on ice.
    // The first frame after leaving ice resets all momentum + sway immediately.
    if (onIce) {
      if (hasInput) {
        if (!moving) { moving = true; playerEl.classList.add("player--moving"); playerEl.classList.remove("player--idle"); }
        const nextAnimation = getMovementAnimation(dx, dy); setAnimation(nextAnimation); renderMovementFrame(currentAnimation, deltaSeconds);
      } else {
        if (moving) { moving = false; playerEl.classList.remove("player--moving"); playerEl.classList.add("player--idle"); }
        setAnimation("idle"); setIdleSprite();
      }
      movePlayerOnIce(dx, dy, deltaSeconds);
      return;
    }

    clearIceVelocity();
    updateIceVisual();
    if (!hasInput) {
      if (moving) { moving = false; playerEl.classList.remove("player--moving"); playerEl.classList.add("player--idle"); }
      setAnimation("idle"); setIdleSprite(); return;
    }
    if (!moving) { moving = true; playerEl.classList.add("player--moving"); playerEl.classList.remove("player--idle"); }
    const nextAnimation = getMovementAnimation(dx, dy); setAnimation(nextAnimation); renderMovementFrame(currentAnimation, deltaSeconds);
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

    if (gameplayUnlocked() && !mapTransitioning) {
      if (!inventoryState.open) {
        if (stadiumActive()) {
          updateStadiumPhase1(deltaSeconds, now);
        } else {
          updatePlayer(deltaSeconds);
          checkMapExit();
        }
      }
      updateAreaSigns();
      updateTrunkenbold(deltaSeconds, now);
      updateRabbits(deltaSeconds, now);
      updateRabbitLootVisibility();
      updateWolves(deltaSeconds, now);
      updateGoat(deltaSeconds, now);
      updateBoars(deltaSeconds, now);
      updateTierbannsteine(deltaSeconds, now);
      updateMole(now);
    }

    renderPlayer();
    updateChurchPlayerDepth();
    renderWorld();

    requestAnimationFrame(frame);
  }

  function isControlEvent(event) {
    return event.code === "ControlLeft" ||
           event.code === "ControlRight" ||
           event.key === "Control";
  }

  window.addEventListener("keydown", (event) => {
    if (!gameplayUnlocked()) {
      const target = event.target;
      const isNameField =
        target && target.id === "startPlayerName";

      // Typing in the name field remains completely native.
      if (isNameField) return;

      // No gameplay key may leak into the campaign while either start screen is open.
      event.preventDefault();
      return;
    }

    // R72 RENCHTALSTADION: spectator input + ESC menu + bookmaker dialog.
    if (stadiumActive()) {
      const isBetStakeField =
        stadiumBetOpen &&
        stadiumBetUI &&
        event.target === stadiumBetUI.stake;

      if (event.code === "Escape") {
        event.preventDefault();

        if (stadiumBetOpen) {
          closeStadiumBetUI();
          return;
        }

        // R74: outside the bookmaker bet dialog, ESC is ALWAYS available in the
        // stadium — including countdown, PRÜGEL, fighter walk/victory/ready phases.
        if (stadiumMenuOpen) hideStadiumMenu();
        else showStadiumMenu();
        return;
      }

      if (isBetStakeField) return;

      event.preventDefault();

      if (stadiumBetOpen || stadiumMenuOpen) return;

      if (stadiumState === "spectator") {
        setStadiumSpectatorFacing(event.code);
      }
      return;
    }

    const controlled = [
      "KeyW", "KeyA", "KeyS", "KeyD", "KeyI",
      "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
      "Equal", "NumpadAdd", "Minus", "NumpadSubtract",
      "Space", "ControlLeft", "ControlRight", "Backquote"
    ];

    if (controlled.includes(event.code) || event.key === "Control") {
      event.preventDefault();
    }

    if (event.code === "KeyI") {
      if (!event.repeat) toggleInventory();
      return;
    }

    // Inventory is screen UI: gameplay controls are ignored until it closes.
    if (inventoryState.open) return;

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
      // Same pickup key as the existing mole loot.
      if (!collectRabbitLoot()) collectBlackPenny();
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
    if (!gameplayUnlocked()) {
      keys.delete(event.code);
      return;
    }

    if (inventoryState.open) {
      keys.delete(event.code);
      return;
    }

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

  // R55 PLAYER STABILITY:
  // A browser can pause requestAnimationFrame while a tab is hidden.
  // Reset only the frame clock on return so walking/combat never inherits
  // stale elapsed time. No animation state, timing constants or sequence changes.
  document.addEventListener("visibilitychange", () => {
    lastFrame = performance.now();
  });

  game.addEventListener("wheel", (event) => {
    event.preventDefault();

    if (!gameplayUnlocked()) return;

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

  async function initialize() {
    startBackgroundMusic();
    installMapTransitionUI();
    createInventorySystem();

    // R67 TEST: first weapon starts in page I at the first free vertical 1x2 area.
    // Later this single line can be removed when the weapon becomes a world reward.
    addItemToInventory(PINK_PIG_CLUB_ITEM);

    // Install immediately as a black curtain so OBERKIRCH never flashes before
    // the new-game sequence. It is screen UI only; no map state is changed.
    createStartFlowUI();

    // R55: all player walking + combat frames are ready before gameplay starts.
    // Existing animation orders, durations and sound synchronization stay untouched.
    await preloadAndDecodePlayerSprites();
    resizeWorldForCurrentMap();
    calculateFitScale();
    displayScale = scaleForLevel(0);
    targetScale = displayScale;

    facing = "right";
    lastHorizontalFacing = "right";
    activeSprite = "";
    currentAnimation = "idle";
    setIdleSprite();

    createAreaSigns();
    installIcePlayerStyles();
    createRabbits();
    createWolves();
    createGoat();
    createBoars();
    createTierbannsteinSystem();
    createMoleSystem();
    createOberkirchBuildings();
    createR11Buildings();
    createWinterbachObsthof();
    createLautenbachBuildings();
    createHubackerBuildings();
    createTrunkenbold();
    createStadiumPhase1();

    clampPlayer();
    updateAreaSigns();
    renderPlayer();
    renderWorld();
    requestAnimationFrame(frame);

    // New game begins only after the existing world has finished preparing.
    // The world stays frozen behind the full-screen start flow until hero select.
    beginStartFlow();
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