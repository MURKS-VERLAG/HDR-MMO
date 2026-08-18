(() => {
  "use strict";

  // R121 DEPLOYMENT VERIFICATION — harmless build marker.
  // If this line appears in DevTools, the browser is definitely running R121.
  console.info("HDR BUILD R178 - KUHBACH RGB REMOVAL + MAP GUARD + CREEK LOWER TRACE");

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
    }),
    oedsbach: Object.freeze({
      id: "oedsbach",
      name: "ÖDSBACH",
      image: "assets/maps/MAP 6 OEDSBACH.png",
      width: 10000,
      height: 6655
    }),
    ramsbach: Object.freeze({
      id: "ramsbach",
      name: "RAMSBACH",
      image: "assets/maps/MAP 7 RAMSBACH.webp",
      width: 10240,
      height: 6827
    }),
    oppenau: Object.freeze({
      id: "oppenau",
      name: "OPPENAU",
      image: "assets/maps/MAP 8 OPPENAU.webp",
      width: 10240,
      height: 5760
    }),
    kuhbach: Object.freeze({
      id: "kuhbach",
      name: "KUHBACH",
      image: "assets/maps/MAP 9 KUHBACH.webp",
      width: 10000,
      height: 5998
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

    // R142: missing reverse direction for the ORIGINAL OBERKIRCH <-> WINTERBACH road.
    // Screenshot/player position is centered on this bottom road around X 5477.
    winterbachOriginalSouth: Object.freeze({
      x1: 4900,
      x2: 6150,
      leavePadding: 18
    }),

    // R142: exact OBERKIRCH top-road arrival from the supplied screenshot.
    oberkirchOriginalNorthReturnSpawn: Object.freeze({
      x: 2590,
      y: 673
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
    }),

    // R91 MAP 2 -> ÖDSBACH: red arrow on the east road.
    winterbachOedsbachEast: Object.freeze({
      y1: 2250,
      y2: 3250,
      leaveX: 10018
    }),
    oedsbachFromWinterbachSpawn: Object.freeze({
      x: 1820,
      y: 6400
    }),

    // R91 ÖDSBACH -> MAP 2: ONLY the blue bottom road returns to WINTERBACH.
    oedsbachWinterbachSouth: Object.freeze({
      x1: 1250,
      x2: 2450,
      leavePadding: 18
    }),
    winterbachFromOedsbachSpawn: Object.freeze({
      x: 9730,
      y: 2715
    }),

    // R111 MAP 4 HUBACKER -> MAP 7 RAMSBACH: existing yellow north road.
    hubackerRamsbachNorth: Object.freeze({
      x1: 3350,
      x2: 4750,
      leaveY: -18
    }),
    ramsbachFromHubackerSpawn: Object.freeze({
      x: 3780,
      y: 6650
    }),

    // MAP 7 RAMSBACH -> HUBACKER: blue bottom road.
    ramsbachHubackerSouth: Object.freeze({
      x1: 3000,
      x2: 4550,
      leavePadding: 18
    }),
    hubackerFromRamsbachSpawn: Object.freeze({
      x: 4050,
      y: 165
    }),

    // R155 MAP 7 RAMSBACH -> MAP 8 OPPENAU: existing red-arrow north road.
    ramsbachOppenauNorth: Object.freeze({
      x1: 3000,
      x2: 4500,
      leaveY: -18
    }),
    // R159 RAMSBACH -> OPPENAU:
    // exact yellow-circle arrival inside the lower gate opening.
    oppenauFromRamsbachSpawn: Object.freeze({
      x: 2615,
      y: 5505
    }),

    // R167 MAP 8 OPPENAU -> MAP 9 KUHBACH: lower-right road leaves east.
    oppenauKuhbachEast: Object.freeze({
      // R168: actual lower-right road / black-border lane from supplied screenshot.
      y1: 4750,
      y2: 5600,
      leaveX: 10258
    }),
    // Spawn on KUHBACH's lower-left incoming road.
    kuhbachFromOppenauSpawn: Object.freeze({
      x: 260,
      y: 5200
    }),

    // Reverse route: KUHBACH lower-left road -> OPPENAU lower-right road.
    kuhbachOppenauWest: Object.freeze({
      y1: 4700,
      y2: 5650,
      leaveX: -18
    }),
    oppenauFromKuhbachSpawn: Object.freeze({
      x: 9980,
      y: 4475
    })
  });

  const PLAYER = Object.freeze({
    standDown: "assets/player/PLAYER STAND DOWN.png",
    standRight: "assets/player/PLAYER STAND RIGHT.png",
    standLeft: "assets/player/PLAYER STAND LEFT.png",
    standUp: "assets/player/PLAYER STAND UP.png",

    // R130 — player death pose supplied by the user.
    dead: "assets/player/PLAYER DEAD.png",

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

  // ------------------------------------------------------------------
  // R143 ERSTES RÜSTUNGSKIT — WAFFENROCK VOM WEISSEN HIRSCH
  // Inventory starts as one 2x3 kit. Equipping splits it visually into
  // armor / helmet / antler-club equipment slots without duplicating items.
  // ------------------------------------------------------------------
  const WHITE_STAG_KIT = Object.freeze({
    id: "white-stag-kit",
    name: "WAFFENROCK VOM WEISSEN HIRSCH",
    inventoryIcon: "assets/items/kits/white-stag/WHITE STAG KIT.png",
    armorIcon: "assets/items/kits/white-stag/WHITE STAG ARMOR.png",
    helmetIcon: "assets/items/kits/white-stag/WHITE STAG HELMET.png",
    weaponIcon: "assets/items/kits/white-stag/WHITE STAG WEAPON.png",
    inventoryWidth: 2,
    inventoryHeight: 3,
    armor: 50,
    damageReduction: 0.50,
    movementSpeedMultiplier: 0.90,
    damage: 120,
    criticalDamage: 180,
    dead: "assets/player/kits/white-stag/death/WHITE STAG DEAD.png",

    // R146 — complete movement-only sprite set while the kit is equipped.
    // RIGHT source = supplied sheet 1. LEFT = exact mirrored RIGHT frames.
    // DOWN source = supplied sheet 2, normalized to one common 420x630 canvas.
    // UP source = supplied sheet 3, deliberately skipping its malformed frame 2.
    walk: Object.freeze({
      right: Object.freeze([
        "assets/player/kits/white-stag/walk/WHITE STAG WALK RIGHT 1.webp",
        "assets/player/kits/white-stag/walk/WHITE STAG WALK RIGHT 2.webp",
        "assets/player/kits/white-stag/walk/WHITE STAG WALK RIGHT 3.webp",
        "assets/player/kits/white-stag/walk/WHITE STAG WALK RIGHT 4.webp"
      ]),
      left: Object.freeze([
        "assets/player/kits/white-stag/walk/WHITE STAG WALK LEFT 1.webp",
        "assets/player/kits/white-stag/walk/WHITE STAG WALK LEFT 2.webp",
        "assets/player/kits/white-stag/walk/WHITE STAG WALK LEFT 3.webp",
        "assets/player/kits/white-stag/walk/WHITE STAG WALK LEFT 4.webp"
      ]),
      down: Object.freeze([
        "assets/player/kits/white-stag/walk/WHITE STAG WALK DOWN 1.webp",
        "assets/player/kits/white-stag/walk/WHITE STAG WALK DOWN 2.webp",
        "assets/player/kits/white-stag/walk/WHITE STAG WALK DOWN 3.webp",
        "assets/player/kits/white-stag/walk/WHITE STAG WALK DOWN 4.webp"
      ]),
      up: Object.freeze([
        "assets/player/kits/white-stag/walk/WHITE STAG WALK UP 1.webp",
        "assets/player/kits/white-stag/walk/WHITE STAG WALK UP 2.webp",
        "assets/player/kits/white-stag/walk/WHITE STAG WALK UP 3.webp"
      ])
    }),

    // R147 — dedicated rest poses after releasing movement.
    // W / up deliberately keeps the existing R146 rear-facing rest frame.
    idle: Object.freeze({
      right: "assets/player/kits/white-stag/idle/WHITE STAG IDLE RIGHT.webp",
      left: "assets/player/kits/white-stag/idle/WHITE STAG IDLE LEFT.webp",
      down: "assets/player/kits/white-stag/idle/WHITE STAG IDLE DOWN.webp"
    }),

    // R148 — dedicated White Stag combat artwork. RIGHT is source sheet 1, LEFT exact mirror.
    attack: Object.freeze({
      right: Object.freeze([
        "assets/player/kits/white-stag/attack/WHITE STAG ATTACK RIGHT 1.webp",
        "assets/player/kits/white-stag/attack/WHITE STAG ATTACK RIGHT 2.webp",
        "assets/player/kits/white-stag/attack/WHITE STAG ATTACK RIGHT 3.webp"
      ]),
      left: Object.freeze([
        "assets/player/kits/white-stag/attack/WHITE STAG ATTACK LEFT 1.webp",
        "assets/player/kits/white-stag/attack/WHITE STAG ATTACK LEFT 2.webp",
        "assets/player/kits/white-stag/attack/WHITE STAG ATTACK LEFT 3.webp"
      ]),
      up: Object.freeze([
        "assets/player/kits/white-stag/attack/WHITE STAG ATTACK UP 1.webp",
        "assets/player/kits/white-stag/attack/WHITE STAG ATTACK UP 2.webp",
        "assets/player/kits/white-stag/attack/WHITE STAG ATTACK UP 3.webp"
      ]),
      down: Object.freeze([
        "assets/player/kits/white-stag/attack/WHITE STAG ATTACK DOWN 1.webp",
        "assets/player/kits/white-stag/attack/WHITE STAG ATTACK DOWN 2.webp",
        "assets/player/kits/white-stag/attack/WHITE STAG ATTACK DOWN 3.webp"
      ])
    })
  });

  // R148 — same proven 400/100/500/100/400/100/500/400 rhythm as existing combat.
  // Each strike begins with the requested AUSHOL frame; hit frames alternate exactly as specified.
  function makeWhiteStagSequence(direction) {
    const f = WHITE_STAG_KIT.attack[direction];
    const pull = f[0];
    const hitA = direction === "down" ? f[2] : f[1];
    const hitB = direction === "down" ? f[1] : f[2];
    const entries = [
      { sprite: pull, duration: 100 },
      { sprite: hitA, duration: 400, hit: true, damage: WHITE_STAG_KIT.damage, strike: 1 },
      { sprite: pull, duration: 100 },
      { sprite: hitB, duration: 500, hit: true, damage: WHITE_STAG_KIT.damage, strike: 2 },
      { sprite: pull, duration: 100 },
      { sprite: hitA, duration: 400, hit: true, damage: WHITE_STAG_KIT.damage, strike: 4 },
      { sprite: pull, duration: 100 },
      { sprite: hitB, duration: 500, hit: true, damage: WHITE_STAG_KIT.criticalDamage, strike: 3, critical: true },
      { sprite: pull, duration: 400 }
    ];
    return Object.freeze(entries.map((entry) => Object.freeze(entry)));
  }

  const WHITE_STAG_ATTACK_RIGHT = makeWhiteStagSequence("right");
  const WHITE_STAG_ATTACK_LEFT = makeWhiteStagSequence("left");
  const WHITE_STAG_ATTACK_DOWN = makeWhiteStagSequence("down");
  const WHITE_STAG_ATTACK_UP = makeWhiteStagSequence("up");

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

  // R80 — one-shot stadium announcer. It is never looped and is never
  // restarted during the countdown/fighter sequence.
  const stadiumFightAnnouncerAudio = new Audio("assets/audio/stadium/ITS TIME UFC ANNOUNCER.mp3");
  stadiumFightAnnouncerAudio.preload = "auto";
  stadiumFightAnnouncerAudio.loop = false;
  stadiumFightAnnouncerAudio.volume = 1.0;
  let stadiumFightAnnouncerPlayed = false;

  // R81 — battle horn after "Wette abschließen".
  const stadiumBattleHornAudio = new Audio("assets/audio/stadium/BATTLEHORN.mp3");
  stadiumBattleHornAudio.preload = "auto";
  stadiumBattleHornAudio.loop = false;
  stadiumBattleHornAudio.volume = 1.0;
  let stadiumBattleHornPlayed = false;

  function playStadiumBattleHornOnce() {
    if (stadiumBattleHornPlayed) return;
    stadiumBattleHornPlayed = true;
    try { stadiumBattleHornAudio.currentTime = 0; } catch (_) {}
    stadiumBattleHornAudio.play().catch(() => {});
  }

  // ------------------------------------------------------------------
  // R89 — RENCHTALSTADION FINAL COMBAT SFX
  // Purely additive. Existing music, horn and announcer remain untouched.
  // ------------------------------------------------------------------
  const STADIUM_ARENA_SFX = Object.freeze({
    neuensteinHits: Object.freeze([
      "assets/audio/stadium/arena/NEUENSTEIN HIT 1.mp3",
      "assets/audio/stadium/arena/NEUENSTEIN HIT 2.mp3",
      "assets/audio/stadium/arena/NEUENSTEIN HIT 3.mp3"
    ]),
    schauenburgHits: Object.freeze([
      "assets/audio/stadium/arena/SCHAUENBURG HIT 1.mp3",
      "assets/audio/stadium/arena/SCHAUENBURG HIT 2.mp3"
    ]),
    // R90 — the formerly misassigned swish8 "kill lead" is actually rest movement SFX.
    deathFinal: "assets/audio/stadium/arena/ARENA DEATH FINAL.mp3",
    // This file is physically trimmed: original audio begins at source 00:05.
    killCrowd: "assets/audio/stadium/arena/ARENA KILL CROWD FROM 5S.mp3",
    neutralRest: Object.freeze([
      "assets/audio/stadium/arena/ARENA REST 1.mp3",
      "assets/audio/stadium/arena/ARENA REST 2.mp3",
      "assets/audio/stadium/arena/ARENA REST 3.mp3",
      "assets/audio/stadium/arena/ARENA KILL LEAD.mp3"
    ])
  });

  const stadiumArenaSfxPreloads = [];
  const stadiumArenaActiveSfx = new Set();
  let stadiumArenaKillSequencePlayed = false;

  function preloadStadiumArenaSfx() {
    if (stadiumArenaSfxPreloads.length) return;
    const all = [
      ...STADIUM_ARENA_SFX.neuensteinHits,
      ...STADIUM_ARENA_SFX.schauenburgHits,
      STADIUM_ARENA_SFX.deathFinal,
      STADIUM_ARENA_SFX.killCrowd,
      ...STADIUM_ARENA_SFX.neutralRest
    ];
    for (const src of all) {
      const audio = new Audio(encodeURI(src));
      audio.preload = "auto";
      audio.load();
      stadiumArenaSfxPreloads.push(audio);
    }
  }

  function playStadiumArenaSfx(src, onEnded = null) {
    const audio = new Audio(encodeURI(src));
    audio.preload = "auto";
    audio.volume = 1.0;
    stadiumArenaActiveSfx.add(audio);

    const cleanup = () => {
      stadiumArenaActiveSfx.delete(audio);
    };

    audio.addEventListener("ended", () => {
      cleanup();
      if (typeof onEnded === "function") onEnded();
    }, { once: true });
    audio.addEventListener("error", cleanup, { once: true });
    audio.play().catch(() => cleanup());
    return audio;
  }

  function stopAllStadiumArenaSfx() {
    for (const audio of stadiumArenaActiveSfx) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (_) {}
    }
    stadiumArenaActiveSfx.clear();
  }

  function playRandomStadiumArenaSfx(pool) {
    if (!Array.isArray(pool) || !pool.length) return;
    const src = pool[Math.floor(Math.random() * pool.length)];
    playStadiumArenaSfx(src);
  }

  function playStadiumArenaNeutralRestPair() {
    const pool = STADIUM_ARENA_SFX.neutralRest;
    if (pool.length < 2) return;
    const firstIndex = Math.floor(Math.random() * pool.length);
    let secondIndex = Math.floor(Math.random() * (pool.length - 1));
    if (secondIndex >= firstIndex) secondIndex += 1;

    // EXACT requirement: two DIFFERENT rest sounds, directly one after another.
    playStadiumArenaSfx(pool[firstIndex], () => {
      playStadiumArenaSfx(pool[secondIndex]);
    });
  }

  function playStadiumArenaKillSequenceOnce() {
    if (stadiumArenaKillSequencePlayed) return;
    stadiumArenaKillSequencePlayed = true;

    // R90 — strict fatality audio order for BOTH possible winners:
    // actual death/final-hit sound first, then the already trimmed crowd reaction.
    // The former swish8 sound is no longer a death cue; it now lives in neutralRest.
    stopAllStadiumArenaSfx();
    playStadiumArenaSfx(STADIUM_ARENA_SFX.deathFinal, () => {
      playStadiumArenaSfx(STADIUM_ARENA_SFX.killCrowd);
    });
  }

  function playStadiumFightAnnouncerOnce() {
    if (stadiumFightAnnouncerPlayed) return Promise.resolve(false);
    stadiumFightAnnouncerPlayed = true;
    try { stadiumFightAnnouncerAudio.currentTime = 0; } catch (_) {}
    return stadiumFightAnnouncerAudio.play()
      .then(() => true)
      .catch(() => false);
  }

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
    "renchtalstadion": "assets/audio/maps/RENCHTALSTADION - MEDIEVAL BATTLE.mp3",
    "oedsbach": "assets/audio/maps/OEDSBACH - THE HOLLOW KNIGHTS MARCH.mp3",
    // R114: dedicated RAMSBACH track supplied by the user.
    "ramsbach": "assets/audio/maps/RAMSBACH - THE RING'S CALL.mp3",
    // R155 dedicated OPPENAU track supplied by the user.
    "oppenau": "assets/audio/maps/OPPENAU - DIE GROSSE REISE.mp3",
    // R167 KUHBACH currently continues the OPPENAU journey theme.
    "kuhbach": "assets/audio/maps/KUHBACH - HALTERUS.mp3"
  });

  const MAP_MUSIC_VOLUME = 1.0;
  const MAP_MUSIC_FADE_MS = 1400;

  // ------------------------------------------------------------------
  // R139 ANIMAL COMBAT / PROXIMITY SFX — supplied by user.
  // ------------------------------------------------------------------
  const ANIMAL_COMBAT_SFX = Object.freeze({
    wolfAttack: Object.freeze([
      "assets/audio/animals/wolf/WOLF ATTACK 1.mp3",
      "assets/audio/animals/wolf/WOLF ATTACK 2.mp3",
      "assets/audio/animals/wolf/WOLF ATTACK 3.mp3",
      "assets/audio/animals/wolf/WOLF ATTACK 4.mp3"
    ]),
    bearAttack: Object.freeze([
      "assets/audio/animals/bear/BEAR ATTACK 1.mp3",
      "assets/audio/animals/bear/BEAR ATTACK 2.mp3"
    ]),
    bearNearby: Object.freeze([
      "assets/audio/animals/bear/BEAR GROWL 1.mp3",
      "assets/audio/animals/bear/BEAR GROWL 2.mp3"
    ]),
    bearDeath: Object.freeze([
      "assets/audio/animals/bear/BEAR DEATH 1.mp3",
      "assets/audio/animals/bear/BEAR DEATH 2.mp3"
    ]),
    boarHitsPlayer: Object.freeze([
      "assets/audio/animals/boar/BOAR PLAYER HIT 1.mp3",
      "assets/audio/animals/boar/BOAR PLAYER HIT 2.mp3"
    ])
  });

  function playRandomAnimalCombatSfx(pool) {
    if (!Array.isArray(pool) || !pool.length) return null;
    const src = pool[Math.floor(Math.random() * pool.length)];
    const audio = new Audio(encodeURI(src));
    audio.preload = "auto";
    audio.loop = false;
    audio.volume = 1.0;
    audio.play().catch(() => {});
    return audio;
  }

  // R79 STADIUM MUSIC:
  // RENCHTALSTADION inherits the currently running OBERKIRCH track until
  // the arena fight is actually started via "Wette abschließen".
  let stadiumBattleMusicStarted = false;

  // R60 START FLOW MUSIC:
  // Both screens before OBERKIRCH use the EXACT existing RENCHTALSTADION track.
  // No duplicate audio file is needed; we reuse MAP_MUSIC["renchtalstadion"].
  function desiredBackgroundMusicId() {
    if (typeof startFlowState !== "undefined" && startFlowState !== "campaign") {
      return "renchtalstadion";
    }

    // R79: while merely visiting / spectating before the bet is submitted,
    // the stadium must continue OBERKIRCH music without restarting it.
    if (
      MAP &&
      MAP.id === "renchtalstadion" &&
      !stadiumBattleMusicStarted
    ) {
      return "oberkirch-zentrum";
    }

    return (MAP && MAP.id) ? MAP.id : "oberkirch-zentrum";
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

    // R111 MAP 7 — RAMSBACH route labels.
    {
      id: "ramsbach-oppenau",
      mapId: "ramsbach",
      text: "OPPENAU",
      x: 3700, y: 430,
      direction: "up",
      glow: "#ffffff",
      trigger: { x1: 3000, y1: 0, x2: 4500, y2: 1250 }
    },
    {
      id: "ramsbach-hubacker",
      mapId: "ramsbach",
      text: "HUBACKER",
      x: 3780, y: 6350,
      direction: "down",
      glow: "#ffffff",
      trigger: { x1: 3000, y1: 5550, x2: 4550, y2: 6827 }
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
    },

    // R91 MAP 6 ÖDSBACH — labels only except the blue WINTERBACH return.
    {
      id: "oedsbach-sendelbach", mapId: "oedsbach", text: "SENDELBACH",
      x: 620, y: 430, direction: "up", glow: "#ffffff",
      trigger: { x1: 0, y1: 0, x2: 1450, y2: 1300 }
    },
    {
      id: "oedsbach-hengstberg", mapId: "oedsbach", text: "HENGSTBERG",
      x: 9350, y: 430, direction: "up", glow: "#ffffff",
      trigger: { x1: 8550, y1: 0, x2: 10000, y2: 1300 }
    },
    {
      id: "oedsbach-hesselbach", mapId: "oedsbach", text: "HESSELBACH",
      x: 9470, y: 4720, direction: "right", glow: "#ffffff",
      trigger: { x1: 8500, y1: 3850, x2: 10000, y2: 5550 }
    },
    {
      id: "oedsbach-winterbach", mapId: "oedsbach", text: "WINTERBACH",
      x: 1820, y: 6170, direction: "down", glow: "#ffffff",
      trigger: { x1: 1050, y1: 5350, x2: 2700, y2: 6655 }
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
  // R91 ÖDEGARD — MAP 6 fixed NPC, three supplied poses, smooth 2s cycle.
  // ------------------------------------------------------------------
  const OEDEGARD_CONFIG = Object.freeze({
    x: 5570,
    y: 1900,
    width: 688,
    height: 688,
    interval: 2000,
    fade: 650,
    sprites: Object.freeze([
      "assets/npcs/oedegard/OEDEGARD 1.png",
      "assets/npcs/oedegard/OEDEGARD 2.png",
      "assets/npcs/oedegard/OEDEGARD 3.png"
    ])
  });

  let oedegard = null;

  function createOedegard() {
    if (oedegard) return;
    const root = document.createElement("div");
    root.className = "oedegard";
    root.style.left = `${OEDEGARD_CONFIG.x}px`;
    root.style.top = `${OEDEGARD_CONFIG.y}px`;
    root.style.width = `${OEDEGARD_CONFIG.width}px`;
    root.style.height = `${OEDEGARD_CONFIG.height}px`;
    root.style.display = MAP.id === "oedsbach" ? "" : "none";

    const imgs = OEDEGARD_CONFIG.sprites.map((src, i) => {
      const img = document.createElement("img");
      img.src = encodeURI(src); img.alt = ""; img.draggable = false;
      img.className = "oedegard__sprite";
      img.style.opacity = i === 0 ? "1" : "0";
      root.appendChild(img);
      return img;
    });
    world.appendChild(root);
    oedegard = { root, imgs, index: 0, nextAt: performance.now() + OEDEGARD_CONFIG.interval };
  }

  function installOedegardStyles() {
    if (document.getElementById("oedegardStyles")) return;
    const style = document.createElement("style");
    style.id = "oedegardStyles";
    style.textContent = `
      .oedegard { position:absolute; transform:translate(-50%,-100%); z-index:7; pointer-events:none; user-select:none; }
      .oedegard__sprite { position:absolute; inset:0; width:100%; height:100%; object-fit:contain; object-position:50% 100%; transition:opacity ${OEDEGARD_CONFIG.fade}ms ease-in-out; filter:drop-shadow(0 9px 5px rgba(0,0,0,.28)); }
    `;
    document.head.appendChild(style);
  }

  function setOedegardVisibility(visible) {
    if (!oedegard) return;
    oedegard.root.style.display = visible ? "" : "none";

    if (visible) {
      oedegard.index = 0;
      oedegard.imgs.forEach((img, index) => {
        img.style.opacity = index === 0 ? "1" : "0";
      });
      oedegard.nextAt = performance.now() + OEDEGARD_CONFIG.interval;
    }
  }

  function updateOedegard(now) {
    if (!oedegard || MAP.id !== "oedsbach") return;
    if (now < oedegard.nextAt) return;
    oedegard.imgs[oedegard.index].style.opacity = "0";
    oedegard.index = (oedegard.index + 1) % oedegard.imgs.length;
    oedegard.imgs[oedegard.index].style.opacity = "1";
    oedegard.nextAt = now + OEDEGARD_CONFIG.interval;
  }

  // ------------------------------------------------------------------
  // R165 ÖDSBACH — REDNECK FREDNECK HÜTTE + FREDNECK
  // Reference placement from the supplied ÖDSBACH screenshot.
  // WHITE upper strip: walkable, player renders BEHIND the visible hut.
  // PURPLE lower strip: walkable, player stays IN FRONT.
  // Middle visible hut body: precise PNG-alpha foot collision.
  // ------------------------------------------------------------------
  const OEDSBACH_REDNECK = Object.freeze({
    hut: Object.freeze({
      id: "oedsbach-redneck-hut",
      src: "assets/buildings/oedsbach/REDNECK_FREDNECK_HUETTE.png",
      left: 6420,
      top: 1430,
      width: 2050,
      height: 1367,
      // Supplied WHITE reference rectangle.
      behind: Object.freeze({ x1: 0.05, y1: 0.00, x2: 0.98, y2: 0.53 }),
      // Supplied PURPLE reference rectangle: explicitly no collision.
      frontWalk: Object.freeze({ x1: 0.00, y1: 0.78, x2: 1.00, y2: 1.00 }),
      collisionFromY: 0.53,
      collisionToY: 0.78,
      zIndex: 6
    }),
    fredneck: Object.freeze({
      src: "assets/npcs/oedsbach/fredneck/REDNECK FREDNECK SLEEP.png",
      x: 8705,
      y: 1480,
      width: 675,
      height: 450,
      zIndex: 7
    })
  });

  let oedsbachRedneckHutEl = null;
  let oedsbachFredneckEl = null;
  let oedsbachRedneckHutMask = null;

  function prepareOedsbachRedneckHutMask(image) {
    if (!image || !image.naturalWidth || !image.naturalHeight) return;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(image, 0, 0);
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const alpha = new Uint8Array(canvas.width * canvas.height);
      for (let src = 3, dst = 0; src < pixels.length; src += 4, dst += 1) alpha[dst] = pixels[src];
      oedsbachRedneckHutMask = { width: canvas.width, height: canvas.height, alpha };
    } catch (error) {
      console.warn("ÖDSBACH REDNECK hut alpha mask unavailable:", error);
    }
  }

  function oedsbachRedneckHutLocalPoint(x, y) {
    const c = OEDSBACH_REDNECK.hut;
    return {
      x: (x - c.left) / c.width,
      y: (y - c.top) / c.height
    };
  }

  function pointInNormalizedRect(x, y, rect) {
    return x >= rect.x1 && x <= rect.x2 && y >= rect.y1 && y <= rect.y2;
  }

  function oedsbachRedneckHutAlphaAt(localX, localY) {
    const mask = oedsbachRedneckHutMask;
    if (!mask || localX < 0 || localX > 1 || localY < 0 || localY > 1) return 0;
    const px = Math.max(0, Math.min(mask.width - 1, Math.round(localX * (mask.width - 1))));
    const py = Math.max(0, Math.min(mask.height - 1, Math.round(localY * (mask.height - 1))));
    return mask.alpha[py * mask.width + px];
  }

  function isOedsbachRedneckHutBlockedFootPoint(x, y) {
    if (MAP.id !== "oedsbach") return false;
    const c = OEDSBACH_REDNECK.hut;
    if (x < c.left || x > c.left + c.width || y < c.top || y > c.top + c.height) return false;
    const p = oedsbachRedneckHutLocalPoint(x, y);

    // WHITE and PURPLE marked zones are intentionally walkable.
    if (pointInNormalizedRect(p.x, p.y, c.behind)) return false;
    if (pointInNormalizedRect(p.x, p.y, c.frontWalk)) return false;

    // Only the actual visible hut silhouette in the middle body blocks.
    if (p.y < c.collisionFromY || p.y > c.collisionToY) return false;
    return oedsbachRedneckHutAlphaAt(p.x, p.y) >= 28;
  }

  function playerBehindOedsbachRedneckHut() {
    if (MAP.id !== "oedsbach") return false;
    const p = oedsbachRedneckHutLocalPoint(playerX, playerY);
    return pointInNormalizedRect(p.x, p.y, OEDSBACH_REDNECK.hut.behind);
  }

  function createOedsbachRedneckScene() {
    if (!oedsbachRedneckHutEl) {
      const c = OEDSBACH_REDNECK.hut;
      const image = document.createElement("img");
      image.id = c.id;
      image.src = encodeURI(c.src);
      image.alt = "";
      image.draggable = false;
      image.style.position = "absolute";
      image.style.left = `${c.left}px`;
      image.style.top = `${c.top}px`;
      image.style.width = `${c.width}px`;
      image.style.height = `${c.height}px`;
      image.style.objectFit = "contain";
      image.style.pointerEvents = "none";
      image.style.userSelect = "none";
      image.style.zIndex = String(c.zIndex);
      image.style.display = MAP.id === "oedsbach" ? "" : "none";
      image.addEventListener("load", () => prepareOedsbachRedneckHutMask(image), { once: true });
      world.appendChild(image);
      if (image.complete && image.naturalWidth > 0) prepareOedsbachRedneckHutMask(image);
      oedsbachRedneckHutEl = image;
    }

    if (!oedsbachFredneckEl) {
      const c = OEDSBACH_REDNECK.fredneck;
      const image = document.createElement("img");
      image.id = "oedsbach-fredneck";
      image.src = encodeURI(c.src);
      image.alt = "";
      image.draggable = false;
      image.style.position = "absolute";
      image.style.left = `${c.x}px`;
      image.style.top = `${c.y}px`;
      image.style.width = `${c.width}px`;
      image.style.height = `${c.height}px`;
      image.style.transform = "translate(-50%, -100%)";
      image.style.objectFit = "contain";
      image.style.objectPosition = "50% 100%";
      image.style.pointerEvents = "none";
      image.style.userSelect = "none";
      image.style.zIndex = String(c.zIndex);
      image.style.display = MAP.id === "oedsbach" ? "" : "none";
      world.appendChild(image);
      oedsbachFredneckEl = image;
    }
  }

  function updateOedsbachRedneckSceneVisibility() {
    const visible = MAP.id === "oedsbach";
    if (oedsbachRedneckHutEl) oedsbachRedneckHutEl.style.display = visible ? "" : "none";
    if (oedsbachFredneckEl) oedsbachFredneckEl.style.display = visible ? "" : "none";
  }


  // ------------------------------------------------------------------
  // R172 KUHBACH — FLORIANUS DANCE LOOP + DISCO LIGHTS
  // Hut placement/collision stays untouched. Florianus now uses the exact
  // PLAYER canvas size (420x630), cycles all supplied poses + mirrors, and
  // crossfades smoothly every 0.25 seconds with an irregular RGB spotlight.
  // ------------------------------------------------------------------
  const KUHBACH_FLORIANUS = Object.freeze({
    hut: Object.freeze({
      id: "kuhbach-florianus-hut",
      src: "assets/buildings/kuhbach/FLORIANUS_HALTERUS_HUETTE.png",
      left: 5600,
      top: 110,
      width: 3400,
      height: 2267,
      mirrored: true,
      zIndex: 6,
      collision: Object.freeze({ x1: 0.56, y1: 0.05, x2: 0.96, y2: 0.61 })
    }),
    florianus: Object.freeze({
      id: "kuhbach-florianus-halterus",
      x: 6840,
      y: 1515,
      width: PLAYER.width,
      height: PLAYER.height,
      zIndex: 8,
      frameMs: 250,
      fadeMs: 0,
      poses: Object.freeze([
        "assets/npcs/kuhbach/FLORIANUS_HALTERUS.png",
        "assets/npcs/kuhbach/dance/FLORIANUS_DANCE_1.webp",
        "assets/npcs/kuhbach/dance/FLORIANUS_DANCE_2.webp",
        "assets/npcs/kuhbach/dance/FLORIANUS_DANCE_3.webp"
      ])
    })
  });

  let kuhbachFlorianusHutEl = null;
  let kuhbachFlorianusEl = null;
  let kuhbachFlorianusDanceTimer = 0;
  let kuhbachFlorianusLightTimer = 0;
  let kuhbachFlorianusDanceIndex = -1;

  function randomDifferentIndex(length, previous) {
    if (length <= 1) return 0;
    let next = Math.floor(Math.random() * length);
    if (next === previous) next = (next + 1 + Math.floor(Math.random() * (length - 1))) % length;
    return next;
  }

  function florianusDanceVariants() {
    const variants = [];
    for (const src of KUHBACH_FLORIANUS.florianus.poses) {
      variants.push({ src, mirrored: false });
      variants.push({ src, mirrored: true });
    }
    return variants;
  }

  const KUHBACH_FLORIANUS_DANCE_VARIANTS = Object.freeze(florianusDanceVariants());

  function setKuhbachFlorianusDanceFrame(immediate = false) {
    if (!kuhbachFlorianusEl) return;
    const layers = kuhbachFlorianusEl.querySelectorAll(".kuhbach-florianus-dance-frame");
    if (!layers.length) return;

    const nextIndex = randomDifferentIndex(
      KUHBACH_FLORIANUS_DANCE_VARIANTS.length,
      kuhbachFlorianusDanceIndex
    );

    for (let i = 0; i < layers.length; i += 1) {
      layers[i].style.visibility = i === nextIndex ? "visible" : "hidden";
    }

    kuhbachFlorianusDanceIndex = nextIndex;
  }

  function scheduleKuhbachFlorianusDance() {
    clearTimeout(kuhbachFlorianusDanceTimer);
    if (MAP.id !== "kuhbach") {
      kuhbachFlorianusDanceTimer = 0;
      return;
    }

    kuhbachFlorianusDanceTimer = window.setTimeout(() => {
      if (MAP.id !== "kuhbach") {
        kuhbachFlorianusDanceTimer = 0;
        return;
      }
      setKuhbachFlorianusDanceFrame(false);
      scheduleKuhbachFlorianusDance();
    }, KUHBACH_FLORIANUS.florianus.frameMs);
  }

  function scheduleKuhbachFlorianusDiscoLight() {
    // R177 HARD FLICKER FIX:
    // dynamic disco repaint is disabled. The prior R176 simplification proved
    // mix-blend was not the only cause; we now remove the remaining gradient repaint entirely.
    clearTimeout(kuhbachFlorianusLightTimer);
    kuhbachFlorianusLightTimer = 0;
    const light =
      kuhbachFlorianusEl &&
      kuhbachFlorianusEl.querySelector(".kuhbach-florianus-disco-light");
    if (light) {
      light.style.display = "none";
      light.style.opacity = "0";
    }
  }

  function createKuhbachFlorianusScene() {
    // R177 BLACKSCREEN FIX: restore the two scene roots that were accidentally
    // removed by the previous flicker patch. The old working structure created
    // the hut image and Florianus root before any dance layers were appended.
    if (!kuhbachFlorianusHutEl) {
      const c = KUHBACH_FLORIANUS.hut;
      const image = document.createElement("img");
      image.id = c.id;
      image.src = encodeURI(c.src);
      image.alt = "";
      image.draggable = false;
      image.style.position = "absolute";
      image.style.left = `${c.left}px`;
      image.style.top = `${c.top}px`;
      image.style.width = `${c.width}px`;
      image.style.height = `${c.height}px`;
      image.style.objectFit = "contain";
      image.style.objectPosition = "50% 100%";
      image.style.transformOrigin = "50% 100%";
      image.style.transform = c.mirrored ? "scaleX(-1)" : "scaleX(1)";
      image.style.pointerEvents = "none";
      image.style.userSelect = "none";
      image.style.zIndex = String(c.zIndex);
      image.style.display = MAP.id === "kuhbach" ? "" : "none";
      world.appendChild(image);
      kuhbachFlorianusHutEl = image;
    }

    if (!kuhbachFlorianusEl) {
      const c = KUHBACH_FLORIANUS.florianus;
      const root = document.createElement("div");
      root.id = c.id;
      root.style.position = "absolute";
      root.style.left = `${c.x}px`;
      root.style.top = `${c.y}px`;
      root.style.width = `${c.width}px`;
      root.style.height = `${c.height}px`;
      root.style.transform = "translate(-50%, -100%)";
      root.style.transformOrigin = "50% 100%";
      root.style.pointerEvents = "none";
      root.style.userSelect = "none";
      root.style.zIndex = String(c.zIndex);
      root.style.display = MAP.id === "kuhbach" ? "" : "none";
      root.style.overflow = "visible";

      // Keep the R177 no-src-swap approach: all 8 variants stay resident and
      // only visibility changes every 250 ms. This preserves the flicker fix.
      for (let i = 0; i < KUHBACH_FLORIANUS_DANCE_VARIANTS.length; i += 1) {
        const variant = KUHBACH_FLORIANUS_DANCE_VARIANTS[i];
        const image = document.createElement("img");
        image.className = "kuhbach-florianus-dance-frame";
        image.alt = "";
        image.draggable = false;
        image.src = encodeURI(variant.src);
        image.style.position = "absolute";
        image.style.inset = "0";
        image.style.width = "100%";
        image.style.height = "100%";
        image.style.objectFit = "contain";
        image.style.objectPosition = "50% 100%";
        image.style.transformOrigin = "50% 100%";
        image.style.transform = variant.mirrored ? "scaleX(-1)" : "scaleX(1)";
        image.style.visibility = "hidden";
        image.style.opacity = "1";
        image.style.pointerEvents = "none";
        image.style.backfaceVisibility = "hidden";
        image.style.webkitBackfaceVisibility = "hidden";
        root.appendChild(image);
        if (typeof image.decode === "function") image.decode().catch(() => {});
      }

      world.appendChild(root);
      kuhbachFlorianusEl = root;
      setKuhbachFlorianusDanceFrame(true);
      if (MAP.id === "kuhbach") scheduleKuhbachFlorianusDance();
    }
  }

  function updateKuhbachFlorianusSceneVisibility() {
    const visible = MAP.id === "kuhbach";
    if (kuhbachFlorianusHutEl) {
      kuhbachFlorianusHutEl.style.display = visible ? "" : "none";
    }
    if (kuhbachFlorianusEl) {
      kuhbachFlorianusEl.style.display = visible ? "" : "none";
    }

    if (visible) {
      if (!kuhbachFlorianusDanceTimer) scheduleKuhbachFlorianusDance();
    } else {
      clearTimeout(kuhbachFlorianusDanceTimer);
      clearTimeout(kuhbachFlorianusLightTimer);
      kuhbachFlorianusDanceTimer = 0;
      kuhbachFlorianusLightTimer = 0;

      const light =
        kuhbachFlorianusEl &&
        kuhbachFlorianusEl.querySelector(".kuhbach-florianus-disco-light");
      if (light) light.style.opacity = "0";
    }
  }

  function isKuhbachFlorianusHutBlockedFootPoint(x, y) {
    if (MAP.id !== "kuhbach") return false;
    const c = KUHBACH_FLORIANUS.hut;
    const r = c.collision;
    const localX = (x - c.left) / c.width;
    const localY = (y - c.top) / c.height;
    return (
      localX >= r.x1 &&
      localX <= r.x2 &&
      localY >= r.y1 &&
      localY <= r.y2
    );
  }


  // ------------------------------------------------------------------
  // R174 KUHBACH — terrain from supplied painted reference.
  // RED filled regions = hard blocked terrain.
  // RED outline = hard fence boundary with an intentional gate opening.
  // WHITE line = visual flowing creek shimmer only (walkable).
  // GREEN left hillside = A/D gets a diagonal slope bias.
  // ------------------------------------------------------------------
  const KUHBACH_TERRAIN = Object.freeze({
    // Screenshot reference mapped to the 10000 x 5998 KUHBACH world.
    blockedPolygons: Object.freeze([
      Object.freeze([
        { x: 9850, y:    0 },
        { x: 8400, y:    0 },
        { x: 8041, y:    0 },
        { x: 8033, y:  214 },
        { x: 7865, y:  343 },
        { x: 7598, y:  412 },
        { x: 7110, y:  946 },
        { x: 7133, y: 1107 },
        { x: 7850, y: 1236 },
        { x: 7965, y: 1313 },
        { x: 8155, y: 1244 },
        { x: 8285, y: 1282 },
        { x: 8575, y: 1572 },
        { x: 8674, y: 1465 },
        { x: 8590, y: 1122 },
        { x: 8812, y: 1045 },
        { x: 8896, y:  939 },
        { x: 9117, y: 1168 },
        { x: 8980, y: 1335 },
        { x: 9117, y: 1442 },
        { x: 9002, y: 1671 },
        { x: 9292, y: 1900 },
        { x: 8804, y: 2068 },
        { x: 8613, y: 2404 },
        { x: 7865, y: 2686 },
        { x: 7644, y: 2915 },
        { x: 7751, y: 3152 },
        { x: 8033, y: 3449 },
        { x: 8819, y: 3106 },
        { x: 8957, y: 2923 },
        { x: 8957, y: 2678 },
        { x: 9048, y: 2556 },
        { x: 9521, y: 2419 },
        { x: 9811, y: 2244 }
      ]),
      Object.freeze([
        { x: 9758, y: 2946 },
        { x: 9285, y: 3068 },
        { x: 8339, y: 3983 },
        { x: 8369, y: 4197 },
        { x: 8278, y: 4380 },
        { x: 8621, y: 4647 },
        { x: 8468, y: 4708 },
        { x: 8400, y: 4891 },
        { x: 8682, y: 5036 },
        { x: 8842, y: 5021 },
        { x: 9712, y: 4350 }
      ])
    ]),

    // Fence line around Florianus' paddock. Bottom-right gate opening is NOT present here.
    fenceSegments: Object.freeze([
      Object.freeze([{ x: 5665, y: 1350 }, { x: 6650, y:  930 }]),
      Object.freeze([{ x: 6650, y:  930 }, { x: 7040, y:  900 }]),
      Object.freeze([{ x: 7040, y:  900 }, { x: 7685, y: 1125 }]),
      Object.freeze([{ x: 7685, y: 1125 }, { x: 8170, y: 1385 }]),
      Object.freeze([{ x: 8170, y: 1385 }, { x: 8085, y: 1655 }]),
      Object.freeze([{ x: 8085, y: 1655 }, { x: 7740, y: 1825 }]),

      // deliberate gate gap from ~7740..7280 world-X

      Object.freeze([{ x: 7220, y: 1940 }, { x: 6175, y: 2070 }]),
      Object.freeze([{ x: 6175, y: 2070 }, { x: 6115, y: 1830 }]),
      Object.freeze([{ x: 6115, y: 1830 }, { x: 5680, y: 1580 }]),
      Object.freeze([{ x: 5680, y: 1580 }, { x: 5665, y: 1350 }])
    ]),
    fenceRadius: 62,

    hillPolygon: Object.freeze([
      { x: 3508, y:   23 },
      { x:  341, y:    0 },
      { x:  173, y:    8 },
      { x:  158, y: 5212 },
      { x: 1707, y: 3678 },
      { x: 2073, y: 2915 },
      { x: 2066, y: 2244 },
      { x: 2226, y: 1717 },
      { x: 2798, y: 1366 },
      { x: 3287, y:  870 },
      { x: 3470, y:  473 }
    ]),
    hillSlopeBias: 0.58,

    creekPath: Object.freeze([
      { x: 6367, y:    0 },
      { x: 6286, y:   50 },
      { x: 6133, y:  145 },
      { x: 5927, y:  237 },
      { x: 5782, y:  328 },
      { x: 5714, y:  420 },
      { x: 5584, y:  504 },
      { x: 5507, y:  595 },
      { x: 5500, y:  687 },
      { x: 5530, y:  778 },
      { x: 5569, y:  878 },
      { x: 5622, y:  965 },
      { x: 5675, y: 1053 },
      { x: 5698, y: 1145 },
      { x: 5675, y: 1244 },
      { x: 5546, y: 1335 },
      { x: 5332, y: 1419 },
      { x: 5164, y: 1511 },
      { x: 5034, y: 1606 },
      { x: 4916, y: 1698 },
      { x: 4790, y: 1786 },
      { x: 4645, y: 1885 },
      { x: 4531, y: 1954 },
      { x: 4496, y: 2064 },
      { x: 4477, y: 2152 },
      { x: 4454, y: 2251 },
      { x: 4409, y: 2335 },
      { x: 4294, y: 2434 },
      { x: 4111, y: 2526 },
      { x: 3913, y: 2610 },
      { x: 3737, y: 2705 },
      { x: 3584, y: 2801 },
      { x: 3378, y: 2900 },
      { x: 3149, y: 2961 },
      { x: 3104, y: 3071 },
      { x: 3088, y: 3167 },
      { x: 3058, y: 3258 },
      { x: 3027, y: 3346 },
      { x: 3004, y: 3434 },
      { x: 2974, y: 3529 },
      { x: 2936, y: 3625 },
      { x: 2875, y: 3716 },
      { x: 2776, y: 3808 },
      { x: 2661, y: 3899 },
      { x: 2531, y: 3983 },
      { x: 2409, y: 4083 },
      { x: 2305, y: 4170 },
      { x: 2190, y: 4260 },
      { x: 2035, y: 4350 },
      { x: 1845, y: 4440 },
      { x: 1615, y: 4530 },
      { x: 1390, y: 4620 },
      { x: 1170, y: 4710 },
      { x:  985, y: 4800 },
      { x:  835, y: 4890 },
      { x:  710, y: 4985 },
      { x:  610, y: 5080 },
      { x:  515, y: 5180 },
      { x:  425, y: 5280 },
      { x:  345, y: 5380 },
      { x:  275, y: 5480 },
      { x:  215, y: 5580 },
      { x:  160, y: 5680 },
      { x:  110, y: 5780 },
      { x:   65, y: 5880 },
      { x:   25, y: 5998 }
    ])
  });

  let kuhbachCreekEffectEl = null;

  function distancePointToSegment(px, py, a, b) {
    const vx = b.x - a.x;
    const vy = b.y - a.y;
    const wx = px - a.x;
    const wy = py - a.y;
    const len2 = vx * vx + vy * vy;
    if (len2 <= 0.0001) return Math.hypot(px - a.x, py - a.y);
    const t = Math.max(0, Math.min(1, (wx * vx + wy * vy) / len2));
    const cx = a.x + vx * t;
    const cy = a.y + vy * t;
    return Math.hypot(px - cx, py - cy);
  }

  function isKuhbachReferenceBlockedFootPoint(x, y) {
    if (MAP.id !== "kuhbach") return false;

    for (const polygon of KUHBACH_TERRAIN.blockedPolygons) {
      if (worldPointInPolygon(x, y, polygon)) return true;
    }

    for (const segment of KUHBACH_TERRAIN.fenceSegments) {
      if (
        distancePointToSegment(x, y, segment[0], segment[1]) <=
        KUHBACH_TERRAIN.fenceRadius
      ) {
        return true;
      }
    }

    return false;
  }

  function playerInsideKuhbachHillSlope() {
    return (
      MAP.id === "kuhbach" &&
      worldPointInPolygon(playerX, playerY, KUHBACH_TERRAIN.hillPolygon)
    );
  }

  function smoothSvgPath(points) {
    // R177: exact reference tracing. We deliberately use dense straight segments
    // with rounded SVG joins instead of cubic interpolation, because the old
    // Catmull-Rom control points overshot the painted creek in two bends.
    if (!points.length) return "";
    return points
      .map((p, index) => `${index === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");
  }

  function createKuhbachCreekEffect() {
    if (kuhbachCreekEffectEl) return;

    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.id = "kuhbach-creek-effect";
    svg.setAttribute("viewBox", `0 0 ${MAPS.kuhbach.width} ${MAPS.kuhbach.height}`);
    svg.style.position = "absolute";
    svg.style.left = "0";
    svg.style.top = "0";
    svg.style.width = `${MAPS.kuhbach.width}px`;
    svg.style.height = `${MAPS.kuhbach.height}px`;
    svg.style.pointerEvents = "none";
    svg.style.overflow = "hidden";
    svg.style.zIndex = "5";
    svg.style.display = MAP.id === "kuhbach" ? "" : "none";

    const pathD = smoothSvgPath(KUHBACH_TERRAIN.creekPath);

    const glow = document.createElementNS(ns, "path");
    glow.setAttribute("d", pathD);
    glow.setAttribute("fill", "none");
    glow.setAttribute("stroke", "rgba(70,185,255,.34)");
    glow.setAttribute("stroke-width", "54");
    glow.setAttribute("stroke-linecap", "round");
    glow.setAttribute("stroke-linejoin", "round");
    // R175: removed expensive full-map SVG blur; prevents high-zoom GPU flicker.
    svg.appendChild(glow);

    const water = document.createElementNS(ns, "path");
    water.setAttribute("d", pathD);
    water.setAttribute("fill", "none");
    water.setAttribute("stroke", "rgba(105,210,255,.52)");
    water.setAttribute("stroke-width", "24");
    water.setAttribute("stroke-linecap", "round");
    water.setAttribute("stroke-linejoin", "round");
    water.setAttribute("pathLength", "1000");
    water.style.strokeDasharray = "36 20 10 26";
    water.style.animation = "kuhbachCreekFlow 3.2s linear infinite";
    svg.appendChild(water);

    const shimmer = document.createElementNS(ns, "path");
    shimmer.setAttribute("d", pathD);
    shimmer.setAttribute("fill", "none");
    shimmer.setAttribute("stroke", "rgba(245,252,255,.72)");
    shimmer.setAttribute("stroke-width", "8");
    shimmer.setAttribute("stroke-linecap", "round");
    shimmer.setAttribute("pathLength", "1000");
    shimmer.style.strokeDasharray = "10 54 4 70";
    shimmer.style.animation = "kuhbachCreekFlowFast 1.75s linear infinite";
    svg.appendChild(shimmer);

    if (!document.getElementById("kuhbach-creek-style")) {
      const style = document.createElement("style");
      style.id = "kuhbach-creek-style";
      style.textContent = `
        @keyframes kuhbachCreekFlow {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -180; }
        }
        @keyframes kuhbachCreekFlowFast {
          from { stroke-dashoffset: 0; opacity: .42; }
          45%  { opacity: .92; }
          to   { stroke-dashoffset: -230; opacity: .42; }
        }
      `;
      document.head.appendChild(style);
    }

    world.appendChild(svg);
    kuhbachCreekEffectEl = svg;
  }

  function updateKuhbachCreekEffectVisibility() {
    if (kuhbachCreekEffectEl) {
      kuhbachCreekEffectEl.style.display = MAP.id === "kuhbach" ? "" : "none";
    }
  }

  // ------------------------------------------------------------------
  // R98 ÖDSBACH — GUARANTEED SCREEN-SPACE FOG + CALIPH APPARITIONS
  // World coordinates remain authoritative; visuals render as GAME overlays
  // so they cannot disappear behind the world/map stacking context.
  // ------------------------------------------------------------------

  const OEDSBACH_BLOCK_ZONES = Object.freeze([
    Object.freeze([
      { x: 0, y: 1217 }, { x: 463, y: 1418 }, { x: 927, y: 1710 },
      { x: 1328, y: 2049 }, { x: 1653, y: 2165 }, { x: 1197, y: 2126 },
      { x: 695, y: 1941 }, { x: 0, y: 1810 }
    ]),
    Object.freeze([
      { x: 4069, y: 1841 }, { x: 4301, y: 1533 }, { x: 4741, y: 1279 },
      { x: 5452, y: 1225 }, { x: 5876, y: 1379 }, { x: 6108, y: 1541 },
      { x: 6131, y: 1818 }, { x: 5822, y: 1941 }, { x: 5351, y: 1872 },
      { x: 5097, y: 1741 }, { x: 4811, y: 1618 }, { x: 4556, y: 1726 },
      { x: 4308, y: 1926 }
    ]),
    Object.freeze([
      { x: 8595, y: 2079 }, { x: 8934, y: 1903 }, { x: 9317, y: 1579 },
      { x: 9737, y: 1202 }, { x: 10000, y: 917 }, { x: 10000, y: 1464 },
      { x: 9768, y: 1672 }, { x: 9340, y: 1918 }, { x: 9019, y: 2079 },
      { x: 8726, y: 2180 }
    ])
  ]);

  function isOedsbachBlockedFootPoint(x, y) {
    if (MAP.id !== "oedsbach") return false;
    for (const polygon of OEDSBACH_BLOCK_ZONES) {
      if (worldPointInPolygon(x, y, polygon)) return true;
    }
    return false;
  }

  const OEDSBACH_SHADOW_CONFIG = Object.freeze({
    centerX: 5570,
    centerY: 1900,
    radii: Object.freeze({
      outer: 3320,
      second: 2080,
      third: 1570,
      inner: 1050
    }),
    oneShotHoldMs: 2000,
    fadeMs: 460,
    innerIntervalMs: 3000,
    sprites: Object.freeze({
      zone1: Object.freeze([
        "assets/npcs/oedsbach-shadows/CALIPH SHADOW 1.png",
        "assets/npcs/oedsbach-shadows/CALIPH SHADOW 2.png"
      ]),
      zone2: "assets/npcs/oedsbach-shadows/CALIPH SHADOW 3.png",
      zone3: "assets/npcs/oedsbach-shadows/CALIPH SHADOW 4.png",
      inner: Object.freeze([
        "assets/npcs/oedsbach-shadows/CALIPH SHADOW 5.png",
        "assets/npcs/oedsbach-shadows/CALIPH SHADOW 6.png",
        "assets/npcs/oedsbach-shadows/CALIPH SHADOW 7.png"
      ])
    }),
    sounds: Object.freeze({
      outer: "assets/audio/oedsbach/caliph/CIRCLE OUTER.mp3",
      secondBase: "assets/audio/oedsbach/caliph/CIRCLE SECOND BASE.mp3",
      secondRandom: Object.freeze([
        "assets/audio/oedsbach/caliph/CIRCLE SECOND RANDOM 1.mp3",
        "assets/audio/oedsbach/caliph/CIRCLE SECOND RANDOM 2.mp3"
      ]),
      third: "assets/audio/oedsbach/caliph/CIRCLE THIRD.mp3",
      innerBase: "assets/audio/oedsbach/caliph/INNER BASE.mp3",
      innerRandom: Object.freeze([
        "assets/audio/oedsbach/caliph/INNER RANDOM 01.mp3",
        "assets/audio/oedsbach/caliph/INNER RANDOM 02.mp3",
        "assets/audio/oedsbach/caliph/INNER RANDOM 03.mp3",
        "assets/audio/oedsbach/caliph/INNER RANDOM 04.mp3",
        "assets/audio/oedsbach/caliph/INNER RANDOM 05.mp3",
        "assets/audio/oedsbach/caliph/INNER RANDOM 06.mp3",
        "assets/audio/oedsbach/caliph/INNER RANDOM 07.mp3",
        "assets/audio/oedsbach/caliph/INNER RANDOM 08.mp3"
      ])
    })
  });

  let oedsbachFogRoot = null;
  let oedsbachShadowRoot = null;
  let oedsbachInnerSprite = null;
  let oedsbachInnerNextAt = 0;
  let oedsbachInnerVisible = false;

  // R99: every ring can re-trigger after leaving THAT ring and entering it again.
  let oedsbachZoneInside = {
    outer: false,
    second: false,
    third: false,
    inner: false
  };

  const oedsbachShadowTimeouts = new Set();

  // R99: all Caliph images are loaded+decoded long before they are shown.
  const oedsbachShadowImageCache = new Map();
  let oedsbachShadowPreloadPromise = null;

  // R99: strict serialized circle voice system.
  const oedsbachCaliphAudioCache = new Map();
  const oedsbachCaliphAudioQueue = [];
  let oedsbachCaliphAudioRunning = false;
  let oedsbachInnerAudioEnabled = false;
  let oedsbachInnerAudioNextIsBase = true;
  let oedsbachCaliphGeneration = 0;

  function allOedsbachShadowSprites() {
    return [
      ...OEDSBACH_SHADOW_CONFIG.sprites.zone1,
      OEDSBACH_SHADOW_CONFIG.sprites.zone2,
      OEDSBACH_SHADOW_CONFIG.sprites.zone3,
      ...OEDSBACH_SHADOW_CONFIG.sprites.inner
    ];
  }

  function preloadOedsbachShadowSprites() {
    if (oedsbachShadowPreloadPromise) return oedsbachShadowPreloadPromise;

    const jobs = allOedsbachShadowSprites().map((src) => new Promise((resolve) => {
      const image = new Image();
      image.decoding = "async";

      image.onload = async () => {
        try {
          if (typeof image.decode === "function") await image.decode();
        } catch (_) {}
        oedsbachShadowImageCache.set(src, image);
        resolve(true);
      };

      image.onerror = () => {
        console.error("ÖDSBACH KALIF PRELOAD fehlgeschlagen:", src);
        resolve(false);
      };

      image.src = encodeURI(src);
    }));

    oedsbachShadowPreloadPromise = Promise.all(jobs);
    return oedsbachShadowPreloadPromise;
  }

  function allOedsbachCaliphSounds() {
    const s = OEDSBACH_SHADOW_CONFIG.sounds;
    return [
      s.outer,
      s.secondBase,
      ...s.secondRandom,
      s.third,
      s.innerBase,
      ...s.innerRandom
    ];
  }

  function preloadOedsbachCaliphSounds() {
    for (const src of allOedsbachCaliphSounds()) {
      if (oedsbachCaliphAudioCache.has(src)) continue;
      const audio = new Audio(encodeURI(src));
      audio.preload = "auto";
      audio.loop = false;
      audio.volume = 1.0;
      try { audio.load(); } catch (_) {}
      oedsbachCaliphAudioCache.set(src, audio);
    }
  }

  function waitForOedsbachAudioEnd(audio, generation) {
    return new Promise((resolve) => {
      let finished = false;

      const finish = () => {
        if (finished) return;
        finished = true;
        audio.removeEventListener("ended", finish);
        audio.removeEventListener("error", finish);
        resolve();
      };

      audio.addEventListener("ended", finish, { once: true });
      audio.addEventListener("error", finish, { once: true });

      if (generation !== oedsbachCaliphGeneration || MAP.id !== "oedsbach") {
        finish();
        return;
      }

      try { audio.currentTime = 0; } catch (_) {}
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(finish);
      }
    });
  }

  async function playOedsbachAudioBundle(bundle, generation) {
    const audios = bundle
      .map((src) => oedsbachCaliphAudioCache.get(src))
      .filter(Boolean);

    if (!audios.length) return;

    // A bundle starts simultaneously. The NEXT block waits until ALL files
    // in this bundle have ended.
    await Promise.all(
      audios.map((audio) => waitForOedsbachAudioEnd(audio, generation))
    );
  }

  function enqueueOedsbachAudioBundle(bundle) {
    if (MAP.id !== "oedsbach" || !Array.isArray(bundle) || !bundle.length) return;
    oedsbachCaliphAudioQueue.push(bundle);
    pumpOedsbachCaliphAudio();
  }

  async function pumpOedsbachCaliphAudio() {
    if (oedsbachCaliphAudioRunning) return;
    oedsbachCaliphAudioRunning = true;
    const generation = oedsbachCaliphGeneration;

    try {
      while (MAP.id === "oedsbach" && generation === oedsbachCaliphGeneration) {
        // Ring-entry cues have priority over the repeating inner loop.
        if (oedsbachCaliphAudioQueue.length) {
          const bundle = oedsbachCaliphAudioQueue.shift();
          await playOedsbachAudioBundle(bundle, generation);
          continue;
        }

        if (oedsbachInnerAudioEnabled) {
          const sounds = OEDSBACH_SHADOW_CONFIG.sounds;
          const src = oedsbachInnerAudioNextIsBase
            ? sounds.innerBase
            : sounds.innerRandom[Math.floor(Math.random() * sounds.innerRandom.length)];

          // Required: 6 -> random 7..14 -> 6 -> random 7..14...
          oedsbachInnerAudioNextIsBase = !oedsbachInnerAudioNextIsBase;
          await playOedsbachAudioBundle([src], generation);
          continue;
        }

        break;
      }
    } finally {
      oedsbachCaliphAudioRunning = false;

      if (
        MAP.id === "oedsbach" &&
        (oedsbachCaliphAudioQueue.length || oedsbachInnerAudioEnabled)
      ) {
        queueMicrotask(pumpOedsbachCaliphAudio);
      }
    }
  }

  function setOedsbachInnerAudioEnabled(enabled) {
    const next = Boolean(enabled);
    if (oedsbachInnerAudioEnabled === next) return;

    oedsbachInnerAudioEnabled = next;

    if (next) {
      // Every fresh inner-circle entry begins again with attachment 6.
      oedsbachInnerAudioNextIsBase = true;
      pumpOedsbachCaliphAudio();
    }
    // On exit: do NOT cut the current sound. It finishes; then loop stops.
  }

  function stopOedsbachCaliphAudioImmediately() {
    oedsbachCaliphGeneration += 1;
    oedsbachCaliphAudioQueue.length = 0;
    oedsbachInnerAudioEnabled = false;
    oedsbachInnerAudioNextIsBase = true;

    for (const audio of oedsbachCaliphAudioCache.values()) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (_) {}
    }

    oedsbachCaliphAudioRunning = false;
  }

  function resetOedsbachZoneEntryState() {
    oedsbachZoneInside = {
      outer: false,
      second: false,
      third: false,
      inner: false
    };
  }

  function installOedsbachAtmosphereStyles() {
    if (document.getElementById("oedsbachAtmosphereStyles")) return;

    const style = document.createElement("style");
    style.id = "oedsbachAtmosphereStyles";
    style.textContent = `
      .oedsbach-screen-fog {
        position:absolute;
        inset:0;
        z-index:4200;
        overflow:hidden;
        pointer-events:none;
        display:none;
      }

      .oedsbach-screen-fog__veil {
        position:absolute;
        left:-85vw;
        width:95vw;
        min-width:1100px;
        height:22vh;
        min-height:170px;
        border-radius:50%;
        filter:blur(28px);
        background:
          radial-gradient(ellipse at 35% 50%,
            rgba(232,237,235,.82) 0%,
            rgba(211,219,216,.70) 28%,
            rgba(187,198,194,.48) 56%,
            rgba(187,198,194,0) 80%),
          radial-gradient(ellipse at 74% 45%,
            rgba(239,242,241,.68) 0%,
            rgba(207,216,212,.56) 36%,
            rgba(185,196,192,0) 78%);
        opacity:.72;
        animation:oedsbachScreenFogDrift linear infinite;
        will-change:transform;
      }

      .oedsbach-screen-fog__veil:nth-child(1){top:-3%; animation-duration:24s; animation-delay:-5s}
      .oedsbach-screen-fog__veil:nth-child(2){top:10%; animation-duration:31s; animation-delay:-17s; opacity:.62}
      .oedsbach-screen-fog__veil:nth-child(3){top:24%; animation-duration:21s; animation-delay:-11s; opacity:.78}
      .oedsbach-screen-fog__veil:nth-child(4){top:38%; animation-duration:35s; animation-delay:-27s; opacity:.60}
      .oedsbach-screen-fog__veil:nth-child(5){top:52%; animation-duration:27s; animation-delay:-15s; opacity:.74}
      .oedsbach-screen-fog__veil:nth-child(6){top:66%; animation-duration:33s; animation-delay:-7s; opacity:.66}
      .oedsbach-screen-fog__veil:nth-child(7){top:79%; animation-duration:23s; animation-delay:-19s; opacity:.73}
      .oedsbach-screen-fog__veil:nth-child(8){top:91%; animation-duration:38s; animation-delay:-31s; opacity:.60}

      @keyframes oedsbachScreenFogDrift {
        from { transform:translate3d(0,0,0) scaleX(1); }
        to   { transform:translate3d(195vw,0,0) scaleX(1.12); }
      }

      .oedsbach-screen-shadows {
        position:absolute;
        inset:0;
        z-index:4300;
        overflow:hidden;
        pointer-events:none;
        display:none;
      }

      .oedsbach-screen-shadow {
        position:absolute;
        transform:translate(-50%,-100%);
        opacity:0;
        pointer-events:none;
        transition:opacity ${OEDSBACH_SHADOW_CONFIG.fadeMs}ms ease-in-out;
        filter:drop-shadow(0 10px 14px rgba(0,0,0,.70));
        will-change:left,top,width,height,opacity;
      }

      .oedsbach-screen-shadow img {
        width:100%;
        height:100%;
        object-fit:contain;
        object-position:50% 100%;
        display:block;
      }

      .oedsbach-screen-dust {
        position:absolute;
        border-radius:50%;
        pointer-events:none;
        background:rgba(35,35,35,.84);
        filter:blur(2px);
        animation:oedsbachScreenDust 780ms ease-out forwards;
      }

      @keyframes oedsbachScreenDust {
        0%   { transform:translate3d(0,0,0) scale(.3); opacity:.92; }
        70%  { opacity:.54; }
        100% { transform:translate3d(var(--dx),var(--dy),0) scale(2.5); opacity:0; }
      }
    `;
    document.head.appendChild(style);
  }

  function createOedsbachFog() {
    if (oedsbachFogRoot) return;
    installOedsbachAtmosphereStyles();

    const root = document.createElement("div");
    root.className = "oedsbach-screen-fog";
    root.style.display = MAP.id === "oedsbach" ? "block" : "none";

    for (let i = 0; i < 8; i += 1) {
      const veil = document.createElement("div");
      veil.className = "oedsbach-screen-fog__veil";
      root.appendChild(veil);
    }

    game.appendChild(root);
    oedsbachFogRoot = root;
  }

  function setOedsbachFogVisibility(visible) {
    if (!oedsbachFogRoot) return;
    oedsbachFogRoot.style.display = visible ? "block" : "none";
  }

  // ------------------------------------------------------------------
  // R114 RAMSBACH — visible moving screen fog, deliberately softer than ÖDSBACH.
  // Same proven screen-space principle, lower density/opacity.
  // ------------------------------------------------------------------
  let ramsbachFogRoot = null;

  function createRamsbachFog() {
    if (ramsbachFogRoot) return;
    installOedsbachAtmosphereStyles();

    const root = document.createElement("div");
    root.className = "oedsbach-screen-fog ramsbach-screen-fog";
    root.style.display = MAP.id === "ramsbach" ? "block" : "none";
    root.style.opacity = "0.58";

    // Fewer veils than ÖDSBACH: clearly visible, but not nearly as heavy.
    for (let i = 0; i < 5; i += 1) {
      const veil = document.createElement("div");
      veil.className = "oedsbach-screen-fog__veil";
      root.appendChild(veil);
    }

    game.appendChild(root);
    ramsbachFogRoot = root;
  }

  function setRamsbachFogVisibility(visible) {
    if (!ramsbachFogRoot) return;
    ramsbachFogRoot.style.display = visible ? "block" : "none";
  }

  // ------------------------------------------------------------------
  // R139 HUBACKER — same proven moving fog as Ramsbach, deliberately weaker.
  // ------------------------------------------------------------------
  let hubackerFogRoot = null;

  function createHubackerFog() {
    if (hubackerFogRoot) return;
    installOedsbachAtmosphereStyles();

    const root = document.createElement("div");
    root.className = "oedsbach-screen-fog hubacker-screen-fog";
    root.style.display = MAP.id === "hubacker" ? "block" : "none";
    root.style.opacity = "0.34";

    // Same drifting veil system as Ramsbach, one veil fewer and lower opacity.
    for (let i = 0; i < 4; i += 1) {
      const veil = document.createElement("div");
      veil.className = "oedsbach-screen-fog__veil";
      root.appendChild(veil);
    }

    game.appendChild(root);
    hubackerFogRoot = root;
  }

  function setHubackerFogVisibility(visible) {
    if (!hubackerFogRoot) return;
    hubackerFogRoot.style.display = visible ? "block" : "none";
  }

  // ------------------------------------------------------------------
  // R139 WINTERBACH — screen-space snowfall, visual only.
  // ------------------------------------------------------------------
  let winterbachSnowRoot = null;

  function installWinterbachSnowStyles() {
    if (document.getElementById("winterbachSnowStyles")) return;
    const style = document.createElement("style");
    style.id = "winterbachSnowStyles";
    style.textContent = `
      .winterbach-screen-snow {
        position:absolute;
        inset:0;
        z-index:4250;
        overflow:hidden;
        pointer-events:none;
        display:none;
      }
      .winterbach-snowflake {
        position:absolute;
        top:-9vh;
        border-radius:50%;
        background:rgba(255,255,255,.92);
        box-shadow:0 0 4px rgba(255,255,255,.72);
        opacity:var(--snow-opacity,.78);
        animation:winterbachSnowFall var(--snow-duration,9s) linear infinite;
        animation-delay:var(--snow-delay,0s);
        will-change:transform;
      }
      @keyframes winterbachSnowFall {
        from {
          transform:translate3d(0,-10vh,0);
        }
        to {
          transform:translate3d(var(--snow-drift,80px),118vh,0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  function createWinterbachSnow() {
    if (winterbachSnowRoot) return;
    installWinterbachSnowStyles();

    const root = document.createElement("div");
    root.className = "winterbach-screen-snow";
    root.style.display = MAP.id === "winterbach-ranglehen" ? "block" : "none";

    // Many small independent flakes = continuous natural snowfall without assets.
    for (let i = 0; i < 86; i += 1) {
      const flake = document.createElement("div");
      flake.className = "winterbach-snowflake";
      const size = 2.5 + Math.random() * 6.5;
      flake.style.left = `${Math.random() * 100}%`;
      flake.style.width = `${size}px`;
      flake.style.height = `${size}px`;
      flake.style.setProperty("--snow-duration", `${6.5 + Math.random() * 8.5}s`);
      flake.style.setProperty("--snow-delay", `${-Math.random() * 14}s`);
      flake.style.setProperty("--snow-drift", `${-120 + Math.random() * 240}px`);
      flake.style.setProperty("--snow-opacity", `${0.46 + Math.random() * 0.46}`);
      root.appendChild(flake);
    }

    game.appendChild(root);
    winterbachSnowRoot = root;
  }

  function setWinterbachSnowVisibility(visible) {
    if (!winterbachSnowRoot) return;
    winterbachSnowRoot.style.display = visible ? "block" : "none";
  }

  function createOedsbachShadowSystem() {
    if (oedsbachShadowRoot) return;
    installOedsbachAtmosphereStyles();

    const root = document.createElement("div");
    root.className = "oedsbach-screen-shadows";
    root.style.display = MAP.id === "oedsbach" ? "block" : "none";

    game.appendChild(root);
    oedsbachShadowRoot = root;
  }

  function currentWorldScreenTransform() {
    const mapScreenWidth = MAP.width * displayScale;
    const mapScreenHeight = MAP.height * displayScale;

    let tx = viewportWidth / 2 - cameraX * displayScale;
    let ty = viewportHeight / 2 - cameraY * displayScale;

    if (zoomLevel === 0 && !zoomAnimating) {
      tx = (viewportWidth - mapScreenWidth) / 2;
      ty = (viewportHeight - mapScreenHeight) / 2;
    }

    return { tx, ty, scale: displayScale };
  }

  function worldToOedsbachScreen(x, y) {
    const t = currentWorldScreenTransform();
    return {
      x: t.tx + x * t.scale,
      y: t.ty + y * t.scale,
      scale: t.scale
    };
  }

  function renderOedsbachShadowPositions() {
    if (!oedsbachShadowRoot || MAP.id !== "oedsbach") return;

    for (const root of oedsbachShadowRoot.querySelectorAll(".oedsbach-screen-shadow")) {
      const wx = Number(root.dataset.worldX);
      const wy = Number(root.dataset.worldY);
      const baseW = Number(root.dataset.baseW) || 650;
      const baseH = Number(root.dataset.baseH) || 780;
      if (!Number.isFinite(wx) || !Number.isFinite(wy)) continue;

      const p = worldToOedsbachScreen(wx, wy);
      root.style.left = `${p.x}px`;
      root.style.top = `${p.y}px`;
      root.style.width = `${Math.max(150, baseW * p.scale)}px`;
      root.style.height = `${Math.max(180, baseH * p.scale)}px`;
    }
  }

  function clearOedsbachShadowTimers() {
    for (const id of oedsbachShadowTimeouts) window.clearTimeout(id);
    oedsbachShadowTimeouts.clear();
  }

  function scheduleOedsbachShadow(fn, delay) {
    const id = window.setTimeout(() => {
      oedsbachShadowTimeouts.delete(id);
      fn();
    }, delay);
    oedsbachShadowTimeouts.add(id);
    return id;
  }

  function puffOedsbachDust(worldX, worldY, amount = 24) {
    if (!oedsbachShadowRoot || MAP.id !== "oedsbach") return;
    const p0 = worldToOedsbachScreen(worldX, worldY);

    for (let i = 0; i < amount; i += 1) {
      const p = document.createElement("span");
      p.className = "oedsbach-screen-dust";

      const size = 7 + Math.random() * 20;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${p0.x + (Math.random() - .5) * 130}px`;
      p.style.top = `${p0.y - 110 + (Math.random() - .5) * 140}px`;

      const distance = 55 + Math.random() * 160;
      const angle = Math.random() * Math.PI * 2;
      p.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
      p.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);

      const shade = Math.floor(18 + Math.random() * 100);
      p.style.background = `rgba(${shade},${shade},${shade},${.52 + Math.random() * .38})`;

      oedsbachShadowRoot.appendChild(p);
      scheduleOedsbachShadow(() => p.remove(), 850);
    }
  }

  function clampShadowPoint(x, y) {
    return {
      x: Math.max(500, Math.min(MAP.width - 500, x)),
      y: Math.max(900, Math.min(MAP.height - 120, y))
    };
  }

  function randomNearPlayer() {
    const angle = Math.random() * Math.PI * 2;
    const dist = 560 + Math.random() * 320;
    return clampShadowPoint(
      playerX + Math.cos(angle) * dist,
      playerY + Math.sin(angle) * dist
    );
  }

  function randomNearOedegard() {
    const anchors = [
      { x:-720, y:80 }, { x:720, y:80 },
      { x:-480, y:350 }, { x:480, y:350 },
      { x:-320, y:-170 }, { x:330, y:-150 },
      {
        x:(playerX - OEDSBACH_SHADOW_CONFIG.centerX) * .34,
        y:(playerY - OEDSBACH_SHADOW_CONFIG.centerY) * .34 + 130
      }
    ];
    const a = anchors[Math.floor(Math.random() * anchors.length)];
    return clampShadowPoint(
      OEDSBACH_SHADOW_CONFIG.centerX + a.x + (Math.random() - .5) * 180,
      OEDSBACH_SHADOW_CONFIG.centerY + a.y + (Math.random() - .5) * 150
    );
  }

  function buildOedsbachShadow(sprite, point, inner = false) {
    const root = document.createElement("div");
    root.className = "oedsbach-screen-shadow";
    root.dataset.worldX = String(point.x);
    root.dataset.worldY = String(point.y);
    root.dataset.baseW = String(inner ? 760 : 680);
    root.dataset.baseH = String(inner ? 950 : 830);

    const img = document.createElement("img");
    const cached = oedsbachShadowImageCache.get(sprite);
    img.src = cached ? cached.src : encodeURI(sprite);
    img.alt = "";
    img.draggable = false;
    img.decoding = "sync";
    img.style.transform = Math.random() < .5 ? "scaleX(-1)" : "scaleX(1)";
    img.addEventListener("error", () => {
      console.error("ÖDSBACH KALIF SPRITE konnte nicht geladen werden:", sprite);
    }, { once:true });

    root.appendChild(img);
    oedsbachShadowRoot.appendChild(root);
    renderOedsbachShadowPositions();
    return root;
  }

  function spawnOedsbachOneShot(sprite, point = randomNearPlayer()) {
    if (!oedsbachShadowRoot || MAP.id !== "oedsbach") return;

    const root = buildOedsbachShadow(sprite, point, false);
    puffOedsbachDust(point.x, point.y, 28);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (root.isConnected) root.style.opacity = "1";
      });
    });

    scheduleOedsbachShadow(() => {
      puffOedsbachDust(point.x, point.y, 28);
      root.style.opacity = "0";
    }, OEDSBACH_SHADOW_CONFIG.fadeMs + OEDSBACH_SHADOW_CONFIG.oneShotHoldMs);

    scheduleOedsbachShadow(() => root.remove(),
      OEDSBACH_SHADOW_CONFIG.fadeMs * 2 +
      OEDSBACH_SHADOW_CONFIG.oneShotHoldMs + 100
    );
  }

  function removeOedsbachInnerShadow(withPuff = true) {
    if (!oedsbachInnerSprite) return;

    const root = oedsbachInnerSprite;
    const x = Number(root.dataset.worldX) || OEDSBACH_SHADOW_CONFIG.centerX;
    const y = Number(root.dataset.worldY) || OEDSBACH_SHADOW_CONFIG.centerY;

    if (withPuff) puffOedsbachDust(x, y, 32);
    root.style.opacity = "0";
    scheduleOedsbachShadow(() => root.remove(), OEDSBACH_SHADOW_CONFIG.fadeMs + 60);
    oedsbachInnerSprite = null;
  }

  function spawnOedsbachInnerShadow(now) {
    removeOedsbachInnerShadow(true);

    const pool = OEDSBACH_SHADOW_CONFIG.sprites.inner;
    const sprite = pool[Math.floor(Math.random() * pool.length)];
    const point = randomNearOedegard();
    const root = buildOedsbachShadow(sprite, point, true);

    oedsbachInnerSprite = root;
    puffOedsbachDust(point.x, point.y, 34);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (root.isConnected) root.style.opacity = "1";
      });
    });

    oedsbachInnerNextAt = now + OEDSBACH_SHADOW_CONFIG.innerIntervalMs;
  }

  function resetOedsbachShadowVisit(removeVisuals = true) {
    resetOedsbachZoneEntryState();
    oedsbachInnerNextAt = 0;
    oedsbachInnerVisible = false;
    setOedsbachInnerAudioEnabled(false);

    if (removeVisuals) {
      clearOedsbachShadowTimers();
      if (oedsbachShadowRoot) oedsbachShadowRoot.replaceChildren();
      oedsbachInnerSprite = null;
    }
  }

  function setOedsbachShadowVisibility(visible) {
    if (!oedsbachShadowRoot) return;
    oedsbachShadowRoot.style.display = visible ? "block" : "none";

    if (visible) {
      preloadOedsbachShadowSprites();
      preloadOedsbachCaliphSounds();
      resetOedsbachZoneEntryState();
    } else {
      resetOedsbachShadowVisit(true);
      stopOedsbachCaliphAudioImmediately();
    }
  }

  function updateOedsbachShadows(now) {
    if (MAP.id !== "oedsbach") return;

    if (oedsbachFogRoot) oedsbachFogRoot.style.display = "block";
    if (oedsbachShadowRoot) oedsbachShadowRoot.style.display = "block";

    const distance = Math.hypot(
      playerX - OEDSBACH_SHADOW_CONFIG.centerX,
      playerY - OEDSBACH_SHADOW_CONFIG.centerY
    );
    const r = OEDSBACH_SHADOW_CONFIG.radii;

    const insideOuter = distance <= r.outer;
    const insideSecond = distance <= r.second;
    const insideThird = distance <= r.third;
    const insideInner = distance <= r.inner;

    // OUTER RING — attachment 1.
    if (insideOuter && !oedsbachZoneInside.outer) {
      const pool = OEDSBACH_SHADOW_CONFIG.sprites.zone1;
      const sprite = pool[Math.floor(Math.random() * pool.length)];

      preloadOedsbachShadowSprites().then(() => {
        if (MAP.id === "oedsbach") spawnOedsbachOneShot(sprite);
      });

      enqueueOedsbachAudioBundle([
        OEDSBACH_SHADOW_CONFIG.sounds.outer
      ]);
    }

    // SECOND RING — attachment 2 SIMULTANEOUSLY with random attachment 3/4.
    if (insideSecond && !oedsbachZoneInside.second) {
      preloadOedsbachShadowSprites().then(() => {
        if (MAP.id === "oedsbach") {
          spawnOedsbachOneShot(OEDSBACH_SHADOW_CONFIG.sprites.zone2);
        }
      });

      const pool = OEDSBACH_SHADOW_CONFIG.sounds.secondRandom;
      const secondary = pool[Math.floor(Math.random() * pool.length)];

      enqueueOedsbachAudioBundle([
        OEDSBACH_SHADOW_CONFIG.sounds.secondBase,
        secondary
      ]);
    }

    // THIRD RING — attachment 5.
    if (insideThird && !oedsbachZoneInside.third) {
      preloadOedsbachShadowSprites().then(() => {
        if (MAP.id === "oedsbach") {
          spawnOedsbachOneShot(OEDSBACH_SHADOW_CONFIG.sprites.zone3);
        }
      });

      enqueueOedsbachAudioBundle([
        OEDSBACH_SHADOW_CONFIG.sounds.third
      ]);
    }

    // INNER RING — visual 3s cycle remains; audio loop is independently
    // serialized so no new sound begins until the old sound finished.
    if (insideInner && !oedsbachZoneInside.inner) {
      oedsbachInnerVisible = true;

      preloadOedsbachShadowSprites().then(() => {
        const stillInside = MAP.id === "oedsbach" &&
          Math.hypot(
            playerX - OEDSBACH_SHADOW_CONFIG.centerX,
            playerY - OEDSBACH_SHADOW_CONFIG.centerY
          ) <= OEDSBACH_SHADOW_CONFIG.radii.inner;

        if (stillInside) spawnOedsbachInnerShadow(performance.now());
      });

      setOedsbachInnerAudioEnabled(true);
    } else if (!insideInner && oedsbachZoneInside.inner) {
      oedsbachInnerVisible = false;
      oedsbachInnerNextAt = 0;
      removeOedsbachInnerShadow(true);
      setOedsbachInnerAudioEnabled(false);
    } else if (insideInner && oedsbachInnerVisible && now >= oedsbachInnerNextAt) {
      spawnOedsbachInnerShadow(now);
    }

    // Membership is stored AFTER entry checks, making every future
    // outside -> inside transition triggerable again.
    oedsbachZoneInside.outer = insideOuter;
    oedsbachZoneInside.second = insideSecond;
    oedsbachZoneInside.third = insideThird;
    oedsbachZoneInside.inner = insideInner;

    renderOedsbachShadowPositions();
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
    attackFrame: "assets/animals/wolves/WOLF ATTACK.png",
    attackDamage: 25,
    attackCooldown: 1500,
    attackWindup: 360,
    attackReach: 255,
    aggroRadius: 900,
    maxHp: 750,
    deadDuration: 6500,
    fadeDuration: 420,
    count: 5,
    // R17: one tick larger.
    // R18: another very small size increase.
    // R138: all wolf visuals exactly 15% larger.
    width: 845.25,
    height: 680.8,
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

  // R116 RAMSBACH — the two BLACK marked wolf circles, one wolf each.
  const RAMSBACH_WOLF_HABITATS = Object.freeze([
    Object.freeze({
      mapId: "ramsbach",
      count: 1,
      canExitTop: false,
      cx: 2671,
      cy: 1008,
      rx: 760,
      ry: 280
    }),
    Object.freeze({
      mapId: "ramsbach",
      count: 1,
      canExitTop: false,
      cx: 1813,
      cy: 1659,
      rx: 760,
      ry: 350
    })
  ]);

  // R158 OPPENAU — BLACK marked circle: exactly one normal wolf.
  const OPPENAU_WOLF_HABITAT = Object.freeze({
    mapId: "oppenau",
    count: 1,
    canExitTop: false,
    cx: 5220,
    cy: 1600,
    rx: 500,
    ry: 590
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
        (actor.tierbannAggressive || actor.aggro) ||
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

    const imageAttack = document.createElement("img");
    imageAttack.className = "map-wolf__sprite";
    imageAttack.src = encodeURI(WOLF_CONFIG.attackFrame);
    imageAttack.alt = "";
    imageAttack.draggable = false;
    imageAttack.decoding = "async";

    const imageDead = document.createElement("img");
    imageDead.className = "map-wolf__sprite map-wolf__sprite--dead";
    imageDead.src = encodeURI(WOLF_CONFIG.deadFrame);
    imageDead.alt = "";
    imageDead.draggable = false;
    imageDead.decoding = "async";

    // Walk 1 / Walk 2 / Howl / Attack / KO are all permanently loaded.
    element.append(imageA, imageB, imageHowl, imageAttack, imageDead);
    world.appendChild(element);

    const actor = {
      element,
      mapId,
      habitat,
      canExitTop,
      images: [imageA, imageB, imageHowl, imageAttack, imageDead],
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
      aggro: Boolean(options.tierbannAggressive),
      attackingPlayer: false,
      attackImpactDone: false,
      attackImpactAt: 0,
      attackEndAt: 0,
      nextPlayerAttackAt: 0,

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

    for (const src of [...WOLF_CONFIG.frames, WOLF_CONFIG.howlFrame, WOLF_CONFIG.attackFrame, WOLF_CONFIG.deadFrame]) {
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

    for (const habitat of RAMSBACH_WOLF_HABITATS) {
      for (let i = 0; i < habitat.count; i += 1) {
        wolfActors.push(
          createWolfActor(
            i,
            habitat.mapId,
            habitat,
            habitat.canExitTop
          )
        );
      }
    }

    for (let i = 0; i < OPPENAU_WOLF_HABITAT.count; i += 1) {
      wolfActors.push(
        createWolfActor(
          i,
          OPPENAU_WOLF_HABITAT.mapId,
          OPPENAU_WOLF_HABITAT,
          OPPENAU_WOLF_HABITAT.canExitTop
        )
      );
    }

    nextWolfHowlAt = performance.now() + WOLF_CONFIG.howlInterval;
  }

  function updateWolves(deltaSeconds, now) {
    const activeActors = wolfActors.filter(actor => actor.mapId === MAP.id);

    // R131 PACK AGGRO:
    // Entering one wolf habitat activates every living wolf belonging
    // to that exact habitat. Individual proximity aggro remains additional.
    const playerOccupiedWolfHabitats = new Set();
    if (!playerDead && !playerRespawnProtected(now)) {
      for (const actor of activeActors) {
        if (
          actor &&
          !actor.dead &&
          !actor.away &&
          actor.habitat &&
          wolfPointInsideHabitat(playerX, playerY, actor.habitat)
        ) {
          playerOccupiedWolfHabitats.add(actor.habitat);
        }
      }
    }

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

      const wolfDistanceToPlayer = Math.hypot(playerX - actor.x, playerY - actor.y);

      // R130: during the visible 3s revive shimmer, wolves must not immediately
      // re-lock the player at the exact death point.
      if (playerRespawnProtected(now)) {
        actor.aggro = false;
        actor.attackingPlayer = false;
      } else if (
        actor.tierbannAggressive ||
        actor.aggro ||
        playerOccupiedWolfHabitats.has(actor.habitat) ||
        wolfDistanceToPlayer <= WOLF_CONFIG.aggroRadius
      ) {
        actor.aggro = true;
        updateWolfPlayerCombat(actor, deltaSeconds, now);
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
    chargeFrame: "assets/animals/boars/WILDSCHWEIN CHARGE.png",
    impactFrame: "assets/animals/boars/WILDSCHWEIN IMPACT.png",
    chargeDamage: 20,
    chargeSpeed: 690,
    chargeDuration: 1450,
    impactDuration: 300,
    retreatDuration: 760,
    retreatSpeed: 300,
    // R129: charge uses the visible boar BODY, not one tiny foot-anchor circle.
    chargeHitHalfWidth: 360,
    chargeHitHalfHeight: 255,

    // Normal boars stop combat once the player has clearly left their habitat.
    // Tierbann boars deliberately ignore this and stay aggressive.
    disengageDistance: 1850,

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
      },
      {
        id: "ramsbach-boar-circle",
        mapId: "ramsbach",
        count: 3,
        exits: [],
        polygon: [
          [2531, 4345],
          [2920, 4445],
          [3225, 4725],
          [3310, 5104],
          [3225, 5485],
          [2920, 5760],
          [2531, 5860],
          [2140, 5760],
          [1840, 5485],
          [1750, 5104],
          [1840, 4725],
          [2140, 4445]
        ]
      },
      {
        // R158 OPPENAU — YELLOW marked circle: exactly two normal wild boars.
        id: "oppenau-boar-circle",
        mapId: "oppenau",
        count: 2,
        exits: [],
        polygon: [
          [8887, 3490],
          [8782, 3730],
          [8497, 3906],
          [8107, 3970],
          [7717, 3906],
          [7432, 3730],
          [7327, 3490],
          [7432, 3250],
          [7717, 3074],
          [8107, 3010],
          [8497, 3074],
          [8782, 3250]
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

    const chargeImage = document.createElement("img");
    chargeImage.className = "map-boar__sprite";
    chargeImage.src = encodeURI(BOAR_CONFIG.chargeFrame);
    chargeImage.alt = "";
    chargeImage.draggable = false;
    chargeImage.decoding = "async";

    const impactImage = document.createElement("img");
    impactImage.className = "map-boar__sprite";
    impactImage.src = encodeURI(BOAR_CONFIG.impactFrame);
    impactImage.alt = "";
    impactImage.draggable = false;
    impactImage.decoding = "async";

    const deadImage = document.createElement("img");
    deadImage.className = "map-boar__sprite map-boar__sprite--dead";
    deadImage.src = encodeURI(BOAR_CONFIG.deadFrame);
    deadImage.alt = "";
    deadImage.draggable = false;
    deadImage.decoding = "async";

    element.append(idleImage, runImage, deadImage, chargeImage, impactImage);
    world.appendChild(element);

    const actor = {
      element,
      images: [idleImage, runImage, deadImage, chargeImage, impactImage],
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
      aggro: Boolean(options.tierbannAggressive),
      combatPhase: "idle",
      combatUntil: 0,
      chargeVX: 0,
      chargeVY: 0,
      chargeHitDone: false,
      retreatVX: 0,
      retreatVY: 0,

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
      actor.images.forEach((img, index) => img.classList.toggle("map-boar__sprite--visible", index === 0));
      actor.visibleLayer = 0;
    });

    return actor;
  }

  function createBoars() {
    installBoarStyles();

    for (const src of [BOAR_CONFIG.idleFrame, BOAR_CONFIG.runFrame, BOAR_CONFIG.deadFrame, BOAR_CONFIG.chargeFrame, BOAR_CONFIG.impactFrame]) {
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

      if (playerRespawnProtected(now)) {
        actor.aggro = false;
        actor.combatPhase = "idle";
      } else if (actor.tierbannAggressive || actor.aggro) {
        updateBoarPlayerCombat(actor, deltaSeconds, now);
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
    },
    {
      id: "ramsbach-rabbits-left-field",
      mapId: "ramsbach",
      polygon: [
        [720, 2870],
        [1650, 3000],
        [1715, 3660],
        [815, 3745]
      ],
      exits: [],
      count: 3
    },
    {
      id: "ramsbach-rabbits-right-field",
      mapId: "ramsbach",
      polygon: [
        [2335, 2550],
        [3340, 2655],
        [3385, 3340],
        [2405, 3400]
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
        /* R138: all rabbit visuals exactly 25% smaller. */
        width: 247.5px;
        height: 195px;
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

      .player-damage {
        position: absolute;
        z-index: 180;
        transform: translate(-50%, -50%);
        pointer-events: none;
        user-select: none;
        color: #ffffff;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 190px;
        font-weight: 900;
        line-height: .9;
        white-space: nowrap;
        text-shadow: 0 0 4px #000, 0 0 10px #000, 0 5px 3px rgba(0,0,0,.9);
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
    // R150: White Stag attacks reuse the EXACT same directional hitbox logic
    // as the already-proven fist/club combat. No oversized weapon-only reach.
    if (
      attackSequence === ATTACK_DOWN ||
      attackSequence === CLUB_ATTACK_DOWN ||
      attackSequence === WHITE_STAG_ATTACK_DOWN
    ) return "down";

    if (
      attackSequence === ATTACK_LEFT ||
      attackSequence === CLUB_ATTACK_LEFT ||
      attackSequence === WHITE_STAG_ATTACK_LEFT
    ) return "left";

    // RIGHT and UP deliberately follow the same existing fist-combat fallback.
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
    // R141: EXP essence appears only AFTER the corpse has fully disappeared.
    if (actor.expRewardEligible && !actor.expOrbSpawned) {
      spawnPlayerExpOrb(
        "rabbit",
        actor.x,
        actor.y,
        actor.zone.mapId || "oberkirch-zentrum"
      );
      actor.expOrbSpawned = true;
    }

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
    actor.expRewardEligible = false;
    actor.expOrbSpawned = false;

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
      actor.expRewardEligible = true;
      actor.expOrbSpawned = false;
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
    actor.aggro = false;
    actor.attackingPlayer = false;
    actor.exiting = false;
    actor.entering = false;
    actor.away = false;
    actor.howling = false;
    actor.pauseUntil = Infinity;
    actor.nextDecision = Infinity;
    actor.nextFrameAt = Infinity;
    actor.element.classList.remove("map-wolf--away");
    actor.element.classList.remove("map-wolf--death-fading");
    wolfShowStaticLayer(actor, 4);
    actor.pendingLoot = rollWolfLoot();
    actor.lootSpawned = false;
    actor.fadeStarted = false;
    actor.respawnAt = now + WOLF_CONFIG.deadDuration;
    actor.fadeAt = actor.respawnAt - WOLF_CONFIG.fadeDuration;
  }

  function respawnWolf(actor, now) {
    if (actor.expRewardEligible && !actor.expOrbSpawned) {
      spawnPlayerExpOrb("wolf", actor.x, actor.y, actor.mapId);
      actor.expOrbSpawned = true;
    }

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
    actor.aggro = false;
    actor.attackingPlayer = false;
    actor.attackImpactDone = false;
    actor.attackImpactAt = 0;
    actor.attackEndAt = 0;
    actor.nextPlayerAttackAt = 0;
    actor.x = start.x;
    actor.y = start.y;
    actor.targetX = start.x;
    actor.targetY = start.y;
    actor.respawnAt = 0;
    actor.fadeAt = 0;
    actor.fadeStarted = false;
    actor.expRewardEligible = false;
    actor.expOrbSpawned = false;
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
    actor.aggro = true;
    actor.moving = false;
    actor.howling = false;
    if (critical) {
      createRabbitDust(actor);
      largeAnimalCriticalKnockback(actor, direction, "map-wolf--critical-hit");
    }
    if (actor.hp <= 0) {
      actor.expRewardEligible = true;
      actor.expOrbSpawned = false;
      killWolf(actor, now);
    } else {
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
    actor.aggro = false;
    actor.combatPhase = "idle";
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
    if (actor.expRewardEligible && !actor.expOrbSpawned) {
      const expMapId = actor.zone.mapId || BOAR_CONFIG.mapId;
      spawnPlayerExpOrb("boar", actor.x, actor.y, expMapId);
      actor.expOrbSpawned = true;
    }

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
    actor.aggro = false;
    actor.combatPhase = "idle";
    actor.combatUntil = 0;
    actor.chargeVX = 0;
    actor.chargeVY = 0;
    actor.chargeHitDone = false;
    actor.retreatVX = 0;
    actor.retreatVY = 0;
    actor.x = start.x;
    actor.y = start.y;
    actor.targetX = start.x;
    actor.targetY = start.y;
    actor.respawnAt = 0;
    actor.fadeAt = 0;
    actor.fadeStarted = false;
    actor.expRewardEligible = false;
    actor.expOrbSpawned = false;
    actor.pauseUntil = now + 700 + Math.random() * 1800;
    actor.moveEndAt = 0;
    actor.element.classList.remove("map-boar--death-fading", "map-boar--critical-hit", "map-boar--away");
    actor.element.style.left = `${actor.x}px`;
    actor.element.style.top = `${actor.y}px`;
    boarShowLayer(actor, 0);
  }

  function damageBoar(actor, amount, critical, direction, now, saustark = false) {
    if (!actor || actor.dead || actor.away) return;

    // R134: only the FIRST hit that wakes a peaceful normal boar may alter its
    // combat cycle. Once aggro is active, further player hits deal damage only.
    // They must never restart retreat/prepare or cancel a committed charge.
    const wasAggro = Boolean(actor.aggro);
    const phaseBeforeHit = actor.combatPhase;

    actor.hp = Math.max(0, actor.hp - amount);
    createRabbitDamageText(actor, amount, critical, saustark);
    playBoarHitSound();
    actor.aggro = true;

    if (critical) {
      createRabbitDust(actor);
      largeAnimalCriticalKnockback(actor, direction, "map-boar--critical-hit");
    }

    if (actor.hp <= 0) {
      actor.expRewardEligible = true;
      actor.expOrbSpawned = false;
      killBoar(actor, now);
      return;
    }

    // First retaliation trigger:
    // player earns breathing room, then the boar MUST complete
    // retreat -> prepare -> charge.
    if (!wasAggro) {
      actor.moving = false;
      beginBoarRetreat(actor, now);
      return;
    }

    // Already fighting: preserve the exact existing phase and timers.
    // Holding the attack key can therefore damage the boar, but can no longer
    // lock it forever in retreat/prepare.
    if (
      phaseBeforeHit === "retreat" ||
      phaseBeforeHit === "prepare" ||
      phaseBeforeHit === "charge" ||
      phaseBeforeHit === "impact"
    ) {
      return;
    }

    // Defensive recovery for an unexpected aggressive idle state.
    actor.moving = false;
    actor.combatPhase = "prepare";
    actor.combatUntil = now + 420;
    boarShowLayer(actor, 0);
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

    // R140: Tierbann actors use .element; RAMSBACH bears use .root.
    // Keep the visible DOM position synchronized with the logical actor position
    // on EVERY chase step so bears can never move invisibly and later teleport.
    const visual = actor.element || actor.root;
    if (visual) {
      visual.style.left = `${actor.x}px`;
      visual.style.top = `${actor.y}px`;
    }
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

  function wolfPlayerInActorHabitat(actor) {
    return actor.mapId === MAP.id && wolfPointInsideHabitat(playerX, playerY, actor.habitat);
  }

  function startWolfPlayerAttack(actor, now) {
    actor.attackingPlayer = true;
    actor.attackImpactDone = false;
    actor.attackImpactAt = now + WOLF_CONFIG.attackWindup;
    actor.attackEndAt = now + 620;
    actor.nextPlayerAttackAt = now + WOLF_CONFIG.attackCooldown;
    actor.moving = false;
    actor.howling = false;
    const dx = playerX - actor.x;
    if (Math.abs(dx) > 8) {
      actor.facing = dx < 0 ? -1 : 1;
      actor.element.style.setProperty("--wolf-facing", actor.facing);
    }
    wolfShowStaticLayer(actor, 3);
    playRandomAnimalCombatSfx(ANIMAL_COMBAT_SFX.wolfAttack);
  }

  function wolfCombatChaseStep(actor, dx, dy, amount) {
    if (!actor) return false;

    // Tierbann summons keep the established hard-world collision unchanged.
    if (actor.tierbannAggressive) {
      return tierbannStepWithCollision(actor, dx, dy, amount);
    }

    // First try the existing route. This preserves landscape collision anywhere
    // it is valid for the wolf.
    if (tierbannStepWithCollision(actor, dx, dy, amount)) return true;

    // R132 fallback: canMoveFootTo() is PLAYER collision and can reject points
    // where ambient wolves legitimately stand. If that happens, normal wolves
    // may still advance, but ONLY inside their own configured habitat.
    const len = Math.hypot(dx, dy) || 1;
    const nx = dx / len;
    const ny = dy / len;
    let moved = false;

    const nextX = actor.x + nx * amount;
    if (wolfPointInsideHabitat(nextX, actor.y, actor.habitat)) {
      actor.x = nextX;
      moved = true;
    }

    const nextY = actor.y + ny * amount;
    if (wolfPointInsideHabitat(actor.x, nextY, actor.habitat)) {
      actor.y = nextY;
      moved = true;
    }

    actor.element.style.left = `${actor.x}px`;
    actor.element.style.top = `${actor.y}px`;
    return moved;
  }

  function updateWolfPlayerCombat(actor, deltaSeconds, now) {
    if (actor.dead || actor.away || playerDead) return;
    actor.aggro = true;
    actor.howling = false;

    if (actor.attackingPlayer) {
      if (!actor.attackImpactDone && now >= actor.attackImpactAt) {
        actor.attackImpactDone = true;
        if (playerInsideEnemyReach(actor, WOLF_CONFIG.attackReach)) damagePlayer(WOLF_CONFIG.attackDamage);
      }
      if (now >= actor.attackEndAt) {
        actor.attackingPlayer = false;
        actor.frameIndex = 0;
        wolfShowStaticLayer(actor, 0);
      }
      return;
    }

    const dx = playerX - actor.x;
    const dy = playerY - actor.y;
    const distance = Math.hypot(dx, dy);
    if (Math.abs(dx) > 12) {
      actor.facing = dx < 0 ? -1 : 1;
      actor.element.style.setProperty("--wolf-facing", actor.facing);
    }
    if (distance <= WOLF_CONFIG.attackReach && now >= actor.nextPlayerAttackAt) {
      startWolfPlayerAttack(actor, now);
      return;
    }
    actor.moving = true;
    if (now >= actor.nextFrameAt) wolfPickWalkFrame(actor);
    if (distance > WOLF_CONFIG.attackReach * 0.78) {
      wolfCombatChaseStep(actor, dx, dy, Math.max(actor.speed, 285) * deltaSeconds);
    }
  }

  function createBoarImpactDust(actor) {
    createRabbitDust({ x: actor.x, y: actor.y });
  }

  function boarAggroWorldPointAllowed(actor, x, y) {
    // R136: aggressive NORMAL boars use animal-world collision, NOT
    // canMoveFootTo(). The player helper contains player-sized map-edge and
    // exit-lane restrictions that wrongly cage boars near their old habitats.
    const marginX = 70;
    const marginY = 70;
    if (x < marginX || x > MAP.width - marginX) return false;
    if (y < marginY || y > MAP.height - marginY) return false;

    // Preserve the actual hard terrain/building obstacles of each map.
    if (MAP.id === "winterbach-ranglehen") {
      if (isWinterbachBlockedFootPoint(x, y)) return false;
      if (isWinterbachObsthofBlockedFootPoint(x, y)) return false;
      return true;
    }

    if (MAP.id === "lautenbach") {
      if (isLautenbachBlockedFootPoint(x, y)) return false;
      if (isLautenbachBuildingBlockedFootPoint(x, y)) return false;
      return true;
    }

    if (MAP.id === "hubacker") {
      if (isHubackerBlockedFootPoint(x, y)) return false;
      return true;
    }

    if (MAP.id === "ramsbach") {
      try {
        if (isRamsbachBlockedFootPoint(x, y)) return false;
      } catch (_) {}
      return true;
    }

    return true;
  }

  function boarCombatStepAllowed(actor, nextX, nextY) {
    // Existing Tierbann summons keep their established collision unchanged.
    if (actor.tierbannAggressive) {
      return tierbannPointAllowed(nextX, nextY);
    }

    // R136: once hit/aggressive, a normal boar may genuinely leave its habitat.
    if (actor.aggro) {
      return boarAggroWorldPointAllowed(actor, nextX, nextY);
    }

    // Peaceful ambient boars remain strictly habitat-bound.
    if (!tierbannPointAllowed(nextX, nextY)) return false;
    return boarPointInPolygon(nextX, nextY, actor.zone.polygon);
  }

  function boarCombatMove(actor, vx, vy, amount) {
    const len = Math.hypot(vx, vy) || 1;
    const nx = vx / len, ny = vy / len;
    let moved = false;
    const x = actor.x + nx * amount;
    if (boarCombatStepAllowed(actor, x, actor.y)) { actor.x = x; moved = true; }
    const y = actor.y + ny * amount;
    if (boarCombatStepAllowed(actor, actor.x, y)) { actor.y = y; moved = true; }
    actor.element.style.left = `${actor.x}px`;
    actor.element.style.top = `${actor.y}px`;
    return moved;
  }

  function boarChargeHitsPlayer(actor) {
    if (!actor) return false;
    const dx = playerX - actor.x;
    const dy = playerY - actor.y;

    // R129: the impact art is a broad charging body. Use the visible body area
    // instead of the old tiny centre-to-foot radius, which could visually hit
    // the player without ever registering damage.
    return (
      Math.abs(dx) <= BOAR_CONFIG.chargeHitHalfWidth &&
      Math.abs(dy) <= BOAR_CONFIG.chargeHitHalfHeight
    );
  }

  function normalBoarShouldDisengage(actor) {
    if (!actor || actor.tierbannAggressive) return false;

    // R135: leaving the red habitat is NOT enough to escape an angry boar.
    // It gives up only when the player has created real distance. If the boar is
    // outside its polygon at that moment, disengageNormalBoar() already sends it
    // back into its original habitat using the existing return animation.
    const distance = Math.hypot(playerX - actor.x, playerY - actor.y);
    return distance > BOAR_CONFIG.disengageDistance;
  }

  function disengageNormalBoar(actor, now) {
    if (!actor || actor.tierbannAggressive) return;

    actor.aggro = false;
    actor.combatPhase = "idle";
    actor.combatUntil = 0;
    actor.chargeVX = 0;
    actor.chargeVY = 0;
    actor.chargeHitDone = false;
    actor.retreatVX = 0;
    actor.retreatVY = 0;
    actor.moving = false;

    // Critical knockback can theoretically have nudged a boar just outside its
    // normal polygon. In that case, visibly walk it back into its own habitat.
    if (!boarPointInPolygon(actor.x, actor.y, actor.zone.polygon)) {
      const target = boarRandomPoint(actor.zone, 140);
      actor.targetX = target.x;
      actor.targetY = target.y;
      actor.speed = 185;
      actor.moving = true;
      actor.entering = true;
      actor.exiting = false;
      actor.moveEndAt = now + 7000;
      const dx = actor.targetX - actor.x;
      if (Math.abs(dx) > 10) boarSetFacing(actor, dx < 0 ? -1 : 1);
      boarShowLayer(actor, 1);
      return;
    }

    actor.entering = false;
    actor.exiting = false;
    boarStartPause(actor, now);
  }

  function startBoarCharge(actor, now) {
    const dx = playerX - actor.x;
    const dy = playerY - actor.y;
    const len = Math.hypot(dx, dy) || 1;
    actor.chargeVX = dx / len;
    actor.chargeVY = dy / len;
    actor.chargeHitDone = false;
    actor.combatPhase = "charge";
    actor.combatUntil = now + BOAR_CONFIG.chargeDuration;
    boarSetFacing(actor, actor.chargeVX < 0 ? -1 : 1);
    boarShowLayer(actor, 3);
  }

  function beginBoarRetreat(actor, now) {
    const dx = actor.x - playerX;
    const dy = actor.y - playerY;
    const len = Math.hypot(dx, dy) || 1;
    actor.retreatVX = dx / len;
    actor.retreatVY = dy / len;
    actor.combatPhase = "retreat";
    actor.combatUntil = now + BOAR_CONFIG.retreatDuration;
    boarSetFacing(actor, actor.retreatVX < 0 ? -1 : 1);
    boarShowLayer(actor, 1);
  }

  function updateBoarPlayerCombat(actor, deltaSeconds, now) {
    if (actor.dead || actor.away || playerDead) return;

    // R129: normal boars are retaliation enemies, not map-wide pursuers.
    // Once the player leaves their habitat / gets clearly away, they immediately
    // drop combat and return to their original idle/run behavior.
    if (normalBoarShouldDisengage(actor)) {
      disengageNormalBoar(actor, now);
      return;
    }

    actor.aggro = true;

    if (actor.combatPhase === "impact") {
      if (now >= actor.combatUntil) beginBoarRetreat(actor, now);
      return;
    }

    if (actor.combatPhase === "retreat") {
      boarCombatMove(actor, actor.retreatVX, actor.retreatVY, BOAR_CONFIG.retreatSpeed * deltaSeconds);
      if (now >= actor.combatUntil) {
        actor.combatPhase = "prepare";
        actor.combatUntil = now + 520;
        boarShowLayer(actor, 0);
      }
      return;
    }

    if (actor.combatPhase === "prepare") {
      const dx = playerX - actor.x;
      if (Math.abs(dx) > 10) boarSetFacing(actor, dx < 0 ? -1 : 1);
      if (now >= actor.combatUntil) startBoarCharge(actor, now);
      return;
    }

    if (actor.combatPhase !== "charge") {
      actor.combatPhase = "prepare";
      actor.combatUntil = now + 420;
      boarShowLayer(actor, 0);
      return;
    }

    boarCombatMove(actor, actor.chargeVX, actor.chargeVY, BOAR_CONFIG.chargeSpeed * deltaSeconds);
    if (!actor.chargeHitDone && boarChargeHitsPlayer(actor)) {
      actor.chargeHitDone = true;
      const playerWasDamaged = damagePlayer(BOAR_CONFIG.chargeDamage);
      if (playerWasDamaged) {
        playRandomAnimalCombatSfx(ANIMAL_COMBAT_SFX.boarHitsPlayer);
      }
      actor.combatPhase = "impact";
      actor.combatUntil = now + BOAR_CONFIG.impactDuration;
      boarShowLayer(actor, 4);
      createBoarImpactDust(actor);
      actor.element.animate(
        [{ transform: "translate(-50%, -84%) translateX(-18px)" }, { transform: "translate(-50%, -84%) translateX(18px)" }, { transform: "translate(-50%, -84%)" }],
        { duration: 210, iterations: 1 }
      );
      return;
    }
    if (now >= actor.combatUntil) beginBoarRetreat(actor, now);
  }

  function updateTierbannAggressiveBoar(actor, deltaSeconds, now) {
    updateBoarPlayerCombat(actor, deltaSeconds, now);
  }

  function updateTierbannAggressiveWolf(actor, deltaSeconds, now) {
    updateWolfPlayerCombat(actor, deltaSeconds, now);
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

  const WHITE_STAG_KIT_ITEM = Object.freeze({
    id: WHITE_STAG_KIT.id,
    name: WHITE_STAG_KIT.name,
    description: "ERSTES VOLLSTÄNDIGES RÜSTUNGSKIT",
    icon: WHITE_STAG_KIT.inventoryIcon,
    stackable: false,
    width: WHITE_STAG_KIT.inventoryWidth,
    height: WHITE_STAG_KIT.inventoryHeight,
    type: "equipment-kit"
  });

  // R105 TEST ITEM — LAMPE DES KALIFEN.
  // 1x1 inventory item; it is NOT equipment. The quickbar only stores a binding,
  // therefore the lamp always remains visible in its original inventory slot.
  const CALIPH_LAMP_ITEM = Object.freeze({
    id: "caliph-lamp",
    name: "LAMPE DES KALIFEN",
    description: "DIE LAMPE DES KALIFEN",
    icon: "assets/items/skills/CALIPH LAMP.png",
    stackable: false,
    width: 1,
    height: 1,
    type: "quickslot"
  });

  // R170 DEV-REISEKARTE — 1x1 Inventaritem. Linksklick öffnet die Kartenwahl.
  const TELEPORTER_ITEM = Object.freeze({
    id: "dev-teleporter-map",
    name: "REISEKARTE",
    description: "SCHNELLREISE ZU BEKANNTEN KARTEN",
    icon: "assets/items/REISEKARTE.svg",
    stackable: false,
    width: 1,
    height: 1,
    type: "teleporter"
  });

  const TELEPORT_DESTINATIONS = Object.freeze([
    Object.freeze({ key: "oberkirch", label: "OBERKIRCH", spawn: MAP_EXIT_CONFIG.oberkirchOriginalNorthReturnSpawn }),
    Object.freeze({ key: "winterbach", label: "WINTERBACH", spawn: MAP_EXIT_CONFIG.winterbachSpawn }),
    Object.freeze({ key: "lautenbach", label: "LAUTENBACH", spawn: MAP_EXIT_CONFIG.lautenbachSouthLeftSpawn }),
    Object.freeze({ key: "hubacker", label: "HUBACKER", spawn: MAP_EXIT_CONFIG.hubackerSouthLeftSpawn }),
    Object.freeze({ key: "renchtalstadion", label: "RENCHTALSTADION", spawn: MAP_EXIT_CONFIG.stadiumFromOberkirchSpawn }),
    Object.freeze({ key: "oedsbach", label: "ÖDSBACH", spawn: MAP_EXIT_CONFIG.oedsbachFromWinterbachSpawn }),
    Object.freeze({ key: "ramsbach", label: "RAMSBACH", spawn: MAP_EXIT_CONFIG.ramsbachFromHubackerSpawn }),
    Object.freeze({ key: "oppenau", label: "OPPENAU", spawn: MAP_EXIT_CONFIG.oppenauFromRamsbachSpawn }),
    Object.freeze({ key: "kuhbach", label: "KUHBACH", spawn: MAP_EXIT_CONFIG.kuhbachFromOppenauSpawn })
  ]);

  let teleporterUI = null;

  function installTeleporterStyles() {
    if (document.getElementById("teleporterStyles")) return;
    const style = document.createElement("style");
    style.id = "teleporterStyles";
    style.textContent = `
      #teleporterUI { position: fixed; inset: 0; z-index: 13000; display: none; place-items: center; background: rgba(0,0,0,.20); pointer-events: auto; }
      #teleporterUI.teleporter-ui--open { display: grid; }
      .teleporter-panel { position: relative; width: min(620px, 82vw); padding: 34px 38px 38px; border: 2px solid rgba(196,158,91,.78); background: rgba(17,13,9,.86); box-shadow: 0 18px 60px rgba(0,0,0,.62), inset 0 0 32px rgba(118,82,39,.20); color: #ead8ae; font-family: Georgia, "Times New Roman", serif; }
      .teleporter-title { margin: 0 42px 24px 0; font-size: 28px; letter-spacing: .13em; text-align: center; color: #e7c77f; text-shadow: 0 2px 3px #000; }
      .teleporter-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; }
      .teleporter-destination { min-height: 48px; border: 1px solid rgba(184,146,79,.55); background: rgba(37,27,17,.72); color: #e7d3a3; font: 700 16px Georgia, "Times New Roman", serif; letter-spacing: .06em; cursor: pointer; }
      .teleporter-destination:hover, .teleporter-destination:focus-visible { background: rgba(91,65,34,.82); border-color: rgba(236,201,132,.95); outline: none; box-shadow: inset 0 0 14px rgba(255,224,157,.12); }
      .teleporter-close { position: absolute; right: 14px; top: 10px; border: 0; background: transparent; color: #e7d3a3; font: 32px Georgia, serif; cursor: pointer; }
      @media (max-width: 620px) { .teleporter-grid { grid-template-columns: 1fr; } .teleporter-panel { max-height: 78vh; overflow: auto; } }
    `;
    document.head.appendChild(style);
  }

  function closeTeleporter() {
    if (!teleporterUI) return;
    teleporterUI.classList.remove("teleporter-ui--open");
    teleporterUI.setAttribute("aria-hidden", "true");
  }

  function openTeleporter() {
    installTeleporterStyles();
    if (!teleporterUI) {
      const root = document.createElement("div");
      root.id = "teleporterUI";
      root.setAttribute("aria-hidden", "true");
      const panel = document.createElement("div");
      panel.className = "teleporter-panel";
      const title = document.createElement("h2");
      title.className = "teleporter-title";
      title.textContent = "REISEKARTE";
      const close = document.createElement("button");
      close.type = "button"; close.className = "teleporter-close"; close.textContent = "×"; close.setAttribute("aria-label", "Reisekarte schließen");
      close.addEventListener("click", closeTeleporter);
      const grid = document.createElement("div"); grid.className = "teleporter-grid";
      for (const destination of TELEPORT_DESTINATIONS) {
        const button = document.createElement("button");
        button.type = "button"; button.className = "teleporter-destination"; button.textContent = destination.label;
        button.addEventListener("click", async () => {
          if (mapTransitioning) return;
          closeTeleporter();
          closeInventory();
          const targetMap = MAPS[destination.key];
          if (!targetMap) return;
          await switchMap(targetMap, destination.spawn, true);
        });
        grid.appendChild(button);
      }
      panel.append(title, close, grid); root.appendChild(panel); document.body.appendChild(root); teleporterUI = root;
      root.addEventListener("click", (event) => { if (event.target === root) closeTeleporter(); });
    }
    keys.clear(); attackHeld = false; cancelAttackImmediately();
    teleporterUI.classList.add("teleporter-ui--open");
    teleporterUI.setAttribute("aria-hidden", "false");
  }

  // ------------------------------------------------------------------
  // R151 HEILGEGENSTÄNDE — 1x1, stackbar, quickbarfähig.
  // Starterbestand: jeweils 10 Stück direkt unter der Kalifenlampe.
  // ------------------------------------------------------------------
  const HEALTH_CONSUMABLES = Object.freeze({
    bandage: Object.freeze({
      id: "bandage",
      name: "VERBAND",
      icon: "assets/items/consumables/VERBAND.png",
      stackable: true,
      width: 1,
      height: 1,
      type: "quickslot",
      heal: 30
    }),
    herbalWrap: Object.freeze({
      id: "herbal-wrap",
      name: "KRÄUTERWICKEL",
      icon: "assets/items/consumables/KRAEUTERWICKEL.png",
      stackable: true,
      width: 1,
      height: 1,
      type: "quickslot",
      heal: 50
    }),
    herbalPunchSpinach: Object.freeze({
      id: "herbal-punch-spinach",
      name: "KRÄUTERPUNSCH-SPINATMIX",
      icon: "assets/items/consumables/KRAEUTERPUNSCH-SPINATMIX.png",
      stackable: true,
      width: 1,
      height: 1,
      type: "quickslot",
      heal: 80,
      damageBonus: 0.25,
      damageBonusMs: 60000
    })
  });

  const HEALTH_CONSUMABLE_BY_ID = Object.freeze(
    Object.fromEntries(Object.values(HEALTH_CONSUMABLES).map((item) => [item.id, item]))
  );

  let playerDamageBuffUntil = 0;

  function playerDamageBuffActive(now = performance.now()) {
    return now < playerDamageBuffUntil;
  }

  function currentPlayerDamageMultiplier(now = performance.now()) {
    return playerDamageBuffActive(now)
      ? (1 + HEALTH_CONSUMABLES.herbalPunchSpinach.damageBonus)
      : 1;
  }

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
      dead: false,
      expRewardEligible: false,
      expOrbSpawned: false
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

      if (finished.expRewardEligible && !finished.expOrbSpawned) {
        spawnPlayerExpOrb(
          "mole",
          finished.x,
          finished.y,
          finished.mapId || MAP.id
        );
        finished.expOrbSpawned = true;
      }
    }, MOLE_CONFIG.fadeDuration + 30);

    moleEvent = null;
    scheduleNextMoleCheck(now);
  }

  function updateMole(now) {
    for (const drop of blackPennyDrops) {
      drop.element.style.display =
        (drop.mapId || "oberkirch-zentrum") === MAP.id ? "" : "none";
    }

    // R138: mole is disabled on these maps. Existing event is hidden and no new
    // event can spawn while any of these maps is active.
    if (
      MAP.id === "lautenbach" ||
      MAP.id === "oedsbach" ||
      MAP.id === "hubacker" ||
      MAP.id === "ramsbach" ||
      MAP.id === "renchtalstadion"
    ) {
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
      moleEvent.expRewardEligible = true;
      moleEvent.expOrbSpawned = false;
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


  // ------------------------------------------------------------------
  // R118 RAMSBACH — FIVE AMBIENT BEARS IN YELLOW MARKED HABITATS.
  // Exactly one bear in each of the two black reference circles. Their areas
  // intentionally overlap the existing wolf habitats. They are ambient only
  // in this patch; combat is added later with the player-damage system.
  // ------------------------------------------------------------------
  const RAMSBACH_BEAR_CONFIG = Object.freeze({
    mapId: "ramsbach",
    // R138: all black-bear visuals exactly 50% larger.
    width: 750,
    height: 585,
    maxHp: 1000,
    attackFrames: Object.freeze([
      "assets/mobs/bears/BLACK BEAR ATTACK 1.png",
      "assets/mobs/bears/BLACK BEAR ATTACK 2.png"
    ]),
    deadFrame: "assets/mobs/bears/BLACK BEAR DEAD.png",
    attackDamage: 100,
    attackCooldown: 1800,
    attackWindup: 430,
    attackReach: 315,
    chaseSpeed: 245,
    speed: 72,
    frameDuration: 430,
    stepMin: 150,
    stepMax: 390,
    pauseMin: 900,
    pauseMax: 2600,
    sideFrames: Object.freeze([
      "assets/mobs/bears/BEAR SIDE 1.png",
      "assets/mobs/bears/BEAR SIDE 2.png"
    ]),
    downFrames: Object.freeze([
      "assets/mobs/bears/BEAR DOWN 1.png",
      "assets/mobs/bears/BEAR DOWN 2.png"
    ]),
    habitats: Object.freeze([
      // R118 — FIVE YELLOW circles from the supplied marked Ramsbach screenshot.
      // These intentionally overlap each other. The old BLACK-circle bear
      // habitats are completely removed; those areas remain wolf-only.
      Object.freeze({ cx: 7800, cy: 780,  rx: 1320, ry: 330 }),
      Object.freeze({ cx: 6370, cy: 1680, rx: 420,  ry: 560 }),
      Object.freeze({ cx: 8760, cy: 3700, rx: 530,  ry: 970 }),
      Object.freeze({ cx: 7240, cy: 4480, rx: 1130, ry: 660 }),
      Object.freeze({ cx: 8130, cy: 4400, rx: 1030, ry: 940 })
    ])
  });

  let ramsbachBearActors = [];
  let nextRamsbachBearNearbySoundAt = 0;

  function playRandomRamsbachBearNearbySound(now) {
    if (MAP.id !== RAMSBACH_BEAR_CONFIG.mapId) return;
    if (now < nextRamsbachBearNearbySoundAt) return;

    const nearby = ramsbachBearActors.filter((actor) =>
      actor &&
      !actor.dead &&
      !actor.away &&
      Math.hypot(playerX - actor.x, playerY - actor.y) <= BOAR_CONFIG.soundDistance
    );

    if (!nearby.length) {
      nextRamsbachBearNearbySoundAt = now + 900;
      return;
    }

    playRandomAnimalCombatSfx(ANIMAL_COMBAT_SFX.bearNearby);
    nextRamsbachBearNearbySoundAt = now + BOAR_CONFIG.soundInterval;
  }

  function installRamsbachBearStyles() {
    if (document.getElementById("ramsbachBearStyles")) return;
    const style = document.createElement("style");
    style.id = "ramsbachBearStyles";
    style.textContent = `
      .ramsbach-bear {
        position: absolute;
        width: ${RAMSBACH_BEAR_CONFIG.width}px;
        height: ${RAMSBACH_BEAR_CONFIG.height}px;
        transform: translate(-50%, -82%) rotate(var(--bear-wobble, 0deg));
        transform-origin: 50% 88%;
        pointer-events: none;
        user-select: none;
        z-index: 8;
        will-change: left, top, transform;
      }
      .ramsbach-bear--critical-hit {
        transition: left 210ms ease-out, top 210ms cubic-bezier(.1,.75,.25,1) !important;
      }
      .ramsbach-bear__sprite {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: 50% 100%;
        opacity: 0;
        visibility: hidden;
        transition: none !important;
        filter: drop-shadow(0 9px 5px rgba(0,0,0,.25));
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }
      .ramsbach-bear__sprite--visible {
        opacity: 1;
        visibility: visible;
      }

      .ramsbach-bear--death-fading {
        opacity: 0;
        transition: opacity 420ms ease !important;
      }
    `;
    document.head.appendChild(style);
  }

  function ramsbachBearPointInHabitat(habitat, x, y) {
    const nx = (x - habitat.cx) / habitat.rx;
    const ny = (y - habitat.cy) / habitat.ry;
    return nx * nx + ny * ny <= 1;
  }

  function randomRamsbachBearPoint(habitat, fromX, fromY) {
    for (let attempt = 0; attempt < 40; attempt += 1) {
      const angle = Math.random() * Math.PI * 2;
      const distance =
        RAMSBACH_BEAR_CONFIG.stepMin +
        Math.random() *
          (RAMSBACH_BEAR_CONFIG.stepMax - RAMSBACH_BEAR_CONFIG.stepMin);
      const x = fromX + Math.cos(angle) * distance;
      const y = fromY + Math.sin(angle) * distance * 0.62;
      if (ramsbachBearPointInHabitat(habitat, x, y)) return { x, y };
    }
    return { x: habitat.cx, y: habitat.cy };
  }

  function setRamsbachBearFrame(actor, family, frameIndex, facing) {
    const familyOffset = family === "down" ? 2 : 0;
    const visible = familyOffset + frameIndex;
    actor.images.forEach((img, index) => {
      img.classList.toggle("ramsbach-bear__sprite--visible", index === visible);
    });

    if (family === "side") {
      // Supplied side frames face RIGHT. LEFT is the exact mirrored asset.
      actor.images[visible].style.transform = facing < 0 ? "scaleX(-1)" : "scaleX(1)";
    } else {
      actor.images[visible].style.transform = facing < 0 ? "scaleX(-1)" : "scaleX(1)";
    }
  }

  function createRamsbachBearActor(habitat, index) {
    const root = document.createElement("div");
    root.className = "ramsbach-bear";
    root.dataset.bearIndex = String(index);

    const sources = [
      ...RAMSBACH_BEAR_CONFIG.sideFrames,
      ...RAMSBACH_BEAR_CONFIG.downFrames,
      ...RAMSBACH_BEAR_CONFIG.attackFrames,
      RAMSBACH_BEAR_CONFIG.deadFrame
    ];
    const images = sources.map((src) => {
      const img = document.createElement("img");
      img.className = "ramsbach-bear__sprite";
      img.src = encodeURI(src);
      img.alt = "";
      img.draggable = false;
      img.decoding = "async";
      root.appendChild(img);
      return img;
    });

    const x = habitat.cx + (Math.random() - 0.5) * habitat.rx * 0.45;
    const y = habitat.cy + (Math.random() - 0.5) * habitat.ry * 0.45;
    const now = performance.now();
    const actor = {
      habitat,
      root,
      images,
      x,
      y,
      targetX: x,
      targetY: y,
      moving: false,
      family: "side",
      facing: 1,
      frame: 0,
      nextFrameAt: now + RAMSBACH_BEAR_CONFIG.frameDuration,
      pauseUntil: now + 700 + Math.random() * 1500,
      nextDecision: now + 900 + Math.random() * 1800,
      wobblePhase: Math.random() * Math.PI * 2,
      hp: RAMSBACH_BEAR_CONFIG.maxHp,
      dead: false,
      away: false,
      aggro: false,
      attackingPlayer: false,
      attackImpactDone: false,
      attackImpactAt: 0,
      attackEndAt: 0,
      nextPlayerAttackAt: 0,
      attackVariant: 0,
      expRewardEligible: false,
      expOrbSpawned: false,
      corpseFadeAt: 0,
      corpseDespawnAt: 0,
      corpseFadeStarted: false,
      corpseHidden: false
    };

    root.style.left = `${x}px`;
    root.style.top = `${y}px`;
    root.style.display = MAP.id === "ramsbach" ? "" : "none";
    setRamsbachBearFrame(actor, "side", 0, 1);
    world.appendChild(root);
    return actor;
  }

  function createRamsbachBears() {
    installRamsbachBearStyles();

    for (const src of [
      ...RAMSBACH_BEAR_CONFIG.sideFrames,
      ...RAMSBACH_BEAR_CONFIG.downFrames,
      ...RAMSBACH_BEAR_CONFIG.attackFrames,
      RAMSBACH_BEAR_CONFIG.deadFrame
    ]) {
      const preload = new Image();
      preload.decoding = "async";
      preload.src = encodeURI(src);
    }

    ramsbachBearActors = RAMSBACH_BEAR_CONFIG.habitats.map(
      (habitat, index) => createRamsbachBearActor(habitat, index)
    );
  }

  function setRamsbachBearVisibility(visible) {
    // R138: visibility only. Do not reset HP, position, death state, aggro,
    // animation, habitat or combat state.
    for (const actor of ramsbachBearActors) {
      if (!actor || !actor.root) continue;
      const shouldShow = visible && !(actor.dead && actor.corpseHidden);
      actor.root.style.display = shouldShow ? "" : "none";
    }
  }

  function updateRamsbachBearDepth(actor) {
    if (!actor || MAP.id !== RAMSBACH_BEAR_CONFIG.mapId) return;

    // EXACT same castle motif rule as the player:
    // upper / behind zone = behind BÄRENBURG, lower / front zone = in front.
    if (worldPointInPolygon(actor.x, actor.y, RAMSBACH_TERRAIN.castleBehindZone)) {
      actor.root.style.zIndex = "5";
    } else if (worldPointInPolygon(actor.x, actor.y, RAMSBACH_TERRAIN.castleFrontZone)) {
      actor.root.style.zIndex = "120";
    } else {
      actor.root.style.zIndex = "8";
    }
  }

  function killRamsbachBear(actor) {
    if (!actor || actor.dead) return;
    const deathNow = performance.now();
    playRandomAnimalCombatSfx(ANIMAL_COMBAT_SFX.bearDeath);
    actor.dead = true;
    actor.hp = 0;
    actor.moving = false;
    actor.aggro = false;
    actor.attackingPlayer = false;
    actor.attackImpactDone = false;
    actor.pauseUntil = Infinity;
    actor.nextDecision = Infinity;
    actor.corpseDespawnAt = deathNow + 6500;
    actor.corpseFadeAt = actor.corpseDespawnAt - 420;
    actor.corpseFadeStarted = false;
    actor.corpseHidden = false;
    actor.root.classList.remove("ramsbach-bear--death-fading");

    // R130: supplied bear death image is the final corpse layer.
    const deathLayer = 6; // 2 side + 2 down + 2 attack
    actor.images.forEach((img, index) => {
      img.classList.toggle("ramsbach-bear__sprite--visible", index === deathLayer);
    });
    actor.images[deathLayer].style.transform = actor.facing < 0 ? "scaleX(-1)" : "scaleX(1)";
    actor.root.style.display = MAP.id === RAMSBACH_BEAR_CONFIG.mapId ? "" : "none";
    updateRamsbachBearDepth(actor);
  }

  function damageRamsbachBear(actor, amount, critical, direction, now, saustark = false) {
    if (!actor || actor.dead || actor.away) return;

    actor.hp = Math.max(0, actor.hp - amount);

    // EXACT existing animal damage readout. Intentionally NO bear hit sound.
    createRabbitDamageText(actor, amount, critical, saustark);
    actor.aggro = true;
    actor.moving = false;

    if (critical) {
      createRabbitDust(actor);
      largeAnimalCriticalKnockback(actor, direction, "ramsbach-bear--critical-hit");
    }

    if (actor.hp <= 0) {
      actor.expRewardEligible = true;
      actor.expOrbSpawned = false;
      killRamsbachBear(actor);
      return;
    }

    actor.pauseUntil = now + 250;
    actor.nextDecision = now + 250;
  }

  function resolveRamsbachBearAttackFrame(frame) {
    if (!frame || !frame.hit || MAP.id !== RAMSBACH_BEAR_CONFIG.mapId) return;

    const direction = rabbitAttackDirection();
    const now = performance.now();

    for (const actor of ramsbachBearActors) {
      if (!actor || actor.dead || actor.away) continue;
      if (!rabbitInsideAttackHitbox(actor, direction)) continue;
      damageRamsbachBear(
        actor,
        frame.damage || 20,
        Boolean(frame.critical),
        direction,
        now,
        Boolean(frame.saustark)
      );
    }
  }

  function showRamsbachBearAttackFrame(actor, variant) {
    const visible = 4 + (variant ? 1 : 0);
    actor.images.forEach((img, index) => img.classList.toggle("ramsbach-bear__sprite--visible", index === visible));
    const dx = playerX - actor.x;
    let flip = dx < 0 ? -1 : 1;
    if (Math.abs(dx) < 60 && Math.random() < 0.5) flip *= -1;
    actor.images[visible].style.transform = flip < 0 ? "scaleX(-1)" : "scaleX(1)";
    actor.facing = flip;
  }

  function setRamsbachBearRestTowardPlayer(actor) {
    const dx = playerX - actor.x;
    const dy = playerY - actor.y;
    actor.family = Math.abs(dx) >= Math.abs(dy) * 0.85 ? "side" : "down";
    actor.facing = dx < 0 ? -1 : 1;
    if (Math.abs(dx) < 60 && Math.random() < 0.32) actor.facing *= -1;
    setRamsbachBearFrame(actor, actor.family, 0, actor.facing);
  }

  function startRamsbachBearPlayerAttack(actor, now) {
    actor.attackingPlayer = true;
    actor.attackImpactDone = false;
    actor.attackImpactAt = now + RAMSBACH_BEAR_CONFIG.attackWindup;
    actor.attackEndAt = now + 760;
    actor.nextPlayerAttackAt = now + RAMSBACH_BEAR_CONFIG.attackCooldown;
    actor.attackVariant = Math.random() < 0.5 ? 0 : 1;
    actor.moving = false;
    showRamsbachBearAttackFrame(actor, actor.attackVariant);
    playRandomAnimalCombatSfx(ANIMAL_COMBAT_SFX.bearAttack);
  }

  function updateRamsbachBearPlayerCombat(actor, deltaSeconds, now) {
    if (actor.dead || actor.away || playerDead) return;
    actor.aggro = true;
    updateRamsbachBearDepth(actor);

    if (actor.attackingPlayer) {
      if (!actor.attackImpactDone && now >= actor.attackImpactAt) {
        actor.attackImpactDone = true;
        if (playerInsideEnemyReach(actor, RAMSBACH_BEAR_CONFIG.attackReach)) damagePlayer(RAMSBACH_BEAR_CONFIG.attackDamage);
      }
      if (now >= actor.attackEndAt) {
        actor.attackingPlayer = false;
        setRamsbachBearRestTowardPlayer(actor);
      }
      return;
    }

    const dx = playerX - actor.x;
    const dy = playerY - actor.y;
    const distance = Math.hypot(dx, dy);
    if (distance <= RAMSBACH_BEAR_CONFIG.attackReach && now >= actor.nextPlayerAttackAt) {
      startRamsbachBearPlayerAttack(actor, now);
      return;
    }

    if (distance > RAMSBACH_BEAR_CONFIG.attackReach * 0.78) {
      actor.family = Math.abs(dx) >= Math.abs(dy) * 0.85 ? "side" : "down";
      actor.facing = dx < 0 ? -1 : 1;
      actor.moving = true;
      tierbannStepWithCollision(actor, dx, dy, RAMSBACH_BEAR_CONFIG.chaseSpeed * deltaSeconds);
      if (now >= actor.nextFrameAt) {
        actor.frame = actor.frame ? 0 : 1;
        actor.nextFrameAt = now + RAMSBACH_BEAR_CONFIG.frameDuration;
        setRamsbachBearFrame(actor, actor.family, actor.frame, actor.facing);
      }
    } else {
      actor.moving = false;
      setRamsbachBearRestTowardPlayer(actor);
    }
  }

  function updateRamsbachBears(deltaSeconds, now) {
    if (MAP.id !== RAMSBACH_BEAR_CONFIG.mapId) return;

    playRandomRamsbachBearNearbySound(now);

    for (const actor of ramsbachBearActors) {
      const active = MAP.id === RAMSBACH_BEAR_CONFIG.mapId;
      actor.root.style.display = active ? "" : "none";
      if (!active) continue;
      if (actor.dead) {
        updateRamsbachBearDepth(actor);

        if (
          !actor.corpseFadeStarted &&
          actor.corpseFadeAt &&
          now >= actor.corpseFadeAt
        ) {
          actor.corpseFadeStarted = true;
          actor.root.classList.add("ramsbach-bear--death-fading");
        }

        if (
          !actor.corpseHidden &&
          actor.corpseDespawnAt &&
          now >= actor.corpseDespawnAt
        ) {
          actor.corpseHidden = true;
          actor.root.style.display = "none";

          if (actor.expRewardEligible && !actor.expOrbSpawned) {
            spawnPlayerExpOrb(
              "bear",
              actor.x,
              actor.y,
              RAMSBACH_BEAR_CONFIG.mapId
            );
            actor.expOrbSpawned = true;
          }
        }

        continue;
      }

      updateRamsbachBearDepth(actor);

      if (playerRespawnProtected(now)) {
        actor.aggro = false;
        actor.attackingPlayer = false;
      } else if (actor.aggro) {
        updateRamsbachBearPlayerCombat(actor, deltaSeconds, now);
        actor.root.style.left = `${actor.x}px`;
        actor.root.style.top = `${actor.y}px`;
        updateRamsbachBearDepth(actor);
        continue;
      }

      if (!actor.moving && now >= actor.nextDecision && now >= actor.pauseUntil) {
        const target = randomRamsbachBearPoint(
          actor.habitat,
          actor.x,
          actor.y
        );
        actor.targetX = target.x;
        actor.targetY = target.y;
        const dx = target.x - actor.x;
        const dy = target.y - actor.y;
        actor.family = Math.abs(dx) >= Math.abs(dy) * 0.85 ? "side" : "down";
        actor.facing = dx < 0 ? -1 : 1;
        actor.moving = true;
        actor.frame = 0;
        actor.nextFrameAt = now + RAMSBACH_BEAR_CONFIG.frameDuration;
        setRamsbachBearFrame(actor, actor.family, actor.frame, actor.facing);
      }

      if (actor.moving) {
        const dx = actor.targetX - actor.x;
        const dy = actor.targetY - actor.y;
        const distance = Math.hypot(dx, dy);
        const step = RAMSBACH_BEAR_CONFIG.speed * deltaSeconds;

        if (distance <= Math.max(4, step)) {
          actor.x = actor.targetX;
          actor.y = actor.targetY;
          actor.moving = false;
          actor.pauseUntil = now +
            RAMSBACH_BEAR_CONFIG.pauseMin +
            Math.random() *
              (RAMSBACH_BEAR_CONFIG.pauseMax - RAMSBACH_BEAR_CONFIG.pauseMin);
          actor.nextDecision = actor.pauseUntil;
        } else {
          actor.x += (dx / distance) * step;
          actor.y += (dy / distance) * step;
        }

        if (now >= actor.nextFrameAt) {
          actor.frame = actor.frame ? 0 : 1;
          actor.nextFrameAt = now + RAMSBACH_BEAR_CONFIG.frameDuration;
          setRamsbachBearFrame(actor, actor.family, actor.frame, actor.facing);
        }

        // Very subtle body sway while walking.
        actor.wobblePhase += deltaSeconds * 5.2;
        actor.root.style.setProperty(
          "--bear-wobble",
          `${Math.sin(actor.wobblePhase) * 1.35}deg`
        );
      } else {
        actor.root.style.setProperty("--bear-wobble", "0deg");
      }

      actor.root.style.left = `${actor.x}px`;
      actor.root.style.top = `${actor.y}px`;
      updateRamsbachBearDepth(actor);
    }
  }

  // ------------------------------------------------------------------
  // R116 MAP 7 — RAMSBACH FINAL REFERENCE PASS.
  // Coordinates are measured from the supplied ACTUAL in-game screenshot.
  // RED markup = hard foot-boundaries. Collision is segment-based so the
  // existing X/Y separated movement slides smoothly along the line instead
  // of snagging on large invisible rectangles.
  // ------------------------------------------------------------------
  const RAMSBACH_TERRAIN = Object.freeze({
    redWallRadius: 44,

    // R139: tiny remaining post-bridge escape seam from the supplied screenshot.
    // This guard is intentionally evaluated BEFORE castleBluePassage's red-wall
    // exemption, so the real plateau entrance stays open but the upper glitch is sealed.
    postBridgeGuardWall: Object.freeze([
      Object.freeze([5260, 3968]),
      Object.freeze([5535, 3968]),
      Object.freeze([5725, 3575]),
      // R140: closes the tiny left-side escape around the previous endpoint
      // without touching the intended bridge -> plateau entrance.
      Object.freeze([5845, 3370])
    ]),

    // RED lines from the supplied reference, stored as independent polylines.
    // Bridge/ramp openings stay open exactly where the markup leaves a gap.
    redWalls: Object.freeze([
      Object.freeze([
        Object.freeze([4312, 0]),
        Object.freeze([4312, 3790])
      ]),
      Object.freeze([
        Object.freeze([4261, 4224]),
        Object.freeze([3943, 6827])
      ]),
      Object.freeze([
        Object.freeze([5056, 0]),
        Object.freeze([5056, 3669]),
        Object.freeze([5597, 3541]),
        Object.freeze([5883, 3350]),
        Object.freeze([5915, 1595]),
        Object.freeze([6042, 957]),
        Object.freeze([6360, 574]),
        Object.freeze([6742, 351]),
        Object.freeze([7441, 223]),
        Object.freeze([8268, 223]),
        Object.freeze([8904, 351]),
        Object.freeze([9381, 670]),
        Object.freeze([9540, 1085]),
        Object.freeze([9636, 1914]),
        Object.freeze([9655, 3190]),
        Object.freeze([9477, 4147]),
        Object.freeze([9159, 4849]),
        Object.freeze([8650, 5264]),
        Object.freeze([8014, 5423]),
        Object.freeze([7378, 5360]),
        Object.freeze([6805, 5104]),
        Object.freeze([6360, 4753]),
        Object.freeze([5788, 4147]),
        Object.freeze([5056, 4230])
      ])
    ]),

    // White bridge line. Right end is deliberately outside its lock zone so D
    // cleanly releases onto the Ramsbach plateau side.
    bridgeLockedZone: Object.freeze({ x1: 3900, y1: 3730, x2: 5260, y2: 4440 }),
    bridgePath: Object.freeze([
      Object.freeze([3915, 4030]),
      Object.freeze([5260, 4030])
    ]),
    bridgeSnapDistance: 180,

    // Marked depth rectangles.
    castleBehindZone: Object.freeze([
      Object.freeze([6589, 45]),
      Object.freeze([9439, 45]),
      Object.freeze([9439, 1665]),
      Object.freeze([6589, 1665])
    ]),
    castleFrontZone: Object.freeze([
      Object.freeze([5629, 1678]),
      Object.freeze([9445, 1678]),
      Object.freeze([9445, 3898]),
      Object.freeze([5629, 3898])
    ]),
    castleBluePassage: Object.freeze([
      // R124: BLUE zone is HARD COLLISION again. No free passage and no castle snap.
      Object.freeze([5480, 3420]),
      Object.freeze([6360, 3420]),
      Object.freeze([6360, 4260]),
      Object.freeze([5480, 4260])
    ]),

  });

  const RAMSBACH_CASTLE = Object.freeze({
    src: "assets/buildings/BAERENBURG.png",
    // R115 placement stays untouched in this pass.
    left: 5200,
    top: 0,
    width: 4800,
    height: 3850,
    zIndex: 6
  });

  let ramsbachCastleElement = null;
  let ramsbachCastleAlphaMask = null;
  let activeRamsbachSnap = null;
  let ramsbachSnapDistance = 0;
  let ramsbachSnapping = false;
  let ramsbachSnapReleaseUntil = 0;

  function prepareRamsbachCastleAlphaMask(image) {
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

      ramsbachCastleAlphaMask = {
        width: canvas.width,
        height: canvas.height,
        alpha
      };
    } catch (error) {
      ramsbachCastleAlphaMask = null;
      console.warn("RAMSBACH BÄRENBURG alpha collision unavailable:", error);
    }
  }

  function createRamsbachCastle() {
    if (ramsbachCastleElement) return;
    const image = document.createElement("img");
    image.id = "ramsbach-baerenburg";
    image.className = "hubacker-building";
    image.src = encodeURI(RAMSBACH_CASTLE.src);
    image.alt = "";
    image.draggable = false;
    image.style.position = "absolute";
    image.style.objectFit = "fill";
    image.style.maxWidth = "none";
    image.style.maxHeight = "none";
    image.style.pointerEvents = "none";
    image.style.userSelect = "none";
    image.style.left = `${RAMSBACH_CASTLE.left}px`;
    image.style.top = `${RAMSBACH_CASTLE.top}px`;
    image.style.width = `${RAMSBACH_CASTLE.width}px`;
    image.style.height = `${RAMSBACH_CASTLE.height}px`;
    image.style.zIndex = String(RAMSBACH_CASTLE.zIndex);
    image.style.opacity = "1";
    image.style.visibility = "visible";
    image.style.display = MAP.id === "ramsbach" ? "block" : "none";

    image.addEventListener("load", () => {
      prepareRamsbachCastleAlphaMask(image);
    }, { once: true });

    image.addEventListener("error", () => {
      console.error("BÄRENBURG asset failed to load:", image.src);
    });

    world.appendChild(image);
    ramsbachCastleElement = image;

    if (image.complete && image.naturalWidth > 0) {
      prepareRamsbachCastleAlphaMask(image);
    }
  }

  function setRamsbachWorldVisibility(visible) {
    if (!ramsbachCastleElement) return;
    ramsbachCastleElement.style.display = visible ? "block" : "none";
    ramsbachCastleElement.style.visibility = visible ? "visible" : "hidden";
    ramsbachCastleElement.style.opacity = visible ? "1" : "0";
  }

  function playerInRamsbachCastleBehindZone() {
    return (
      MAP.id === "ramsbach" &&
      worldPointInPolygon(playerX, playerY, RAMSBACH_TERRAIN.castleBehindZone)
    );
  }

  function playerInRamsbachCastleFrontZone() {
    return (
      MAP.id === "ramsbach" &&
      worldPointInPolygon(playerX, playerY, RAMSBACH_TERRAIN.castleFrontZone)
    );
  }

  // ------------------------------------------------------------------
  // R158 MAP 8 OPPENAU — TERRAIN / RED NO-GO / WHITE BRIDGE SNAP
  // Coordinates mapped 1:1 from the supplied marked screenshot.
  // RED = hard player-foot collision.
  // BLUE = castle exception, walkable + player behind castle.
  // WHITE = forced A/D bridge centerlines; W+A / W+D / S+A / S+D also engage
  // because the horizontal component owns movement while snapped.
  // ------------------------------------------------------------------
  const OPPENAU_TERRAIN = Object.freeze({
    // Four independent RED inaccessible regions.
    blockedPolygons: Object.freeze([
      Object.freeze([
        Object.freeze([1520, 62]),
        Object.freeze([0, 349]),
        Object.freeze([0, 5760]),
        Object.freeze([528, 5760]),
        Object.freeze([1319, 5264]),
        Object.freeze([1078, 5225]),
        Object.freeze([1792, 3961]),
        Object.freeze([1660, 3326]),
        Object.freeze([3142, 2775]),
        Object.freeze([1870, 2489]),
        Object.freeze([450, 1488]),
        Object.freeze([644, 721]),
        Object.freeze([1319, 550])
      ]),
      Object.freeze([
        Object.freeze([4042, 2760]),
        Object.freeze([4049, 3582]),
        Object.freeze([4600, 4938]),
        Object.freeze([4453, 5760]),
        Object.freeze([5415, 5760]),
        Object.freeze([5795, 4574]),
        Object.freeze([6865, 3504]),
        Object.freeze([6237, 3326]),
        Object.freeze([5508, 3977]),
        Object.freeze([5174, 4566]),
        Object.freeze([4639, 3496]),
        Object.freeze([4763, 2946])
      ]),
      Object.freeze([
        Object.freeze([2529, 0]),
        Object.freeze([2428, 0]),
        Object.freeze([3887, 1364]),
        Object.freeze([4042, 1775]),
        Object.freeze([4042, 2706]),
        Object.freeze([4786, 2899]),
        Object.freeze([4895, 2535]),
        Object.freeze([4243, 961]),
        Object.freeze([3375, 248]),
        Object.freeze([3056, 0])
      ]),
      Object.freeze([
        Object.freeze([10100, 0]),
        Object.freeze([9612, 0]),
        Object.freeze([9138, 667]),
        Object.freeze([8107, 1248]),
        Object.freeze([7416, 2380]),
        Object.freeze([6276, 3287]),
        Object.freeze([6959, 3465]),
        Object.freeze([7486, 3000]),
        Object.freeze([8277, 1659]),
        Object.freeze([9495, 814])
      ])
    ]),

    // BLUE rectangle: only castle area that is walkable and places player behind.
    castleBluePassage: Object.freeze([
      Object.freeze([2390, 495]),
      Object.freeze([2945, 495]),
      Object.freeze([2945, 1015]),
      Object.freeze([2390, 1015])
    ]),

    bridges: Object.freeze([
      Object.freeze({
        id: "oppenau-covered",
        path: Object.freeze([
          Object.freeze([3810, 2675]),
          Object.freeze([5230, 3065])
        ]),
        engageDistance: 175
      }),
      Object.freeze({
        id: "oppenau-stone",
        path: Object.freeze([
          Object.freeze([6245, 3315]),
          Object.freeze([6970, 3545])
        ]),
        engageDistance: 165
      })
    ])
  });

  let activeOppenauBridgeSnap = null;

  function playerInOppenauCastleBluePassage() {
    return (
      MAP.id === "oppenau" &&
      worldPointInPolygon(playerX, playerY, OPPENAU_TERRAIN.castleBluePassage)
    );
  }

  function isOppenauTerrainBlockedFootPoint(x, y) {
    if (MAP.id !== "oppenau") return false;

    // BLUE castle exception always wins over the painted RED area.
    if (worldPointInPolygon(x, y, OPPENAU_TERRAIN.castleBluePassage)) {
      return false;
    }

    // R160: both gate center corridors are deliberate holes through the RED
    // terrain collision. This is what makes BOTH gates fully passable north/south.
    if (
      pointInOppenauRect(x, y, OPPENAU_DECOR.upperGate.passage) ||
      pointInOppenauRect(x, y, OPPENAU_DECOR.lowerGate.passage)
    ) {
      return false;
    }

    for (const polygon of OPPENAU_TERRAIN.blockedPolygons) {
      if (worldPointInPolygon(x, y, polygon)) return true;
    }
    return false;
  }

  function tryEngageOppenauBridgeSnap(dx, dy) {
    if (MAP.id !== "oppenau") return false;

    const horizontalDirection = dx > 0 ? 1 : dx < 0 ? -1 : 0;
    if (!horizontalDirection) return false;

    let best = null;
    for (const bridge of OPPENAU_TERRAIN.bridges) {
      const closest = closestPointOnBridgePath(playerX, playerY, bridge.path);
      if (!closest || closest.distance > bridge.engageDistance) continue;

      // Moving outward from a finished endpoint must release into free movement.
      if (closest.progress <= 0.035 && horizontalDirection < 0) continue;
      if (closest.progress >= 0.965 && horizontalDirection > 0) continue;

      if (!best || closest.distance < best.closest.distance) {
        best = { bridge, closest };
      }
    }

    if (!best) return false;

    activeOppenauBridgeSnap = {
      id: best.bridge.id,
      path: best.bridge.path,
      distance: best.closest.pathDistance,
      snapping: true
    };
    clearIceVelocity();
    updateIceVisual();
    return true;
  }

  function moveAlongOppenauBridgeSnap(dx, dy, deltaSeconds) {
    if (!activeOppenauBridgeSnap) return false;

    const horizontalDirection = dx > 0 ? 1 : dx < 0 ? -1 : 0;
    const anchor = pointAtBridgeDistance(
      activeOppenauBridgeSnap.path,
      activeOppenauBridgeSnap.distance
    );

    if (activeOppenauBridgeSnap.snapping) {
      const sx = anchor.x - playerX;
      const sy = anchor.y - playerY;
      const distance = Math.hypot(sx, sy);

      if (distance > 5) {
        const pull = Math.min(1, 10 * deltaSeconds);
        playerX += sx * pull;
        playerY += sy * pull;
        return true;
      }

      playerX = anchor.x;
      playerY = anchor.y;
      activeOppenauBridgeSnap.snapping = false;
    }

    // W/S alone cannot drift off a bridge. A/D owns movement.
    // Diagonals remain valid because their horizontal component is preserved.
    if (!horizontalDirection) return true;

    const metrics = getPathMetrics(activeOppenauBridgeSnap.path);
    const nextDistance = Math.max(
      0,
      Math.min(
        metrics.total,
        activeOppenauBridgeSnap.distance +
          horizontalDirection * currentPlayerMoveSpeed() * deltaSeconds
      )
    );

    const point = pointAtBridgeDistance(activeOppenauBridgeSnap.path, nextDistance);
    playerX = point.x;
    playerY = point.y;
    activeOppenauBridgeSnap.distance = nextDistance;

    const leftDone = nextDistance <= 0.001 && horizontalDirection < 0;
    const rightDone =
      nextDistance >= metrics.total - 0.001 && horizontalDirection > 0;

    if (leftDone || rightDone) {
      activeOppenauBridgeSnap = null;
      // Tiny exit nudge prevents immediate re-capture at the endpoint.
      playerX += horizontalDirection * 18;
    }
    return true;
  }

  // ------------------------------------------------------------------
  // R159 MAP 8 OPPENAU — TWO GATES + MOSS ROCK
  // Reference mapping:
  //   lower gate = supplied gate with tower, MIRRORED
  //   upper gate = supplied simple gate, NOT mirrored
  //   rock       = supplied moss rock
  //
  // Gates are hard collision on their visible silhouettes EXCEPT the central
  // arch passage. While walking through the marked RED depth zone the player
  // fades behind the gate, then returns to full foreground after leaving it.
  // ------------------------------------------------------------------
  const OPPENAU_DECOR = Object.freeze({
    upperGate: Object.freeze({
      id: "oppenau-upper-gate",
      src: "assets/buildings/oppenau/OPPENAU_UPPER_GATE.webp",
      left: 2575,
      top: 1965,
      width: 1510,
      height: 1007,
      mirrored: false,
      zIndex: 92,

      // Central arch is the ONLY walkable part of the gate silhouette.
      // R160: this is a THROUGH-CORRIDOR, not merely the visible black arch.
      // It extends completely through the gate so the player's FOOT anchor can
      // leave on the north side instead of colliding with the facade/roof above.
      passage: Object.freeze({
        x1: 3010, y1: 1810,
        x2: 3590, y2: 3180
      }),

      // R163: upper gate uses the full visible gate-body band.
      // This prevents the player from visually "standing on the roof":
      // feet entering the roof/body section are already behind the gate.
      depthZone: Object.freeze({
        x1: 2575, y1: 1740,
        x2: 4085, y2: 2865
      }),

      // Small deliberate opening from the arch/right edge directly onto the
      // covered bridge snap line. This fixes the gate's upper-right silhouette
      // blocking entry to the bridge from the LEFT.
      bridgeApproach: Object.freeze({
        x1: 3480, y1: 2450,
        // MINIFIX: continue the right-side walkable pocket far enough behind
        // the upper gate to include the supplied yellow-circle player position.
        x2: 4185, y2: 3300
      })
    }),

    lowerGate: Object.freeze({
      id: "oppenau-lower-gate",
      src: "assets/buildings/oppenau/OPPENAU_LOWER_GATE.webp",
      left: 1380,
      top: 4290,
      width: 2120,
      height: 1491,
      mirrored: true,
      zIndex: 92,

      // Yellow-circle / main arch passage. Spawn from RAMSBACH sits here.
      // R160: full north/south THROUGH-CORRIDOR. The old y1=5050 stopped at
      // the visible arch apex, which trapped the FOOT anchor when walking north.
      passage: Object.freeze({
        x1: 2390, y1: 4140,
        x2: 2860, y2: 5760
      }),

      // R163: depth is restricted to the ACTUAL lower-gate body.
      // The old north edge (4190) kept the player translucent after he had
      // already cleared the gate. Passage itself stays fully traversable.
      depthZone: Object.freeze({
        x1: 1380, y1: 4425,
        x2: 3500, y2: 5260
      })
    }),

    rock: Object.freeze({
      id: "oppenau-moss-rock",
      src: "assets/buildings/oppenau/OPPENAU_MOSS_ROCK.webp",
      left: 1340,
      top: 1535,
      width: 1210,
      height: 807,
      mirrored: false,
      zIndex: 88
    }),

    // Player coordinates are FOOT coordinates. Gate occlusion must react to
    // the visible body, otherwise the effect starts one W-tap too late.
    gateDepthBodyProbeOffsetY: 235,
    gateFadeBand: 185
  });

  const oppenauDecorElements = new Map();
  const oppenauDecorAlphaMasks = new Map();

  function prepareOppenauDecorAlphaMask(id, image) {
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

      oppenauDecorAlphaMasks.set(id, {
        width: canvas.width,
        height: canvas.height,
        alpha
      });
    } catch (error) {
      oppenauDecorAlphaMasks.delete(id);
      console.warn(`OPPENAU decor alpha mask unavailable (${id}):`, error);
    }
  }

  function createOppenauDecorObject(config) {
    const existing = document.getElementById(config.id);
    if (existing) {
      oppenauDecorElements.set(config.id, existing);
      return existing;
    }

    const image = document.createElement("img");
    image.id = config.id;
    image.src = encodeURI(config.src);
    image.alt = "";
    image.draggable = false;

    image.style.position = "absolute";
    image.style.left = `${config.left}px`;
    image.style.top = `${config.top}px`;
    image.style.width = `${config.width}px`;
    image.style.height = `${config.height}px`;
    image.style.objectFit = "fill";
    image.style.maxWidth = "none";
    image.style.maxHeight = "none";
    image.style.pointerEvents = "none";
    image.style.userSelect = "none";
    image.style.webkitUserDrag = "none";
    image.style.transformOrigin = "50% 50%";
    image.style.transform = config.mirrored ? "scaleX(-1)" : "none";
    image.style.zIndex = String(config.zIndex);
    image.style.opacity = "1";
    image.style.display = MAP.id === "oppenau" ? "block" : "none";
    image.style.visibility = MAP.id === "oppenau" ? "visible" : "hidden";

    image.addEventListener("load", () => {
      prepareOppenauDecorAlphaMask(config.id, image);
    }, { once: true });

    image.addEventListener("error", () => {
      console.error("OPPENAU decor asset failed to load:", image.src);
    });

    world.appendChild(image);
    oppenauDecorElements.set(config.id, image);

    if (image.complete && image.naturalWidth > 0) {
      prepareOppenauDecorAlphaMask(config.id, image);
    }

    return image;
  }

  function createOppenauDecor() {
    createOppenauDecorObject(OPPENAU_DECOR.upperGate);
    createOppenauDecorObject(OPPENAU_DECOR.lowerGate);
    createOppenauDecorObject(OPPENAU_DECOR.rock);
  }

  function setOppenauDecorVisibility(visible) {
    if (oppenauDecorElements.size < 3) createOppenauDecor();

    for (const element of oppenauDecorElements.values()) {
      element.style.display = visible ? "block" : "none";
      element.style.visibility = visible ? "visible" : "hidden";
    }
  }

  function pointInOppenauRect(x, y, rect) {
    return (
      x >= rect.x1 && x <= rect.x2 &&
      y >= rect.y1 && y <= rect.y2
    );
  }

  function sampleOppenauDecorAlpha(config, x, y) {
    if (
      x < config.left || x > config.left + config.width ||
      y < config.top || y > config.top + config.height
    ) return false;

    const mask = oppenauDecorAlphaMasks.get(config.id);

    // Safe fallback during the first decode frame: treat the object bounds as
    // solid. Gate passage exceptions are handled before this function.
    if (!mask) return true;

    let localX01 = (x - config.left) / config.width;
    const localY01 = (y - config.top) / config.height;

    if (config.mirrored) localX01 = 1 - localX01;

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

    return mask.alpha[py * mask.width + px] >= 28;
  }

  function isOppenauGateBlockedFootPoint(config, x, y) {
    // Central arch always remains walkable.
    if (pointInOppenauRect(x, y, config.passage)) return false;

    // R163: ONLY the upper gate owns this tiny bridge approach exception.
    // It opens the route from the left side onto the existing covered-bridge
    // snap line without weakening the rest of the gate hitbox.
    if (
      config.bridgeApproach &&
      pointInOppenauRect(x, y, config.bridgeApproach)
    ) {
      return false;
    }

    return sampleOppenauDecorAlpha(config, x, y);
  }

  function isOppenauDecorBlockedFootPoint(x, y) {
    if (MAP.id !== "oppenau") return false;

    if (isOppenauGateBlockedFootPoint(OPPENAU_DECOR.upperGate, x, y)) {
      return true;
    }
    if (isOppenauGateBlockedFootPoint(OPPENAU_DECOR.lowerGate, x, y)) {
      return true;
    }

    // Moss rock = complete fixed alpha-silhouette collision.
    if (sampleOppenauDecorAlpha(OPPENAU_DECOR.rock, x, y)) {
      return true;
    }

    return false;
  }

  function oppenauGateDepthProbeY() {
    // playerY is the FOOT anchor; use the lower torso/body as the visual probe.
    // This pulls the layer/fade transition DOWN on screen by the requested amount.
    return playerY - OPPENAU_DECOR.gateDepthBodyProbeOffsetY;
  }

  function oppenauGateVisualProbeY(config) {
    const bodyProbeY = oppenauGateDepthProbeY();

    // R163: on the UPPER gate the visible roof/body sits high enough that the
    // FOOT anchor must also participate, otherwise the player can appear to
    // stand on the roof before the layer switches.
    if (config === OPPENAU_DECOR.upperGate) {
      const footInside = pointInOppenauRect(playerX, playerY, config.depthZone);
      return footInside ? playerY : bodyProbeY;
    }

    return bodyProbeY;
  }

  function oppenauGateFadeOpacityFor(config) {
    if (MAP.id !== "oppenau") return 1;

    const z = config.depthZone;
    const probeY = oppenauGateVisualProbeY(config);

    if (!pointInOppenauRect(playerX, probeY, z)) return 1;

    // Feet must still be travelling inside the gate corridor.
    if (!pointInOppenauRect(playerX, playerY, config.passage)) return 1;

    const edgeDistance = Math.min(
      Math.abs(probeY - z.y1),
      Math.abs(z.y2 - probeY)
    );
    const t = Math.max(
      0,
      Math.min(1, edgeDistance / OPPENAU_DECOR.gateFadeBand)
    );

    const smooth = t * t * (3 - 2 * t);
    return 1 - smooth;
  }

  function playerInOppenauGateDepthZone() {
    if (MAP.id !== "oppenau") return false;

    for (const config of [OPPENAU_DECOR.upperGate, OPPENAU_DECOR.lowerGate]) {
      const probeY = oppenauGateVisualProbeY(config);

      const inGateRoute =
        pointInOppenauRect(playerX, playerY, config.passage) ||
        (config.bridgeApproach &&
          pointInOppenauRect(playerX, playerY, config.bridgeApproach));

      if (
        (pointInOppenauRect(playerX, probeY, config.depthZone) ||
          (config.bridgeApproach &&
            pointInOppenauRect(playerX, playerY, config.bridgeApproach))) &&
        inGateRoute
      ) return true;
    }
    return false;
  }

  function currentOppenauPlayerOpacity() {
    if (MAP.id !== "oppenau") return 1;

    // Covered wooden bridge only: disappear smoothly the instant the white
    // snap line is engaged. Stone bridge remains completely unchanged.
    if (
      activeOppenauBridgeSnap &&
      activeOppenauBridgeSnap.id === "oppenau-covered"
    ) {
      return 0;
    }

    return Math.min(
      oppenauGateFadeOpacityFor(OPPENAU_DECOR.upperGate),
      oppenauGateFadeOpacityFor(OPPENAU_DECOR.lowerGate)
    );
  }




  // ------------------------------------------------------------------
  // R164 OPPENAU — ZIEGE + MAID / SUPERBOCK EVENT STAGE 1
  //
  // Existing ambient 10-second reactions remain intact while idle.
  // NEW:
  // - goat is mouse-selectable while idle
  // - parchment cursor + subtle highlight on hover
  // - click starts a fixed path following the user's red route
  // - covered bridge uses the existing OPPENAU bridge snap line exactly
  // - goat goes behind the upper gate and fades under the covered bridge
  // - after arrival: 2 s goat meet + mirrored maid meet
  // - then maid dance, 0.3 s later mirrored goat dance
  // - final poses freeze until SUPERBOCK.mp3 ends
  // - player remains fully controllable throughout
  // - after song: both reset to exact starting positions / normal frames
  // ------------------------------------------------------------------
  const OPPENAU_AMBIENT_PAIR = Object.freeze({
    mapId: "oppenau",
    cycleMs: 10000,
    initialDelayMs: 10000,
    crossfadeMs: 320,

    goat: Object.freeze({
      x: 1990,
      y: 2460,
      width: 390,
      height: 410,

      standard: "assets/npcs/oppenau/goat/OPPENAU GOAT NORMAL.webp",
      alternate: "assets/npcs/oppenau/goat/OPPENAU GOAT ALT.webp",

      walk1: "assets/npcs/oppenau/goat/event/OPPENAU GOAT WALK RIGHT 1.webp",
      walk2: "assets/npcs/oppenau/goat/event/OPPENAU GOAT WALK RIGHT 2.webp",
      meet: "assets/npcs/oppenau/goat/event/OPPENAU GOAT MEET.webp",
      dance: "assets/npcs/oppenau/goat/event/OPPENAU GOAT DANCE.webp"
    }),

    maid: Object.freeze({
      x: 5220,
      y: 3865,
      width: 405,
      height: 555,

      standard: "assets/npcs/oppenau/maid/OPPENAU MAID NORMAL.webp",
      phase1: "assets/npcs/oppenau/maid/OPPENAU MAID LOOK UP.webp",
      phase2: "assets/npcs/oppenau/maid/OPPENAU MAID HANDKERCHIEF.webp",

      meet: "assets/npcs/oppenau/maid/event/OPPENAU MAID MEET.webp",
      dance: "assets/npcs/oppenau/maid/event/OPPENAU MAID DANCE.webp"
    })
  });

  const OPPENAU_SUPERBOCK_EVENT = Object.freeze({
    song: "assets/audio/events/oppenau/SUPERBOCK.mp3",
    musicFadeMs: 1250,

    walkSpeed: 300,
    walkFrameMs: 225,

    // Exact route reconstructed from the supplied RED line.
    // Points 4 -> 5 are the already-established covered bridge snap line
    // from R158: (3810,2675) -> (5230,3065).
    route: Object.freeze([
      Object.freeze({ x: 1990, y: 2460 }),
      Object.freeze({ x: 2260, y: 2290 }),
      Object.freeze({ x: 2860, y: 2320 }),
      Object.freeze({ x: 3340, y: 2495 }),
      Object.freeze({ x: 3810, y: 2675 }),
      Object.freeze({ x: 5230, y: 3065 }),
      // MINIFIX: stop directly after the covered bridge, once the goat is visible again.
      // This is the supplied screenshot position beside the maid without overlap.
      Object.freeze({ x: 5410, y: 3290 })
    ]),

    bridgeStartIndex: 4,
    bridgeEndIndex: 5,

    meetDurationMs: 2000,
    goatDanceDelayMs: 300
  });

  let oppenauAmbientPairStartAt = 0;
  let oppenauAmbientGoat = null;
  let oppenauAmbientMaid = null;

  let oppenauGoatPartyState = "idle";
  let oppenauGoatPartyRouteIndex = 1;
  let oppenauGoatPartyNextWalkFrameAt = 0;
  let oppenauGoatPartyWalkFrame = 0;
  let oppenauGoatPartyPhaseEndAt = 0;
  let oppenauGoatPartyHovered = false;

  let oppenauGoatPartyAudio = null;
  let oppenauGoatPartyMusicToken = 0;
  let oppenauGoatPartyPreviousMapAudio = null;

  function installOppenauAmbientPairStyles() {
    if (document.getElementById("oppenauAmbientPairStyles")) return;

    const style = document.createElement("style");
    style.id = "oppenauAmbientPairStyles";
    style.textContent = `
      .oppenau-ambient-pair {
        position: absolute;
        transform: translate(-50%, -100%);
        transform-origin: 50% 100%;
        pointer-events: none;
        user-select: none;
        z-index: 95;
        transition:
          opacity ${OPPENAU_AMBIENT_PAIR.crossfadeMs}ms ease,
          filter 150ms ease;
        will-change: left, top, opacity, filter;
      }

      .oppenau-ambient-pair__sprite {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center bottom;
        opacity: 0;
        transition: opacity ${OPPENAU_AMBIENT_PAIR.crossfadeMs}ms ease;
        will-change: opacity, transform;
        pointer-events: none;
      }

      .oppenau-ambient-pair__sprite--visible {
        opacity: 1;
      }

      #oppenau-ambient-goat.oppenau-goat--interactive {
        pointer-events: auto;
      }

      #oppenau-ambient-goat.oppenau-goat--hovered {
        z-index: 102;
        filter:
          brightness(1.18)
          drop-shadow(0 0 18px rgba(255, 236, 175, .72));
      }

      #game.oppenau-goat-parchment-cursor {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath fill='%23e4d2a2' stroke='%235b4023' stroke-width='1.5' d='M8 5h17c2 0 3 1 3 3s-1 3-3 3H11v13c0 2-1 3-3 3s-3-1-3-3V8c0-2 1-3 3-3Z'/%3E%3Cpath fill='none' stroke='%2384663b' stroke-width='1.4' d='M11 13h12M11 17h10M11 21h8'/%3E%3C/svg%3E") 7 7, pointer;
      }
    `;

    document.head.appendChild(style);
  }

  function preloadOppenauAmbientPairSprites() {
    const sources = [
      OPPENAU_AMBIENT_PAIR.goat.standard,
      OPPENAU_AMBIENT_PAIR.goat.alternate,
      OPPENAU_AMBIENT_PAIR.goat.walk1,
      OPPENAU_AMBIENT_PAIR.goat.walk2,
      OPPENAU_AMBIENT_PAIR.goat.meet,
      OPPENAU_AMBIENT_PAIR.goat.dance,

      OPPENAU_AMBIENT_PAIR.maid.standard,
      OPPENAU_AMBIENT_PAIR.maid.phase1,
      OPPENAU_AMBIENT_PAIR.maid.phase2,
      OPPENAU_AMBIENT_PAIR.maid.meet,
      OPPENAU_AMBIENT_PAIR.maid.dance
    ];

    for (const src of sources) {
      const image = new Image();
      image.decoding = "async";
      image.src = encodeURI(src);
    }
  }

  function createOppenauAmbientActor(id, config, sources) {
    const root = document.createElement("div");
    root.id = id;
    root.className = "oppenau-ambient-pair";
    root.style.left = `${config.x}px`;
    root.style.top = `${config.y}px`;
    root.style.width = `${config.width}px`;
    root.style.height = `${config.height}px`;

    const images = sources.map((src, index) => {
      const image = document.createElement("img");
      image.className =
        "oppenau-ambient-pair__sprite" +
        (index === 0 ? " oppenau-ambient-pair__sprite--visible" : "");
      image.src = encodeURI(src);
      image.alt = "";
      image.draggable = false;
      root.appendChild(image);
      return image;
    });

    root.style.display =
      MAP.id === OPPENAU_AMBIENT_PAIR.mapId ? "" : "none";

    world.appendChild(root);

    return {
      root,
      images,
      visibleIndex: 0,
      x: config.x,
      y: config.y
    };
  }

  function setOppenauAmbientFrame(actor, index) {
    if (!actor || actor.visibleIndex === index) return;

    actor.images.forEach((image, imageIndex) => {
      image.classList.toggle(
        "oppenau-ambient-pair__sprite--visible",
        imageIndex === index
      );
    });

    actor.visibleIndex = index;
  }

  function setOppenauAmbientActorPosition(actor, x, y) {
    if (!actor) return;
    actor.x = x;
    actor.y = y;
    actor.root.style.left = `${x}px`;
    actor.root.style.top = `${y}px`;
  }

  function setOppenauGoatInteractionEnabled(enabled) {
    if (!oppenauAmbientGoat) return;

    oppenauAmbientGoat.root.classList.toggle(
      "oppenau-goat--interactive",
      Boolean(enabled)
    );

    if (!enabled) {
      oppenauGoatPartyHovered = false;
      oppenauAmbientGoat.root.classList.remove("oppenau-goat--hovered");
      game.classList.remove("oppenau-goat-parchment-cursor");
    }
  }

  function updateOppenauGoatHoverVisual(hovered) {
    oppenauGoatPartyHovered = Boolean(hovered);

    if (!oppenauAmbientGoat) return;

    const active =
      hovered &&
      MAP.id === OPPENAU_AMBIENT_PAIR.mapId &&
      oppenauGoatPartyState === "idle";

    oppenauAmbientGoat.root.classList.toggle(
      "oppenau-goat--hovered",
      active
    );
    game.classList.toggle("oppenau-goat-parchment-cursor", active);
  }

  function ensureOppenauGoatPartyAudio() {
    if (oppenauGoatPartyAudio) return oppenauGoatPartyAudio;

    const audio = new Audio(encodeURI(OPPENAU_SUPERBOCK_EVENT.song));
    audio.preload = "auto";
    audio.loop = false;
    audio.volume = 0;

    audio.addEventListener("ended", () => {
      finishOppenauGoatParty(performance.now(), true);
    });

    oppenauGoatPartyAudio = audio;
    return audio;
  }

  function fadeAudioPair(outgoing, incoming, duration, token, onComplete = null) {
    const outgoingStart =
      outgoing && !outgoing.paused ? outgoing.volume : 0;
    const incomingTarget = MAP_MUSIC_VOLUME;
    const startedAt = performance.now();

    function step(now) {
      if (token !== oppenauGoatPartyMusicToken) return;

      const t = Math.min(1, (now - startedAt) / duration);
      const eased = t * t * (3 - 2 * t);

      if (outgoing) {
        outgoing.volume = Math.max(0, outgoingStart * (1 - eased));
      }

      if (incoming) {
        incoming.volume = Math.min(
          incomingTarget,
          incomingTarget * eased
        );
      }

      if (t < 1) {
        requestAnimationFrame(step);
        return;
      }

      if (outgoing) {
        outgoing.pause();
        outgoing.volume = 0;
      }

      if (incoming) incoming.volume = incomingTarget;
      if (typeof onComplete === "function") onComplete();
    }

    requestAnimationFrame(step);
  }

  function startOppenauGoatPartyMusic() {
    const song = ensureOppenauGoatPartyAudio();
    const token = ++oppenauGoatPartyMusicToken;

    oppenauGoatPartyPreviousMapAudio =
      activeMapMusic && !activeMapMusic.paused
        ? activeMapMusic
        : getMapMusicPlayer("oppenau");

    try { song.currentTime = 0; } catch (_) {}
    song.volume = 0;

    song.play()
      .then(() => {
        fadeAudioPair(
          oppenauGoatPartyPreviousMapAudio,
          song,
          OPPENAU_SUPERBOCK_EVENT.musicFadeMs,
          token
        );
      })
      .catch(() => {
        // A genuine click normally unlocks audio. If the browser still rejects
        // playback, reset cleanly instead of leaving the event frozen forever.
        finishOppenauGoatParty(performance.now(), false);
      });
  }

  function restoreOppenauMapMusic() {
    const song = oppenauGoatPartyAudio;
    const token = ++oppenauGoatPartyMusicToken;

    if (song) {
      song.pause();
      song.volume = 0;
      try { song.currentTime = 0; } catch (_) {}
    }

    const mapId = desiredBackgroundMusicId();
    const mapAudio =
      MAP.id === "oppenau" && oppenauGoatPartyPreviousMapAudio
        ? oppenauGoatPartyPreviousMapAudio
        : getMapMusicPlayer(mapId);

    activeMapMusicId = mapId;
    activeMapMusic = mapAudio;
    mapAudio.volume = 0;

    mapAudio.play()
      .then(() => {
        musicUnlocked = true;
        fadeAudioPair(
          null,
          mapAudio,
          MAP_MUSIC_FADE_MS,
          token,
          () => stopAllMapMusicExcept(mapAudio)
        );
      })
      .catch(() => {});

    oppenauGoatPartyPreviousMapAudio = null;
  }

  function resetOppenauGoatPartyVisuals(now = performance.now()) {
    setOppenauAmbientActorPosition(
      oppenauAmbientGoat,
      OPPENAU_AMBIENT_PAIR.goat.x,
      OPPENAU_AMBIENT_PAIR.goat.y
    );
    setOppenauAmbientActorPosition(
      oppenauAmbientMaid,
      OPPENAU_AMBIENT_PAIR.maid.x,
      OPPENAU_AMBIENT_PAIR.maid.y
    );

    if (oppenauAmbientGoat) {
      oppenauAmbientGoat.root.style.opacity = "1";
      oppenauAmbientGoat.root.style.zIndex = "95";
    }
    if (oppenauAmbientMaid) {
      oppenauAmbientMaid.root.style.opacity = "1";
      oppenauAmbientMaid.root.style.zIndex = "95";
    }

    setOppenauAmbientFrame(oppenauAmbientGoat, 0);
    setOppenauAmbientFrame(oppenauAmbientMaid, 0);

    oppenauAmbientPairStartAt = now;
    oppenauGoatPartyRouteIndex = 1;
    oppenauGoatPartyNextWalkFrameAt = 0;
    oppenauGoatPartyWalkFrame = 0;
    oppenauGoatPartyPhaseEndAt = 0;

    setOppenauGoatInteractionEnabled(
      MAP.id === OPPENAU_AMBIENT_PAIR.mapId
    );
  }

  function finishOppenauGoatParty(now, restoreMusic = true) {
    if (oppenauGoatPartyState === "idle") return;

    oppenauGoatPartyState = "idle";
    resetOppenauGoatPartyVisuals(now);

    if (restoreMusic) restoreOppenauMapMusic();
  }

  function beginOppenauGoatParty() {
    if (
      MAP.id !== OPPENAU_AMBIENT_PAIR.mapId ||
      oppenauGoatPartyState !== "idle" ||
      !oppenauAmbientGoat ||
      !oppenauAmbientMaid
    ) {
      return;
    }

    setOppenauGoatInteractionEnabled(false);

    oppenauGoatPartyState = "walking";
    oppenauGoatPartyRouteIndex = 1;
    oppenauGoatPartyWalkFrame = 0;
    oppenauGoatPartyNextWalkFrameAt = 0;

    setOppenauAmbientFrame(oppenauAmbientGoat, 2);
    setOppenauAmbientFrame(oppenauAmbientMaid, 0);
  }

  function updateOppenauGoatPartyDepth() {
    if (!oppenauAmbientGoat) return;

    const x = oppenauAmbientGoat.x;
    const y = oppenauAmbientGoat.y;

    // Same gate principle as player: route passes behind the upper gate body.
    if (
      pointInOppenauRect(x, y, OPPENAU_DECOR.upperGate.depthZone)
    ) {
      oppenauAmbientGoat.root.style.zIndex = "80";
    } else {
      oppenauAmbientGoat.root.style.zIndex = "95";
    }

    // Covered bridge only: same smooth invisibility principle as the player.
    const onCoveredBridge =
      oppenauGoatPartyState === "walking" &&
      oppenauGoatPartyRouteIndex ===
        OPPENAU_SUPERBOCK_EVENT.bridgeEndIndex;

    oppenauAmbientGoat.root.style.opacity =
      onCoveredBridge ? "0" : "1";
  }

  function updateOppenauGoatPartyWalking(deltaSeconds, now) {
    const route = OPPENAU_SUPERBOCK_EVENT.route;
    if (
      !oppenauAmbientGoat ||
      oppenauGoatPartyRouteIndex >= route.length
    ) {
      oppenauGoatPartyState = "meet";
      oppenauGoatPartyPhaseEndAt =
        now + OPPENAU_SUPERBOCK_EVENT.meetDurationMs;

      // Goat = attachment 3.
      setOppenauAmbientFrame(oppenauAmbientGoat, 4);

      // Maid = attachment 4, pre-mirrored at creation.
      setOppenauAmbientFrame(oppenauAmbientMaid, 3);

      oppenauAmbientGoat.root.style.opacity = "1";
      oppenauAmbientGoat.root.style.zIndex = "95";

      startOppenauGoatPartyMusic();
      return;
    }

    const target = route[oppenauGoatPartyRouteIndex];
    const dx = target.x - oppenauAmbientGoat.x;
    const dy = target.y - oppenauAmbientGoat.y;
    const distance = Math.hypot(dx, dy);

    if (distance <= 8) {
      setOppenauAmbientActorPosition(
        oppenauAmbientGoat,
        target.x,
        target.y
      );
      oppenauGoatPartyRouteIndex += 1;
      updateOppenauGoatPartyDepth();
      return;
    }

    const step = Math.min(
      distance,
      OPPENAU_SUPERBOCK_EVENT.walkSpeed * deltaSeconds
    );

    setOppenauAmbientActorPosition(
      oppenauAmbientGoat,
      oppenauAmbientGoat.x + (dx / distance) * step,
      oppenauAmbientGoat.y + (dy / distance) * step
    );

    // Only RIGHT walking art is required by design.
    if (now >= oppenauGoatPartyNextWalkFrameAt) {
      oppenauGoatPartyWalkFrame =
        1 - oppenauGoatPartyWalkFrame;

      setOppenauAmbientFrame(
        oppenauAmbientGoat,
        oppenauGoatPartyWalkFrame === 0 ? 2 : 3
      );

      oppenauGoatPartyNextWalkFrameAt =
        now + OPPENAU_SUPERBOCK_EVENT.walkFrameMs;
    }

    updateOppenauGoatPartyDepth();
  }

  function updateOppenauGoatParty(deltaSeconds, now) {
    if (oppenauGoatPartyState === "idle") return;

    if (MAP.id !== OPPENAU_AMBIENT_PAIR.mapId) {
      // Safe cleanup if the player leaves OPPENAU mid-event.
      finishOppenauGoatParty(now, true);
      return;
    }

    if (oppenauGoatPartyState === "walking") {
      updateOppenauGoatPartyWalking(deltaSeconds, now);
      return;
    }

    if (
      oppenauGoatPartyState === "meet" &&
      now >= oppenauGoatPartyPhaseEndAt
    ) {
      // After the synchronized two-second reaction:
      // maid changes first...
      setOppenauAmbientFrame(oppenauAmbientMaid, 4);

      oppenauGoatPartyState = "maid-dance";
      oppenauGoatPartyPhaseEndAt =
        now + OPPENAU_SUPERBOCK_EVENT.goatDanceDelayMs;
      return;
    }

    if (
      oppenauGoatPartyState === "maid-dance" &&
      now >= oppenauGoatPartyPhaseEndAt
    ) {
      // ...goat follows exactly 0.3 seconds later, mirrored.
      setOppenauAmbientFrame(oppenauAmbientGoat, 5);
      oppenauGoatPartyState = "freeze";
      return;
    }

    // "freeze" intentionally does nothing:
    // both final images remain until the song's native 'ended' event fires.
  }

  function createOppenauAmbientPair() {
    installOppenauAmbientPairStyles();
    preloadOppenauAmbientPairSprites();
    ensureOppenauGoatPartyAudio();

    if (!oppenauAmbientGoat) {
      oppenauAmbientGoat = createOppenauAmbientActor(
        "oppenau-ambient-goat",
        OPPENAU_AMBIENT_PAIR.goat,
        [
          OPPENAU_AMBIENT_PAIR.goat.standard,  // 0
          OPPENAU_AMBIENT_PAIR.goat.alternate, // 1
          OPPENAU_AMBIENT_PAIR.goat.walk1,     // 2
          OPPENAU_AMBIENT_PAIR.goat.walk2,     // 3
          OPPENAU_AMBIENT_PAIR.goat.meet,      // 4
          OPPENAU_AMBIENT_PAIR.goat.dance      // 5
        ]
      );

      oppenauAmbientGoat.root.addEventListener("pointerenter", () => {
        updateOppenauGoatHoverVisual(true);
      });

      oppenauAmbientGoat.root.addEventListener("pointerleave", () => {
        updateOppenauGoatHoverVisual(false);
      });

      oppenauAmbientGoat.root.addEventListener("click", (event) => {
        if (oppenauGoatPartyState !== "idle") return;
        event.preventDefault();
        event.stopPropagation();
        updateOppenauGoatHoverVisual(false);
        beginOppenauGoatParty();
      });
    }

    if (!oppenauAmbientMaid) {
      oppenauAmbientMaid = createOppenauAmbientActor(
        "oppenau-ambient-maid",
        OPPENAU_AMBIENT_PAIR.maid,
        [
          OPPENAU_AMBIENT_PAIR.maid.standard, // 0
          OPPENAU_AMBIENT_PAIR.maid.phase1,   // 1
          OPPENAU_AMBIENT_PAIR.maid.phase2,   // 2
          OPPENAU_AMBIENT_PAIR.maid.meet,     // 3
          OPPENAU_AMBIENT_PAIR.maid.dance     // 4
        ]
      );

      // Requested mirrored reaction frame.
      oppenauAmbientMaid.images[3].style.transform = "scaleX(-1)";
    }

    // Requested mirrored final goat pose.
    oppenauAmbientGoat.images[5].style.transform = "scaleX(-1)";

    if (!oppenauAmbientPairStartAt) {
      oppenauAmbientPairStartAt = performance.now();
    }

    setOppenauGoatInteractionEnabled(
      MAP.id === OPPENAU_AMBIENT_PAIR.mapId
    );
  }

  function updateOppenauAmbientPair(deltaSeconds, now) {
    if (!oppenauAmbientGoat || !oppenauAmbientMaid) return;

    const visible = MAP.id === OPPENAU_AMBIENT_PAIR.mapId;
    oppenauAmbientGoat.root.style.display = visible ? "" : "none";
    oppenauAmbientMaid.root.style.display = visible ? "" : "none";

    if (!visible) {
      updateOppenauGoatHoverVisual(false);
      return;
    }

    // Event owns all frames/positions while running.
    if (oppenauGoatPartyState !== "idle") {
      updateOppenauGoatParty(deltaSeconds, now);
      return;
    }

    setOppenauGoatInteractionEnabled(true);

    const elapsed = now - oppenauAmbientPairStartAt;

    if (elapsed < OPPENAU_AMBIENT_PAIR.initialDelayMs) {
      setOppenauAmbientFrame(oppenauAmbientGoat, 0);
      setOppenauAmbientFrame(oppenauAmbientMaid, 0);
      return;
    }

    const phase =
      (elapsed - OPPENAU_AMBIENT_PAIR.initialDelayMs) %
      OPPENAU_AMBIENT_PAIR.cycleMs;

    if (phase < 3000) {
      setOppenauAmbientFrame(oppenauAmbientGoat, 1);
      setOppenauAmbientFrame(oppenauAmbientMaid, 1);
    } else if (phase < 6000) {
      setOppenauAmbientFrame(oppenauAmbientGoat, 0);
      setOppenauAmbientFrame(oppenauAmbientMaid, 2);
    } else {
      setOppenauAmbientFrame(oppenauAmbientGoat, 0);
      setOppenauAmbientFrame(oppenauAmbientMaid, 0);
    }
  }


  // ------------------------------------------------------------------
  // R161 OPPENAU — MOOSMÄNNLE
  // Two peaceful route walkers following the user's WHITE dotted paths.
  // They spawn beyond the map edge, traverse the marked paths, perform a
  // playful turn/wobble at every GREEN point, then disappear beyond an edge
  // for 0..60 seconds before the next traversal.
  // ------------------------------------------------------------------
  const MOOSMAENNLE_CONFIG = Object.freeze({
    mapId: "oppenau",
    count: 2,
    maxHp: 500,

    // Exactly half player character height (PLAYER.height = 630).
    visualHeight: 315,
    canvasWidth: 480,
    canvasHeight: 340,

    speed: 205,
    frameDuration: 235,
    frameFadeMs: 90,

    greenPauseMin: 2400,
    greenPauseMax: 4300,
    greenTurnStepMs: 270,

    awayMin: 0,
    awayMax: 60000,
    deathFadeMs: 420,

    sprites: Object.freeze({
      side: Object.freeze([
        "assets/animals/moosmaennle/MOOSMAENNLE SIDE 1.webp",
        "assets/animals/moosmaennle/MOOSMAENNLE SIDE 2.webp"
      ]),
      down: Object.freeze([
        "assets/animals/moosmaennle/MOOSMAENNLE DOWN 1.webp",
        "assets/animals/moosmaennle/MOOSMAENNLE DOWN 2.webp"
      ]),
      up: Object.freeze([
        "assets/animals/moosmaennle/MOOSMAENNLE UP 1.webp",
        "assets/animals/moosmaennle/MOOSMAENNLE UP 2.webp"
      ])
    }),

    // WHITE central path. It enters from above the map, visits all three
    // GREEN circles, turns around at the lower-left GREEN circle and retraces
    // the exact same path until it disappears above the map again.
    routeA: Object.freeze([
      Object.freeze({ x: 4916, y: -520, green: false }),
      Object.freeze({ x: 4916, y:  372, green: true  }),
      Object.freeze({ x: 4763, y:  952, green: false }),
      Object.freeze({ x: 4878, y: 1262, green: false }),
      Object.freeze({ x: 5185, y: 1572, green: false }),
      Object.freeze({ x: 5300, y: 1882, green: false }),
      Object.freeze({ x: 5415, y: 2269, green: false }),
      Object.freeze({ x: 5454, y: 2578, green: false }),
      Object.freeze({ x: 5915, y: 2779, green: true  }),
      Object.freeze({ x: 5877, y: 3275, green: false }),
      Object.freeze({ x: 5608, y: 3391, green: false }),
      Object.freeze({ x: 5339, y: 3585, green: false }),
      Object.freeze({ x: 5147, y: 3778, green: true  })
    ]),

    // WHITE right-hand route. Both ends are outside the map. After each trip
    // the next traversal may begin from either end, giving natural variation.
    routeB: Object.freeze([
      Object.freeze({ x: 10410, y: -300, green: false }),
      Object.freeze({ x: 10025, y:  178, green: false }),
      Object.freeze({ x:  9795, y:  565, green: false }),
      Object.freeze({ x:  9564, y:  875, green: false }),
      Object.freeze({ x:  9256, y: 1185, green: false }),
      Object.freeze({ x:  8872, y: 1417, green: false }),
      Object.freeze({ x:  8527, y: 1711, green: true  }),
      Object.freeze({ x:  8335, y: 1882, green: false }),
      Object.freeze({ x:  8181, y: 2269, green: false }),
      Object.freeze({ x:  7989, y: 2578, green: false }),
      Object.freeze({ x:  7797, y: 2810, green: false }),
      Object.freeze({ x:  7605, y: 3042, green: false }),
      Object.freeze({ x:  7451, y: 3275, green: false }),
      Object.freeze({ x:  7336, y: 3468, green: false }),
      Object.freeze({ x:  7413, y: 3662, green: false }),
      Object.freeze({ x:  7720, y: 3894, green: false }),
      Object.freeze({ x:  8104, y: 4126, green: false }),
      Object.freeze({ x:  8527, y: 4552, green: true  }),
      Object.freeze({ x:  8872, y: 4591, green: false }),
      Object.freeze({ x:  9372, y: 4901, green: false }),
      Object.freeze({ x:  9872, y: 5210, green: false }),
      Object.freeze({ x: 10520, y: 5900, green: false })
    ])
  });

  let moosmaennleActors = [];

  function installMoosmaennleStyles() {
    if (document.getElementById("moosmaennleStyles")) return;

    const style = document.createElement("style");
    style.id = "moosmaennleStyles";
    style.textContent = `
      .moosmaennle {
        position: absolute;
        width: ${MOOSMAENNLE_CONFIG.canvasWidth}px;
        height: ${MOOSMAENNLE_CONFIG.canvasHeight}px;
        transform: translate(-50%, -100%);
        transform-origin: 50% 100%;
        pointer-events: none;
        user-select: none;
        z-index: 5;
        will-change: left, top, transform, opacity;
      }

      .moosmaennle__sprite {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center bottom;
        opacity: 0;
        transition: opacity ${MOOSMAENNLE_CONFIG.frameFadeMs}ms linear;
        will-change: opacity, transform;
        pointer-events: none;
      }

      .moosmaennle__sprite--visible {
        opacity: 1;
      }

      .moosmaennle--wobble {
        animation: moosmaennle-wobble 540ms ease-in-out infinite alternate;
      }

      .moosmaennle--dead {
        opacity: 0;
        transition: opacity ${MOOSMAENNLE_CONFIG.deathFadeMs}ms ease;
      }

      @keyframes moosmaennle-wobble {
        0%   { margin-left: -18px; rotate: -4deg; }
        50%  { margin-left:   8px; rotate:  2deg; }
        100% { margin-left:  18px; rotate:  4deg; }
      }
    `;
    document.head.appendChild(style);
  }

  function preloadMoosmaennleSprites() {
    const sources = [
      ...MOOSMAENNLE_CONFIG.sprites.side,
      ...MOOSMAENNLE_CONFIG.sprites.down,
      ...MOOSMAENNLE_CONFIG.sprites.up
    ];
    for (const src of sources) {
      const image = new Image();
      image.decoding = "async";
      image.src = encodeURI(src);
    }
  }

  function moosRouteExpandedA() {
    const outward = MOOSMAENNLE_CONFIG.routeA;
    const back = outward.slice(0, -1).reverse();
    return [...outward, ...back];
  }

  function moosActorRoute(actor) {
    if (actor.routeId === "A") return moosRouteExpandedA();
    const route = MOOSMAENNLE_CONFIG.routeB;
    return actor.reverseRoute ? [...route].reverse() : route;
  }

  function moosSetLayerSprite(actor, src, mirrored) {
    const nextLayer = 1 - actor.visibleLayer;
    const nextImage = actor.images[nextLayer];
    const oldImage = actor.images[actor.visibleLayer];

    nextImage.src = encodeURI(src);
    nextImage.style.transform = mirrored ? "scaleX(-1)" : "scaleX(1)";
    nextImage.classList.add("moosmaennle__sprite--visible");
    oldImage.classList.remove("moosmaennle__sprite--visible");
    actor.visibleLayer = nextLayer;
  }

  function moosFamilyForVelocity(dx, dy) {
    // The user's diagonal rule: meaningful vertical travel uses DOWN/UP artwork.
    if (Math.abs(dy) >= Math.abs(dx) * 0.38) {
      return dy >= 0 ? "down" : "up";
    }
    return "side";
  }

  function moosSetMovementFrame(actor, dx, dy, now, force = false) {
    const family = moosFamilyForVelocity(dx, dy);
    const mirrored = family === "side" && dx < 0;

    if (!force && now < actor.nextFrameAt && actor.family === family && actor.mirrored === mirrored) {
      return;
    }

    if (actor.family !== family || actor.mirrored !== mirrored) {
      actor.frameIndex = 0;
    } else {
      actor.frameIndex = (actor.frameIndex + 1) % 2;
    }

    actor.family = family;
    actor.mirrored = mirrored;
    actor.nextFrameAt = now + MOOSMAENNLE_CONFIG.frameDuration;

    const src = MOOSMAENNLE_CONFIG.sprites[family][actor.frameIndex];
    moosSetLayerSprite(actor, src, mirrored);
  }

  function moosSetTurnFrame(actor, now) {
    // Rotate through right -> down -> left -> up, including the requested
    // mirror variants, while the root smoothly wobbles.
    const sequence = [
      { family: "side", mirrored: false },
      { family: "down", mirrored: false },
      { family: "side", mirrored: true },
      { family: "up", mirrored: false }
    ];

    const pose = sequence[actor.turnPoseIndex % sequence.length];
    actor.turnPoseIndex = (actor.turnPoseIndex + 1) % sequence.length;
    actor.frameIndex = (actor.frameIndex + 1) % 2;
    actor.family = pose.family;
    actor.mirrored = pose.mirrored;
    actor.nextTurnFrameAt = now + MOOSMAENNLE_CONFIG.greenTurnStepMs;

    moosSetLayerSprite(
      actor,
      MOOSMAENNLE_CONFIG.sprites[pose.family][actor.frameIndex],
      pose.mirrored
    );
  }

  function createMoosmaennleActor(index, routeId) {
    const root = document.createElement("div");
    root.className = "moosmaennle";
    root.dataset.moosmaennle = String(index);

    const imgA = document.createElement("img");
    const imgB = document.createElement("img");
    for (const img of [imgA, imgB]) {
      img.className = "moosmaennle__sprite";
      img.alt = "";
      img.draggable = false;
    }

    root.append(imgA, imgB);
    world.appendChild(root);

    const actor = {
      index,
      routeId,
      reverseRoute: false,
      route: null,
      routeIndex: 1,

      x: 0,
      y: 0,
      hp: MOOSMAENNLE_CONFIG.maxHp,
      dead: false,
      away: true,
      ready: true,

      root,
      element: root,
      images: [imgA, imgB],
      visibleLayer: 0,

      family: "down",
      mirrored: false,
      frameIndex: 0,
      nextFrameAt: 0,

      turning: false,
      turnUntil: 0,
      nextTurnFrameAt: 0,
      turnPoseIndex: 0,

      returnAt: performance.now() + Math.random() * 2500
    };

    imgA.src = encodeURI(MOOSMAENNLE_CONFIG.sprites.down[0]);
    imgA.classList.add("moosmaennle__sprite--visible");

    root.style.display = "none";
    return actor;
  }

  function moosBeginTraversal(actor, now) {
    actor.reverseRoute =
      actor.routeId === "B" ? Math.random() < 0.5 : false;

    actor.route = moosActorRoute(actor);
    actor.routeIndex = 1;

    actor.x = actor.route[0].x;
    actor.y = actor.route[0].y;
    actor.hp = MOOSMAENNLE_CONFIG.maxHp;
    actor.dead = false;
    actor.away = false;
    actor.turning = false;
    actor.turnUntil = 0;
    actor.turnPoseIndex = 0;
    actor.frameIndex = 0;
    actor.nextFrameAt = 0;

    actor.root.classList.remove("moosmaennle--dead", "moosmaennle--wobble");
    actor.root.style.opacity = "1";
    actor.root.style.left = `${actor.x}px`;
    actor.root.style.top = `${actor.y}px`;
    actor.root.style.display = MAP.id === MOOSMAENNLE_CONFIG.mapId ? "" : "none";

    const target = actor.route[1];
    moosSetMovementFrame(
      actor,
      target.x - actor.x,
      target.y - actor.y,
      now,
      true
    );
  }

  function moosGoAway(actor, now) {
    actor.away = true;
    actor.turning = false;
    actor.root.classList.remove("moosmaennle--wobble");
    actor.root.style.display = "none";
    actor.returnAt =
      now +
      MOOSMAENNLE_CONFIG.awayMin +
      Math.random() *
        (MOOSMAENNLE_CONFIG.awayMax - MOOSMAENNLE_CONFIG.awayMin);
  }

  function moosStartGreenTurn(actor, now) {
    actor.turning = true;
    actor.turnUntil =
      now +
      MOOSMAENNLE_CONFIG.greenPauseMin +
      Math.random() *
        (MOOSMAENNLE_CONFIG.greenPauseMax - MOOSMAENNLE_CONFIG.greenPauseMin);
    actor.nextTurnFrameAt = now;
    actor.turnPoseIndex = Math.floor(Math.random() * 4);
    actor.root.classList.add("moosmaennle--wobble");
    moosSetTurnFrame(actor, now);
  }

  function killMoosmaennle(actor, now) {
    if (!actor || actor.dead || actor.away) return;
    actor.dead = true;
    actor.hp = 0;
    actor.turning = false;
    actor.root.classList.remove("moosmaennle--wobble");
    actor.root.classList.add("moosmaennle--dead");

    // No invented loot/EXP/death artwork: the supplied live frame simply fades.
    window.setTimeout(() => {
      if (!actor.dead) return;
      moosGoAway(actor, performance.now());
    }, MOOSMAENNLE_CONFIG.deathFadeMs);
  }

  function damageMoosmaennle(actor, amount, critical, direction, now, saustark = false) {
    if (!actor || actor.dead || actor.away || MAP.id !== MOOSMAENNLE_CONFIG.mapId) return;

    actor.hp = Math.max(0, actor.hp - amount);
    createRabbitDamageText(actor, amount, critical, saustark);

    if (actor.hp <= 0) {
      killMoosmaennle(actor, now);
    }
  }

  function resolveMoosmaennleAttackFrame(frame) {
    if (!frame || !frame.hit || MAP.id !== MOOSMAENNLE_CONFIG.mapId) return;

    const direction = rabbitAttackDirection();
    const now = performance.now();

    for (const actor of moosmaennleActors) {
      if (!actor || actor.dead || actor.away || !actor.ready) continue;
      if (!rabbitInsideAttackHitbox(actor, direction)) continue;

      damageMoosmaennle(
        actor,
        frame.damage || 20,
        Boolean(frame.critical),
        direction,
        now,
        Boolean(frame.saustark)
      );
    }
  }

  function createMoosmaennleSystem() {
    installMoosmaennleStyles();
    preloadMoosmaennleSprites();

    if (moosmaennleActors.length) return;
    moosmaennleActors = [
      createMoosmaennleActor(0, "A"),
      createMoosmaennleActor(1, "B")
    ];
  }

  function updateMoosmaennle(deltaSeconds, now) {
    for (const actor of moosmaennleActors) {
      actor.root.style.display =
        MAP.id === MOOSMAENNLE_CONFIG.mapId && !actor.away
          ? ""
          : "none";

      if (MAP.id !== MOOSMAENNLE_CONFIG.mapId) continue;
      if (actor.dead) continue;

      if (actor.away) {
        if (now >= actor.returnAt) moosBeginTraversal(actor, now);
        continue;
      }

      if (!actor.route || actor.routeIndex >= actor.route.length) {
        moosGoAway(actor, now);
        continue;
      }

      if (actor.turning) {
        if (now >= actor.nextTurnFrameAt) moosSetTurnFrame(actor, now);

        if (now >= actor.turnUntil) {
          actor.turning = false;
          actor.root.classList.remove("moosmaennle--wobble");
          actor.nextFrameAt = 0;
        } else {
          continue;
        }
      }

      const target = actor.route[actor.routeIndex];
      const dx = target.x - actor.x;
      const dy = target.y - actor.y;
      const distance = Math.hypot(dx, dy);

      if (distance <= 8) {
        actor.x = target.x;
        actor.y = target.y;
        actor.root.style.left = `${actor.x}px`;
        actor.root.style.top = `${actor.y}px`;

        const reachedGreen = Boolean(target.green);
        actor.routeIndex += 1;

        if (actor.routeIndex >= actor.route.length) {
          moosGoAway(actor, now);
          continue;
        }

        if (reachedGreen) {
          moosStartGreenTurn(actor, now);
          continue;
        }
      }

      const next = actor.route[actor.routeIndex];
      const vx = next.x - actor.x;
      const vy = next.y - actor.y;
      const len = Math.hypot(vx, vy) || 1;
      const step = Math.min(
        len,
        MOOSMAENNLE_CONFIG.speed * deltaSeconds
      );

      actor.x += (vx / len) * step;
      actor.y += (vy / len) * step;

      actor.root.style.left = `${actor.x}px`;
      actor.root.style.top = `${actor.y}px`;

      moosSetMovementFrame(actor, vx, vy, now);
    }
  }

  // ------------------------------------------------------------------
  // R156 MAP 8 OPPENAU — BURG
  // Exact supplied transparent castle, mirrored to match the reference composite.
  // LOWER half = hard foot collision / player foreground.
  // UPPER third = fully walkable / foreground overlay occludes the player.
  // ------------------------------------------------------------------
  const OPPENAU_CASTLE = Object.freeze({
    id: "oppenau-burg",
    src: "assets/buildings/OPPENAU_BURG.webp",
    left: 470,
    top: 90,
    width: 2920,
    height: 1947,
    groundedFromY: 0.0,
    occluderToY: 0.0
  });

  let oppenauCastleBaseElement = null;
  let oppenauCastleForegroundElement = null;
  let oppenauCastleAlphaMask = null;

  function prepareOppenauCastleAlphaMask(image) {
    if (!image || !image.naturalWidth || !image.naturalHeight) return;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(image, 0, 0);
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const alpha = new Uint8Array(canvas.width * canvas.height);
      for (let i = 3, j = 0; i < pixels.length; i += 4, j += 1) alpha[j] = pixels[i];
      oppenauCastleAlphaMask = { width: canvas.width, height: canvas.height, alpha };
    } catch (error) {
      oppenauCastleAlphaMask = null;
      console.warn("OPPENAU BURG alpha collision unavailable:", error);
    }
  }

  function createOppenauCastle() {
    // R157: if a stale/half-created layer exists, rebuild the pair instead of
    // silently returning with an invisible castle.
    const existingBase = document.getElementById("oppenau-burg-base");
    const existingFront = document.getElementById("oppenau-burg-upper-foreground");

    if (existingBase && existingFront) {
      oppenauCastleBaseElement = existingBase;
      oppenauCastleForegroundElement = existingFront;
      return;
    }

    if (existingBase) existingBase.remove();
    if (existingFront) existingFront.remove();
    oppenauCastleBaseElement = null;
    oppenauCastleForegroundElement = null;

    const makeLayer = (id, zIndex, clipPath = "none") => {
      const image = document.createElement("img");
      image.id = id;
      image.src = encodeURI(OPPENAU_CASTLE.src);
      image.alt = "";
      image.draggable = false;
      image.style.position = "absolute";
      image.style.left = `${OPPENAU_CASTLE.left}px`;
      image.style.top = `${OPPENAU_CASTLE.top}px`;
      image.style.width = `${OPPENAU_CASTLE.width}px`;
      image.style.height = `${OPPENAU_CASTLE.height}px`;
      image.style.objectFit = "fill";
      image.style.maxWidth = "none";
      image.style.maxHeight = "none";
      image.style.pointerEvents = "none";
      image.style.userSelect = "none";
      image.style.webkitUserDrag = "none";
      image.style.transformOrigin = "50% 50%";
      image.style.transform = "scaleX(-1)";
      image.style.zIndex = String(zIndex);
      image.style.clipPath = clipPath;
      image.style.opacity = "1";
      image.style.visibility = MAP.id === "oppenau" ? "visible" : "hidden";
      image.style.display = MAP.id === "oppenau" ? "block" : "none";

      image.addEventListener("error", () => {
        console.error("OPPENAU BURG asset failed to load:", image.src);
      });

      world.appendChild(image);
      return image;
    };

    // COMPLETE castle below the player.
    oppenauCastleBaseElement = makeLayer("oppenau-burg-base", 6);

    // R158: castle is now entirely BELOW the normal player.
    // The only behind-castle exception is the BLUE passage, handled by player z-index.
    oppenauCastleForegroundElement = makeLayer(
      "oppenau-burg-upper-foreground",
      4,
      "none"
    );

    oppenauCastleBaseElement.addEventListener("load", () => {
      prepareOppenauCastleAlphaMask(oppenauCastleBaseElement);
      setOppenauCastleVisibility(MAP.id === "oppenau");
    }, { once: true });

    if (oppenauCastleBaseElement.complete && oppenauCastleBaseElement.naturalWidth > 0) {
      prepareOppenauCastleAlphaMask(oppenauCastleBaseElement);
    }
  }

  function setOppenauCastleVisibility(visible) {
    // R157: visibility calls are allowed to heal a missing DOM layer.
    if (!oppenauCastleBaseElement || !oppenauCastleForegroundElement) {
      createOppenauCastle();
    }

    for (const element of [oppenauCastleBaseElement, oppenauCastleForegroundElement]) {
      if (!element) continue;
      element.style.display = visible ? "block" : "none";
      element.style.visibility = visible ? "visible" : "hidden";
      element.style.opacity = visible ? "1" : "0";
    }
  }

  function isOppenauCastleBlockedFootPoint(x, y) {
    if (MAP.id !== "oppenau") return false;

    // BLUE marked castle corner is the ONLY walkable castle section.
    if (worldPointInPolygon(x, y, OPPENAU_TERRAIN.castleBluePassage)) {
      return false;
    }

    const c = OPPENAU_CASTLE;
    if (
      x < c.left || x > c.left + c.width ||
      y < c.top || y > c.top + c.height
    ) return false;

    if (!oppenauCastleAlphaMask) return false;

    const localX = (x - c.left) / c.width;
    const localY = (y - c.top) / c.height;

    // CSS mirrors the artwork, therefore the alpha lookup mirrors X too.
    const px = Math.max(
      0,
      Math.min(
        oppenauCastleAlphaMask.width - 1,
        Math.round((1 - localX) * (oppenauCastleAlphaMask.width - 1))
      )
    );
    const py = Math.max(
      0,
      Math.min(
        oppenauCastleAlphaMask.height - 1,
        Math.round(localY * (oppenauCastleAlphaMask.height - 1))
      )
    );

    // COMPLETE visible castle silhouette blocks the player's FOOT anchor.
    return (
      oppenauCastleAlphaMask.alpha[
        py * oppenauCastleAlphaMask.width + px
      ] >= 28
    );
  }

  function ramsbachPathFor(id) {
    if (id === "bridge") return RAMSBACH_TERRAIN.bridgePath;
    return null;
  }

  function ramsbachPointTouchesRedWall(x, y) {
    const radius = RAMSBACH_TERRAIN.redWallRadius;

    // R139: this one short seam MUST remain hard even inside the blue passage.
    const guard = RAMSBACH_TERRAIN.postBridgeGuardWall;
    for (let i = 0; i < guard.length - 1; i += 1) {
      const a = guard[i];
      const b = guard[i + 1];
      if (boarPointToSegmentDistance(x, y, a[0], a[1], b[0], b[1]) <= radius) {
        return true;
      }
    }

    // Existing R137 exception remains unchanged for every OTHER red wall:
    // the intended bridge -> plateau corridor stays freely traversable.
    if (worldPointInPolygon(x, y, RAMSBACH_TERRAIN.castleBluePassage)) return false;

    for (const polyline of RAMSBACH_TERRAIN.redWalls) {
      for (let i = 0; i < polyline.length - 1; i += 1) {
        const a = polyline[i];
        const b = polyline[i + 1];
        if (boarPointToSegmentDistance(x, y, a[0], a[1], b[0], b[1]) <= radius) {
          return true;
        }
      }
    }
    return false;
  }

  function isRamsbachCastleBlockedFootPoint(x, y) {
    if (MAP.id !== "ramsbach") return false;

    // R137: BLUE marked strip is the intended bridge -> plateau access corridor.
    // It must stay walkable even where it overlaps the castle artwork.
    if (worldPointInPolygon(x, y, RAMSBACH_TERRAIN.castleBluePassage)) return false;

    // PINK: no hitbox at all — player can walk freely behind the motif.
    if (worldPointInPolygon(x, y, RAMSBACH_TERRAIN.castleBehindZone)) return false;

    // Only the requested YELLOW/front area owns the castle collision.
    if (!worldPointInPolygon(x, y, RAMSBACH_TERRAIN.castleFrontZone)) return false;

    const c = RAMSBACH_CASTLE;
    if (
      x < c.left || x > c.left + c.width ||
      y < c.top || y > c.top + c.height
    ) return false;

    // No oversized fallback wall while the PNG alpha mask is loading.
    if (!ramsbachCastleAlphaMask) return false;

    const localX01 = (x - c.left) / c.width;
    const localY01 = (y - c.top) / c.height;
    const px = Math.max(
      0,
      Math.min(
        ramsbachCastleAlphaMask.width - 1,
        Math.round(localX01 * (ramsbachCastleAlphaMask.width - 1))
      )
    );
    const py = Math.max(
      0,
      Math.min(
        ramsbachCastleAlphaMask.height - 1,
        Math.round(localY01 * (ramsbachCastleAlphaMask.height - 1))
      )
    );

    return ramsbachCastleAlphaMask.alpha[
      py * ramsbachCastleAlphaMask.width + px
    ] >= 32;
  }

  function isRamsbachBlockedFootPoint(x, y) {
    if (MAP.id !== "ramsbach") return false;

    // RED lines are absolute terrain limits. Snap movement itself does not call
    // canMoveFootTo(), so bridge/ramp travel remains perfectly smooth.
    if (ramsbachPointTouchesRedWall(x, y)) return true;

    const onBridge = activeRamsbachSnap === "bridge";
    if (!onBridge) {
      const b = RAMSBACH_TERRAIN.bridgeLockedZone;
      if (x >= b.x1 && x <= b.x2 && y >= b.y1 && y <= b.y2) return true;
    }

    if (isRamsbachCastleBlockedFootPoint(x, y)) return true;

    return false;
  }

  function tryEngageRamsbachSnap(dx, dy) {
    if (MAP.id !== "ramsbach" || activeRamsbachSnap) return false;
    if (performance.now() < ramsbachSnapReleaseUntil) return false;

    const horizontalDirection = dx > 0 ? 1 : dx < 0 ? -1 : 0;
    const verticalDirection = dy > 0 ? 1 : dy < 0 ? -1 : 0;

    // Existing WHITE river bridge: A / D, unchanged.
    if (horizontalDirection) {
      const bridge = RAMSBACH_TERRAIN.bridgePath;
      const closest = closestPointOnBridgePath(playerX, playerY, bridge);
      if (closest && closest.distance <= RAMSBACH_TERRAIN.bridgeSnapDistance) {
        const leavingLeft = closest.progress <= 0.035 && horizontalDirection < 0;
        const leavingRight = closest.progress >= 0.965 && horizontalDirection > 0;
        if (!leavingLeft && !leavingRight) {
          activeRamsbachSnap = "bridge";
          ramsbachSnapDistance = closest.pathDistance;
          ramsbachSnapping = true;
          return true;
        }
      }
    }

    return false;
  }

  function moveAlongRamsbachSnap(dx, dy, deltaSeconds) {
    if (!activeRamsbachSnap) return false;

    const path = ramsbachPathFor(activeRamsbachSnap);
    if (!path) {
      activeRamsbachSnap = null;
      ramsbachSnapping = false;
      return false;
    }

    const anchor = pointAtBridgeDistance(path, ramsbachSnapDistance);
    if (ramsbachSnapping) {
      const ddx = anchor.x - playerX;
      const ddy = anchor.y - playerY;
      const distance = Math.hypot(ddx, ddy);
      if (distance > 5) {
        const pull = Math.min(1, 10 * deltaSeconds);
        playerX += ddx * pull;
        playerY += ddy * pull;
        return true;
      }
      playerX = anchor.x;
      playerY = anchor.y;
      ramsbachSnapping = false;
    }

    const metrics = getPathMetrics(path);
    let direction = 0;

    if (activeRamsbachSnap === "bridge") {
      direction = dx > 0 ? 1 : dx < 0 ? -1 : 0;
    }

    if (!direction) return true;

    const nextDistance = Math.max(
      0,
      Math.min(
        metrics.total,
        ramsbachSnapDistance + direction * currentPlayerMoveSpeed() * deltaSeconds
      )
    );

    const point = pointAtBridgeDistance(path, nextDistance);
    ramsbachSnapDistance = nextDistance;
    playerX = point.x;
    playerY = point.y;

    const atStart = nextDistance <= 0.001 && direction < 0;
    const atEnd = nextDistance >= metrics.total - 0.001 && direction > 0;

    if (activeRamsbachSnap === "bridge") {
      if (atStart || atEnd) {
        activeRamsbachSnap = null;
        ramsbachSnapping = false;
        ramsbachSnapReleaseUntil = performance.now() + 420;
        playerX = atStart
          ? RAMSBACH_TERRAIN.bridgeLockedZone.x1 - 55
          : RAMSBACH_TERRAIN.bridgeLockedZone.x2 + 55;
      }
      return true;
    }

    return true;
  }
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
    const speed=Math.hypot(iceVelocityX,iceVelocityY); const maxIceSpeed=ICE_PHYSICS.maxSpeed*(equippedKitItem?WHITE_STAG_KIT.movementSpeedMultiplier:1); if(speed>maxIceSpeed){ const s=maxIceSpeed/speed; iceVelocityX*=s; iceVelocityY*=s; }
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

    const inWinterbachOedsbachEastExit =
      MAP.id === "winterbach-ranglehen" &&
      y >= MAP_EXIT_CONFIG.winterbachOedsbachEast.y1 &&
      y <= MAP_EXIT_CONFIG.winterbachOedsbachEast.y2;

    const inOppenauKuhbachEastExit =
      MAP.id === "oppenau" &&
      y >= MAP_EXIT_CONFIG.oppenauKuhbachEast.y1 &&
      y <= MAP_EXIT_CONFIG.oppenauKuhbachEast.y2;

    const inKuhbachOppenauWestExit =
      MAP.id === "kuhbach" &&
      y >= MAP_EXIT_CONFIG.kuhbachOppenauWest.y1 &&
      y <= MAP_EXIT_CONFIG.kuhbachOppenauWest.y2;

    if (x < halfW) {
      const westExitAllowed =
        inKuhbachOppenauWestExit &&
        x >= MAP_EXIT_CONFIG.kuhbachOppenauWest.leaveX - 80;
      if (!westExitAllowed) return false;
    }
    if (x > MAP.width - halfW) {
      const eastExitAllowed =
        (inWinterbachOedsbachEastExit &&
          x <= MAP_EXIT_CONFIG.winterbachOedsbachEast.leaveX + 80) ||
        (inOppenauKuhbachEastExit &&
          x <= MAP_EXIT_CONFIG.oppenauKuhbachEast.leaveX + 80);
      if (!eastExitAllowed) return false;
    }

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
      (
        (
          x >= MAP_EXIT_CONFIG.winterbachSouth.x1 &&
          x <= MAP_EXIT_CONFIG.winterbachSouth.x2
        ) ||
        (
          x >= MAP_EXIT_CONFIG.winterbachOriginalSouth.x1 &&
          x <= MAP_EXIT_CONFIG.winterbachOriginalSouth.x2
        )
      );

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

    const inHubackerRamsbachNorthExit =
      MAP.id === "hubacker" &&
      x >= MAP_EXIT_CONFIG.hubackerRamsbachNorth.x1 &&
      x <= MAP_EXIT_CONFIG.hubackerRamsbachNorth.x2;

    const inRamsbachHubackerSouthExit =
      MAP.id === "ramsbach" &&
      x >= MAP_EXIT_CONFIG.ramsbachHubackerSouth.x1 &&
      x <= MAP_EXIT_CONFIG.ramsbachHubackerSouth.x2;

    const inRamsbachOppenauNorthExit =
      MAP.id === "ramsbach" &&
      x >= MAP_EXIT_CONFIG.ramsbachOppenauNorth.x1 &&
      x <= MAP_EXIT_CONFIG.ramsbachOppenauNorth.x2;

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
        (inLautenbachNorthExit && y >= lautenbachNorthLeaveFloor) ||
        (inHubackerRamsbachNorthExit && y >= MAP_EXIT_CONFIG.hubackerRamsbachNorth.leaveY - 80) ||
        (inRamsbachOppenauNorthExit && y >= MAP_EXIT_CONFIG.ramsbachOppenauNorth.leaveY - 80);

      if (!allowedNorth) return false;
    }

    const inOedsbachWinterbachSouthExit =
      MAP.id === "oedsbach" &&
      x >= MAP_EXIT_CONFIG.oedsbachWinterbachSouth.x1 &&
      x <= MAP_EXIT_CONFIG.oedsbachWinterbachSouth.x2;

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

      const ramsbachHubackerSouthAllowed =
        inRamsbachHubackerSouthExit &&
        y <= MAP.height + MAP_EXIT_CONFIG.ramsbachHubackerSouth.leavePadding + 80;

      const oberkirchStadiumSouthAllowed =
        inOberkirchStadiumSouthExit &&
        y <= MAP.height + MAP_EXIT_CONFIG.oberkirchStadiumSouth.leavePadding + 80;

      const stadiumOberkirchSouthAllowed =
        inStadiumOberkirchSouthExit &&
        y <= MAP.height + MAP_EXIT_CONFIG.stadiumOberkirchSouth.leavePadding + 80;

      const oedsbachWinterbachSouthAllowed =
        inOedsbachWinterbachSouthExit &&
        y <= MAP.height + MAP_EXIT_CONFIG.oedsbachWinterbachSouth.leavePadding + 80;

      if (
        !winterbachSouthAllowed &&
        !lautenbachSouthAllowed &&
        !hubackerSouthAllowed &&
        !ramsbachHubackerSouthAllowed &&
        !oberkirchStadiumSouthAllowed &&
        !stadiumOberkirchSouthAllowed &&
        !oedsbachWinterbachSouthAllowed
      ) {
        return false;
      }
    }

    // R168 OPPENAU -> KUHBACH: once the foot anchor is on the actual
    // lower-right exit road, the decorative/terrain black border must not
    // stop the player before the established east-edge transition threshold.
    // This is isolated to OPPENAU and only to the final edge corridor.
    if (inOppenauKuhbachEastExit && x >= 9450) return true;

    // Existing river/bridge collision remains unchanged.
    if (isRiverBlockedFootPoint(x, y)) return false;

    // R21 MAP 2: red terrain is hard-blocked for the player's FOOT anchor.
    if (isWinterbachBlockedFootPoint(x, y)) return false;

    // R28 MAP 3: every RED marked Lautenbach region is hard-blocked.
    if (isLautenbachBlockedFootPoint(x, y)) return false;

    // R40 MAP 4: RED river + both PURPLE regions + locked bridge gap.
    if (isHubackerBlockedFootPoint(x, y)) return false;

    // R97 MAP 6: three RED reference regions are hard-blocked.
    if (isOedsbachBlockedFootPoint(x, y)) return false;

    // R165 MAP 6: REDNECK FREDNECK hut — alpha collision only on the middle body.
    if (isOedsbachRedneckHutBlockedFootPoint(x, y)) return false;

    // R169 KUHBACH: fixed foot hitbox for Florianus' hut building only.
    if (isKuhbachFlorianusHutBlockedFootPoint(x, y)) return false;

    // R174 KUHBACH painted reference: red filled terrain + red fence line.
    if (isKuhbachReferenceBlockedFootPoint(x, y)) return false;

    // R122 SAFE RAMSBACH COLLISION ISOLATION:
    // Ramsbach terrain/locked-footprint code must NEVER participate on another map.
    // If the new Ramsbach collision itself throws, keep the player-control frame alive
    // instead of aborting updatePlayer() after the walking animation was already set.
    if (MAP.id === "ramsbach") {
      try {
        if (isRamsbachBlockedFootPoint(x, y)) return false;
      } catch (ramsbachCollisionError) {
        console.error("R122 RAMSBACH COLLISION RECOVERY:", ramsbachCollisionError);
      }
    }


    // R158 OPPENAU: every RED painted area is hard player-foot collision.
    if (isOppenauTerrainBlockedFootPoint(x, y)) return false;

    // R159 OPPENAU: both inserted gates and the moss rock use precise
    // visible-alpha foot collision. Only each central gate arch remains walkable.
    if (isOppenauDecorBlockedFootPoint(x, y)) return false;

    // R158 OPPENAU: complete visible castle blocks feet except BLUE passage.
    if (isOppenauCastleBlockedFootPoint(x, y)) return false;

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
    const step = horizontalDirection * currentPlayerMoveSpeed() * deltaSeconds;
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

    if (MAP.id !== "ramsbach" && activeRamsbachSnap) {
      activeRamsbachSnap = null;
      ramsbachSnapping = false;
    }

    if (MAP.id !== "oppenau" && activeOppenauBridgeSnap) {
      activeOppenauBridgeSnap = null;
    }

    // R158 MAP 8: both WHITE bridge lines are forced A/D snap routes.
    // A/D alone works; W+A, W+D, S+A and S+D work identically.
    if (
      MAP.id === "oppenau" &&
      (activeOppenauBridgeSnap || tryEngageOppenauBridgeSnap(dx, dy))
    ) {
      moveAlongOppenauBridgeSnap(dx, dy, deltaSeconds);
      clampPlayer();
      return;
    }

    // R124 MAP 7: ONLY the river bridge uses A/D snap. All red/blue terrain boundaries are hard collision.
    if (MAP.id === "ramsbach" && (activeRamsbachSnap || tryEngageRamsbachSnap(dx, dy))) {
      moveAlongRamsbachSnap(dx, dy, deltaSeconds);
      clampPlayer();
      return;
    }

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

    // R174 KUHBACH green hillside:
    // horizontal travel naturally follows the painted slope.
    // A alone => up-left, D alone => down-right.
    if (playerInsideKuhbachHillSlope() && dx !== 0) {
      dy += dx * KUHBACH_TERRAIN.hillSlopeBias;
    }

    const length = Math.hypot(dx, dy) || 1;
    const nx = dx / length;
    const ny = dy / length;
    const amount = currentPlayerMoveSpeed() * deltaSeconds;

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

    let targetOpacity = playerInsideCoveredBridgeInterior() ? 0 : 1;

    // R159 OPPENAU adds its gate/covered-bridge fade without touching the
    // established OBERKIRCH covered-bridge behaviour.
    if (MAP.id === "oppenau") {
      targetOpacity = Math.min(targetOpacity, currentOppenauPlayerOpacity());
    }

    playerEl.style.opacity = String(
      Math.max(0, Math.min(1, targetOpacity))
    );
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
    // R175: hide/show creek before any map-specific early return.
    updateKuhbachCreekEffectVisibility();
    if (!playerEl) return;

    // R135: a dead player is ground scenery. All animal actor layers begin above
    // this value (rabbits 4, wolves/boars 5, bears 5+), so animals visibly pass
    // in front of the corpse. Revive automatically restores the normal map depth
    // on the next frame because playerDead becomes false.
    if (playerDead) {
      playerEl.style.zIndex = "2";
      return;
    }

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

    if (MAP.id === "ramsbach") {
      if (playerInRamsbachCastleBehindZone()) {
        // PINK remains exactly as before.
        playerEl.style.zIndex = "5";
      } else if (playerInRamsbachCastleFrontZone()) {
        // YELLOW remains exactly as before: player in front of the castle.
        playerEl.style.zIndex = "120";
      } else {
        playerEl.style.zIndex = "100";
      }
      return;
    }

    if (MAP.id === "oppenau") {
      // R159 depth priority:
      // 1) BLUE castle corner -> behind castle.
      // 2) RED gate passages -> behind gate while crossing.
      // 3) everywhere else -> normal foreground.
      if (playerInOppenauCastleBluePassage()) {
        playerEl.style.zIndex = "5";
      } else if (playerInOppenauGateDepthZone()) {
        playerEl.style.zIndex = "80";
      } else {
        playerEl.style.zIndex = "100";
      }
      return;
    }

    if (MAP.id === "oedsbach") {
      updateOedsbachRedneckSceneVisibility();
      // WHITE reference strip: player is behind the hut. Everywhere else,
      // including the PURPLE lower strip, the player stays in foreground.
      playerEl.style.zIndex = playerBehindOedsbachRedneckHut() ? "5" : "100";
      return;
    }

    if (MAP.id === "kuhbach") {
      updateKuhbachFlorianusSceneVisibility();
      playerEl.style.zIndex = "100";
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


  // ------------------------------------------------------------------
  // R103 — SPLIT PLAYER HUD
  // Main status/quickbar is pinned flush to the lower-left screen corner.
  // EXP shields are a separate transparent asset pinned flush lower-right.
  // Both are campaign-only and hidden in RENCHTALSTADION.
  // ------------------------------------------------------------------
  const PLAYER_HUD = Object.freeze({
    mainImage: "assets/ui/hud/PLAYER HUD MAIN.png",
    expImage: "assets/ui/hud/PLAYER HUD EXP SHIELDS.png"
  });

  let playerHud = null;

  // ------------------------------------------------------------------
  // R141 — CENTRAL PLAYER EXP / LEVEL SYSTEM
  // EXP is awarded ONLY when the golden orb physically reaches the player.
  // Four HUD shields represent the four quarters of the CURRENT level.
  // ------------------------------------------------------------------
  const PLAYER_EXP_CONFIG = Object.freeze({
    maxLevel: 10,
    mobExp: Object.freeze({
      rabbit: 0.5,
      mole: 5,
      boar: 30,
      wolf: 75,
      bear: 500
    }),
    toNextLevel: Object.freeze({
      1: 100,
      2: 150,
      3: 200,
      4: 300,
      5: 500,
      6: 720,
      7: 1000,
      8: 1400,
      9: 2000
    }),
    orb: Object.freeze({
      collectRadius: 92,
      hoverMs: 240,
      startSpeed: 420,
      acceleration: 880,
      maxSpeed: 1850,
      wobbleSpeed: 245
    })
  });

  let playerExp = 0;
  let playerExpOrbs = [];
  let playerExpHudFills = [];
  let playerExpHudAnimationQueue = [];
  let playerExpHudAnimating = false;
  let playerLevelTitleHud = null;

  function cleanHalfExp(value) {
    return Math.round((Number(value) || 0) * 2) / 2;
  }

  function playerExpNeeded(level = playerLevel) {
    return PLAYER_EXP_CONFIG.toNextLevel[level] || 0;
  }

  function playerExpProgress() {
    if (playerLevel >= PLAYER_EXP_CONFIG.maxLevel) return 1;
    const needed = playerExpNeeded();
    if (!needed) return 0;
    return Math.max(0, Math.min(1, playerExp / needed));
  }

  function renderPlayerExpHudProgress(progress, immediate = false) {
    const safe = Math.max(0, Math.min(1, Number(progress) || 0));
    const scaled = safe * 4;

    playerExpHudFills.forEach((fill, index) => {
      const local = Math.max(0, Math.min(1, scaled - index));
      if (immediate) {
        const oldTransition = fill.style.transition;
        fill.style.transition = "none";
        fill.style.height = `${local * 100}%`;
        void fill.offsetHeight;
        fill.style.transition = oldTransition;
      } else {
        fill.style.height = `${local * 100}%`;
      }
    });
  }

  function processPlayerExpHudAnimationQueue() {
    if (playerExpHudAnimating || !playerExpHudAnimationQueue.length) return;
    playerExpHudAnimating = true;

    const next = playerExpHudAnimationQueue.shift();
    renderPlayerExpHudProgress(next, false);

    window.setTimeout(() => {
      playerExpHudAnimating = false;
      processPlayerExpHudAnimationQueue();
    }, 500);
  }

  function queuePlayerExpHudProgress(progress) {
    playerExpHudAnimationQueue.push(Math.max(0, Math.min(1, progress)));
    processPlayerExpHudAnimationQueue();
  }

  function playerRankTitle(level = playerLevel) {
    if (level >= 10) return "WAFFENKNECHT";
    if (level >= 5) return "GEFOLGSMANN";
    return "KNECHT";
  }

  function updatePlayerLevelTitleHud() {
    if (!playerLevelTitleHud) return;
    playerLevelTitleHud.textContent = `LV ${playerLevel} · ${playerRankTitle(playerLevel)}`;
  }

  function grantPlayerExp(amount) {
    let remaining = cleanHalfExp(amount);
    if (remaining <= 0) return;

    if (playerLevel >= PLAYER_EXP_CONFIG.maxLevel) {
      playerLevel = PLAYER_EXP_CONFIG.maxLevel;
      playerExp = 0;
      queuePlayerExpHudProgress(1);
      updatePlayerLevelTitleHud();
      return;
    }

    // Each crossed level first visually completes all four shields, then resets
    // them for the next level. Overflow EXP is never lost.
    while (remaining > 0 && playerLevel < PLAYER_EXP_CONFIG.maxLevel) {
      const needed = playerExpNeeded(playerLevel);
      if (!needed) break;

      const room = cleanHalfExp(needed - playerExp);

      if (remaining >= room) {
        playerExp = needed;
        queuePlayerExpHudProgress(1);
        remaining = cleanHalfExp(remaining - room);
        playerLevel += 1;

        if (playerLevel >= PLAYER_EXP_CONFIG.maxLevel) {
          playerLevel = PLAYER_EXP_CONFIG.maxLevel;
          playerExp = 0;
          queuePlayerExpHudProgress(1);
          remaining = 0;
          break;
        }

        playerExp = 0;
        queuePlayerExpHudProgress(0);
      } else {
        playerExp = cleanHalfExp(playerExp + remaining);
        remaining = 0;
        queuePlayerExpHudProgress(playerExpProgress());
      }
    }

    updatePlayerLevelTitleHud();
  }

  function createPlayerExpHudFill(root, image) {
    if (!root || playerExpHudFills.length) return;

    const layer = document.createElement("div");
    layer.className = "player-exp-shields-fill-layer";

    // Four independent shield interiors. The clip is intentionally conservative:
    // gold can never bleed outside the painted bronze shield borders.
    const lefts = [1.2, 25.5, 49.8, 74.1];

    playerExpHudFills = lefts.map((left, index) => {
      const slot = document.createElement("div");
      slot.className = "player-exp-shield-slot";
      slot.style.left = `${left}%`;
      slot.dataset.expShield = String(index + 1);

      const fill = document.createElement("div");
      fill.className = "player-exp-shield-fill";
      fill.style.height = "0%";

      slot.appendChild(fill);
      layer.appendChild(slot);
      return fill;
    });

    root.insertBefore(layer, image);
    image.classList.add("player-exp-shields-frame");

    const levelTitle = document.createElement("div");
    levelTitle.className = "player-exp-level-title";
    root.appendChild(levelTitle);
    playerLevelTitleHud = levelTitle;

    renderPlayerExpHudProgress(playerExpProgress(), true);
    updatePlayerLevelTitleHud();
  }

  function installPlayerExpStyles() {
    if (document.getElementById("playerExpStyles")) return;

    const style = document.createElement("style");
    style.id = "playerExpStyles";
    style.textContent = `
      .player-exp-shields-fill-layer {
        position:absolute;
        inset:0;
        z-index:0;
        overflow:hidden;
        pointer-events:none;
      }

      #playerHudExp .player-exp-shields-frame {
        position:relative;
        z-index:2;
      }

      .player-exp-level-title {
        position:absolute;
        z-index:4;
        left:50%;
        bottom:calc(100% + 3px);
        transform:translateX(-50%);
        width:max-content;
        max-width:150%;
        white-space:nowrap;
        pointer-events:none;
        user-select:none;
        color:#e4b447;
        font-family:"Old English Text MT", "Lucida Blackletter", "UnifrakturCook", Georgia, serif;
        font-size:clamp(11px, 1.15vw, 17px);
        font-weight:900;
        line-height:1;
        letter-spacing:.5px;
        text-align:center;
        text-shadow:
          0 1px 2px #000,
          0 0 3px rgba(255,203,76,.48);
      }

      .player-exp-shield-slot {
        position:absolute;
        bottom:5.8%;
        width:23.1%;
        height:88.8%;
        overflow:hidden;
        clip-path:polygon(
          50% 1%,
          89% 13%,
          91% 40%,
          83% 66%,
          67% 84%,
          50% 98%,
          33% 84%,
          17% 66%,
          9% 40%,
          11% 13%
        );
      }

      .player-exp-shield-fill {
        position:absolute;
        z-index:1;
        left:0;
        right:0;
        bottom:0;
        height:0%;
        background:
          radial-gradient(circle at 48% 70%, rgba(255,255,155,.98) 0 8%, rgba(255,229,35,.98) 35%, rgba(230,158,0,.98) 100%);
        box-shadow:
          inset 0 0 9px rgba(255,255,190,.88),
          0 0 8px rgba(255,205,0,.65);
        transition:height 440ms cubic-bezier(.22,.76,.18,1);
        will-change:height;
      }

      .player-exp-orb {
        position:absolute;
        z-index:155;
        width:34px;
        height:34px;
        margin-left:-17px;
        margin-top:-17px;
        border-radius:50%;
        pointer-events:none;
        background:
          radial-gradient(circle at 38% 32%,
            #fffbd0 0 12%,
            #fff16a 24%,
            #ffc400 52%,
            #d27a00 78%,
            rgba(145,71,0,.15) 100%);
        box-shadow:
          0 0 7px rgba(255,255,190,.98),
          0 0 18px rgba(255,215,30,.92),
          0 0 36px rgba(255,153,0,.58);
        filter:brightness(1.08);
        will-change:left,top,transform,opacity;
      }

      .player-exp-orb::after {
        content:"";
        position:absolute;
        inset:7px;
        border-radius:50%;
        background:rgba(255,255,226,.80);
        filter:blur(2px);
      }

      .player-exp-puff {
        position:absolute;
        z-index:160;
        width:46px;
        height:46px;
        margin-left:-23px;
        margin-top:-23px;
        border-radius:50%;
        pointer-events:none;
        background:radial-gradient(circle,
          rgba(255,255,220,.96) 0 8%,
          rgba(255,226,55,.88) 24%,
          rgba(255,165,0,.54) 48%,
          rgba(255,145,0,0) 72%);
        box-shadow:
          0 0 18px rgba(255,230,80,.90),
          0 0 42px rgba(255,170,0,.62);
        animation:playerExpPuff 420ms ease-out forwards;
      }

      @keyframes playerExpPuff {
        0%   { transform:scale(.38); opacity:1; }
        58%  { transform:scale(1.55); opacity:.92; }
        100% { transform:scale(2.15); opacity:0; }
      }
    `;
    document.head.appendChild(style);
  }

  function createPlayerExpPuff(x, y) {
    const puff = document.createElement("div");
    puff.className = "player-exp-puff";
    puff.style.left = `${x}px`;
    puff.style.top = `${y}px`;
    world.appendChild(puff);
    window.setTimeout(() => puff.remove(), 470);
  }

  function spawnPlayerExpOrb(mobType, x, y, mapId) {
    const expValue = PLAYER_EXP_CONFIG.mobExp[mobType];
    if (!Number.isFinite(expValue) || expValue <= 0) return false;

    // Never create a cross-map ghost orb.
    if (!MAP || mapId !== MAP.id) return false;

    const element = document.createElement("div");
    element.className = "player-exp-orb";
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    world.appendChild(element);

    const now = performance.now();
    playerExpOrbs.push({
      element,
      mapId,
      mobType,
      exp: expValue,
      x,
      y: y - 52,
      bornAt: now,
      seed: Math.random() * Math.PI * 2,
      collected: false
    });

    element.style.left = `${x}px`;
    element.style.top = `${y - 52}px`;
    return true;
  }

  function collectPlayerExpOrb(orb) {
    if (!orb || orb.collected) return;
    orb.collected = true;

    createPlayerExpPuff(playerX, playerY - 150);
    grantPlayerExp(orb.exp);

    orb.element.remove();
  }

  function updatePlayerExpOrbs(deltaSeconds, now) {
    if (!playerExpOrbs.length) return;

    const survivors = [];

    for (const orb of playerExpOrbs) {
      if (!orb || orb.collected || !orb.element.isConnected) continue;

      // An orb can never follow the player across a map transition.
      if (!MAP || orb.mapId !== MAP.id) {
        orb.element.remove();
        continue;
      }

      const ageMs = now - orb.bornAt;
      const targetX = playerX;
      const targetY = playerY - 145;
      const dx = targetX - orb.x;
      const dy = targetY - orb.y;
      const distance = Math.hypot(dx, dy);

      if (distance <= PLAYER_EXP_CONFIG.orb.collectRadius) {
        collectPlayerExpOrb(orb);
        continue;
      }

      if (ageMs < PLAYER_EXP_CONFIG.orb.hoverMs) {
        // Tiny magical lift before magnetic attraction begins.
        orb.y -= 46 * deltaSeconds;
        orb.x += Math.sin(ageMs * 0.020 + orb.seed) * 22 * deltaSeconds;
      } else {
        const len = distance || 1;
        const nx = dx / len;
        const ny = dy / len;

        const flightAge = Math.max(0, (ageMs - PLAYER_EXP_CONFIG.orb.hoverMs) / 1000);
        const speed = Math.min(
          PLAYER_EXP_CONFIG.orb.maxSpeed,
          PLAYER_EXP_CONFIG.orb.startSpeed +
            flightAge * PLAYER_EXP_CONFIG.orb.acceleration
        );

        // Side-to-side magnetic wobble. It becomes calmer near the player so
        // the orb always lands smoothly instead of orbiting the target.
        const nearFactor = Math.max(0.08, Math.min(1, distance / 780));
        const wobble =
          Math.sin(ageMs * 0.0105 + orb.seed) *
          PLAYER_EXP_CONFIG.orb.wobbleSpeed *
          nearFactor;

        const px = -ny;
        const py = nx;

        orb.x += (nx * speed + px * wobble) * deltaSeconds;
        orb.y += (ny * speed + py * wobble) * deltaSeconds;
      }

      const pulse = 1 + Math.sin(ageMs * 0.016 + orb.seed) * 0.12;
      orb.element.style.left = `${orb.x}px`;
      orb.element.style.top = `${orb.y}px`;
      orb.element.style.transform = `scale(${pulse})`;

      survivors.push(orb);
    }

    playerExpOrbs = survivors;
  }

  function installPlayerHudStyles() {
    if (document.getElementById("playerHudStyles")) return;

    const style = document.createElement("style");
    style.id = "playerHudStyles";
    style.textContent = `
      .player-hud-piece {
        position: fixed;
        z-index: 2147483000;
        bottom: 0;
        pointer-events: none;
        user-select: none;
        -webkit-user-drag: none;
        margin: 0;
        padding: 0;
        line-height: 0;
        opacity: 1;
        visibility: visible;
        transition: opacity 160ms ease, visibility 160ms ease;
        filter: drop-shadow(0 3px 4px rgba(0,0,0,.22));
      }

      #playerHudMain {
        left: 0;
        width: min(40vw, 640px);
      }

      #playerHudExp {
        right: 0;
        width: min(15.4vw, 252px);
      }

      .player-hud-piece.player-hud--hidden {
        display: none !important;
        opacity: 0;
        visibility: hidden;
      }

      .player-hp-fill {
        position: absolute;
        z-index: 4;

        /* R129: exact INNER black HP slot from the supplied HUD screenshot.
           Nothing overlaps the bronze/gold frame anymore. */
        left: 17.9%;
        top: 27.0%;
        width: 17.8%;
        height: 10.4%;

        box-sizing: border-box;
        border-radius: 5px;
        overflow: hidden;
        transform-origin: 0 50%;
        background: linear-gradient(180deg, #ff4b42 0%, #b40000 55%, #640000 100%);
        box-shadow: inset 0 1px 1px rgba(255,255,255,.28);
        pointer-events: none;
      }

      .player-hp-text {
        position: absolute;
        z-index: 5;
        left: 17.9%;
        top: 27.0%;
        width: 17.8%;
        height: 10.4%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        text-align: center;
        color: #fff;
        font: 700 11px Georgia, serif;
        line-height: 1;
        text-shadow: 0 1px 2px #000, 0 0 2px #000;
        pointer-events: none;
      }

      .player-hud-piece > img {
        display: block;
        width: 100%;
        height: auto;
        pointer-events: none;
        user-select: none;
        -webkit-user-drag: none;
        margin: 0;
        padding: 0;
      }

      /* R105: invisible hit zones exactly over the painted 1–9 quickbar cells. */
      .player-quickslot-layer {
        position: absolute;
        inset: 0;
        z-index: 6;
        pointer-events: none;
      }

      .player-quickslot {
        position: absolute;
        box-sizing: border-box;
        pointer-events: auto;
        background: transparent;
        border: 0;
        margin: 0;
        padding: 0;
        overflow: visible;
      }

      .player-quickslot--dragover {
        filter:
          drop-shadow(0 0 4px rgba(255,244,190,.95))
          drop-shadow(0 0 8px rgba(224,168,59,.72));
      }

      .player-quickslot__icon {
        position: absolute;
        z-index: 2;
        left: 50%;
        top: 54%;
        width: 92%;
        height: 92%;
        transform: translate(-50%, -50%);
        object-fit: contain;
        object-position: 50% 50%;
        pointer-events: none;
        user-select: none;
        -webkit-user-drag: none;
        filter: drop-shadow(0 2px 2px rgba(0,0,0,.78));
      }

      .player-quickslot__quantity {
        position: absolute;
        z-index: 8;
        right: 3%;
        bottom: 4%;
        min-width: 24%;
        color: #ffffff;
        font: 900 clamp(10px, 1.35vh, 16px)/1 Georgia, "Times New Roman", serif;
        text-align: right;
        pointer-events: none;
        text-shadow:
          -1px -1px 0 #000,
           1px -1px 0 #000,
          -1px  1px 0 #000,
           1px  1px 0 #000,
           0 2px 3px #000;
      }

      /* R106 CALIPH LAMP COOLDOWN:
         grayscale base stays visible while a second full-color copy is revealed
         clockwise from 12 o'clock until the 15-second cooldown is complete. */
      .player-quickslot__icon--caliph-gray {
        filter:
          grayscale(1)
          brightness(.55)
          contrast(1.12)
          drop-shadow(0 2px 2px rgba(0,0,0,.78));
      }

      .player-quickslot__cooldown-color {
        position: absolute;
        z-index: 3;
        left: 50%;
        top: 54%;
        width: 92%;
        height: 92%;
        transform: translate(-50%, -50%);
        object-fit: contain;
        object-position: 50% 50%;
        pointer-events: none;
        user-select: none;
        -webkit-user-drag: none;
        filter: drop-shadow(0 2px 2px rgba(0,0,0,.78));
        --caliph-cooldown-angle: 0deg;
        -webkit-mask-image:
          conic-gradient(from 0deg at 50% 50%,
            #000 0deg var(--caliph-cooldown-angle),
            transparent var(--caliph-cooldown-angle) 360deg);
        mask-image:
          conic-gradient(from 0deg at 50% 50%,
            #000 0deg var(--caliph-cooldown-angle),
            transparent var(--caliph-cooldown-angle) 360deg);
      }

      /* R107 — successful Caliph summon: fire ballista in world space. */
      .caliph-ballista-action {
        position: absolute;
        z-index: 24;
        transform: translate(-50%, -68%);
        pointer-events: none;
        user-select: none;
        opacity: 0;
        transition: opacity 120ms ease;
        will-change: left, top, opacity;
      }

      .caliph-ballista-action--visible {
        opacity: 1;
      }

      .caliph-ballista-action__sprite {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: 50% 50%;
        transform: scaleX(var(--caliph-ballista-facing, 1));
        transform-origin: 50% 50%;
        pointer-events: none;
        user-select: none;
        -webkit-user-drag: none;
        filter: drop-shadow(0 18px 10px rgba(0,0,0,.40));
      }

      .caliph-ballista-bolt {
        position: absolute;
        z-index: 26;
        pointer-events: none;
        user-select: none;
        transform-origin: 50% 50%;
        will-change: left, top, transform;
      }

      .caliph-ballista-bolt__sprite {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: 50% 50%;
        pointer-events: none;
        user-select: none;
        -webkit-user-drag: none;
        filter:
          drop-shadow(0 0 12px rgba(255,74,0,.90))
          drop-shadow(0 5px 5px rgba(0,0,0,.42));
      }


      /* --------------------------------------------------------------
         R130 PLAYER DEATH / REVIVE OVERLAY
         Uses the same dark translucent visual language as stadium UI.
         -------------------------------------------------------------- */
      #playerDeathUI {
        position: fixed;
        inset: 0;
        z-index: 2147483400;
        display: grid;
        place-items: center;
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        transition: opacity 220ms ease, visibility 220ms ease;
      }

      #playerDeathUI.player-death-ui--visible {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      .player-death-ui__panel {
        width: min(560px, 86vw);
        box-sizing: border-box;
        padding: 24px 42px 30px;
        border: 1px solid rgba(198,151,60,.62);
        background: rgba(4,4,4,.84);
        box-shadow:
          0 20px 70px rgba(0,0,0,.78),
          inset 0 0 30px rgba(158,108,33,.10);
        backdrop-filter: blur(3px);
        text-align: center;
      }

      .player-death-ui__skull {
        display: block;
        width: min(135px, 30vw);
        height: 132px;
        object-fit: contain;
        margin: 0 auto 10px;
        pointer-events: none;
        user-select: none;
        -webkit-user-drag: none;
        filter: drop-shadow(0 8px 8px rgba(0,0,0,.72));
      }

      .player-death-ui__revive {
        display: block;
        width: 100%;
        box-sizing: border-box;
        appearance: none;
        border: 0;
        outline: none;
        margin: 0 auto;
        padding: 8px 8px 5px;
        background: transparent;
        color: #ffffff;
        cursor: pointer;
        font-family: "Old English Text MT", "Lucida Blackletter", "UnifrakturCook", Georgia, serif;
        font-size: clamp(25px, 2.65vw, 38px);
        font-weight: 900;
        line-height: 1.05;
        letter-spacing: 1px;
        white-space: nowrap;
        text-align: center;
        text-shadow: 0 2px 2px #000;
        transition:
          transform 150ms ease,
          color 150ms ease,
          text-shadow 150ms ease,
          filter 150ms ease;
      }

      .player-death-ui__revive:hover,
      .player-death-ui__revive:focus-visible {
        color: #ffffff;
        transform: scale(1.07);
        text-shadow:
          0 2px 2px #000,
          0 0 7px rgba(255,255,255,.95),
          0 0 18px rgba(255,255,255,.82),
          0 0 34px rgba(255,255,255,.48);
        filter: brightness(1.28);
      }

      /* Three-second respawn shimmer. Applied to the sprite only so the
         player's world transform / foot anchor can never be disturbed. */
      .player--respawn-glow #playerSprite {
        animation: playerRespawnGlow 360ms ease-in-out 8 alternate;
      }

      @keyframes playerRespawnGlow {
        from {
          opacity: .50;
          filter: brightness(1.05) drop-shadow(0 0 2px rgba(255,255,255,.25));
        }
        to {
          opacity: 1;
          filter:
            brightness(1.75)
            drop-shadow(0 0 8px rgba(255,255,255,.92))
            drop-shadow(0 0 22px rgba(255,255,255,.62));
        }
      }

      @media (max-width: 1100px) {
        #playerHudMain { width: min(43vw, 560px); }
        #playerHudExp  { width: min(16.8vw, 210px); }
      }

      @media (max-height: 760px) {
        #playerHudMain { width: min(37vw, 570px); }
        #playerHudExp  { width: min(14vw, 224px); }
      }
    `;

    document.head.appendChild(style);
  }

  function createPlayerHudPiece(id, src, sideClass) {
    const root = document.createElement("div");
    root.id = id;
    root.className = `player-hud-piece ${sideClass}`;
    root.setAttribute("aria-hidden", "true");

    const image = document.createElement("img");
    image.src = encodeURI(src);
    image.alt = "";
    image.draggable = false;
    root.appendChild(image);
    document.body.appendChild(root);
    return { root, image };
  }


  // ------------------------------------------------------------------
  // R105 QUICKBAR 1–9
  // The HUD art is 1254 x 231 px after the approved crop.
  // These nine rectangles sit over the BLACK item cells only.
  // ------------------------------------------------------------------
  const QUICKBAR_SOURCE = Object.freeze({
    width: 1254,
    height: 231,
    slots: Object.freeze([
      Object.freeze({ x1: 480, y1: 99, x2: 552, y2: 200 }),
      Object.freeze({ x1: 557, y1: 99, x2: 629, y2: 200 }),
      Object.freeze({ x1: 634, y1: 99, x2: 706, y2: 200 }),
      Object.freeze({ x1: 711, y1: 99, x2: 783, y2: 200 }),
      Object.freeze({ x1: 788, y1: 99, x2: 860, y2: 200 }),
      Object.freeze({ x1: 865, y1: 99, x2: 937, y2: 200 }),
      Object.freeze({ x1: 942, y1: 99, x2: 1014, y2: 200 }),
      Object.freeze({ x1: 1019, y1: 99, x2: 1091, y2: 200 }),
      Object.freeze({ x1: 1096, y1: 99, x2: 1168, y2: 200 })
    ])
  });

  const quickSlotState = {
    assignments: new Array(9).fill(null),
    layer: null,
    slots: []
  };

  // ------------------------------------------------------------------
  // R106 CALIPH LAMP — FIRST ULTIMATE STAGE
  // Exactly 50/50 on every READY activation.
  // Success = random supplied file 1–6.
  // Failure = random supplied file 7–10.
  // After either result the lamp is unavailable for exactly 15 seconds.
  // ------------------------------------------------------------------
  const CALIPH_LAMP_ULTIMATE = Object.freeze({
    cooldownMs: 15000,
    successChance: 0.5,
    successSounds: Object.freeze([
      "assets/audio/skills/caliph-lamp/CALIPH SUCCESS 1.mp3",
      "assets/audio/skills/caliph-lamp/CALIPH SUCCESS 2.mp3",
      "assets/audio/skills/caliph-lamp/CALIPH SUCCESS 3.mp3",
      "assets/audio/skills/caliph-lamp/CALIPH SUCCESS 4.mp3",
      "assets/audio/skills/caliph-lamp/CALIPH SUCCESS 5.mp3",
      "assets/audio/skills/caliph-lamp/CALIPH SUCCESS 6.mp3"
    ]),
    failureSounds: Object.freeze([
      "assets/audio/skills/caliph-lamp/CALIPH FAILURE 1.mp3",
      "assets/audio/skills/caliph-lamp/CALIPH FAILURE 2.mp3",
      "assets/audio/skills/caliph-lamp/CALIPH FAILURE 3.mp3",
      "assets/audio/skills/caliph-lamp/CALIPH FAILURE 4.mp3"
    ]),
    successAction1: Object.freeze({
      sprite: "assets/skills/caliph/CALIPH FIRE BALLISTA.png",
      boltSprite: "assets/skills/caliph/CALIPH FIRE BALLISTA BOLT.png",
      crankSound: "assets/audio/skills/caliph-lamp/BALLISTA CRANK.mp3",
      launchSound: "assets/audio/skills/caliph-lamp/BALLISTA LAUNCH.mp3",
      width: 1120,
      height: 1120,
      boltWidth: 720,
      boltHeight: 260,
      boltHitRadius: 215,
      projectileMsMin: 180,
      projectileMsMax: 360
    })
  });

  const caliphLampUltimateState = {
    readyAt: 0,
    cooldownFrame: 0,
    activeAudio: null
  };

  const caliphLampUltimatePreloads = [];

  function preloadCaliphLampUltimateSounds() {
    if (caliphLampUltimatePreloads.length) return;

    const all = [
      ...CALIPH_LAMP_ULTIMATE.successSounds,
      ...CALIPH_LAMP_ULTIMATE.failureSounds,
      CALIPH_LAMP_ULTIMATE.successAction1.crankSound,
      CALIPH_LAMP_ULTIMATE.successAction1.launchSound
    ];

    const actionImages = [
      CALIPH_LAMP_ULTIMATE.successAction1.sprite,
      CALIPH_LAMP_ULTIMATE.successAction1.boltSprite
    ];
    for (const src of actionImages) {
      const image = new Image();
      image.decoding = "async";
      image.src = encodeURI(src);
      if (typeof image.decode === "function") image.decode().catch(() => {});
    }

    for (const src of all) {
      const audio = new Audio(encodeURI(src));
      audio.preload = "auto";
      audio.load();
      caliphLampUltimatePreloads.push(audio);
    }
  }

  function playCaliphLampUltimateSound(src) {
    if (!src) return;

    const previous = caliphLampUltimateState.activeAudio;
    if (previous) {
      try {
        previous.pause();
        previous.currentTime = 0;
      } catch (_) {}
    }

    const audio = new Audio(encodeURI(src));
    audio.preload = "auto";
    audio.volume = 1.0;
    caliphLampUltimateState.activeAudio = audio;

    const cleanup = () => {
      if (caliphLampUltimateState.activeAudio === audio) {
        caliphLampUltimateState.activeAudio = null;
      }
    };

    audio.addEventListener("ended", cleanup, { once: true });
    audio.addEventListener("error", cleanup, { once: true });
    audio.play().catch(cleanup);
  }

  function caliphLampCooldownProgress(now = performance.now()) {
    const readyAt = Number(caliphLampUltimateState.readyAt) || 0;
    if (!readyAt || now >= readyAt) return 1;

    const remaining = Math.max(0, readyAt - now);
    return Math.max(
      0,
      Math.min(1, 1 - (remaining / CALIPH_LAMP_ULTIMATE.cooldownMs))
    );
  }

  function caliphLampReady(now = performance.now()) {
    return caliphLampCooldownProgress(now) >= 1;
  }

  function updateCaliphLampCooldownVisual(now = performance.now()) {
    const lampIndex = findQuickSlotForItem("caliph-lamp");
    if (lampIndex < 0) return;

    const slot = quickSlotState.slots[lampIndex];
    if (!slot) return;

    const progress = caliphLampCooldownProgress(now);
    const gray = slot.querySelector(".player-quickslot__icon--caliph-gray");
    const color = slot.querySelector(".player-quickslot__cooldown-color");

    if (progress >= 1) {
      if (gray) gray.classList.remove("player-quickslot__icon--caliph-gray");
      if (color) color.style.display = "none";
      return;
    }

    if (gray) gray.classList.add("player-quickslot__icon--caliph-gray");
    if (color) {
      color.style.display = "";
      color.style.setProperty(
        "--caliph-cooldown-angle",
        `${Math.max(0, Math.min(360, progress * 360))}deg`
      );
    }
  }

  function runCaliphLampCooldownVisual() {
    if (caliphLampUltimateState.cooldownFrame) return;

    const tick = (now) => {
      updateCaliphLampCooldownVisual(now);

      if (!caliphLampReady(now)) {
        caliphLampUltimateState.cooldownFrame = requestAnimationFrame(tick);
        return;
      }

      caliphLampUltimateState.cooldownFrame = 0;
      updateCaliphLampCooldownVisual(now);
    };

    caliphLampUltimateState.cooldownFrame = requestAnimationFrame(tick);
  }

  function quickbarPercentX(px) {
    return (px / QUICKBAR_SOURCE.width) * 100;
  }

  function quickbarPercentY(px) {
    return (px / QUICKBAR_SOURCE.height) * 100;
  }

  function findQuickSlotForItem(itemId) {
    return quickSlotState.assignments.findIndex(
      (entry) => entry && entry.itemId === itemId
    );
  }

  function firstFreeQuickSlot() {
    return quickSlotState.assignments.findIndex((entry) => !entry);
  }

  function quickSlotBindingFromInventory(itemId) {
    const found = findInventoryStack(itemId);
    if (!found || !found.stack || found.stack.type !== "quickslot") return null;
    return {
      itemId: found.stack.id,
      icon: found.stack.icon || ""
    };
  }

  function quickSlotInventoryQuantity(itemId) {
    const found = findInventoryStack(itemId);
    if (!found || !found.stack) return 0;
    return Math.max(0, Number(found.stack.quantity) || 0);
  }

  function bindInventoryQuickItemToSlot(itemId, targetIndex) {
    const index = Number(targetIndex);
    if (!Number.isInteger(index) || index < 0 || index >= quickSlotState.assignments.length) {
      return false;
    }

    const binding = quickSlotBindingFromInventory(itemId);
    if (!binding) return false;

    const existingIndex = findQuickSlotForItem(itemId);

    // Dropping onto its existing slot changes nothing.
    if (existingIndex === index) return true;

    // Never overwrite another quickbar assignment.
    if (quickSlotState.assignments[index]) return false;

    // Same inventory item may exist in only ONE quickbar slot.
    // Moving the binding never removes the real item from inventory.
    if (existingIndex >= 0) quickSlotState.assignments[existingIndex] = null;
    quickSlotState.assignments[index] = binding;

    renderQuickSlots();
    return true;
  }

  function unbindQuickSlot(index) {
    const safe = Number(index);
    if (!Number.isInteger(safe) || safe < 0 || safe >= quickSlotState.assignments.length) {
      return false;
    }
    if (!quickSlotState.assignments[safe]) return false;

    quickSlotState.assignments[safe] = null;
    renderQuickSlots();
    return true;
  }

  function toggleInventoryQuickItem(itemId) {
    const existingIndex = findQuickSlotForItem(itemId);

    // EXACT requested reverse operation: right click the inventory lamp again
    // and its quickbar binding disappears; the inventory item itself never moved.
    if (existingIndex >= 0) {
      return unbindQuickSlot(existingIndex);
    }

    const free = firstFreeQuickSlot();
    if (free < 0) return false;
    return bindInventoryQuickItemToSlot(itemId, free);
  }

  function renderQuickSlots() {
    for (let index = 0; index < quickSlotState.slots.length; index += 1) {
      const slot = quickSlotState.slots[index];
      if (!slot) continue;

      slot.replaceChildren();
      slot.classList.remove("player-quickslot--dragover");

      const binding = quickSlotState.assignments[index];
      slot.draggable = Boolean(binding);
      if (!binding || !binding.icon) continue;

      const icon = document.createElement("img");
      icon.className = "player-quickslot__icon";
      icon.src = encodeURI(binding.icon);
      icon.alt = "";
      icon.draggable = false;
      slot.appendChild(icon);

      if (HEALTH_CONSUMABLE_BY_ID[binding.itemId]) {
        const quantity = document.createElement("span");
        quantity.className = "player-quickslot__quantity";
        quantity.textContent = String(quickSlotInventoryQuantity(binding.itemId));
        slot.appendChild(quantity);
      }

      if (binding.itemId === "caliph-lamp") {
        const progress = caliphLampCooldownProgress();

        if (progress < 1) {
          icon.classList.add("player-quickslot__icon--caliph-gray");

          const color = document.createElement("img");
          color.className = "player-quickslot__cooldown-color";
          color.src = encodeURI(binding.icon);
          color.alt = "";
          color.draggable = false;
          color.style.setProperty(
            "--caliph-cooldown-angle",
            `${Math.max(0, Math.min(360, progress * 360))}deg`
          );
          slot.appendChild(color);
        }
      }
    }

    updateCaliphLampCooldownVisual();
  }

  function createPlayerQuickSlots(mainHudRoot) {
    if (!mainHudRoot || quickSlotState.layer) return;

    const layer = document.createElement("div");
    layer.className = "player-quickslot-layer";
    layer.setAttribute("aria-label", "Schnellzugriff 1 bis 9");

    quickSlotState.slots = QUICKBAR_SOURCE.slots.map((rect, index) => {
      const slot = document.createElement("div");
      slot.className = "player-quickslot";
      slot.dataset.quickSlotIndex = String(index);
      slot.setAttribute("aria-label", `Schnellzugriff ${index + 1}`);

      slot.style.left = `${quickbarPercentX(rect.x1)}%`;
      slot.style.top = `${quickbarPercentY(rect.y1)}%`;
      slot.style.width = `${quickbarPercentX(rect.x2 - rect.x1)}%`;
      slot.style.height = `${quickbarPercentY(rect.y2 - rect.y1)}%`;

      slot.addEventListener("dragover", (event) => {
        if (!inventoryState.open && !quickSlotState.assignments[index]) return;
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
        slot.classList.add("player-quickslot--dragover");
      });

      slot.addEventListener("dragleave", () => {
        slot.classList.remove("player-quickslot--dragover");
      });

      slot.addEventListener("drop", (event) => {
        event.preventDefault();
        slot.classList.remove("player-quickslot--dragover");
        if (!event.dataTransfer) return;

        try {
          const payload = JSON.parse(event.dataTransfer.getData("text/plain") || "{}");

          if (payload.kind === "inventory-quickslot-item") {
            // Binding only: the source item REMAINS in the same inventory slot.
            bindInventoryQuickItemToSlot(payload.itemId, index);
          } else if (payload.kind === "quickslot-item") {
            const from = Number(payload.quickSlotIndex);
            const binding = quickSlotState.assignments[from];
            if (!binding) return;
            if (quickSlotState.assignments[index] && index !== from) return;
            if (from !== index) {
              quickSlotState.assignments[from] = null;
              quickSlotState.assignments[index] = binding;
              renderQuickSlots();
            }
          }
        } catch (_) {}
      });

      slot.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        // Reverse operation: remove ONLY the quickbar binding.
        // The actual lamp remains untouched in inventory.
        unbindQuickSlot(index);
      });

      slot.addEventListener("dragstart", (event) => {
        const binding = quickSlotState.assignments[index];
        if (!binding || !event.dataTransfer) {
          event.preventDefault();
          return;
        }

        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", JSON.stringify({
          kind: "quickslot-item",
          itemId: binding.itemId,
          quickSlotIndex: index
        }));
      });

      layer.appendChild(slot);
      return slot;
    });

    mainHudRoot.appendChild(layer);
    quickSlotState.layer = layer;
    renderQuickSlots();
  }


  // ------------------------------------------------------------------
  // R107 SUCCESS ACTION 1 — FIRE BALLISTA
  // ------------------------------------------------------------------
  function caliphCurrentLivingMobs() {
    const mobs = [];

    for (const actor of rabbitActors) {
      const mapId = actor.zone.mapId || "oberkirch-zentrum";
      if (mapId !== MAP.id || actor.dead || actor.away || actor.ready === false) continue;
      mobs.push({
        kind: "rabbit", actor, x: actor.x, y: actor.y, radius: 175,
        kill: (now) => killRabbit(actor, now)
      });
    }

    for (const actor of wolfActors) {
      if (actor.mapId !== MAP.id || actor.dead || actor.away || actor.ready === false) continue;
      mobs.push({
        kind: "wolf", actor, x: actor.x, y: actor.y, radius: 270,
        kill: (now) => killWolf(actor, now)
      });
    }

    for (const actor of boarActors) {
      const mapId = actor.zone.mapId || BOAR_CONFIG.mapId;
      if (mapId !== MAP.id || actor.dead || actor.away || actor.ready === false) continue;
      mobs.push({
        kind: "boar", actor, x: actor.x, y: actor.y, radius: 285,
        kill: (now) => killBoar(actor, now)
      });
    }

    if (
      moleEvent &&
      (moleEvent.mapId || "oberkirch-zentrum") === MAP.id &&
      moleEvent.phase === "exposed" &&
      !moleEvent.dead
    ) {
      mobs.push({
        kind: "mole", actor: moleEvent, x: moleEvent.x, y: moleEvent.y, radius: 135,
        kill: (now) => killMole(now)
      });
    }

    return mobs;
  }

  function caliphNearestLivingMob() {
    let nearest = null;
    let nearestDistance = Infinity;
    for (const mob of caliphCurrentLivingMobs()) {
      const distance = Math.hypot(mob.x - playerX, mob.y - playerY);
      if (distance < nearestDistance) {
        nearest = mob;
        nearestDistance = distance;
      }
    }
    return nearest;
  }

  function caliphRefreshMobPosition(mob) {
    if (!mob || !mob.actor) return mob;
    if (Number.isFinite(mob.actor.x)) mob.x = mob.actor.x;
    if (Number.isFinite(mob.actor.y)) mob.y = mob.actor.y;
    return mob;
  }

  function caliphSegmentProjection(startX, startY, endX, endY, px, py) {
    const dx = endX - startX;
    const dy = endY - startY;
    const lengthSq = dx * dx + dy * dy;
    if (lengthSq <= 0.0001) {
      return { t: 0, distance: Math.hypot(px - startX, py - startY) };
    }
    const rawT = ((px - startX) * dx + (py - startY) * dy) / lengthSq;
    const t = Math.max(0, Math.min(1, rawT));
    const cx = startX + dx * t;
    const cy = startY + dy * t;
    return { t, distance: Math.hypot(px - cx, py - cy) };
  }

  function caliphBallistaVictims(startX, startY, targetX, targetY, guaranteedTarget) {
    const hits = [];
    const seen = new Set();

    for (const mob of caliphCurrentLivingMobs()) {
      caliphRefreshMobPosition(mob);
      const projection = caliphSegmentProjection(
        startX, startY, targetX, targetY, mob.x, mob.y
      );
      const threshold =
        CALIPH_LAMP_ULTIMATE.successAction1.boltHitRadius + (mob.radius || 0);

      if (projection.distance <= threshold) {
        hits.push({ mob, t: projection.t });
        seen.add(mob.actor);
      }
    }

    if (guaranteedTarget && guaranteedTarget.actor && !seen.has(guaranteedTarget.actor)) {
      caliphRefreshMobPosition(guaranteedTarget);
      hits.push({ mob: guaranteedTarget, t: 1 });
    }

    hits.sort((a, b) => a.t - b.t);
    return hits;
  }

  function caliphPlayActionAudio(src, onEnded = null) {
    const previous = caliphLampUltimateState.activeAudio;
    if (previous) {
      try {
        previous.pause();
        previous.currentTime = 0;
      } catch (_) {}
    }

    const audio = new Audio(encodeURI(src));
    audio.preload = "auto";
    audio.volume = 1.0;
    caliphLampUltimateState.activeAudio = audio;

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      if (caliphLampUltimateState.activeAudio === audio) {
        caliphLampUltimateState.activeAudio = null;
      }
      if (typeof onEnded === "function") onEnded();
    };

    audio.addEventListener("ended", finish, { once: true });
    audio.addEventListener("error", finish, { once: true });
    audio.play().catch(finish);
    return audio;
  }

  function caliphCreateBallista(target) {
    const action = CALIPH_LAMP_ULTIMATE.successAction1;
    caliphRefreshMobPosition(target);

    const targetIsLeft = target ? target.x < playerX : lastHorizontalFacing === "left";
    const facing = targetIsLeft ? -1 : 1;

    const x = Math.max(520, Math.min(MAP.width - 520, playerX - facing * 470));
    const y = Math.max(760, Math.min(MAP.height - 120, playerY + 105));

    const root = document.createElement("div");
    root.className = "caliph-ballista-action";
    root.style.left = `${x}px`;
    root.style.top = `${y}px`;
    root.style.width = `${action.width}px`;
    root.style.height = `${action.height}px`;
    root.style.setProperty("--caliph-ballista-facing", String(facing));

    const image = document.createElement("img");
    image.className = "caliph-ballista-action__sprite";
    image.src = encodeURI(action.sprite);
    image.alt = "";
    image.draggable = false;

    root.appendChild(image);
    world.appendChild(root);
    requestAnimationFrame(() => root.classList.add("caliph-ballista-action--visible"));

    return { root, x, y, facing };
  }

  function caliphBallistaMuzzle(ballista) {
    return {
      x: ballista.x + ballista.facing * 405,
      y: ballista.y - 215
    };
  }

  function caliphCreateBolt(startX, startY, targetX, targetY) {
    const action = CALIPH_LAMP_ULTIMATE.successAction1;
    const angle = Math.atan2(targetY - startY, targetX - startX);
    const distance = Math.hypot(targetX - startX, targetY - startY);
    const duration = Math.max(
      action.projectileMsMin,
      Math.min(action.projectileMsMax, distance * 0.075)
    );

    const root = document.createElement("div");
    root.className = "caliph-ballista-bolt";
    root.style.left = `${startX}px`;
    root.style.top = `${startY}px`;
    root.style.width = `${action.boltWidth}px`;
    root.style.height = `${action.boltHeight}px`;
    root.style.transform =
      `translate(-50%, -50%) rotate(${angle * 180 / Math.PI}deg)`;

    const image = document.createElement("img");
    image.className = "caliph-ballista-bolt__sprite";
    image.src = encodeURI(action.boltSprite);
    image.alt = "";
    image.draggable = false;

    root.appendChild(image);
    world.appendChild(root);

    return { root, duration, angle, startX, startY, targetX, targetY };
  }

  function caliphAnimateBolt(bolt, victims) {
    const startedAt = performance.now();
    const pending = victims.map((entry) => ({ ...entry, triggered: false }));

    const step = (now) => {
      const p = Math.max(0, Math.min(1, (now - startedAt) / bolt.duration));
      const eased = 1 - Math.pow(1 - p, 2);

      const x = bolt.startX + (bolt.targetX - bolt.startX) * eased;
      const y = bolt.startY + (bolt.targetY - bolt.startY) * eased;
      bolt.root.style.left = `${x}px`;
      bolt.root.style.top = `${y}px`;

      for (const entry of pending) {
        if (entry.triggered || eased + 0.015 < entry.t) continue;
        entry.triggered = true;
        try { entry.mob.kill(performance.now()); } catch (_) {}
      }

      if (p < 1) {
        requestAnimationFrame(step);
        return;
      }

      // Bolt remains physically stuck at the chosen target until launch sound ends.
      bolt.root.style.left = `${bolt.targetX}px`;
      bolt.root.style.top = `${bolt.targetY}px`;

      for (const entry of pending) {
        if (!entry.triggered) {
          entry.triggered = true;
          try { entry.mob.kill(performance.now()); } catch (_) {}
        }
      }
    };

    requestAnimationFrame(step);
  }

  function runCaliphBallistaSuccessAction() {
    let target = caliphNearestLivingMob();

    const fallbackFacing = lastHorizontalFacing === "left" ? -1 : 1;
    const fallbackTarget = {
      actor: null,
      x: Math.max(180, Math.min(MAP.width - 180, playerX + fallbackFacing * 2200)),
      y: playerY - 80,
      radius: 0,
      kill: () => {}
    };

    if (!target) target = fallbackTarget;

    const ballista = caliphCreateBallista(target);
    const action = CALIPH_LAMP_ULTIMATE.successAction1;

    // Attachment 2 starts immediately with the Caliph apparition.
    caliphPlayActionAudio(action.crankSound, () => {
      let launchTarget = caliphNearestLivingMob() || target || fallbackTarget;
      caliphRefreshMobPosition(launchTarget);

      const nextFacing = launchTarget.x < ballista.x ? -1 : 1;
      ballista.facing = nextFacing;
      ballista.root.style.setProperty("--caliph-ballista-facing", String(nextFacing));

      const muzzle = caliphBallistaMuzzle(ballista);
      const victims = caliphBallistaVictims(
        muzzle.x, muzzle.y, launchTarget.x, launchTarget.y,
        launchTarget.actor ? launchTarget : null
      );

      // Attachment 3 starts and the visible shot happens in this exact callback.
      const bolt = caliphCreateBolt(
        muzzle.x, muzzle.y, launchTarget.x, launchTarget.y
      );
      caliphAnimateBolt(bolt, victims);

      caliphPlayActionAudio(action.launchSound, () => {
        bolt.root.remove();
        ballista.root.classList.remove("caliph-ballista-action--visible");
        window.setTimeout(() => ballista.root.remove(), 130);
      });
    });
  }

  function activateCaliphLamp() {
    const now = performance.now();

    // During the 15-second cooldown: absolutely nothing happens.
    if (!caliphLampReady(now)) return false;

    // Cooldown starts immediately on the valid summon attempt,
    // independent of whether the 50/50 roll succeeds or fails.
    caliphLampUltimateState.readyAt = now + CALIPH_LAMP_ULTIMATE.cooldownMs;

    const success = Math.random() < CALIPH_LAMP_ULTIMATE.successChance;

    if (success) {
      // MINIFIX R108:
      // First play ONE of the original success voice lines completely.
      // Only AFTER that finishes do we start the existing ballista sequence
      // (ballista image -> crank sound -> launch sound + shot).
      const pool = CALIPH_LAMP_ULTIMATE.successSounds;
      const src = pool[Math.floor(Math.random() * pool.length)];

      const introAudio = new Audio(encodeURI(src));
      introAudio.preload = "auto";
      introAudio.volume = 1.0;
      caliphLampUltimateState.activeAudio = introAudio;

      let continued = false;
      const continueWithBallista = () => {
        if (continued) return;
        continued = true;
        if (caliphLampUltimateState.activeAudio === introAudio) {
          caliphLampUltimateState.activeAudio = null;
        }
        runCaliphBallistaSuccessAction();
      };

      introAudio.addEventListener("ended", continueWithBallista, { once: true });
      introAudio.addEventListener("error", continueWithBallista, { once: true });
      introAudio.play().catch(continueWithBallista);
    } else {
      // Failure stays exactly as before: random failure audio only.
      const pool = CALIPH_LAMP_ULTIMATE.failureSounds;
      const src = pool[Math.floor(Math.random() * pool.length)];
      playCaliphLampUltimateSound(src);
    }

    renderQuickSlots();
    runCaliphLampCooldownVisual();
    return success;
  }

  function consumeInventoryQuickItem(itemId) {
    const found = findInventoryStack(itemId);
    if (!found || !found.stack) return false;

    found.stack.quantity = Math.max(0, (Number(found.stack.quantity) || 0) - 1);

    if (found.stack.quantity <= 0) {
      clearInventoryItem(found.pageIndex, found.slotIndex);
      const quickIndex = findQuickSlotForItem(itemId);
      if (quickIndex >= 0) quickSlotState.assignments[quickIndex] = null;
    }

    if (inventoryState.open) renderInventory();
    renderQuickSlots();
    return true;
  }

  function activateHealthConsumable(itemId) {
    if (playerDead) return false;

    const item = HEALTH_CONSUMABLE_BY_ID[itemId];
    if (!item) return false;

    const found = findInventoryStack(itemId);
    if (!found || !found.stack || (Number(found.stack.quantity) || 0) <= 0) return false;

    const missingHp = Math.max(0, PLAYER_MAX_HP - playerHp);
    const hasDamageBuff = Number(item.damageBonus) > 0 && Number(item.damageBonusMs) > 0;

    // Pure healing items are not wasted at full life.
    // The Kräuterpunsch may still be used at full life because its damage buff is meaningful.
    if (missingHp <= 0 && !hasDamageBuff) return false;

    if (item.heal > 0 && missingHp > 0) {
      playerHp = Math.min(PLAYER_MAX_HP, playerHp + item.heal);
      updatePlayerHpHud();
    }

    if (hasDamageBuff) {
      playerDamageBuffUntil = performance.now() + item.damageBonusMs;
    }

    return consumeInventoryQuickItem(itemId);
  }

  function activateQuickSlot(index) {
    const safe = Number(index);
    if (!Number.isInteger(safe) || safe < 0 || safe >= quickSlotState.assignments.length) {
      return false;
    }

    const binding = quickSlotState.assignments[safe];
    if (!binding) return false;

    if (binding.itemId === "caliph-lamp") {
      return activateCaliphLamp();
    }

    if (HEALTH_CONSUMABLE_BY_ID[binding.itemId]) {
      return activateHealthConsumable(binding.itemId);
    }

    return false;
  }

  function createPlayerHud() {
    if (playerHud) return;
    installPlayerHudStyles();
    installPlayerExpStyles();

    const main = createPlayerHudPiece("playerHudMain", PLAYER_HUD.mainImage, "player-hud-piece--left");
    const exp = createPlayerHudPiece("playerHudExp", PLAYER_HUD.expImage, "player-hud-piece--right");
    const hpFill = document.createElement("div");
    hpFill.className = "player-hp-fill";
    const hpText = document.createElement("div");
    hpText.className = "player-hp-text";
    main.root.append(hpFill, hpText);

    createPlayerExpHudFill(exp.root, exp.image);

    playerHud = { main, exp, hpFill, hpText };

    createPlayerQuickSlots(main.root);
    updatePlayerHpHud();
    updatePlayerHudVisibility();
  }

  function updatePlayerHudVisibility() {
    if (!playerHud) return;

    const visible =
      typeof startFlowState !== "undefined" &&
      startFlowState === "campaign" &&
      typeof MAP !== "undefined" &&
      MAP &&
      MAP.id !== "renchtalstadion";

    playerHud.main.root.classList.toggle("player-hud--hidden", !visible);
    playerHud.exp.root.classList.toggle("player-hud--hidden", !visible);
  }


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

  let startFlowState = "start-key";
  let chosenPlayerName = "";
  const START_PRODUCT_KEYS = new Set(["1", "N", "H4P-PYB-1RT-HDA-Y2U"]);
  let startFlowUI = null;

  function gameplayUnlocked() {
    // R121: once the start-flow DOM has been removed, gameplay is unlocked even
    // if a stale async state assignment was missed. While either start screen
    // still exists, gameplay remains locked exactly as before.
    return startFlowState === "campaign" || startFlowUI === null;
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

    // R88 — final betting slip / bookmaker result artwork.
    resultPlayerWin: "assets/npcs/renchtalstadion/BUCHMACHER AUSZAHLUNG.png",
    resultBookmakerWin: "assets/npcs/renchtalstadion/BUCHMACHER GEWINN.png",

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

      // R81 — exact final sync to the supplied "It's time" file.
      finalPruegelAtMs: 5000,
      finalCountdown3AtMs: 2000,
      finalCountdown2AtMs: 3000,
      finalCountdown1AtMs: 4000,
      announcerFrame2AtMs: 2000,
      announcerFrame3AtMs: 5000,
      announcerPoint: Object.freeze({ x: 5035, y: 2910 }),
      announcerWidth: 980,
      announcerHeight: 1260,
      announcerFrames: Object.freeze([
        "assets/stadium/announcer/ANNOUNCER TRAPDOOR.png",
        "assets/stadium/announcer/ANNOUNCER MEGAPHONE.png",
        "assets/stadium/announcer/ANNOUNCER PRUEGEL.png"
      ]),

      // R79 TEAM ORDER:
      // Fighter A / first entrant = ROHART-NEUENSTEIN.
      // World-space foot anchors derived from the marked stadium reference.
      start: Object.freeze({ x: 5000, y: 5585 }),
      linePoint: Object.freeze({ x: 5035, y: 2910 }),
      readyPoint: Object.freeze({ x: 7820, y: 3485 }),

      speedUp: 620,
      speedRight: 620,

      fighterWidth: 700,
      fighterHeight: 1080,

      // R80 visual tuning.
      // Fighter A = ROHART-NEUENSTEIN: backward/up and right run substantially smaller.
      neuensteinWalkUpScale: 0.78,
      neuensteinWalkRightScale: 0.76,
      // Fighter B = SCHAUENBURG: left run is enlarged while keeping one fixed foot baseline.
      schauenburgWalkLeftScale: 1.16,

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
      readyFrame: "assets/stadium/fighters/FLEGEL READY.png",

      // R79 — Fighter B / second entrant = SCHAUENBURG.
      // IMPORTANT: the files themselves still carry the legacy "NEUENSTEIN"
      // filenames from R78 so existing GitHub assets remain compatible.
      schauenburgStart: Object.freeze({ x: 5000, y: 5585 }),
      schauenburgLinePoint: Object.freeze({ x: 5035, y: 2910 }),
      schauenburgLeftPoint: Object.freeze({ x: 2200, y: 3660 }),
      schauenburgSpeedUp: 620,
      schauenburgSpeedLeft: 620,
      schauenburgWalkUpFrames: Object.freeze([
        "assets/stadium/fighters/NEUENSTEIN WALK UP 1.png",
        "assets/stadium/fighters/NEUENSTEIN WALK UP 2.png"
      ]),
      schauenburgVictoryFrame: "assets/stadium/fighters/NEUENSTEIN VICTORY.png",
      schauenburgWalkLeftFrames: Object.freeze([
        "assets/stadium/fighters/NEUENSTEIN WALK LEFT 1.png",
        "assets/stadium/fighters/NEUENSTEIN WALK LEFT 2.png"
      ]),
      schauenburgReadyFrame: "assets/stadium/fighters/NEUENSTEIN READY.png",

      // R82 — actual derby brawl. Existing R79-R81 intro values above stay untouched.
      brawl: Object.freeze({
        approachDurationMs: 3200,
        attackMs: 650,
        restMs: 500,
        crossfadeMs: 85,
        minCycles: 50,
        maxCycles: 90,
        targetOpaqueHeight: 900,
        neuensteinContact: Object.freeze({ x: 5480, y: 3540 }),
        schauenburgContact: Object.freeze({ x: 4700, y: 3540 }),
        sharedPoint: Object.freeze({ x: 5090, y: 3540 }),
        dustPoint: Object.freeze({ x: 5090, y: 3380 }),
        neuensteinAttack: "assets/stadium/fighters/FLEGEL N2.png",
        sharedRest: "assets/stadium/fighters/DERBY REST.png",
        schauenburgAttack: "assets/stadium/fighters/SCHAUENBURG ATTACK.png",

        // R84 — alternating hit-chance frames replace ONLY the shared rest slot.
        // Chances reuse the exact bookmaker probabilities; no outcome logic is changed.
        neuensteinHitFrame: "assets/stadium/fighters/DERBY HIT NEUENSTEIN.png",
        // R87 — both normal Schauenburg hit frames remain available for hits 1-3.
        schauenburgHitFrame: "assets/stadium/fighters/DERBY HIT SCHAUENBURG 1.png",
        schauenburgHitFrameAlt: "assets/stadium/fighters/DERBY HIT SCHAUENBURG VARIANT 2.png",
        schauenburgHitFourthFrame: "assets/stadium/fighters/DERBY HIT SCHAUENBURG 4.png",

        // R85 — fatality branch after Schauenburg's 4th successful hit.
        finishSetupFrame: "assets/stadium/fighters/DERBY FINISH SETUP.png",
        finishEvadeFrame: "assets/stadium/fighters/DERBY FINISH NEUENSTEIN EVADE.png",
        fatalityNeuensteinFrame: "assets/stadium/fighters/DERBY FATALITY NEUENSTEIN.png",
        fatalitySchauenburgFrame: "assets/stadium/fighters/DERBY FATALITY SCHAUENBURG.png",
        finishSetupMs: 750,
        finishEvadeMs: 750,
        fatalityMs: 2100
      })
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
  let stadiumLockedBet = null;
  let stadiumResultUI = null;
  let stadiumResultOpen = false;
  let stadiumResultShown = false;
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
  let stadiumFightFighterB = null;
  let stadiumFightFighterBFrameIndex = 0;
  let stadiumFightFighterBNextFrameAt = 0;
  let stadiumFightFighterBSpriteToken = 0;

  // R81 — arena announcer and final synchronized countdown.
  let stadiumArenaAnnouncer = null;
  let stadiumFinalSequenceStartedAt = 0;
  let stadiumFinalSequenceStep = -1;

  // R82 — isolated spectator derby brawl state.
  let stadiumBrawlStarted = false;
  let stadiumBrawlWinner = null;
  let stadiumBrawlCyclesTarget = 0;
  let stadiumBrawlCyclesDone = 0;
  let stadiumBrawlPhaseEndAt = 0;
  let stadiumBrawlApproachStartedAt = 0;
  let stadiumBrawlApproachStartA = null;
  let stadiumBrawlApproachStartB = null;
  let stadiumBrawlVisuals = null;
  let stadiumBrawlDust = null;

  // R84 — rest slots alternate: Neuenstein first, then Schauenburg.
  let stadiumBrawlRestTurn = "neuenstein";
  let stadiumBrawlSchauenburgSuccessfulHits = 0;

  // R85 — the 4th successful Schauenburg hit branches into the finish sequence.
  let stadiumBrawlFatalityPending = false;
  let stadiumBrawlFatalityEvaded = null;
  let stadiumBrawlDamageTextRoot = null;
  let stadiumBrawlFatalityText = null;

  // R77 — normalize each movement direction to ITS OWN matching stand pose.
  // WALK UP uses FLEGEL VICTORY as its size reference at the green circle.
  // WALK RIGHT uses FLEGEL READY as its size reference at the green box.
  // This keeps the already-correct stand-pose sizes while eliminating bounce inside each walk cycle.
  const stadiumFightFrameMetrics = new Map();
  const stadiumFightReferenceOpaqueHeights = { up: null, right: null };
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

      #stadiumResultUI {
        position: fixed;
        inset: 0;
        z-index: 24250;
        display: grid;
        place-items: center;
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        transition: opacity 260ms ease, visibility 260ms ease;
      }
      #stadiumResultUI.stadium-result--visible { opacity: 1; visibility: visible; pointer-events: auto; }
      .stadium-result__panel {
        position: relative; width: min(820px, 90vw); max-height: 92vh; overflow: auto;
        box-sizing: border-box; padding: 28px 42px 30px; text-align: center;
        color: #f4eddd; border: 1px solid rgba(198,151,60,.66);
        background: rgba(3,3,3,.88); box-shadow: 0 22px 80px rgba(0,0,0,.84), inset 0 0 34px rgba(158,108,33,.12);
        backdrop-filter: blur(4px);
      }
      .stadium-result__close { position:absolute; right:14px; top:8px; border:0; background:transparent; color:#d7b35b; font:700 31px Georgia,serif; cursor:pointer; }
      .stadium-result__title { color:#d8ad48; font-family:"Old English Text MT","Lucida Blackletter","UnifrakturCook",Georgia,serif; font-size:52px; font-weight:900; letter-spacing:3px; text-shadow:0 2px 8px #000; }
      .stadium-result__crest { display:block; width:132px; height:132px; object-fit:contain; margin:15px auto 4px; filter:drop-shadow(0 7px 8px rgba(0,0,0,.65)); }
      .stadium-result__team { font:700 20px Georgia,serif; letter-spacing:1px; margin-bottom:12px; }
      .stadium-result__numbers { display:grid; grid-template-columns:1fr 1fr; gap:8px 28px; max-width:520px; margin:0 auto 12px; font:700 20px Georgia,serif; }
      .stadium-result__outcome { margin:8px 0 4px; font-family:"Old English Text MT","Lucida Blackletter","UnifrakturCook",Georgia,serif; font-size:36px; font-weight:900; }
      .stadium-result__outcome--win { color:#d8ad48; } .stadium-result__outcome--loss { color:#b53a32; }
      .stadium-result__bookmaker { display:block; width:min(350px,55vw); max-height:330px; object-fit:contain; margin:2px auto -2px; }
      .stadium-result__speech { max-width:650px; margin:0 auto; padding:13px 18px; border:1px solid rgba(255,255,255,.18); border-radius:18px; background:rgba(255,255,255,.055); font:700 19px/1.38 Georgia,serif; }
      .stadium-result__it--g { color:#34a853; } .stadium-result__it--w { color:#f5f1e8; } .stadium-result__it--r { color:#e34a42; }

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

      .stadium-bet__possible-win {
        display: block;
        width: 100%;
        margin: 8px auto 12px;
        white-space: nowrap;
        color: #b87333;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 18px;
        font-weight: 900;
        letter-spacing: .35px;
        line-height: 1.15;
        text-align: center;
        text-shadow:
          0 2px 2px rgba(0,0,0,.95),
          0 0 8px rgba(184,115,51,.25);
      }

      @media (max-width: 760px) {
        .stadium-bet__possible-win {
          font-size: 15px;
          white-space: normal;
        }
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

      .stadium-brawl-layer {
        position: absolute;
        z-index: 19;
        transform: translate(-50%, -100%);
        transform-origin: 50% 100%;
        pointer-events: none;
        user-select: none;
        opacity: 0;
        visibility: hidden;
        transition: opacity ${STADIUM.fightIntro.brawl.crossfadeMs}ms linear,
                    visibility ${STADIUM.fightIntro.brawl.crossfadeMs}ms linear;
        will-change: opacity;
      }

      .stadium-brawl-layer--visible {
        opacity: 1;
        visibility: visible;
      }

      .stadium-brawl-layer__sprite {
        position: absolute;
        left: 50%;
        bottom: 0;
        width: auto;
        height: auto;
        max-width: none;
        max-height: none;
        transform-origin: 50% 100%;
        filter: drop-shadow(0 8px 5px rgba(0,0,0,.30));
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }

      .stadium-brawl-dust {
        position: absolute;
        z-index: 20;
        width: 1px;
        height: 1px;
        pointer-events: none;
        user-select: none;
      }

      .stadium-brawl-dust__puff {
        position: absolute;
        width: var(--dust-size, 120px);
        height: calc(var(--dust-size, 120px) * .58);
        left: var(--dust-x, 0px);
        top: var(--dust-y, 0px);
        margin-left: calc(var(--dust-size, 120px) * -.5);
        margin-top: calc(var(--dust-size, 120px) * -.29);
        border-radius: 48% 52% 44% 56%;
        background: radial-gradient(ellipse at center,
          rgba(214,196,157,.58) 0%,
          rgba(178,154,113,.34) 45%,
          rgba(120,95,64,.08) 72%,
          rgba(90,70,46,0) 100%);
        opacity: 0;
        transform: scale(.28) translate(0, 0);
        animation: stadiumBrawlDustPuff var(--dust-life, 330ms) ease-out forwards;
        filter: blur(1.5px);
      }

      @keyframes stadiumBrawlDustPuff {
        0% { opacity: 0; transform: scale(.28) translate(0, 0); }
        18% { opacity: .92; }
        100% {
          opacity: 0;
          transform: scale(1.55) translate(var(--dust-dx, 0px), var(--dust-dy, -18px));
        }
      }

      .stadium-brawl-damage-root {
        position: absolute;
        inset: 0;
        z-index: 23;
        pointer-events: none;
        user-select: none;
      }

      .stadium-brawl-damage {
        position: absolute;
        transform: translate(-50%, -100%);
        font-family: Georgia, "Times New Roman", serif;
        font-size: 104px;
        font-weight: 900;
        line-height: 1;
        letter-spacing: 2px;
        text-shadow:
          0 4px 2px rgba(0,0,0,.92),
          0 0 10px currentColor,
          0 0 20px rgba(0,0,0,.55);
        animation: stadiumBrawlDamageFloat 820ms ease-out forwards;
        will-change: transform, opacity;
      }

      .stadium-brawl-damage--neuenstein {
        color: #82dcff;
      }

      .stadium-brawl-damage--schauenburg {
        color: #ff3737;
      }

      @keyframes stadiumBrawlDamageFloat {
        0%   { opacity: 0; transform: translate(-50%, -72%) scale(.82); }
        16%  { opacity: 1; transform: translate(-50%, -100%) scale(1.05); }
        72%  { opacity: 1; }
        100% { opacity: 0; transform: translate(-50%, -178%) scale(.98); }
      }

      .stadium-brawl-fatality-text {
        position: absolute;
        z-index: 24;
        left: ${STADIUM.fightIntro.brawl.sharedPoint.x}px;
        top: ${STADIUM.fightIntro.brawl.sharedPoint.y - 930}px;
        transform: translate(-50%, -50%) scale(.88);
        pointer-events: none;
        user-select: none;
        opacity: 0;
        visibility: hidden;
        font-family: "Old English Text MT", "Lucida Blackletter", "UnifrakturCook", Georgia, serif;
        font-size: 172px;
        font-weight: 900;
        letter-spacing: 5px;
        white-space: nowrap;
        text-shadow: 0 5px 3px #000, 0 0 18px currentColor, 0 0 36px rgba(0,0,0,.72);
        transition: opacity 150ms ease, transform 180ms ease, visibility 150ms ease;
      }

      .stadium-brawl-fatality-text--visible {
        opacity: 1;
        visibility: visible;
        transform: translate(-50%, -50%) scale(1);
      }

      .stadium-brawl-fatality-text--neuenstein { color: #82dcff; }
      .stadium-brawl-fatality-text--schauenburg { color: #ff3737; }

      .stadium-gate-foreground {
        position: absolute;
        z-index: 18;
        pointer-events: none;
        user-select: none;
        object-fit: fill;
        display: none;
      }

      .stadium-arena-announcer {
        position: absolute;
        z-index: 21;
        width: ${STADIUM.fightIntro.announcerWidth}px;
        height: ${STADIUM.fightIntro.announcerHeight}px;
        transform: translate(-50%, -100%);
        transform-origin: 50% 100%;
        pointer-events: none;
        user-select: none;
        display: none;
      }

      .stadium-arena-announcer--visible {
        display: block;
      }

      .stadium-arena-announcer__sprite {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: 50% 100%;
        opacity: 0;
        transition: opacity 180ms ease;
        filter: drop-shadow(0 8px 5px rgba(0,0,0,.30));
      }

      .stadium-arena-announcer__sprite--active {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }

  function createStadiumPhase1() {
    installStadiumStyles();
    preloadStadiumArenaSfx();

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

        <div id="stadiumBetPossibleWin" class="stadium-bet__possible-win">MÖGLICHER GEWINN: —</div>

        <div class="stadium-bet__stake-label">EINSATZ</div>
        <div class="stadium-bet__stake-row">
          <input id="stadiumBetStake" class="stadium-bet__stake" type="text" inputmode="numeric" maxlength="9" autocomplete="off" aria-label="Einsatz in Pfennig">
          <span class="stadium-bet__penny" aria-hidden="true">₰</span>
        </div>

        <button type="button" class="stadium-bet__submit" id="stadiumBetSubmit">Wette abschließen</button>
      </div>`;
    game.appendChild(betRoot);

    const resultRoot = document.createElement("div");
    resultRoot.id = "stadiumResultUI";
    resultRoot.innerHTML = `<div class="stadium-result__panel" role="dialog" aria-modal="true" aria-label="Euer Wettschein"><button class="stadium-result__close" type="button" aria-label="Schließen">×</button><div class="stadium-result__body"></div></div>`;
    game.appendChild(resultRoot);
    stadiumResultUI = { root: resultRoot, body: resultRoot.querySelector(".stadium-result__body") };
    resultRoot.addEventListener("click", (event) => { if (event.target.closest(".stadium-result__close")) closeStadiumResultUI(); });

    const stake = betRoot.querySelector("#stadiumBetStake");
    const possibleWin = betRoot.querySelector("#stadiumBetPossibleWin");

    function updateStadiumPossibleWin() {
      if (!possibleWin) return;

      const stakeValue = Number.parseInt(stake.value || "0", 10);
      if (
        !stadiumBetSelectedTeam ||
        !Number.isFinite(stakeValue) ||
        stakeValue <= 0
      ) {
        possibleWin.textContent = "MÖGLICHER GEWINN: —";
        return;
      }

      const odds = stadiumBetSelectedTeam === "schauenburg"
        ? STADIUM.derby.schauenburgOdds
        : STADIUM.derby.neuensteinOdds;

      // Decimal quote is applied directly to the entered Pfennig.
      // Payout stays in whole Pfennig.
      const payout = Math.floor(stakeValue * odds);
      possibleWin.textContent =
        `MÖGLICHER GEWINN: ${payout.toLocaleString("de-DE")}`;
    }

    stake.addEventListener("input", () => {
      stake.value = stake.value.replace(/\D+/g, "").replace(/^0+(?=\d)/, "");
      updateStadiumPossibleWin();
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
        updateStadiumPossibleWin();
        return;
      }

      if (event.target.closest("#stadiumBetSubmit")) {
        const stakeValue = Number.parseInt(stake.value || "0", 10);
        if (!stadiumBetSelectedTeam || !Number.isFinite(stakeValue) || stakeValue <= 0) return;
        const odds = stadiumBetSelectedTeam === "schauenburg"
          ? STADIUM.derby.schauenburgOdds : STADIUM.derby.neuensteinOdds;
        stadiumLockedBet = Object.freeze({
          team: stadiumBetSelectedTeam, stake: stakeValue, odds, payout: Math.floor(stakeValue * odds)
        });
        stadiumResultShown = false;
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

    // R78 — second fighter uses the same proven double-buffer / foot-anchor setup.
    const fighterBRoot = document.createElement("div");
    fighterBRoot.id = "stadiumFighterB";
    fighterBRoot.className = "stadium-fighter";
    fighterBRoot.style.left = `${STADIUM.fightIntro.schauenburgStart.x}px`;
    fighterBRoot.style.top = `${STADIUM.fightIntro.schauenburgStart.y}px`;

    const fighterBImageA = document.createElement("img");
    fighterBImageA.className = "stadium-fighter__sprite stadium-fighter__sprite--active";
    fighterBImageA.src = encodeURI(STADIUM.fightIntro.schauenburgWalkUpFrames[0]);
    fighterBImageA.alt = "";
    fighterBImageA.draggable = false;

    const fighterBImageB = document.createElement("img");
    fighterBImageB.className = "stadium-fighter__sprite";
    fighterBImageB.alt = "";
    fighterBImageB.draggable = false;

    fighterBRoot.append(fighterBImageA, fighterBImageB);
    world.appendChild(fighterBRoot);

    // R82 — three isolated brawl layers: A attack, ONE shared rest image, B attack.
    // Keeping these separate from the proven entry sprites prevents R79-R81 size/mirror regressions.
    function makeBrawlLayer(id, src, point, mirror) {
      const layer = document.createElement("div");
      layer.id = id;
      layer.className = "stadium-brawl-layer";
      layer.style.left = `${point.x}px`;
      layer.style.top = `${point.y}px`;

      const img = document.createElement("img");
      img.className = "stadium-brawl-layer__sprite";
      img.src = encodeURI(src);
      img.alt = "";
      img.draggable = false;
      layer.appendChild(img);
      world.appendChild(layer);

      const layout = () => layoutStadiumBrawlSprite(img, mirror);
      img.addEventListener("load", layout);
      if (img.complete && img.naturalWidth > 0) layout();
      return { root: layer, image: img, src, mirror };
    }

    const brawlAttackA = makeBrawlLayer(
      "stadiumBrawlAttackA",
      STADIUM.fightIntro.brawl.neuensteinAttack,
      STADIUM.fightIntro.brawl.neuensteinContact,
      true
    );
    const brawlShared = makeBrawlLayer(
      "stadiumBrawlShared",
      STADIUM.fightIntro.brawl.sharedRest,
      STADIUM.fightIntro.brawl.sharedPoint,
      true
    );
    const brawlAttackB = makeBrawlLayer(
      "stadiumBrawlAttackB",
      STADIUM.fightIntro.brawl.schauenburgAttack,
      STADIUM.fightIntro.brawl.schauenburgContact,
      false
    );

    // R84 — these are full two-fighter hit compositions and therefore live at
    // the exact same shared world anchor as DERBY REST. All three are mirrored.
    const brawlHitNeuenstein = makeBrawlLayer(
      "stadiumBrawlHitNeuenstein",
      STADIUM.fightIntro.brawl.neuensteinHitFrame,
      STADIUM.fightIntro.brawl.sharedPoint,
      true
    );
    const brawlHitSchauenburg = makeBrawlLayer(
      "stadiumBrawlHitSchauenburg",
      STADIUM.fightIntro.brawl.schauenburgHitFrame,
      STADIUM.fightIntro.brawl.sharedPoint,
      true
    );
    const brawlHitSchauenburgAlt = makeBrawlLayer(
      "stadiumBrawlHitSchauenburgAlt",
      STADIUM.fightIntro.brawl.schauenburgHitFrameAlt,
      STADIUM.fightIntro.brawl.sharedPoint,
      true
    );
    const brawlHitSchauenburgFourth = makeBrawlLayer(
      "stadiumBrawlHitSchauenburgFourth",
      STADIUM.fightIntro.brawl.schauenburgHitFourthFrame,
      STADIUM.fightIntro.brawl.sharedPoint,
      true
    );

    // R85 — full two-fighter finish compositions, isolated from the normal brawl.
    const brawlFinishSetup = makeBrawlLayer(
      "stadiumBrawlFinishSetup",
      STADIUM.fightIntro.brawl.finishSetupFrame,
      STADIUM.fightIntro.brawl.sharedPoint,
      true
    );
    const brawlFinishEvade = makeBrawlLayer(
      "stadiumBrawlFinishEvade",
      STADIUM.fightIntro.brawl.finishEvadeFrame,
      STADIUM.fightIntro.brawl.sharedPoint,
      true
    );
    const brawlFatalityNeuenstein = makeBrawlLayer(
      "stadiumBrawlFatalityNeuenstein",
      STADIUM.fightIntro.brawl.fatalityNeuensteinFrame,
      STADIUM.fightIntro.brawl.sharedPoint,
      true
    );
    const brawlFatalitySchauenburg = makeBrawlLayer(
      "stadiumBrawlFatalitySchauenburg",
      STADIUM.fightIntro.brawl.fatalitySchauenburgFrame,
      STADIUM.fightIntro.brawl.sharedPoint,
      true
    );

    const brawlDust = document.createElement("div");
    brawlDust.id = "stadiumBrawlDust";
    brawlDust.className = "stadium-brawl-dust";
    brawlDust.style.left = `${STADIUM.fightIntro.brawl.dustPoint.x}px`;
    brawlDust.style.top = `${STADIUM.fightIntro.brawl.dustPoint.y}px`;
    world.appendChild(brawlDust);

    stadiumBrawlVisuals = {
      attackA: brawlAttackA,
      shared: brawlShared,
      attackB: brawlAttackB,
      hitNeuenstein: brawlHitNeuenstein,
      hitSchauenburg: brawlHitSchauenburg,
      hitSchauenburgAlt: brawlHitSchauenburgAlt,
      hitSchauenburgFourth: brawlHitSchauenburgFourth,
      finishSetup: brawlFinishSetup,
      finishEvade: brawlFinishEvade,
      fatalityNeuenstein: brawlFatalityNeuenstein,
      fatalitySchauenburg: brawlFatalitySchauenburg
    };
    stadiumBrawlDust = brawlDust;

    const brawlDamageRoot = document.createElement("div");
    brawlDamageRoot.id = "stadiumBrawlDamageRoot";
    brawlDamageRoot.className = "stadium-brawl-damage-root";
    world.appendChild(brawlDamageRoot);
    stadiumBrawlDamageTextRoot = brawlDamageRoot;

    const fatalityText = document.createElement("div");
    fatalityText.id = "stadiumBrawlFatalityText";
    fatalityText.className = "stadium-brawl-fatality-text";
    fatalityText.textContent = "FATALITÄT!";
    world.appendChild(fatalityText);
    stadiumBrawlFatalityText = fatalityText;

    for (const brawlSrc of [
      STADIUM.fightIntro.brawl.neuensteinAttack,
      STADIUM.fightIntro.brawl.sharedRest,
      STADIUM.fightIntro.brawl.schauenburgAttack,
      STADIUM.fightIntro.brawl.neuensteinHitFrame,
      STADIUM.fightIntro.brawl.schauenburgHitFrame,
      STADIUM.fightIntro.brawl.schauenburgHitFrameAlt,
      STADIUM.fightIntro.brawl.schauenburgHitFourthFrame,
      STADIUM.fightIntro.brawl.finishSetupFrame,
      STADIUM.fightIntro.brawl.finishEvadeFrame,
      STADIUM.fightIntro.brawl.fatalityNeuensteinFrame,
      STADIUM.fightIntro.brawl.fatalitySchauenburgFrame
    ]) {
      const preload = new Image();
      preload.src = encodeURI(brawlSrc);
      if (typeof preload.decode === "function") preload.decode().catch(() => {});
    }

    // R81 — announcer appears at the same arena presentation point.
    const announcerRoot = document.createElement("div");
    announcerRoot.id = "stadiumArenaAnnouncer";
    announcerRoot.className = "stadium-arena-announcer";
    announcerRoot.style.left = `${STADIUM.fightIntro.announcerPoint.x}px`;
    announcerRoot.style.top = `${STADIUM.fightIntro.announcerPoint.y}px`;

    const announcerImages = STADIUM.fightIntro.announcerFrames.map((announcerSrc) => {
      const img = document.createElement("img");
      img.className = "stadium-arena-announcer__sprite";
      img.src = encodeURI(announcerSrc);
      img.alt = "";
      img.draggable = false;
      announcerRoot.appendChild(img);
      return img;
    });

    world.appendChild(announcerRoot);
    stadiumArenaAnnouncer = {
      root: announcerRoot,
      images: announcerImages,
      activeIndex: -1
    };

    for (const fighterSrc of [
      ...STADIUM.fightIntro.walkUpFrames,
      STADIUM.fightIntro.victoryFrame,
      ...STADIUM.fightIntro.walkRightFrames,
      STADIUM.fightIntro.readyFrame,
      ...STADIUM.fightIntro.schauenburgWalkUpFrames,
      STADIUM.fightIntro.schauenburgVictoryFrame,
      ...STADIUM.fightIntro.schauenburgWalkLeftFrames,
      STADIUM.fightIntro.schauenburgReadyFrame
    ]) {
      const preload = new Image();
      preload.onload = () => {
        const metrics = getStadiumFightOpaqueMetrics(preload);
        if (!metrics) return;

        let referenceKey = null;
        if (fighterSrc === STADIUM.fightIntro.victoryFrame) referenceKey = "up";
        if (fighterSrc === STADIUM.fightIntro.readyFrame) referenceKey = "right";

        if (referenceKey) {
          const fit = Math.min(
            STADIUM.fightIntro.fighterWidth / metrics.naturalWidth,
            STADIUM.fightIntro.fighterHeight / metrics.naturalHeight
          );
          stadiumFightReferenceOpaqueHeights[referenceKey] = metrics.height * fit;
        }
      };
      preload.src = encodeURI(fighterSrc);
      if (preload.complete && preload.naturalWidth > 0) preload.onload();
    }

    for (const announcerSrc of STADIUM.fightIntro.announcerFrames) {
      const preload = new Image();
      preload.src = encodeURI(announcerSrc);
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
    stadiumFightFighterB = {
      root: fighterBRoot,
      images: [fighterBImageA, fighterBImageB],
      activeIndex: 0,
      currentSrc: STADIUM.fightIntro.schauenburgWalkUpFrames[0],
      x: STADIUM.fightIntro.schauenburgStart.x,
      y: STADIUM.fightIntro.schauenburgStart.y
    };
    ensureStadiumFightBReference("up");
    ensureStadiumFightBReference("left");
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

  function stadiumItalianSpeech(text) {
    const colors = ["g", "w", "r"];
    let i = 0;
    return text.split(/(\s+)/).map((part) => {
      if (/^\s+$/.test(part)) return part;
      const cls = colors[i++ % colors.length];
      const safe = part.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      return `<span class="stadium-result__it--${cls}">${safe}</span>`;
    }).join("");
  }

  function showStadiumResultUI() {
    if (!stadiumResultUI || !stadiumLockedBet || !stadiumBrawlWinner || stadiumResultShown) return;
    stadiumResultShown = true;
    stadiumResultOpen = true;
    const won = stadiumLockedBet.team === stadiumBrawlWinner;
    const crest = stadiumLockedBet.team === "schauenburg" ? STADIUM.derby.schauenburgCrest : STADIUM.derby.neuensteinCrest;
    const teamName = stadiumLockedBet.team === "schauenburg" ? STADIUM.derby.schauenburgName : STADIUM.derby.neuensteinName;
    const bookmakerImage = won ? STADIUM.resultPlayerWin : STADIUM.resultBookmakerWin;
    const speech = won
      ? "Vaffanculo! Da, nimm deine Pfennige. Und jetzt verschwinde! Arrivederci!"
      : "Ahhh, mein aufrichtigstes Beileid! Wirklich tragisch. Für dich. Für mich war es ein ausgesprochen schöner Abend. Bis zum nächsten Mal!";
    stadiumResultUI.body.innerHTML = `
      <div class="stadium-result__title">EUER WETTSCHEIN</div>
      <img class="stadium-result__crest" src="${encodeURI(crest)}" alt="">
      <div class="stadium-result__team">${teamName}</div>
      <div class="stadium-result__numbers"><span>QUOTE</span><span>${stadiumLockedBet.odds.toFixed(2).replace(".",",")}</span><span>EINSATZ</span><span>${stadiumLockedBet.stake.toLocaleString("de-DE")} ₰</span></div>
      <div class="stadium-result__outcome ${won ? "stadium-result__outcome--win" : "stadium-result__outcome--loss"}">${won ? `GEWINN: ${stadiumLockedBet.payout.toLocaleString("de-DE")} ₰` : `VERLUST: ${stadiumLockedBet.stake.toLocaleString("de-DE")} ₰`}</div>
      <img class="stadium-result__bookmaker" src="${encodeURI(bookmakerImage)}" alt="">
      <div class="stadium-result__speech">${stadiumItalianSpeech(speech)}</div>`;
    stadiumResultUI.root.classList.add("stadium-result--visible");
  }

  function closeStadiumResultUI() {
    if (!stadiumResultUI || !stadiumResultOpen) return;
    stadiumResultOpen = false;
    stadiumResultUI.root.classList.remove("stadium-result--visible");
    // The spectator remains on the stand; only the fight/bet state is reset for a new wager.
    resetStadiumFightIntro();
    stadiumState = "spectator";
    stadiumLockedBet = null;
    stadiumBetSelectedTeam = null;
    if (stadiumBetUI) {
      stadiumBetUI.stake.value = "";
      for (const node of stadiumBetUI.root.querySelectorAll("[data-bet-team]")) node.classList.remove("stadium-bet__crest--selected");
      const possible = stadiumBetUI.root.querySelector("#stadiumBetPossibleWin");
      if (possible) possible.textContent = "MÖGLICHER GEWINN: —";
    }
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

  function stadiumFightReferenceKeyForSrc(src) {
    if (
      src === STADIUM.fightIntro.victoryFrame ||
      STADIUM.fightIntro.walkUpFrames.includes(src)
    ) {
      return "up";
    }
    return "right";
  }

  function ensureStadiumFightReference(referenceKey) {
    if (stadiumFightReferenceOpaqueHeights[referenceKey] != null) return true;

    const referenceSrc = referenceKey === "up"
      ? STADIUM.fightIntro.victoryFrame
      : STADIUM.fightIntro.readyFrame;

    const reference = new Image();
    reference.src = encodeURI(referenceSrc);
    if (!reference.complete || !reference.naturalWidth) return false;

    const metrics = getStadiumFightOpaqueMetrics(reference);
    if (!metrics) return false;

    const fit = Math.min(
      STADIUM.fightIntro.fighterWidth / metrics.naturalWidth,
      STADIUM.fightIntro.fighterHeight / metrics.naturalHeight
    );
    stadiumFightReferenceOpaqueHeights[referenceKey] = metrics.height * fit;
    return true;
  }

  function layoutStadiumFightSprite(image, src) {
    if (!stadiumFightFighter || !image || !image.naturalWidth || !image.naturalHeight) return;
    const metrics = getStadiumFightOpaqueMetrics(image);
    if (!metrics) return;

    // R77 SIZE FIX:
    // Backward/up walking is scaled to the exact visual size of FLEGEL VICTORY.
    // Right walking is scaled to the exact visual size of FLEGEL READY.
    // The stand poses themselves therefore do NOT change size when reached.
    const referenceKey = stadiumFightReferenceKeyForSrc(src);
    if (stadiumFightReferenceOpaqueHeights[referenceKey] == null) {
      ensureStadiumFightReference(referenceKey);
    }
    const targetOpaqueHeight = stadiumFightReferenceOpaqueHeights[referenceKey];
    if (targetOpaqueHeight == null) return;

    let scale = targetOpaqueHeight / Math.max(1, metrics.height);

    // R80: Fighter A is ROHART-NEUENSTEIN.
    // Only his moving sprites are reduced; victory/ready poses stay unchanged.
    if (STADIUM.fightIntro.walkUpFrames.includes(src)) {
      scale *= STADIUM.fightIntro.neuensteinWalkUpScale;
    } else if (STADIUM.fightIntro.walkRightFrames.includes(src)) {
      scale *= STADIUM.fightIntro.neuensteinWalkRightScale;
    }

    const renderedWidth = metrics.naturalWidth * scale;
    const renderedHeight = metrics.naturalHeight * scale;

    // Preserve the proven anti-bounce foot anchor exactly.
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
      layoutStadiumFightSprite(nextImage, src);
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

  const stadiumFightBReferenceOpaqueHeights = {
    up: null,
    left: null
  };

  function stadiumFightBGroupForSrc(src) {
    return STADIUM.fightIntro.schauenburgWalkLeftFrames.includes(src) ? "left" : "up";
  }

  function ensureStadiumFightBReference(group) {
    if (stadiumFightBReferenceOpaqueHeights[group] != null) return true;

    const refSrc = group === "left"
      ? STADIUM.fightIntro.schauenburgWalkLeftFrames[0]
      : STADIUM.fightIntro.schauenburgVictoryFrame;

    const reference = new Image();
    reference.src = encodeURI(refSrc);
    if (!reference.complete || !reference.naturalWidth) return false;

    const metrics = getStadiumFightOpaqueMetrics(reference);
    if (!metrics) return false;

    const fit = Math.min(
      STADIUM.fightIntro.fighterWidth / metrics.naturalWidth,
      STADIUM.fightIntro.fighterHeight / metrics.naturalHeight
    );

    stadiumFightBReferenceOpaqueHeights[group] =
      metrics.height * fit *
      (group === "left" ? STADIUM.fightIntro.schauenburgWalkLeftScale : 1);

    return true;
  }

  function layoutStadiumFightSpriteB(image, src) {
    if (!stadiumFightFighterB || !image || !image.naturalWidth || !image.naturalHeight) return;
    const metrics = getStadiumFightOpaqueMetrics(image);
    if (!metrics) return;

    const group = stadiumFightBGroupForSrc(src);
    if (stadiumFightBReferenceOpaqueHeights[group] == null) {
      ensureStadiumFightBReference(group);
    }

    let targetOpaqueHeight = stadiumFightBReferenceOpaqueHeights[group];

    // Fallback is deterministic and still uses the requested left enlargement.
    if (targetOpaqueHeight == null) {
      const fit = Math.min(
        STADIUM.fightIntro.fighterWidth / metrics.naturalWidth,
        STADIUM.fightIntro.fighterHeight / metrics.naturalHeight
      );
      targetOpaqueHeight = metrics.height * fit *
        (group === "left" ? STADIUM.fightIntro.schauenburgWalkLeftScale : 1);
    }

    // Every frame in a movement group gets the SAME visible opaque height.
    // Combined with the opaque foot anchor this eliminates the left-run bounce.
    const scale = targetOpaqueHeight / Math.max(1, metrics.height);
    const footGap = (metrics.naturalHeight - 1 - metrics.footBottomY) * scale;

    image.style.width = `${(metrics.naturalWidth * scale).toFixed(3)}px`;
    image.style.height = `${(metrics.naturalHeight * scale).toFixed(3)}px`;
    image.style.bottom = `${(-footGap).toFixed(3)}px`;
    image.style.transform = "translateX(-50%)";
  }

  function setStadiumFightSpriteB(src, force = false) {
    if (!stadiumFightFighterB || !src) return;
    if (!force && stadiumFightFighterB.currentSrc === src) return;
    const token = ++stadiumFightFighterBSpriteToken;
    const nextIndex = 1 - stadiumFightFighterB.activeIndex;
    const nextImage = stadiumFightFighterB.images[nextIndex];
    const oldImage = stadiumFightFighterB.images[stadiumFightFighterB.activeIndex];
    const reveal = () => {
      if (token !== stadiumFightFighterBSpriteToken) return;
      layoutStadiumFightSpriteB(nextImage, src);
      nextImage.classList.add("stadium-fighter__sprite--active");
      oldImage.classList.remove("stadium-fighter__sprite--active");
      stadiumFightFighterB.activeIndex = nextIndex;
      stadiumFightFighterB.currentSrc = src;
    };
    nextImage.onload = reveal;
    nextImage.src = encodeURI(src);
    if (nextImage.complete && nextImage.naturalWidth > 0) reveal();
  }

  function setStadiumFightPositionB(x, y) {
    if (!stadiumFightFighterB) return;
    stadiumFightFighterB.x = x;
    stadiumFightFighterB.y = y;
    stadiumFightFighterB.root.style.left = `${x}px`;
    stadiumFightFighterB.root.style.top = `${y}px`;
  }

  function moveStadiumFighterBToward(target, speed, deltaSeconds) {
    if (!stadiumFightFighterB) return true;
    const dx = target.x - stadiumFightFighterB.x;
    const dy = target.y - stadiumFightFighterB.y;
    const distance = Math.hypot(dx, dy);
    if (distance <= 4) { setStadiumFightPositionB(target.x, target.y); return true; }
    const step = Math.min(distance, speed * deltaSeconds);
    setStadiumFightPositionB(
      stadiumFightFighterB.x + (dx / distance) * step,
      stadiumFightFighterB.y + (dy / distance) * step
    );
    if (step >= distance) { setStadiumFightPositionB(target.x, target.y); return true; }
    return false;
  }

  function updateStadiumFighterBWalkAnimation(now, frames, mirror = false) {
    if (!stadiumFightFighterB || !frames.length) return;
    if (now >= stadiumFightFighterBNextFrameAt) {
      while (now >= stadiumFightFighterBNextFrameAt) {
        stadiumFightFighterBFrameIndex = (stadiumFightFighterBFrameIndex + 1) % frames.length;
        stadiumFightFighterBNextFrameAt += STADIUM.fightIntro.frameDuration;
      }
      setStadiumFightSpriteB(frames[stadiumFightFighterBFrameIndex]);
    }
    for (const img of stadiumFightFighterB.images) {
      const base = "translateX(-50%)";
      img.style.transform = mirror ? `${base} scaleX(-1)` : base;
    }
  }

  function layoutStadiumBrawlSprite(image, mirror = false) {
    if (!image || !image.naturalWidth || !image.naturalHeight) return;
    const metrics = getStadiumFightOpaqueMetrics(image);
    if (!metrics) return;
    const scale = STADIUM.fightIntro.brawl.targetOpaqueHeight / Math.max(1, metrics.height);
    const footGap = (metrics.naturalHeight - 1 - metrics.footBottomY) * scale;
    image.style.width = `${(metrics.naturalWidth * scale).toFixed(3)}px`;
    image.style.height = `${(metrics.naturalHeight * scale).toFixed(3)}px`;
    image.style.bottom = `${(-footGap).toFixed(3)}px`;
    image.style.transform = mirror ? "translateX(-50%) scaleX(-1)" : "translateX(-50%)";
  }

  function setStadiumBrawlLayerVisible(layer, visible) {
    if (!layer || !layer.root) return;
    layer.root.classList.toggle("stadium-brawl-layer--visible", visible);
  }

  function hideAllStadiumBrawlLayers() {
    if (!stadiumBrawlVisuals) return;
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.attackA, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.shared, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.attackB, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.hitNeuenstein, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.hitSchauenburg, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.hitSchauenburgAlt, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.hitSchauenburgFourth, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.finishSetup, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.finishEvade, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.fatalityNeuenstein, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.fatalitySchauenburg, false);
  }

  function showStadiumBrawlAttack() {
    if (!stadiumBrawlVisuals) return;
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.shared, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.hitNeuenstein, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.hitSchauenburg, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.hitSchauenburgAlt, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.hitSchauenburgFourth, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.finishSetup, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.finishEvade, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.fatalityNeuenstein, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.fatalitySchauenburg, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.attackA, true);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.attackB, true);
    spawnStadiumBrawlDust();
  }

  function spawnStadiumBrawlDamageText(targetTeam) {
    if (!stadiumBrawlDamageTextRoot) return;

    const isNeuensteinTarget = targetTeam === "neuenstein";
    const point = isNeuensteinTarget
      ? STADIUM.fightIntro.brawl.neuensteinContact
      : STADIUM.fightIntro.brawl.schauenburgContact;

    const text = document.createElement("span");
    text.className =
      "stadium-brawl-damage " +
      (isNeuensteinTarget
        ? "stadium-brawl-damage--neuenstein"
        : "stadium-brawl-damage--schauenburg");
    text.textContent = "-20";
    text.style.left = `${point.x}px`;
    text.style.top = `${point.y - 870}px`;
    stadiumBrawlDamageTextRoot.appendChild(text);
    text.addEventListener("animationend", () => text.remove(), { once: true });
  }

  function clearStadiumBrawlDamageText() {
    if (stadiumBrawlDamageTextRoot) stadiumBrawlDamageTextRoot.replaceChildren();
  }

  function hideStadiumBrawlFatalityText() {
    if (!stadiumBrawlFatalityText) return;
    stadiumBrawlFatalityText.classList.remove(
      "stadium-brawl-fatality-text--visible",
      "stadium-brawl-fatality-text--neuenstein",
      "stadium-brawl-fatality-text--schauenburg"
    );
  }

  function showStadiumBrawlFatalityText(winner) {
    if (!stadiumBrawlFatalityText) return;
    stadiumBrawlFatalityText.classList.remove(
      "stadium-brawl-fatality-text--neuenstein",
      "stadium-brawl-fatality-text--schauenburg"
    );
    stadiumBrawlFatalityText.classList.add(
      winner === "neuenstein"
        ? "stadium-brawl-fatality-text--neuenstein"
        : "stadium-brawl-fatality-text--schauenburg",
      "stadium-brawl-fatality-text--visible"
    );
  }

  function showStadiumBrawlRest(allowHitRoll = true) {
    if (!stadiumBrawlVisuals) return;

    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.attackA, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.attackB, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.shared, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.hitNeuenstein, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.hitSchauenburg, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.hitSchauenburgAlt, false);
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.hitSchauenburgFourth, false);

    // Final/result holds remain neutral and must never consume another hit slot.
    if (!allowHitRoll) {
      setStadiumBrawlLayerVisible(stadiumBrawlVisuals.shared, true);
      return;
    }

    if (stadiumBrawlRestTurn === "neuenstein") {
      // First shared slot is always Neuenstein's 30% opportunity.
      const landed = Math.random() < STADIUM.derby.neuensteinChance;
      setStadiumBrawlLayerVisible(
        landed ? stadiumBrawlVisuals.hitNeuenstein : stadiumBrawlVisuals.shared,
        true
      );
      if (landed) {
        // Neuenstein hits Schauenburg: red -20 + one random successful-hit sound (2-4).
        spawnStadiumBrawlDamageText("schauenburg");
        playRandomStadiumArenaSfx(STADIUM_ARENA_SFX.neuensteinHits);
      } else {
        // No hit: two different neutral-rest sounds (available attachments 8-10),
        // always played directly one after another.
        playStadiumArenaNeutralRestPair();
      }
      stadiumBrawlRestTurn = "schauenburg";
      return;
    }

    // Next shared slot is Schauenburg's 70% opportunity.
    const landed = Math.random() < STADIUM.derby.schauenburgChance;
    if (!landed) {
      setStadiumBrawlLayerVisible(stadiumBrawlVisuals.shared, true);
      // No hit: two different neutral-rest sounds, directly sequential.
      playStadiumArenaNeutralRestPair();
    } else {
      stadiumBrawlSchauenburgSuccessfulHits += 1;
      const fourthSuccessfulHit = stadiumBrawlSchauenburgSuccessfulHits % 4 === 0;

      // R87 — hit 4 is still ALWAYS the established leg-pull frame.
      // Hits 1-3 randomly use either normal Schauenburg hit composition.
      const normalSchauenburgHitLayer = Math.random() < 0.5
        ? stadiumBrawlVisuals.hitSchauenburg
        : stadiumBrawlVisuals.hitSchauenburgAlt;

      setStadiumBrawlLayerVisible(
        fourthSuccessfulHit
          ? stadiumBrawlVisuals.hitSchauenburgFourth
          : normalSchauenburgHitLayer,
        true
      );

      // Schauenburg hits Neuenstein: light-blue -20 + random successful-hit sound (5-6).
      spawnStadiumBrawlDamageText("neuenstein");
      playRandomStadiumArenaSfx(STADIUM_ARENA_SFX.schauenburgHits);

      // R85: after this existing 4th-hit frame has held for the normal restMs,
      // the normal attack/rest loop stops and the finish branch begins.
      if (fourthSuccessfulHit) stadiumBrawlFatalityPending = true;
    }
    stadiumBrawlRestTurn = "neuenstein";
  }

  function clearStadiumBrawlDust() {
    if (stadiumBrawlDust) stadiumBrawlDust.replaceChildren();
  }

  function spawnStadiumBrawlDust() {
    if (!stadiumBrawlDust) return;
    const count = 4 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i += 1) {
      const puff = document.createElement("span");
      puff.className = "stadium-brawl-dust__puff";
      puff.style.setProperty("--dust-size", `${90 + Math.round(Math.random() * 95)}px`);
      puff.style.setProperty("--dust-x", `${Math.round((Math.random() - .5) * 260)}px`);
      puff.style.setProperty("--dust-y", `${Math.round((Math.random() - .5) * 105)}px`);
      puff.style.setProperty("--dust-dx", `${Math.round((Math.random() - .5) * 95)}px`);
      puff.style.setProperty("--dust-dy", `${-10 - Math.round(Math.random() * 42)}px`);
      puff.style.setProperty("--dust-life", `${270 + Math.round(Math.random() * 120)}ms`);
      stadiumBrawlDust.appendChild(puff);
      puff.addEventListener("animationend", () => puff.remove(), { once: true });
    }
  }

  function setStadiumFighterAMirrored(mirrored) {
    if (!stadiumFightFighter) return;
    for (const img of stadiumFightFighter.images) {
      img.style.transform = mirrored
        ? "translateX(-50%) scaleX(-1)"
        : "translateX(-50%)";
    }
  }

  function beginStadiumBrawlFatalitySetup(now) {
    stadiumBrawlFatalityPending = false;
    stadiumBrawlFatalityEvaded = null;
    clearStadiumBrawlDust();
    clearStadiumBrawlDamageText();
    hideStadiumBrawlFatalityText();
    hideAllStadiumBrawlLayers();
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.finishSetup, true);
    stadiumBrawlPhaseEndAt = now + STADIUM.fightIntro.brawl.finishSetupMs;
    stadiumState = "fight-fatality-setup";
  }

  function resolveStadiumBrawlFatalityEvade(now) {
    // Exactly one 30% evade roll, using the existing bookmaker chance.
    stadiumBrawlFatalityEvaded = Math.random() < STADIUM.derby.neuensteinChance;
    hideAllStadiumBrawlLayers();

    if (stadiumBrawlFatalityEvaded) {
      setStadiumBrawlLayerVisible(stadiumBrawlVisuals.finishEvade, true);
      stadiumBrawlPhaseEndAt = now + STADIUM.fightIntro.brawl.finishEvadeMs;
      stadiumState = "fight-fatality-evade";
      return;
    }

    stadiumBrawlWinner = "schauenburg";
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.fatalitySchauenburg, true);
    showStadiumBrawlFatalityText("schauenburg");
    playStadiumArenaKillSequenceOnce();
    stadiumBrawlPhaseEndAt = now + STADIUM.fightIntro.brawl.fatalityMs;
    stadiumState = "fight-fatality-schauenburg";
  }

  function beginStadiumBrawlNeuensteinFatality(now) {
    hideAllStadiumBrawlLayers();
    stadiumBrawlWinner = "neuenstein";
    setStadiumBrawlLayerVisible(stadiumBrawlVisuals.fatalityNeuenstein, true);
    showStadiumBrawlFatalityText("neuenstein");
    playStadiumArenaKillSequenceOnce();
    stadiumBrawlPhaseEndAt = now + STADIUM.fightIntro.brawl.fatalityMs;
    stadiumState = "fight-fatality-neuenstein";
  }

  function beginStadiumBrawl(now = performance.now()) {
    if (stadiumBrawlStarted || !stadiumFightFighter || !stadiumFightFighterB) return;
    stadiumBrawlStarted = true;

    // One and only one outcome roll. Uses the exact existing bookmaker chance.
    stadiumBrawlWinner = Math.random() < STADIUM.derby.schauenburgChance
      ? "schauenburg"
      : "neuenstein";
    stadiumBrawlCyclesTarget = STADIUM.fightIntro.brawl.minCycles +
      Math.floor(Math.random() * (STADIUM.fightIntro.brawl.maxCycles - STADIUM.fightIntro.brawl.minCycles + 1));
    stadiumBrawlCyclesDone = 0;
    stadiumBrawlRestTurn = "neuenstein";
    stadiumBrawlSchauenburgSuccessfulHits = 0;
    stadiumBrawlFatalityPending = false;
    stadiumBrawlFatalityEvaded = null;
    stadiumBrawlApproachStartedAt = now;
    stadiumBrawlApproachStartA = { x: stadiumFightFighter.x, y: stadiumFightFighter.y };
    stadiumBrawlApproachStartB = { x: stadiumFightFighterB.x, y: stadiumFightFighterB.y };
    stadiumFightFrameIndex = 0;
    stadiumFightFighterBFrameIndex = 0;
    stadiumFightNextFrameAt = now + STADIUM.fightIntro.frameDuration;
    stadiumFightFighterBNextFrameAt = now + STADIUM.fightIntro.frameDuration;
    hideAllStadiumBrawlLayers();
    clearStadiumBrawlDust();
    clearStadiumBrawlDamageText();
    hideStadiumBrawlFatalityText();

    // Reuse the already-proven side-run animation groups in the reverse direction.
    setStadiumFightSprite(STADIUM.fightIntro.walkRightFrames[0], true);
    setStadiumFightSpriteB(STADIUM.fightIntro.schauenburgWalkLeftFrames[0], true);
    setStadiumFighterAMirrored(true);
    for (const img of stadiumFightFighterB.images) img.style.transform = "translateX(-50%)";
    stadiumState = "fight-brawl-approach";
  }

  function updateStadiumBrawlApproach(now) {
    if (!stadiumBrawlApproachStartA || !stadiumBrawlApproachStartB) return;
    updateStadiumFighterWalkAnimation(now, STADIUM.fightIntro.walkRightFrames);
    updateStadiumFighterBWalkAnimation(now, STADIUM.fightIntro.schauenburgWalkLeftFrames, false);
    setStadiumFighterAMirrored(true);

    const duration = Math.max(1, STADIUM.fightIntro.brawl.approachDurationMs);
    const t = Math.min(1, Math.max(0, (now - stadiumBrawlApproachStartedAt) / duration));
    const eased = t * t * (3 - 2 * t);
    const aTarget = STADIUM.fightIntro.brawl.neuensteinContact;
    const bTarget = STADIUM.fightIntro.brawl.schauenburgContact;

    setStadiumFightPosition(
      stadiumBrawlApproachStartA.x + (aTarget.x - stadiumBrawlApproachStartA.x) * eased,
      stadiumBrawlApproachStartA.y + (aTarget.y - stadiumBrawlApproachStartA.y) * eased
    );
    setStadiumFightPositionB(
      stadiumBrawlApproachStartB.x + (bTarget.x - stadiumBrawlApproachStartB.x) * eased,
      stadiumBrawlApproachStartB.y + (bTarget.y - stadiumBrawlApproachStartB.y) * eased
    );

    if (t < 1) return;

    // The entry roots are replaced only now; the actual hit images are isolated R82 layers.
    stadiumFightFighter.root.classList.remove("stadium-fighter--visible");
    stadiumFightFighterB.root.classList.remove("stadium-fighter--visible");
    showStadiumBrawlAttack();
    stadiumBrawlPhaseEndAt = now + STADIUM.fightIntro.brawl.attackMs;
    stadiumState = "fight-brawl-attack";
  }

  function updateStadiumBrawl(now) {
    if (stadiumState === "fight-brawl-approach") {
      updateStadiumBrawlApproach(now);
      return true;
    }

    if (stadiumState === "fight-brawl-attack") {
      if (now < stadiumBrawlPhaseEndAt) return true;
      showStadiumBrawlRest();
      stadiumBrawlPhaseEndAt = now + STADIUM.fightIntro.brawl.restMs;
      stadiumState = "fight-brawl-rest";
      return true;
    }

    if (stadiumState === "fight-brawl-rest") {
      if (now < stadiumBrawlPhaseEndAt) return true;

      // R85: the existing 4th Schauenburg hit held for its full normal restMs.
      // From here on, no more normal hit rolls, dust or 50–90-cycle loop.
      if (stadiumBrawlFatalityPending) {
        beginStadiumBrawlFatalitySetup(now);
        return true;
      }

      stadiumBrawlCyclesDone += 1;
      if (stadiumBrawlCyclesDone >= stadiumBrawlCyclesTarget) {
        // Fallback remains the neutral shared frame if no fatality branch was reached.
        showStadiumBrawlRest(false);
        stadiumState = "fight-brawl-result";
        return true;
      }
      showStadiumBrawlAttack();
      stadiumBrawlPhaseEndAt = now + STADIUM.fightIntro.brawl.attackMs;
      stadiumState = "fight-brawl-attack";
      return true;
    }

    if (stadiumState === "fight-fatality-setup") {
      if (now < stadiumBrawlPhaseEndAt) return true;
      resolveStadiumBrawlFatalityEvade(now);
      return true;
    }

    if (stadiumState === "fight-fatality-evade") {
      if (now < stadiumBrawlPhaseEndAt) return true;
      beginStadiumBrawlNeuensteinFatality(now);
      return true;
    }

    if (
      stadiumState === "fight-fatality-neuenstein" ||
      stadiumState === "fight-fatality-schauenburg"
    ) {
      if (now < stadiumBrawlPhaseEndAt) return true;
      stadiumState = "fight-brawl-result";
      showStadiumResultUI();
      return true;
    }

    if (stadiumState === "fight-brawl-result") return true;
    return false;
  }

  function setStadiumArenaAnnouncerFrame(index, visible = true) {
    if (!stadiumArenaAnnouncer) return;
    const safeIndex = Math.max(0, Math.min(stadiumArenaAnnouncer.images.length - 1, index));

    stadiumArenaAnnouncer.root.classList.toggle(
      "stadium-arena-announcer--visible",
      visible
    );

    stadiumArenaAnnouncer.images.forEach((img, i) => {
      img.classList.toggle(
        "stadium-arena-announcer__sprite--active",
        visible && i === safeIndex
      );
    });

    stadiumArenaAnnouncer.activeIndex = visible ? safeIndex : -1;
  }

  function hideStadiumArenaAnnouncer() {
    if (!stadiumArenaAnnouncer) return;
    stadiumArenaAnnouncer.root.classList.remove("stadium-arena-announcer--visible");
    stadiumArenaAnnouncer.images.forEach((img) => {
      img.classList.remove("stadium-arena-announcer__sprite--active");
    });
    stadiumArenaAnnouncer.activeIndex = -1;
  }

  function beginStadiumFinalCountdown(now = performance.now()) {
    if (stadiumState !== "schauenburg-ready") return;

    stadiumState = "fight-final-sync";
    stadiumFinalSequenceStartedAt = 0;
    stadiumFinalSequenceStep = -1;
    setStadiumFightOverlay(null);

    // Prompt Anhang 2: first image appears exactly with the sound.
    setStadiumArenaAnnouncerFrame(0, true);

    playStadiumFightAnnouncerOnce().then(() => {
      const currentMs = Number.isFinite(stadiumFightAnnouncerAudio.currentTime)
        ? stadiumFightAnnouncerAudio.currentTime * 1000
        : 0;
      stadiumFinalSequenceStartedAt = performance.now() - currentMs;
    });
  }

  function updateStadiumFinalCountdown(now) {
    if (stadiumState !== "fight-final-sync" || !stadiumFinalSequenceStartedAt) return;

    // The audio itself is the master clock.
    const elapsedMs =
      !stadiumFightAnnouncerAudio.paused &&
      Number.isFinite(stadiumFightAnnouncerAudio.currentTime)
        ? stadiumFightAnnouncerAudio.currentTime * 1000
        : Math.max(0, now - stadiumFinalSequenceStartedAt);

    if (
      elapsedMs >= STADIUM.fightIntro.finalCountdown3AtMs &&
      stadiumFinalSequenceStep < 1
    ) {
      stadiumFinalSequenceStep = 1;
      // Prompt Anhang 3 after exactly 2 seconds.
      setStadiumArenaAnnouncerFrame(1, true);
      setStadiumFightOverlay("countdown", "3");
    }

    if (
      elapsedMs >= STADIUM.fightIntro.finalCountdown2AtMs &&
      stadiumFinalSequenceStep < 2
    ) {
      stadiumFinalSequenceStep = 2;
      setStadiumFightOverlay("countdown", "2");
    }

    if (
      elapsedMs >= STADIUM.fightIntro.finalCountdown1AtMs &&
      stadiumFinalSequenceStep < 3
    ) {
      stadiumFinalSequenceStep = 3;
      setStadiumFightOverlay("countdown", "1");
    }

    if (
      elapsedMs >= STADIUM.fightIntro.finalPruegelAtMs &&
      stadiumFinalSequenceStep < 4
    ) {
      stadiumFinalSequenceStep = 4;
      // Prompt Anhang 4 + PRÜGEL exactly on TIME at 5.000 seconds.
      setStadiumArenaAnnouncerFrame(2, true);
      setStadiumFightOverlay("pruegel", "PRÜGEL!");
      stadiumState = "fight-pruegel-ready";
      stadiumFightPhaseEndAt = now + STADIUM.fightIntro.pruegelMs;
    }
  }

  function resetStadiumFightIntro() {
    stadiumFightStarted = false;
    stadiumFightAnnouncerPlayed = false;
    stadiumBattleHornPlayed = false;
    stadiumArenaKillSequencePlayed = false;
    stopAllStadiumArenaSfx();
    stadiumFinalSequenceStartedAt = 0;
    stadiumFinalSequenceStep = -1;
    stadiumBrawlStarted = false;
    stadiumBrawlWinner = null;
    stadiumResultShown = false;
    stadiumBrawlCyclesTarget = 0;
    stadiumBrawlCyclesDone = 0;
    stadiumBrawlRestTurn = "neuenstein";
    stadiumBrawlSchauenburgSuccessfulHits = 0;
    stadiumBrawlFatalityPending = false;
    stadiumBrawlFatalityEvaded = null;
    stadiumBrawlPhaseEndAt = 0;
    stadiumBrawlApproachStartedAt = 0;
    stadiumBrawlApproachStartA = null;
    stadiumBrawlApproachStartB = null;
    hideAllStadiumBrawlLayers();
    clearStadiumBrawlDust();
    clearStadiumBrawlDamageText();
    hideStadiumBrawlFatalityText();
    try {
      stadiumFightAnnouncerAudio.pause();
      stadiumFightAnnouncerAudio.currentTime = 0;
      stadiumBattleHornAudio.pause();
      stadiumBattleHornAudio.currentTime = 0;
    } catch (_) {}
    hideStadiumArenaAnnouncer();
    stadiumFightPhaseEndAt = 0;
    stadiumFightFrameIndex = 0;
    stadiumFightNextFrameAt = 0;
    stadiumFightLastState = "";
    ensureStadiumFightReference("up");
    ensureStadiumFightReference("right");
    setStadiumFightOverlay(null);

    if (stadiumFightFighter) {
      stadiumFightFighter.root.classList.remove("stadium-fighter--visible");
      setStadiumFightPosition(STADIUM.fightIntro.start.x, STADIUM.fightIntro.start.y);
      setStadiumFightSprite(STADIUM.fightIntro.walkUpFrames[0], true);
      setStadiumFighterAMirrored(false);
    }
    if (stadiumFightFighterB) {
      stadiumFightFighterB.root.classList.remove("stadium-fighter--visible");
      setStadiumFightPositionB(STADIUM.fightIntro.schauenburgStart.x, STADIUM.fightIntro.schauenburgStart.y);
      setStadiumFightSpriteB(STADIUM.fightIntro.schauenburgWalkUpFrames[0], true);
      for (const img of stadiumFightFighterB.images) img.style.transform = "translateX(-50%)";
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

    // R79: only NOW does RENCHTALSTADION switch from the continuing
    // OBERKIRCH music to its already existing dedicated battle track.
    stadiumBattleMusicStarted = true;
    crossfadeMapMusic("renchtalstadion");

    if (stadiumFightFighter) {
      stadiumFightFighter.root.classList.remove("stadium-fighter--visible");
      setStadiumFightPosition(STADIUM.fightIntro.start.x, STADIUM.fightIntro.start.y);
      setStadiumFightSprite(STADIUM.fightIntro.walkUpFrames[0], true);
    }

    // R81: after betting only the horn, music switch and normal entrance happen.
    // NO countdown and NO "It's time" effect at this moment.
    playStadiumBattleHornOnce();
    beginStadiumFighterWalkUp(now);
  }

  function advanceStadiumFightCountdown(now) {
    if (stadiumState === "fight-pre-countdown") {
      stadiumState = "fight-countdown-3";
      stadiumFightPhaseEndAt = now + STADIUM.fightIntro.countdownStepMs;
      setStadiumFightOverlay("countdown", "3");
      return true;
    }

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

    if (stadiumState === "fight-final-sync") {
      updateStadiumFinalCountdown(now);
      return;
    }

    if (stadiumState === "fight-pruegel-ready") {
      if (now >= stadiumFightPhaseEndAt) {
        setStadiumFightOverlay(null);
        hideStadiumArenaAnnouncer();
        stadiumState = "fight-await-brawl";
      }
      return;
    }

    if (stadiumState === "fight-await-brawl") {
      beginStadiumBrawl(now);
      return;
    }

    if (
      stadiumState === "fight-brawl-approach" ||
      stadiumState === "fight-brawl-attack" ||
      stadiumState === "fight-brawl-rest" ||
      stadiumState === "fight-fatality-setup" ||
      stadiumState === "fight-fatality-evade" ||
      stadiumState === "fight-fatality-neuenstein" ||
      stadiumState === "fight-fatality-schauenburg" ||
      stadiumState === "fight-brawl-result"
    ) {
      updateStadiumBrawl(now);
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
        stadiumFightPhaseEndAt = now;
      }
      return;
    }

    // R79: Fighter A = Rohart-Neuenstein. As soon as he reaches his green
    // final position, Fighter B = Schauenburg enters through the same gate.
    if (stadiumState === "fighter-ready") {
      stadiumState = "schauenburg-entry-up";
      stadiumFightFighterBFrameIndex = 0;
      stadiumFightFighterBNextFrameAt = now + STADIUM.fightIntro.frameDuration;
      setStadiumFightPositionB(STADIUM.fightIntro.schauenburgStart.x, STADIUM.fightIntro.schauenburgStart.y);
      setStadiumFightSpriteB(STADIUM.fightIntro.schauenburgWalkUpFrames[0], true);
      if (stadiumFightFighterB) stadiumFightFighterB.root.classList.add("stadium-fighter--visible");
      return;
    }

    if (stadiumState === "schauenburg-entry-up") {
      updateStadiumFighterBWalkAnimation(now, STADIUM.fightIntro.schauenburgWalkUpFrames, false);
      if (moveStadiumFighterBToward(STADIUM.fightIntro.schauenburgLinePoint, STADIUM.fightIntro.schauenburgSpeedUp, deltaSeconds)) {
        stadiumState = "schauenburg-victory";
        stadiumFightPhaseEndAt = now + STADIUM.fightIntro.victoryDuration;
        setStadiumFightSpriteB(STADIUM.fightIntro.schauenburgVictoryFrame);
      }
      return;
    }

    if (stadiumState === "schauenburg-victory") {
      if (now < stadiumFightPhaseEndAt) return;
      stadiumState = "schauenburg-entry-left";
      stadiumFightFighterBFrameIndex = 0;
      stadiumFightFighterBNextFrameAt = now + STADIUM.fightIntro.frameDuration;
      setStadiumFightSpriteB(STADIUM.fightIntro.schauenburgWalkLeftFrames[0]);
      for (const img of stadiumFightFighterB.images) img.style.transform = "translateX(-50%) scaleX(-1)";
      return;
    }

    if (stadiumState === "schauenburg-entry-left") {
      updateStadiumFighterBWalkAnimation(now, STADIUM.fightIntro.schauenburgWalkLeftFrames, true);
      if (moveStadiumFighterBToward(STADIUM.fightIntro.schauenburgLeftPoint, STADIUM.fightIntro.schauenburgSpeedLeft, deltaSeconds)) {
        stadiumState = "schauenburg-ready";
        setStadiumFightSpriteB(STADIUM.fightIntro.schauenburgReadyFrame);
        for (const img of stadiumFightFighterB.images) img.style.transform = "translateX(-50%)";

        // Both fighters are in position: NOW start "It's time" + announcer.
        beginStadiumFinalCountdown(now);
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
    stadiumBattleMusicStarted = false;
    resetStadiumFightIntro();
    stadiumState = "arrival-walk";
    keys.clear();
    cancelAttackImmediately();
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
    stadiumBattleMusicStarted = false;
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

      .start-flow__key-error {
        min-height: 18px;
        margin: 7px 0 0;
        color: #d7b9a7;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 14px;
        letter-spacing: .04em;
        opacity: 0;
        transition: opacity 150ms ease;
      }

      .start-flow__key-error--visible { opacity: 1; }

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

    // R126: product key and player name are two physically separate form stages.
    // This prevents the first form from ever being silently reused as the name form.
    const namePanel = document.createElement("div");
    namePanel.className = "start-flow__name-panel";

    const keyForm = document.createElement("form");
    keyForm.className = "start-flow__gate-stage";
    keyForm.autocomplete = "off";

    const keyLabel = document.createElement("label");
    keyLabel.className = "start-flow__name-label";
    keyLabel.htmlFor = "startProductKey";
    keyLabel.textContent = "PRODUKTSCHLÜSSEL:";

    const keyInput = document.createElement("input");
    keyInput.id = "startProductKey";
    keyInput.className = "start-flow__name-input";
    keyInput.type = "text";
    keyInput.maxLength = 32;
    keyInput.spellcheck = false;
    keyInput.autocomplete = "off";
    keyInput.setAttribute("aria-label", "Produktschlüssel");

    const keyError = document.createElement("div");
    keyError.className = "start-flow__key-error";
    keyError.textContent = "UNGÜLTIGER PRODUKTSCHLÜSSEL";
    keyError.setAttribute("aria-live", "polite");

    const keyButton = document.createElement("button");
    keyButton.className = "start-flow__continue";
    keyButton.type = "submit";
    keyButton.textContent = "AKTIVIEREN";
    keyButton.disabled = true;

    keyForm.append(keyLabel, keyInput, keyError, keyButton);

    const playerNameForm = document.createElement("form");
    playerNameForm.className = "start-flow__gate-stage";
    playerNameForm.autocomplete = "off";
    playerNameForm.hidden = true;

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

    playerNameForm.append(nameLabel, nameInput, continueButton);
    namePanel.append(keyForm, playerNameForm);
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
      keyForm,
      keyInput,
      keyError,
      keyButton,
      playerNameForm,
      nameLabel,
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

    keyInput.addEventListener("input", () => {
      keyButton.disabled = keyInput.value.trim().length === 0;
      keyError.classList.remove("start-flow__key-error--visible");
    });

    keyForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!startFlowUI || startFlowUI.transitionBusy) return;
      if (startFlowState !== "start-key") return;

      const key = keyInput.value.trim().toUpperCase();
      if (!START_PRODUCT_KEYS.has(key)) {
        keyError.classList.add("start-flow__key-error--visible");
        keyInput.focus();
        keyInput.select();
        return;
      }

      startFlowState = "start-name";
      keyForm.hidden = true;
      playerNameForm.hidden = false;
      keyError.classList.remove("start-flow__key-error--visible");
      nameInput.value = "";
      continueButton.disabled = true;
      nameInput.focus();
    });

    nameInput.addEventListener("input", () => {
      continueButton.disabled = nameInput.value.trim().length === 0;
    });

    playerNameForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!startFlowUI || startFlowUI.transitionBusy) return;
      if (startFlowState !== "start-name") return;

      const name = nameInput.value.trim();
      if (!name) return;
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

    startFlowState = "start-key";
    // R126 hard reset: every fresh start ALWAYS begins at the product-key gate.
    startFlowUI.keyForm.hidden = false;
    startFlowUI.playerNameForm.hidden = true;
    startFlowUI.keyInput.value = "";
    startFlowUI.keyButton.disabled = true;
    startFlowUI.keyError.classList.remove("start-flow__key-error--visible");
    startFlowUI.nameInput.value = "";
    startFlowUI.continueButton.disabled = true;
    startFlowUI.transitionBusy = true;
    keys.clear();
    attackHeld = false;
    cancelAttackImmediately();
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

    if (startFlowState !== "start-key") return;
    startFlowUI.namePanel.classList.add("start-flow__name-panel--visible");
    startFlowUI.transitionBusy = false;

    window.setTimeout(() => {
      if (startFlowState === "start-key") startFlowUI.keyInput.focus();
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

    // R120 CONTROL RESET: campaign must always begin in a clean movable state.
    keys.clear();
    attackHeld = false;
    attacking = false;
    attackSequence = null;
    attackStep = 0;
    attackTimer = 0;
    moving = false;

    // R102: HUD is created ONLY after login/name + hero selection are finished.
    // It therefore cannot exist on either start screen.
    createPlayerHud();

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
    // R143: blue marked Saukeule area remains two painted boxes high.
    weaponEquipRect: Object.freeze({ x1: 45, y1: 196, x2: 125, y2: 405 }),

    // R145 WHITE STAG KIT — aligned directly to the marked painted equipment areas.
    // Antler weapon spans ALL THREE left equipment boxes.
    kitWeaponEquipRect: Object.freeze({ x1: 45, y1: 196, x2: 125, y2: 590 }),
    // Armor and helmet are deliberately shifted downward versus R144.
    kitArmorEquipRect: Object.freeze({ x1: 205, y1: 246, x2: 335, y2: 440 }),
    kitHelmetEquipRect: Object.freeze({ x1: 370, y1: 255, x2: 465, y2: 380 })
  });

  let playerLevel = 1;
  let equippedWeapon = null;
  let equippedWeaponItem = null;
  let equippedKitItem = null;
  let playerArmorBonus = 0;

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
    weaponEquipZone: null,
    kitWeaponEquipZone: null,
    kitArmorEquipZone: null,
    kitHelmetEquipZone: null
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

      /* R154: hovered item owns the top inventory stacking context.
         EVERY tooltip/card therefore stays above all sibling inventory icons. */
      .inventory-item:hover,
      .inventory-item:focus-within {
        z-index: 100;
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

      /* R105 quickslot item: visually large in its 1x1 inventory cell. */
      .inventory-item--quickslot {
        cursor: grab;
      }

      .inventory-item--quickslot:active {
        cursor: grabbing;
      }

      .inventory-item--quickslot .inventory-item__icon {
        width: 92%;
        height: 92%;
      }

      /* R154 CALIPH LAMP hover card. */
      .inventory-caliph-tooltip {
        position: absolute;
        z-index: 46;
        left: calc(100% + 14px);
        top: 50%;
        width: clamp(250px, 25vw, 390px);
        transform: translateY(-50%);
        box-sizing: border-box;
        padding: 17px 20px;
        border: 1px solid rgba(218,174,72,.72);
        border-radius: 7px;
        background: rgba(8,8,8,.94);
        box-shadow: 0 10px 28px rgba(0,0,0,.72);
        color: #ffffff;
        font-family: Georgia, "Times New Roman", serif;
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        transition: opacity 100ms ease, visibility 100ms ease;
        white-space: normal;
      }

      .inventory-item--quickslot:hover .inventory-caliph-tooltip {
        opacity: 1;
        visibility: visible;
      }

      .inventory-caliph-tooltip__title {
        margin-bottom: 9px;
        color: #e6bd55;
        font-family: "Old English Text MT", "Lucida Blackletter", "UnifrakturCook", Georgia, serif;
        font-size: clamp(18px, 2.05vh, 26px);
        font-weight: 900;
        letter-spacing: .7px;
        text-shadow: 0 1px 2px #000;
      }

      .inventory-caliph-tooltip__description {
        margin-bottom: 12px;
        color: #f0eadb;
        font-size: clamp(13px, 1.55vh, 18px);
        font-style: italic;
        line-height: 1.3;
      }

      .inventory-caliph-tooltip__stat {
        margin-top: 5px;
        color: #ffffff;
        font-size: clamp(13px, 1.55vh, 18px);
        font-weight: 800;
        line-height: 1.28;
        text-shadow: 0 1px 2px #000;
      }

      /* R151 consumable hover cards: dark translucent, red heading + heart, white values. */
      .inventory-consumable-tooltip {
        position: absolute;
        z-index: 44;
        left: calc(100% + 14px);
        top: 50%;
        width: clamp(250px, 25vw, 390px);
        transform: translateY(-50%);
        box-sizing: border-box;
        padding: 16px 19px;
        border: 1px solid rgba(145,35,35,.72);
        border-radius: 7px;
        background: rgba(8,8,8,.92);
        box-shadow: 0 10px 28px rgba(0,0,0,.72);
        color: #ffffff;
        font-family: Georgia, "Times New Roman", serif;
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        transition: opacity 100ms ease, visibility 100ms ease;
        white-space: normal;
      }

      .inventory-item--quickslot:hover .inventory-consumable-tooltip {
        opacity: 1;
        visibility: visible;
      }

      .inventory-consumable-tooltip__title {
        display: flex;
        align-items: center;
        gap: 9px;
        margin-bottom: 10px;
        color: #d83333;
        font-family: "Old English Text MT", "Lucida Blackletter", "UnifrakturCook", Georgia, serif;
        font-size: clamp(17px, 2vh, 25px);
        font-weight: 900;
        letter-spacing: .5px;
        text-shadow: 0 1px 2px #000, 0 0 3px rgba(120,0,0,.7);
      }

      .inventory-consumable-tooltip__heart {
        color: #d83333;
        font-family: Georgia, serif;
        font-size: 1.05em;
        line-height: 1;
      }

      .inventory-consumable-tooltip__stat {
        margin-top: 5px;
        color: #ffffff;
        font-size: clamp(13px, 1.55vh, 18px);
        font-weight: 800;
        line-height: 1.28;
        text-shadow: 0 1px 2px #000;
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

      .inventory-item--equipment-kit {
        cursor: pointer;
      }

      /* R145: the unequipped White Stag kit is ONE logical 2x3 item,
         but is drawn as three separate cut-out pieces on the exact painted cells:
         left top = helmet (1 cell), left bottom = armor (2 cells),
         right column = antler weapon (3 cells). */
      .inventory-white-stag-kit-parts {
        position:absolute;
        inset:0;
        z-index:3;
        pointer-events:none;
      }

      .inventory-white-stag-kit-part {
        position:absolute;
        overflow:visible;
        pointer-events:none;
      }

      .inventory-white-stag-kit-part img {
        position:absolute;
        inset:0;
        width:100%;
        height:100%;
        object-fit:contain;
        object-position:50% 50%;
        display:block;
        pointer-events:none;
        filter:drop-shadow(0 2px 2px rgba(0,0,0,.72));
      }

      /* Parent 2x3 rect contains the small painted gaps between cells.
         These percentages reproduce the actual 64px cells + raster gaps. */
      .inventory-white-stag-kit-part--helmet {
        left:0%;
        top:0%;
        width:47.76%;
        height:31.25%;
      }

      .inventory-white-stag-kit-part--armor {
        left:0%;
        top:34.11%;
        width:47.76%;
        height:65.89%;
      }

      .inventory-white-stag-kit-part--weapon {
        left:52.24%;
        top:0%;
        width:47.76%;
        height:100%;
      }

      .inventory-item--equipment-kit:hover .inventory-kit-tooltip {
        opacity: 1;
        visibility: visible;
      }

      .inventory-item--equipment-kit.inventory-item--asset-missing::before {
        content: "KIT-ASSET FEHLT";
        position:absolute;
        inset:8%;
        display:grid;
        place-items:center;
        border:2px solid #e6bd55;
        background:rgba(20,12,4,.86);
        color:#e6bd55;
        font:900 clamp(10px,1.25vh,15px)/1.15 Georgia,serif;
        text-align:center;
        z-index:5;
        pointer-events:none;
      }

      .inventory-kit-tooltip {
        position: absolute;
        z-index: 45;
        left: calc(100% + 14px);
        top: 50%;
        width: clamp(270px, 26vw, 410px);
        transform: translateY(-50%);
        box-sizing: border-box;
        padding: 18px 20px;
        border: 1px solid rgba(232,190,76,.78);
        border-radius: 7px;
        background: rgba(255,255,255,.22);
        box-shadow: 0 10px 28px rgba(0,0,0,.55);
        color: #e6bd55;
        font-family: "Old English Text MT", "Lucida Blackletter", Georgia, serif;
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        transition: opacity 100ms ease, visibility 100ms ease;
        text-shadow: 0 1px 2px #000, 0 0 3px #000;
      }

      .inventory-kit-tooltip__title {
        margin-bottom: 10px;
        font-size: clamp(18px, 2.1vh, 27px);
        font-weight: 900;
      }

      .inventory-kit-tooltip__stat {
        margin-top: 5px;
        font-size: clamp(13px, 1.55vh, 18px);
        font-weight: 900;
        line-height: 1.25;
      }

      .inventory-kit-equip-zone {
        position: absolute;
        z-index: 7;
        box-sizing: border-box;
        pointer-events: auto;
        background: transparent;
      }

      .inventory-kit-equip-icon {
        position:absolute;
        inset:0;
        width:100%;
        height:100%;
        object-fit:contain;
        object-position:50% 50%;
        pointer-events:none;
        filter:drop-shadow(0 2px 2px rgba(0,0,0,.75));
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
    if (equippedKitItem && !unequipWhiteStagKitToInventory()) return false;
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


  function createCaliphLampTooltip() {
    const tooltip = document.createElement("div");
    tooltip.className = "inventory-caliph-tooltip";

    const title = document.createElement("div");
    title.className = "inventory-caliph-tooltip__title";
    title.textContent = CALIPH_LAMP_ITEM.name;

    const description = document.createElement("div");
    description.className = "inventory-caliph-tooltip__description";
    description.textContent = CALIPH_LAMP_ITEM.description;

    const chance = document.createElement("div");
    chance.className = "inventory-caliph-tooltip__stat";
    chance.textContent = `${Math.round(CALIPH_LAMP_ULTIMATE.successChance * 100)}% CHANCE AUF BESCHWÖRUNG`;

    const cooldown = document.createElement("div");
    cooldown.className = "inventory-caliph-tooltip__stat";
    cooldown.textContent = `${Math.round(CALIPH_LAMP_ULTIMATE.cooldownMs / 1000)} SEKUNDEN ABKLINGZEIT`;

    tooltip.append(title, description, chance, cooldown);
    return tooltip;
  }


  function createHealthConsumableTooltip(itemId) {
    const item = HEALTH_CONSUMABLE_BY_ID[itemId];
    if (!item) return document.createDocumentFragment();

    const tooltip = document.createElement("div");
    tooltip.className = "inventory-consumable-tooltip";

    const title = document.createElement("div");
    title.className = "inventory-consumable-tooltip__title";

    const heart = document.createElement("span");
    heart.className = "inventory-consumable-tooltip__heart";
    heart.textContent = "♥";

    const titleText = document.createElement("span");
    titleText.textContent = item.name;
    title.append(heart, titleText);

    const heal = document.createElement("div");
    heal.className = "inventory-consumable-tooltip__stat";
    heal.textContent = `+${item.heal} Gesundheit`;
    tooltip.append(title, heal);

    if (item.damageBonus) {
      const damage = document.createElement("div");
      damage.className = "inventory-consumable-tooltip__stat";
      damage.textContent =
        `+${Math.round(item.damageBonus * 100)}% Schaden für ${Math.round(item.damageBonusMs / 60000)} Minute`;
      tooltip.appendChild(damage);
    }

    return tooltip;
  }

  function createWhiteStagKitInventoryVisual() {
    const root = document.createElement("div");
    root.className = "inventory-white-stag-kit-parts";

    const parts = [
      ["helmet", WHITE_STAG_KIT.helmetIcon],
      ["armor", WHITE_STAG_KIT.armorIcon],
      ["weapon", WHITE_STAG_KIT.weaponIcon]
    ];

    for (const [kind, src] of parts) {
      const part = document.createElement("div");
      part.className = `inventory-white-stag-kit-part inventory-white-stag-kit-part--${kind}`;

      const img = document.createElement("img");
      img.src = encodeURI(src);
      img.alt = "";
      img.draggable = false;
      img.addEventListener("error", () => {
        console.warn(`White Stag ${kind} inventory asset failed to load:`, src);
      });

      part.appendChild(img);
      root.appendChild(part);
    }

    return root;
  }

  function createWhiteStagKitTooltip() {
    const tooltip = document.createElement("div");
    tooltip.className = "inventory-kit-tooltip";

    const title = document.createElement("div");
    title.className = "inventory-kit-tooltip__title";
    title.textContent = "Waffenrock vom weißen Hirsch";
    tooltip.appendChild(title);

    for (const text of [
      `Rüstung +${WHITE_STAG_KIT.armor}`,
      `${Math.round(WHITE_STAG_KIT.damageReduction * 100)}% weniger Schaden`,
      `Bewegungsgeschwindigkeit -${Math.round((1 - WHITE_STAG_KIT.movementSpeedMultiplier) * 100)}%`,
      `${WHITE_STAG_KIT.damage} Angriff`,
      `${WHITE_STAG_KIT.criticalDamage} Krit`
    ]) {
      const stat = document.createElement("div");
      stat.className = "inventory-kit-tooltip__stat";
      stat.textContent = text;
      tooltip.appendChild(stat);
    }
    return tooltip;
  }

  function applyWhiteStagKitStats(active) {
    playerArmorBonus = active ? WHITE_STAG_KIT.armor : 0;
  }

  function equipWhiteStagKitFromInventory(pageIndex, slotIndex) {
    if (equippedKitItem) return true;
    const page = inventoryState.pages[pageIndex];
    if (!page) return false;
    let anchorIndex = slotIndex;
    if (isInventoryOccupancyMarker(page[slotIndex])) anchorIndex = page[slotIndex].occupiedBy;
    const stack = page[anchorIndex];
    if (!stack || stack.id !== WHITE_STAG_KIT.id) return false;

    // Existing weapon returns to inventory before the full kit occupies equipment.
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
    equippedKitItem = removed;
    equippedWeapon = WHITE_STAG_KIT.id;
    applyWhiteStagKitStats(true);
    if (!playerDead && !attacking) setIdleSprite();
    renderInventory();
    return true;
  }

  function unequipWhiteStagKitToInventory() {
    if (!equippedKitItem) return false;
    const free = findFirstFreeInventoryArea(WHITE_STAG_KIT.inventoryWidth, WHITE_STAG_KIT.inventoryHeight);
    if (!free) return false;
    if (!placeInventoryItem(free.pageIndex, free.slotIndex, equippedKitItem)) return false;
    equippedKitItem = null;
    equippedWeapon = null;
    applyWhiteStagKitStats(false);
    if (!playerDead && !attacking) setIdleSprite();
    inventoryState.currentPage = free.pageIndex;
    renderInventory();
    return true;
  }

  function renderWhiteStagKitEquipment() {
    const zones = [
      [inventoryState.kitArmorEquipZone, WHITE_STAG_KIT.armorIcon],
      [inventoryState.kitHelmetEquipZone, WHITE_STAG_KIT.helmetIcon],
      [inventoryState.kitWeaponEquipZone, WHITE_STAG_KIT.weaponIcon]
    ];
    for (const [zone, src] of zones) {
      if (!zone) continue;
      zone.replaceChildren();
      if (!equippedKitItem) continue;
      const icon = document.createElement("img");
      icon.className = "inventory-kit-equip-icon";
      icon.src = encodeURI(src);
      icon.alt = "";
      icon.draggable = false;
      zone.appendChild(icon);
    }
  }

  function renderEquippedWeapon() {
    const zone = inventoryState.weaponEquipZone;
    if (!zone) return;
    zone.replaceChildren();
    zone.classList.remove("inventory-weapon-equip-zone--dragover");

    zone.draggable = Boolean(equippedWeaponItem);
    if (!equippedWeaponItem) {
      renderWhiteStagKitEquipment();
      return;
    }
    const icon = document.createElement("img");
    icon.className = "inventory-weapon-equip-icon";
    icon.src = encodeURI(equippedWeaponItem.icon || WEAPONS.pinkPigClub.icon);
    icon.alt = "";
    icon.draggable = false;
    zone.appendChild(icon);

    if (equippedWeaponItem.id === WEAPONS.pinkPigClub.id) {
      zone.appendChild(createSaukeuleTooltip());
    }
    renderWhiteStagKitEquipment();
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
      item.className =
        "inventory-item" +
        (stack.type === "weapon" ? " inventory-item--weapon" : "") +
        (stack.type === "quickslot" ? " inventory-item--quickslot" : "") +
        (stack.type === "equipment-kit" ? " inventory-item--equipment-kit" : "") +
        (stack.type === "teleporter" ? " inventory-item--teleporter" : "");
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
      } else if (stack.id === WHITE_STAG_KIT.id) {
        // R145: NO combined kit symbol. The three real cut-outs occupy the 2x3 block.
        item.appendChild(createWhiteStagKitInventoryVisual());
      } else if (stack.icon) {
        const icon = document.createElement("img");
        icon.className = "inventory-item__icon";
        icon.src = encodeURI(stack.icon);
        icon.alt = "";
        icon.draggable = false;
        icon.addEventListener("error", () => {
          console.warn("Inventory icon failed to load:", stack.icon);
        });
        item.appendChild(icon);
      }

      if (stack.stackable || (stack.quantity || 1) > 1) {
        const quantity = document.createElement("span");
        quantity.className = "inventory-item__quantity";
        quantity.textContent = String(stack.quantity || 1);
        item.appendChild(quantity);
      }

      if (stack.type === "teleporter") {
        item.title = "REISEKARTE · Linksklick: Schnellreise";
        item.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          openTeleporter();
        });
      } else if (stack.type === "equipment-kit") {
        item.appendChild(createWhiteStagKitTooltip());
        item.addEventListener("contextmenu", (event) => {
          event.preventDefault();
          equipWhiteStagKitFromInventory(inventoryState.currentPage, slotIndex);
        });
      } else if (stack.type === "weapon") {
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
      } else if (stack.type === "quickslot") {
        item.draggable = true;

        if (stack.id === CALIPH_LAMP_ITEM.id) {
          item.appendChild(createCaliphLampTooltip());
        } else if (HEALTH_CONSUMABLE_BY_ID[stack.id]) {
          item.appendChild(createHealthConsumableTooltip(stack.id));
        }

        item.addEventListener("contextmenu", (event) => {
          event.preventDefault();
          // Toggle: first right click binds to the first free 1–9 position.
          // A second right click removes that binding again.
          toggleInventoryQuickItem(stack.id);
        });

        item.addEventListener("dragstart", (event) => {
          if (!event.dataTransfer) return;
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", JSON.stringify({
            kind: "inventory-quickslot-item",
            itemId: stack.id,
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

  // R144: deterministic starter placement for the first White Stag kit.
  // The generic addItemToInventory path remains untouched for normal loot/crafting.
  function addStarterWhiteStagKit() {
    if (findInventoryStack(WHITE_STAG_KIT_ITEM.id) || equippedKitItem) return true;

    const stack = {
      id: WHITE_STAG_KIT_ITEM.id,
      name: WHITE_STAG_KIT_ITEM.name,
      description: WHITE_STAG_KIT_ITEM.description || "",
      icon: WHITE_STAG_KIT_ITEM.icon,
      width: WHITE_STAG_KIT_ITEM.width,
      height: WHITE_STAG_KIT_ITEM.height,
      quantity: 1,
      stackable: false,
      type: WHITE_STAG_KIT_ITEM.type
    };

    // Page I, columns 3+4, rows 1-3: exactly beside the starter club/lamp.
    const preferredPage = 0;
    const preferredSlot = 2;
    if (canPlaceInventoryItem(preferredPage, preferredSlot, stack.width, stack.height)) {
      placeInventoryItem(preferredPage, preferredSlot, stack);
      return true;
    }

    const free = findFirstFreeInventoryArea(stack.width, stack.height);
    if (!free) {
      console.warn("White Stag starter kit could not be placed: no free 2x3 inventory area.");
      return false;
    }
    placeInventoryItem(free.pageIndex, free.slotIndex, stack);
    return true;
  }

  function addStarterHealthConsumables() {
    const placements = [
      [HEALTH_CONSUMABLES.bandage, 7],
      [HEALTH_CONSUMABLES.herbalWrap, 13],
      [HEALTH_CONSUMABLES.herbalPunchSpinach, 19]
    ];

    for (const [item, preferredSlot] of placements) {
      const existing = findInventoryStack(item.id);
      if (existing) {
        existing.stack.quantity = Math.max(10, Number(existing.stack.quantity) || 0);
        continue;
      }

      const stack = {
        id: item.id,
        name: item.name,
        description: "",
        icon: item.icon,
        width: 1,
        height: 1,
        quantity: 10,
        stackable: true,
        type: "quickslot"
      };

      if (canPlaceInventoryItem(0, preferredSlot, 1, 1)) {
        placeInventoryItem(0, preferredSlot, stack);
      } else {
        const free = findFirstFreeInventoryArea(1, 1);
        if (!free || !placeInventoryItem(free.pageIndex, free.slotIndex, stack)) {
          console.warn("Starter-Heilitem konnte nicht platziert werden:", item.id);
        }
      }
    }

    if (inventoryState.open) renderInventory();
    return true;
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
      PINK_PIG_CLUB_ITEM.icon, CALIPH_LAMP_ITEM.icon, TELEPORTER_ITEM.icon,
      HEALTH_CONSUMABLES.bandage.icon,
      HEALTH_CONSUMABLES.herbalWrap.icon,
      HEALTH_CONSUMABLES.herbalPunchSpinach.icon,
      WHITE_STAG_KIT.inventoryIcon, WHITE_STAG_KIT.armorIcon,
      WHITE_STAG_KIT.helmetIcon, WHITE_STAG_KIT.weaponIcon
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

    const kitWeaponEquipZone = document.createElement("div");
    kitWeaponEquipZone.className = "inventory-kit-equip-zone";
    setInventoryRect(kitWeaponEquipZone, INVENTORY_CONFIG.kitWeaponEquipRect);
    kitWeaponEquipZone.setAttribute("aria-label", "Weißhirsch-Kitwaffe");

    const kitArmorEquipZone = document.createElement("div");
    kitArmorEquipZone.className = "inventory-kit-equip-zone";
    setInventoryRect(kitArmorEquipZone, INVENTORY_CONFIG.kitArmorEquipRect);
    kitArmorEquipZone.setAttribute("aria-label", "Weißhirsch-Waffenrock");

    const kitHelmetEquipZone = document.createElement("div");
    kitHelmetEquipZone.className = "inventory-kit-equip-zone";
    setInventoryRect(kitHelmetEquipZone, INVENTORY_CONFIG.kitHelmetEquipRect);
    kitHelmetEquipZone.setAttribute("aria-label", "Weißhirsch-Helm");

    for (const zone of [kitWeaponEquipZone, kitArmorEquipZone, kitHelmetEquipZone]) {
      zone.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        if (equippedKitItem) unequipWhiteStagKitToInventory();
      });
    }

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

    panel.append(image, slotsLayer, weaponEquipZone, kitWeaponEquipZone, kitArmorEquipZone, kitHelmetEquipZone, closeButton, page1Button, page2Button);
    root.appendChild(panel);
    document.body.appendChild(root);

    inventoryState.root = root;
    inventoryState.panel = panel;
    inventoryState.image = image;
    inventoryState.slotsLayer = slotsLayer;
    inventoryState.closeButton = closeButton;
    inventoryState.pageButtons = [page1Button, page2Button];
    inventoryState.weaponEquipZone = weaponEquipZone;
    inventoryState.kitWeaponEquipZone = kitWeaponEquipZone;
    inventoryState.kitArmorEquipZone = kitArmorEquipZone;
    inventoryState.kitHelmetEquipZone = kitHelmetEquipZone;

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
    } else if (map.id === "oedsbach") {
      label = "ÖDSBACH";
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
    const sourceMap = MAP;
    const sourceMapId = MAP.id;
    const scriptedStadiumArrival =
      sourceMapId === "oberkirch-zentrum" && nextMap.id === STADIUM.mapId;
    mapTransitioning = true;
    keys.clear();
    cancelAttackImmediately();
    activeBridge = null;

    const overlay = transitionOverlay();

    // Exact requested exit: one-second fade to black.
    overlay.style.transition = "opacity 200ms ease";
    overlay.style.webkitMaskImage = "none";
    overlay.style.maskImage = "none";
    overlay.style.opacity = "1";

    // R79: OBERKIRCH -> RENCHTALSTADION keeps the exact same OBERKIRCH
    // track running seamlessly. The dedicated stadium battle track begins
    // only once "Wette abschließen" starts the fight.
    const nextMusicId = scriptedStadiumArrival
      ? "oberkirch-zentrum"
      : nextMap.id;
    crossfadeMapMusic(nextMusicId);

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
    } catch (error) {
      // R94 HARD FAILSAFE:
      // A missing/corrupt map asset must NEVER strand the game behind
      // the black transition curtain. Restore the source map immediately.
      console.error("Map image failed to load:", MAP.image, error);
      MAP = sourceMap;
      resizeWorldForCurrentMap();
      mapImage.src = encodeURI(MAP.image);
      try {
        await waitForImage(mapImage);
      } catch (_) {}

      overlay.style.transition = "none";
      overlay.style.opacity = "0";
      overlay.style.webkitMaskImage = "none";
      overlay.style.maskImage = "none";
      overlay.style.setProperty("--iris-radius", "0%");
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
    activeRamsbachSnap = null;
    ramsbachSnapping = false;
    activeOppenauBridgeSnap = null;

    setOberkirchWorldVisibility(MAP.id === "oberkirch-zentrum");
    setWinterbachWorldVisibility(MAP.id === "winterbach-ranglehen");
    setLautenbachWorldVisibility(MAP.id === "lautenbach");
    setOedegardVisibility(MAP.id === "oedsbach");
    // R168: REDNECK FREDNECK + hut are strictly ÖDSBACH-only.
    // Sync on every map switch so they can never leak onto later maps.
    updateOedsbachRedneckSceneVisibility();
    // R169: Florianus + hut are strictly KUHBACH-only.
    updateKuhbachFlorianusSceneVisibility();
    // R175: creek is strictly KUHBACH-only and is synchronized on EVERY map switch.
    updateKuhbachCreekEffectVisibility();
    setOedsbachFogVisibility(MAP.id === "oedsbach");
    setOedsbachShadowVisibility(MAP.id === "oedsbach");
    setRamsbachWorldVisibility(MAP.id === "ramsbach");
    setOppenauCastleVisibility(MAP.id === "oppenau");
    setOppenauDecorVisibility(MAP.id === "oppenau");
    setRamsbachFogVisibility(MAP.id === "ramsbach");
    setHubackerFogVisibility(MAP.id === "hubacker");
    setWinterbachSnowVisibility(MAP.id === "winterbach-ranglehen");
    setRamsbachBearVisibility(MAP.id === RAMSBACH_BEAR_CONFIG.mapId);
    updatePlayerHudVisibility();

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

  function playerInWinterbachOriginalSouthExitLane() {
    return (
      MAP.id === "winterbach-ranglehen" &&
      playerX >= MAP_EXIT_CONFIG.winterbachOriginalSouth.x1 &&
      playerX <= MAP_EXIT_CONFIG.winterbachOriginalSouth.x2
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

  function playerInHubackerRamsbachNorthExitLane() {
    return (
      MAP.id === "hubacker" &&
      playerX >= MAP_EXIT_CONFIG.hubackerRamsbachNorth.x1 &&
      playerX <= MAP_EXIT_CONFIG.hubackerRamsbachNorth.x2
    );
  }

  function playerInRamsbachHubackerSouthExitLane() {
    return (
      MAP.id === "ramsbach" &&
      playerX >= MAP_EXIT_CONFIG.ramsbachHubackerSouth.x1 &&
      playerX <= MAP_EXIT_CONFIG.ramsbachHubackerSouth.x2
    );
  }

  function playerInRamsbachOppenauNorthExitLane() {
    return (
      MAP.id === "ramsbach" &&
      playerX >= MAP_EXIT_CONFIG.ramsbachOppenauNorth.x1 &&
      playerX <= MAP_EXIT_CONFIG.ramsbachOppenauNorth.x2
    );
  }

  function playerInOppenauKuhbachEastExitLane() {
    return (
      MAP.id === "oppenau" &&
      playerY >= MAP_EXIT_CONFIG.oppenauKuhbachEast.y1 &&
      playerY <= MAP_EXIT_CONFIG.oppenauKuhbachEast.y2
    );
  }

  function playerInKuhbachOppenauWestExitLane() {
    return (
      MAP.id === "kuhbach" &&
      playerY >= MAP_EXIT_CONFIG.kuhbachOppenauWest.y1 &&
      playerY <= MAP_EXIT_CONFIG.kuhbachOppenauWest.y2
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

  function playerInWinterbachOedsbachEastExitLane() {
    return (
      MAP.id === "winterbach-ranglehen" &&
      playerY >= MAP_EXIT_CONFIG.winterbachOedsbachEast.y1 &&
      playerY <= MAP_EXIT_CONFIG.winterbachOedsbachEast.y2
    );
  }

  function playerInOedsbachWinterbachSouthExitLane() {
    return (
      MAP.id === "oedsbach" &&
      playerX >= MAP_EXIT_CONFIG.oedsbachWinterbachSouth.x1 &&
      playerX <= MAP_EXIT_CONFIG.oedsbachWinterbachSouth.x2
    );
  }

  function checkMapExit() {
    if (mapTransitioning) return false;

    const movingUp = keys.has("KeyW") || keys.has("ArrowUp");
    const movingDown = keys.has("KeyS") || keys.has("ArrowDown");
    const movingLeft = keys.has("KeyA") || keys.has("ArrowLeft");
    const movingRight = keys.has("KeyD") || keys.has("ArrowRight");

    // R167 OPPENAU lower-right road -> KUHBACH lower-left road.
    if (
      playerInOppenauKuhbachEastExitLane() &&
      movingRight &&
      playerX >= MAP_EXIT_CONFIG.oppenauKuhbachEast.leaveX
    ) {
      switchMap(MAPS.kuhbach, MAP_EXIT_CONFIG.kuhbachFromOppenauSpawn, true);
      return true;
    }

    // R167 KUHBACH lower-left road -> OPPENAU lower-right road.
    if (
      playerInKuhbachOppenauWestExitLane() &&
      movingLeft &&
      playerX <= MAP_EXIT_CONFIG.kuhbachOppenauWest.leaveX
    ) {
      switchMap(MAPS.oppenau, MAP_EXIT_CONFIG.oppenauFromKuhbachSpawn, true);
      return true;
    }

    // R155 RAMSBACH red-arrow north road -> OPPENAU.
    if (playerInRamsbachOppenauNorthExitLane() && movingUp && playerY <= MAP_EXIT_CONFIG.ramsbachOppenauNorth.leaveY) {
      switchMap(MAPS.oppenau, MAP_EXIT_CONFIG.oppenauFromRamsbachSpawn, true);
      return true;
    }

    // R111 HUBACKER yellow north arrow -> RAMSBACH blue south road.
    if (playerInHubackerRamsbachNorthExitLane() && movingUp && playerY <= MAP_EXIT_CONFIG.hubackerRamsbachNorth.leaveY) {
      switchMap(MAPS.ramsbach, MAP_EXIT_CONFIG.ramsbachFromHubackerSpawn, true);
      return true;
    }

    // R111 RAMSBACH blue south road -> HUBACKER yellow north road.
    if (playerInRamsbachHubackerSouthExitLane() && movingDown && playerY >= MAP.height + MAP_EXIT_CONFIG.ramsbachHubackerSouth.leavePadding) {
      switchMap(MAPS.hubacker, MAP_EXIT_CONFIG.hubackerFromRamsbachSpawn, true);
      return true;
    }

    // R91 MAP 2 red east arrow -> ÖDSBACH blue bottom road.
    if (
      playerInWinterbachOedsbachEastExitLane() &&
      movingRight &&
      playerX >= MAP_EXIT_CONFIG.winterbachOedsbachEast.leaveX
    ) {
      switchMap(MAPS.oedsbach, MAP_EXIT_CONFIG.oedsbachFromWinterbachSpawn, true);
      return true;
    }

    // R91 ÖDSBACH blue bottom road -> MAP 2 red east road.
    if (
      playerInOedsbachWinterbachSouthExitLane() &&
      movingDown &&
      playerY >= MAP.height + MAP_EXIT_CONFIG.oedsbachWinterbachSouth.leavePadding
    ) {
      switchMap(MAPS.winterbach, MAP_EXIT_CONFIG.winterbachFromOedsbachSpawn, true);
      return true;
    }

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

    // R142: ORIGINAL MAP 2 lower road -> ORIGINAL OBERKIRCH north road.
    // Uses the exact same iris/map-title transition system as every other route.
    if (
      playerInWinterbachOriginalSouthExitLane() &&
      movingDown &&
      playerY >= MAP.height + MAP_EXIT_CONFIG.winterbachOriginalSouth.leavePadding
    ) {
      switchMap(
        MAPS.oberkirch,
        MAP_EXIT_CONFIG.oberkirchOriginalNorthReturnSpawn,
        true
      );
      return true;
    }

    // Existing later MAP 2 lower-right OBERKIRCH return remains untouched.
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

    ...WHITE_STAG_KIT.walk.right,
    ...WHITE_STAG_KIT.walk.left,
    ...WHITE_STAG_KIT.walk.down,
    ...WHITE_STAG_KIT.walk.up,
    WHITE_STAG_KIT.idle.right,
    WHITE_STAG_KIT.idle.left,
    WHITE_STAG_KIT.idle.down,

    // R149 — preload/decode the complete White Stag combat set too.
    ...WHITE_STAG_KIT.attack.right,
    ...WHITE_STAG_KIT.attack.left,
    ...WHITE_STAG_KIT.attack.down,
    ...WHITE_STAG_KIT.attack.up,
    WHITE_STAG_KIT.dead,

    PLAYER.attackFinish,
    PLAYER.attackFinishLeft
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

  // ------------------------------------------------------------------
  // R128 PLAYER HP + ENEMY -> PLAYER DAMAGE
  // ------------------------------------------------------------------
  const PLAYER_MAX_HP = 100;
  let playerHp = PLAYER_MAX_HP;
  let playerDead = false;

  // R130 death / revive state.
  const PLAYER_DEATH = Object.freeze({
    sprite: PLAYER.dead,
    skull: "assets/ui/death/DEATH SKULL.png",
    sounds: Object.freeze([
      "assets/audio/player/PLAYER DEATH 1.mp3",
      "assets/audio/player/PLAYER DEATH 2.mp3"
    ]),
    respawnProtectionMs: 3000
  });

  let playerDeathUI = null;
  let playerRespawnProtectedUntil = 0;
  let playerDeathX = 0;
  let playerDeathY = 0;

  const playerDeathAudios = PLAYER_DEATH.sounds.map((src) => {
    const audio = new Audio(encodeURI(src));
    audio.preload = "auto";
    audio.loop = false;
    audio.volume = 1.0;
    return audio;
  });

  function currentPlayerDeathSprite() {
    return equippedKitItem ? WHITE_STAG_KIT.dead : PLAYER_DEATH.sprite;
  }

  function playerRespawnProtected(now = performance.now()) {
    return now < playerRespawnProtectedUntil;
  }

  function playRandomPlayerDeathSound() {
    if (!playerDeathAudios.length) return;
    const audio = playerDeathAudios[Math.floor(Math.random() * playerDeathAudios.length)];
    try { audio.currentTime = 0; } catch (_) {}
    audio.play().catch(() => {});
  }

  function createPlayerDeathUI() {
    if (playerDeathUI) return playerDeathUI;

    const root = document.createElement("div");
    root.id = "playerDeathUI";
    root.setAttribute("aria-hidden", "true");

    const panel = document.createElement("div");
    panel.className = "player-death-ui__panel";

    const skull = document.createElement("img");
    skull.className = "player-death-ui__skull";
    skull.src = encodeURI(PLAYER_DEATH.skull);
    skull.alt = "";
    skull.draggable = false;

    const revive = document.createElement("button");
    revive.className = "player-death-ui__revive";
    revive.type = "button";
    revive.textContent = "WIEDERBELEBEN";

    revive.addEventListener("click", () => revivePlayerAtDeathPoint());

    panel.append(skull, revive);
    root.appendChild(panel);
    document.body.appendChild(root);

    playerDeathUI = { root, panel, skull, revive };
    return playerDeathUI;
  }

  function showPlayerDeathUI() {
    const ui = createPlayerDeathUI();

    // R150 fail-safe: the revive panel must appear even if a stale/deferred
    // stylesheet or DOM replacement interferes with the class-based visibility.
    if (!ui.root.isConnected) document.body.appendChild(ui.root);
    ui.root.classList.add("player-death-ui--visible");
    ui.root.setAttribute("aria-hidden", "false");
    ui.root.style.display = "grid";
    ui.root.style.opacity = "1";
    ui.root.style.visibility = "visible";
    ui.root.style.pointerEvents = "auto";
    ui.root.style.zIndex = "2147483646";

    window.setTimeout(() => ui.revive.focus(), 80);
  }

  function hidePlayerDeathUI() {
    if (!playerDeathUI) return;
    playerDeathUI.root.classList.remove("player-death-ui--visible");
    playerDeathUI.root.setAttribute("aria-hidden", "true");
    playerDeathUI.root.style.opacity = "0";
    playerDeathUI.root.style.visibility = "hidden";
    playerDeathUI.root.style.pointerEvents = "none";
  }

  function resetEnemyAggroAfterPlayerDeath(now) {
    // Wolves: cancel the exact attack/chase state that was active on death.
    for (const actor of wolfActors) {
      if (!actor || actor.dead || actor.away) continue;
      actor.aggro = false;
      actor.attackingPlayer = false;
      actor.attackImpactDone = false;
      actor.attackImpactAt = 0;
      actor.attackEndAt = 0;
      actor.nextPlayerAttackAt = now + PLAYER_DEATH.respawnProtectionMs;
      actor.moving = false;
      actor.howling = false;
      actor.frameIndex = 0;
      if (actor.ready) wolfShowStaticLayer(actor, 0);
      actor.pauseUntil = now + 650 + Math.random() * 550;
      actor.nextDecision = actor.pauseUntil;
    }

    // Boars: normal combat phase is fully cancelled. Tierbann identity stays
    // intact, but it cannot damage the player during the protection window.
    for (const actor of boarActors) {
      if (!actor || actor.dead || actor.away) continue;
      actor.aggro = false;
      actor.combatPhase = "idle";
      actor.combatUntil = 0;
      actor.chargeHitDone = false;
      actor.chargeVX = 0;
      actor.chargeVY = 0;
      actor.retreatVX = 0;
      actor.retreatVY = 0;
      actor.moving = false;
      if (actor.ready) boarShowLayer(actor, 0);
      actor.pauseUntil = now + 650 + Math.random() * 550;
      actor.nextDecision = actor.pauseUntil;
    }

    // Ramsbach black bears: same clean reset.
    for (const actor of ramsbachBearActors) {
      if (!actor || actor.dead || actor.away) continue;
      actor.aggro = false;
      actor.attackingPlayer = false;
      actor.attackImpactDone = false;
      actor.attackImpactAt = 0;
      actor.attackEndAt = 0;
      actor.nextPlayerAttackAt = now + PLAYER_DEATH.respawnProtectionMs;
      actor.moving = false;
      actor.pauseUntil = now + 700 + Math.random() * 650;
      actor.nextDecision = actor.pauseUntil;
      setRamsbachBearFrame(actor, actor.family || "side", 0, actor.facing || 1);
    }
  }

  function killPlayer() {
    if (playerDead) return;

    playerDead = true;
    playerDeathX = playerX;
    playerDeathY = playerY;

    keys.clear();
    attackHeld = false;
    if (attacking) cancelAttackImmediately();
    moving = false;

    playerEl.classList.remove("player--moving", "player--respawn-glow");
    playerEl.classList.add("player--idle");

    // R136: corpse is hard-pinned below every animal actor layer immediately.
    playerEl.style.zIndex = "2";

    // The supplied horizontal death pose remains visible until revive.
    // Force bypasses any cached activeSprite state from the fatal attack frame.
    forceSprite(currentPlayerDeathSprite());

    playRandomPlayerDeathSound();
    resetEnemyAggroAfterPlayerDeath(performance.now());
    showPlayerDeathUI();
  }

  function revivePlayerAtDeathPoint() {
    if (!playerDead) return;

    const now = performance.now();

    // Exact death coordinates: no map spawn, no teleport.
    playerX = playerDeathX;
    playerY = playerDeathY;
    playerHp = PLAYER_MAX_HP;
    playerDead = false;
    playerRespawnProtectedUntil = now + PLAYER_DEATH.respawnProtectionMs;

    keys.clear();
    attackHeld = false;
    attacking = false;
    moving = false;
    currentAnimation = "idle";
    walkFrame = 0;
    walkFrameTimer = 0;

    updatePlayerHpHud();
    playerEl.style.left = `${playerX}px`;
    playerEl.style.top = `${playerY}px`;
    playerEl.classList.remove("player--moving");
    playerEl.classList.add("player--idle");

    // Return to the normal character art, then flash for exactly the requested
    // three-second protection period.
    setIdleSprite();
    hidePlayerDeathUI();
    resetEnemyAggroAfterPlayerDeath(now);

    // Immediately restore the correct live-character world depth.
    updateChurchPlayerDepth();

    playerEl.classList.remove("player--respawn-glow");
    void playerEl.offsetWidth;
    playerEl.classList.add("player--respawn-glow");
    window.setTimeout(() => {
      playerEl.classList.remove("player--respawn-glow");
    }, PLAYER_DEATH.respawnProtectionMs);
  }

  function updatePlayerHpHud() {
    if (!playerHud || !playerHud.hpFill) return;
    const ratio = Math.max(0, Math.min(1, playerHp / PLAYER_MAX_HP));
    playerHud.hpFill.style.transform = `scaleX(${ratio})`;
    if (playerHud.hpText) playerHud.hpText.textContent = `${playerHp}/${PLAYER_MAX_HP}`;
  }

  function createPlayerDamageText(amount) {
    const popup = document.createElement("div");
    popup.className = "player-damage";
    popup.textContent = `-${amount}`;
    popup.style.left = `${playerX}px`;
    popup.style.top = `${playerY - 500}px`;
    world.appendChild(popup);
    window.setTimeout(() => popup.remove(), 820);
  }

  function damagePlayer(amount) {
    if (
      playerDead ||
      playerRespawnProtected() ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) return false;

    const incoming = equippedKitItem
      ? amount * (1 - WHITE_STAG_KIT.damageReduction)
      : amount;
    const applied = Math.min(playerHp, Math.max(0, Math.round(incoming)));
    if (applied <= 0) return false;

    playerHp = Math.max(0, playerHp - applied);
    createPlayerDamageText(applied);
    updatePlayerHpHud();

    if (playerHp <= 0) killPlayer();
    return true;
  }

  function playerInsideEnemyReach(actor, reach) {
    return Math.hypot(playerX - actor.x, playerY - actor.y) <= reach;
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
  let blockFacing = "right";

  function currentPlayerMoveSpeed() {
    return PLAYER.speed * (equippedKitItem ? WHITE_STAG_KIT.movementSpeedMultiplier : 1);
  }

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

    // R92 FIX — WINTERBACH red east road -> ÖDSBACH:
    // exactly like the established north/south exits, the player must be
    // allowed to physically cross the map edge inside the marked lane.
    const eastExitOpen =
      (
        playerInWinterbachOedsbachEastExitLane() ||
        playerInOppenauKuhbachEastExitLane()
      ) &&
      (keys.has("KeyD") || keys.has("ArrowRight"));

    const westExitOpen =
      playerInKuhbachOppenauWestExitLane() &&
      (keys.has("KeyA") || keys.has("ArrowLeft"));

    if (eastExitOpen) {
      const leaveX = MAP.id === "oppenau"
        ? MAP_EXIT_CONFIG.oppenauKuhbachEast.leaveX
        : MAP_EXIT_CONFIG.winterbachOedsbachEast.leaveX;
      playerX = Math.max(
        halfW,
        Math.min(leaveX + 80, playerX)
      );
    } else if (westExitOpen) {
      playerX = Math.max(
        MAP_EXIT_CONFIG.kuhbachOppenauWest.leaveX - 80,
        Math.min(MAP.width - halfW, playerX)
      );
    } else {
      playerX = Math.max(halfW, Math.min(MAP.width - halfW, playerX));
    }

    const northExitOpen =
      (
        playerInOberkirchNorthExitLane() ||
        playerInOberkirchGreenNorthExitLane() ||
        playerInWinterbachNorthLeftExitLane() ||
        playerInWinterbachNorthRightExitLane() ||
        playerInLautenbachNorthLeftExitLane() ||
        playerInLautenbachNorthRightExitLane() ||
        playerInHubackerRamsbachNorthExitLane() ||
        playerInRamsbachOppenauNorthExitLane()
      ) &&
      (keys.has("KeyW") || keys.has("ArrowUp"));

    const southExitOpen =
      (
        playerInWinterbachSouthExitLane() ||
        playerInWinterbachOriginalSouthExitLane() ||
        playerInLautenbachSouthLeftExitLane() ||
        playerInLautenbachSouthRightExitLane() ||
        playerInHubackerSouthLeftExitLane() ||
        playerInOberkirchStadiumSouthExitLane() ||
        playerInStadiumOberkirchSouthExitLane() ||
        playerInOedsbachWinterbachSouthExitLane() ||
        playerInRamsbachHubackerSouthExitLane()
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
      } else if (MAP.id === "hubacker") {
        leaveFloor = MAP_EXIT_CONFIG.hubackerRamsbachNorth.leaveY - 80;
      } else if (MAP.id === "ramsbach") {
        leaveFloor = MAP_EXIT_CONFIG.ramsbachOppenauNorth.leaveY - 80;
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
      } else if (MAP.id === "oedsbach") {
        leavePadding = MAP_EXIT_CONFIG.oedsbachWinterbachSouth.leavePadding;
      } else if (MAP.id === "ramsbach") {
        leavePadding = MAP_EXIT_CONFIG.ramsbachHubackerSouth.leavePadding;
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

    const isWhiteStagWalk =
      WHITE_STAG_KIT.walk.right.includes(src) ||
      WHITE_STAG_KIT.walk.left.includes(src) ||
      WHITE_STAG_KIT.walk.down.includes(src) ||
      WHITE_STAG_KIT.walk.up.includes(src);

    const isWhiteStagIdle =
      src === WHITE_STAG_KIT.idle.right ||
      src === WHITE_STAG_KIT.idle.left ||
      src === WHITE_STAG_KIT.idle.down;

    const isWhiteStagAttack =
      WHITE_STAG_KIT.attack.right.includes(src) ||
      WHITE_STAG_KIT.attack.left.includes(src) ||
      WHITE_STAG_KIT.attack.down.includes(src) ||
      WHITE_STAG_KIT.attack.up.includes(src);

    const isWhiteStagDeath = src === WHITE_STAG_KIT.dead;

    if (src === PLAYER_DEATH.sprite || isWhiteStagDeath) {
      // R135: horizontal corpse artwork is intentionally larger than the living
      // idle body while staying anchored to the exact death foot position.
      spriteScale = 1.80;
    } else if (isClubLeft || isClubRight) {
      // Source sheet is a wide 2x2 composition; normalized 2:3 canvases need
      // this fixed bottom-center scale to match the existing player's world size.
      spriteScale = 2.50;
    } else if (isClubDown) {
      spriteScale = 1.25;
    } else if (isClubUp) {
      spriteScale = 1.75;
    } else if (isWhiteStagAttack) {
      // R149: S/down is the visual size reference and stays exactly as before.
      // Side attacks need +10% relative to R148; rear/up only +5%.
      if (WHITE_STAG_KIT.attack.right.includes(src) || WHITE_STAG_KIT.attack.left.includes(src)) {
        spriteScale = 1.2705; // R150: another +5% over R149 side-attack size
      } else if (WHITE_STAG_KIT.attack.up.includes(src)) {
        spriteScale = 1.155; // 1.10 * 1.05
      } else {
        spriteScale = 1.10; // DOWN unchanged — reference size
      }
    } else if (isWhiteStagWalk || isWhiteStagIdle) {
      // Existing R147 movement/rest size remains untouched.
      spriteScale = 1.10;
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

  // R165 STADIUM / FORCED SPRITE RESTORE:
  // Some scripted states must re-apply a sprite even when activeSprite still
  // caches the same source. Several existing systems already call forceSprite().
  function forceSprite(src) {
    activeSprite = "";
    setSprite(src);
  }

  function setIdleSprite() {
    if (equippedKitItem) {
      // R147 exact requested rest poses:
      // D/right = supplied idle image 1.
      // A/left  = exact mirror of supplied idle image 1.
      // S/down  = supplied idle image 2.
      // W/up    = keep the already-working R146 rear-facing behaviour.
      if (facing === "right") {
        setSprite(WHITE_STAG_KIT.idle.right);
      } else if (facing === "left") {
        setSprite(WHITE_STAG_KIT.idle.left);
      } else if (facing === "down") {
        setSprite(WHITE_STAG_KIT.idle.down);
      } else {
        setSprite(WHITE_STAG_KIT.walk.up[0]);
      }
      return;
    }

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
    const walkSet = equippedKitItem ? WHITE_STAG_KIT.walk : PLAYER;
    const frames = equippedKitItem
      ? (animationName === "down" ? walkSet.down :
         animationName === "right" ? walkSet.right :
         animationName === "left" ? walkSet.left :
         animationName === "up" ? walkSet.up : null)
      : (animationName === "down" ? PLAYER.walkDown :
         animationName === "right" ? PLAYER.walkRight :
         animationName === "left" ? PLAYER.walkLeft :
         animationName === "up" ? PLAYER.walkUp : null);

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
    if (equippedWeapon === WHITE_STAG_KIT.id) {
      if (facing === "down") return WHITE_STAG_ATTACK_DOWN;
      if (facing === "up") return WHITE_STAG_ATTACK_UP;
      if (facing === "left") return WHITE_STAG_ATTACK_LEFT;
      if (facing === "right") return WHITE_STAG_ATTACK_RIGHT;
      return lastHorizontalFacing === "left" ? WHITE_STAG_ATTACK_LEFT : WHITE_STAG_ATTACK_RIGHT;
    }

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

    if (frame.hit && equippedWeapon === WHITE_STAG_KIT.id) {
      resolvedFrame = {
        ...frame,
        damage: frame.critical ? WHITE_STAG_KIT.criticalDamage : WHITE_STAG_KIT.damage
      };
    }

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

    // R151 Kräuterpunsch-Spinatmix: +25% on every real player hit for 60 seconds.
    // Applied after weapon/critical/Saustark resolution so the complete outgoing hit is boosted.
    if (resolvedFrame.hit && playerDamageBuffActive()) {
      resolvedFrame = {
        ...resolvedFrame,
        damage: Math.round((Number(resolvedFrame.damage) || 0) * currentPlayerDamageMultiplier())
      };
    }

    resolveRabbitAttackFrame(resolvedFrame);
    resolveWolfAttackFrame(resolvedFrame);
    resolveBoarAttackFrame(resolvedFrame);
    resolveMoosmaennleAttackFrame(resolvedFrame);
    resolveRamsbachBearAttackFrame(resolvedFrame);
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
    if (playerDead || attacking) return;

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
    if (!attacking) return;

    // R110 PLAYER STABILITY:
    // Never let a corrupted/transient combat state throw inside the main frame.
    // A single uncaught exception used to kill requestAnimationFrame permanently.
    if (
      !Array.isArray(attackSequence) ||
      attackSequence.length === 0 ||
      !Number.isInteger(attackStep) ||
      attackStep < 0 ||
      attackStep >= attackSequence.length ||
      !Number.isFinite(attackTimer)
    ) {
      cancelAttackImmediately();
      return;
    }

    const safeDelta = Number.isFinite(deltaSeconds)
      ? Math.max(0, Math.min(0.05, deltaSeconds))
      : 0;

    attackTimer += safeDelta * 1000;

    while (
      attacking &&
      attackSequence &&
      attackStep >= 0 &&
      attackStep < attackSequence.length &&
      attackTimer >= attackSequence[attackStep].duration
    ) {
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


  function updatePlayer(deltaSeconds) {
    if (playerDead) {
      clearIceVelocity();
      updateIceVisual();

      // R133 HARD DEATH-SPRITE LOCK:
      // Death is the highest-priority player visual state. Re-assert the supplied
      // death pose every frame until revive so no delayed idle/combat/block state
      // can overwrite it.
      playerEl.classList.remove("player--moving", "player--ice-sliding");
      playerEl.classList.add("player--idle");

      // R136: death depth has absolute priority over all map-specific depth rules.
      playerEl.style.zIndex = "2";
      const deathSprite = currentPlayerDeathSprite();
      if (activeSprite !== deathSprite) forceSprite(deathSprite);
      return;
    }
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

    // R178 hard map-local guard: KUHBACH-only DOM can never leak to OBERKIRCH/other maps.
    const kuhbachVisibleNow = MAP.id === "kuhbach";
    if (kuhbachFlorianusHutEl) kuhbachFlorianusHutEl.style.display = kuhbachVisibleNow ? "" : "none";
    if (kuhbachFlorianusEl) kuhbachFlorianusEl.style.display = kuhbachVisibleNow ? "" : "none";
    if (kuhbachCreekEffectEl) kuhbachCreekEffectEl.style.display = kuhbachVisibleNow ? "" : "none";

    world.style.transform =
      `translate3d(${tx}px, ${ty}px, 0) scale(${displayScale})`;

    zoomLabel.textContent = `ZOOM ${zoomLevel}`;
    coordLabel.textContent =
      `KAMERA X: ${Math.round(cameraX)} · Y: ${Math.round(cameraY)}`;
    playerLabel.textContent =
      `SPIELER X: ${Math.round(playerX)} · Y: ${Math.round(playerY)}`;

    // R157: OPPENAU castle is a map-local world layer. Reassert visibility
    // during render so a missed/late image load can never leave it hidden.
    if (MAP.id === "oppenau") {
      setOppenauCastleVisibility(true);
      setOppenauDecorVisibility(true);
    }
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

  let playerStabilityLastFrameErrorAt = 0;

  function frame(now) {
    // R110 PLAYER STABILITY:
    // The NEXT frame is guaranteed in finally. Before this fix, any one-off
    // runtime exception anywhere below prevented requestAnimationFrame(frame)
    // from being reached and permanently froze walking + combat together.
    try {
      // R153 TAB/FOCUS STABILITY:
      // Never advance simulation while the page/window is suspended.
      // We still keep lastFrame fresh so the first visible frame can never
      // inherit a giant background delta.
      if (gameTimingSuspended || document.hidden) {
        lastFrame = now;
        return;
      }

      const rawDelta = (now - lastFrame) / 1000;
      const deltaSeconds = Number.isFinite(rawDelta)
        ? Math.max(0, Math.min(0.05, rawDelta))
        : 0;
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
        updateMoosmaennle(deltaSeconds, now);
        updateOppenauAmbientPair(deltaSeconds, now);

        // R120: current five-bear system remains, but is completely isolated
        // from core player controls and is executed ONLY on RAMSBACH.
        if (MAP.id === "ramsbach") {
          try {
            updateRamsbachBears(deltaSeconds, now);
          } catch (bearError) {
            console.error("R120 RAMSBACH BEAR RECOVERY:", bearError);
          }
        }

        updateTierbannsteine(deltaSeconds, now);
        updateMole(now);
        updatePlayerExpOrbs(deltaSeconds, now);
        updateOedegard(now);
        updateOedsbachShadows(now);
        updatePlayerHudVisibility();
      }

      renderPlayer();
      updateChurchPlayerDepth();
      renderWorld();
      renderOedsbachShadowPositions();
    } catch (error) {
      // Keep the game alive even if a later auxiliary system has one bad frame.
      // Throttle logging so a persistent error cannot flood the console.
      const errorNow = performance.now();
      if (errorNow - playerStabilityLastFrameErrorAt >= 1000) {
        playerStabilityLastFrameErrorAt = errorNow;
        console.error("R110 FRAME RECOVERY:", error);
      }

      // Repair only transient player-control state if it became internally invalid.
      if (
        attacking &&
        (
          !Array.isArray(attackSequence) ||
          !Number.isInteger(attackStep) ||
          attackStep < 0 ||
          attackStep >= (attackSequence ? attackSequence.length : 0) ||
          !Number.isFinite(attackTimer)
        )
      ) {
        cancelAttackImmediately();
      }
    } finally {
      // CRITICAL: the main game loop can no longer die because of one exception.
      requestAnimationFrame(frame);
    }
  }

  window.addEventListener("keydown", (event) => {
    if (!gameplayUnlocked()) {
      const target = event.target;
      const isStartTextField =
        target && (target.id === "startPlayerName" || target.id === "startProductKey");

      // Typing in either start-flow text field remains completely native.
      if (isStartTextField) return;

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

        if (stadiumResultOpen) {
          closeStadiumResultUI();
          return;
        }

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
      "Space", "Backquote"
    ];

    if (controlled.includes(event.code)) {
      event.preventDefault();
    }

    if (event.code === "Escape" && teleporterUI && teleporterUI.classList.contains("teleporter-ui--open")) {
      event.preventDefault();
      closeTeleporter();
      return;
    }

    if (event.code === "KeyI") {
      if (!event.repeat) {
        if (teleporterUI && teleporterUI.classList.contains("teleporter-ui--open")) closeTeleporter();
        else toggleInventory();
      }
      return;
    }

    // Inventory is screen UI: gameplay controls are ignored until it closes.
    if (inventoryState.open) return;

    // R105 QUICKBAR: top-row 1–9 and numpad 1–9.
    // The Caliph lamp currently triggers only a safe placeholder hook.
    const quickSlotKeyMatch =
      /^Digit([1-9])$/.exec(event.code) ||
      /^Numpad([1-9])$/.exec(event.code);

    if (quickSlotKeyMatch) {
      event.preventDefault();
      if (!event.repeat) activateQuickSlot(Number(quickSlotKeyMatch[1]) - 1);
      return;
    }

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
      if (playerDead) return;
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

    if (event.code === "Space") {
      event.preventDefault();
      cancelAttackImmediately();
      return;
    }

    keys.delete(event.code);
  }, { passive: false });

  // R110: one conservative reset for transient keyboard/combat state.
  // Used only when browser focus/visibility changes, never during normal play.
  function resetTransientPlayerControls() {
    keys.clear();

    cancelAttackImmediately();

    moving = false;
    currentAnimation = "idle";
    walkFrame = 0;
    walkFrameTimer = 0;

    playerEl.classList.remove("player--moving");
    playerEl.classList.add("player--idle");

    clearIceVelocity();
    updateIceVisual();
    lastFrame = performance.now();
  }

  // ------------------------------------------------------------------
  // R153 TAB / WINDOW RESUME STABILITY
  //
  // Browsers throttle requestAnimationFrame/setTimeout in background tabs.
  // Our movement delta was already clamped to 50 ms, but many animal and
  // combat state machines also use absolute performance.now() deadlines.
  // Without shifting those deadlines, returning from a tab switch can make
  // several animation phases expire at once and leave a mob on the wrong frame.
  //
  // Rule:
  //   - freeze simulation while hidden/unfocused;
  //   - preserve HP, aggro, position, loot, EXP and every persistent state;
  //   - shift ONLY timestamp/deadline fields by the time spent away;
  //   - resume with a fresh lastFrame so no background delta is replayed.
  // ------------------------------------------------------------------
  let gameTimingSuspended = false;
  let gameTimingPauseStartedAt = 0;

  function shiftResumeTimerObject(target, pausedMs) {
    if (!target || typeof target !== "object" || !(pausedMs > 0)) return;

    for (const key of Object.keys(target)) {
      const value = target[key];
      if (!Number.isFinite(value) || value <= 0) continue;

      // Actor deadline names used throughout rabbits/wolves/boars/bears/goat/
      // Tierbannstein/mole and future actors following the same convention.
      const isTimerField =
        /At$/.test(key) ||
        /Until$/.test(key) ||
        /^next[A-Z]/.test(key) ||
        key === "nextDecision";

      if (isTimerField) target[key] = value + pausedMs;
    }
  }

  function shiftResumeTimerList(list, pausedMs) {
    if (!Array.isArray(list)) return;
    for (const entry of list) shiftResumeTimerObject(entry, pausedMs);
  }

  function shiftAllSimulationDeadlines(pausedMs) {
    if (!(pausedMs > 0) || !Number.isFinite(pausedMs)) return;

    // Living/world actors.
    shiftResumeTimerList(rabbitActors, pausedMs);
    shiftResumeTimerList(wolfActors, pausedMs);
    shiftResumeTimerList(boarActors, pausedMs);
    shiftResumeTimerList(ramsbachBearActors, pausedMs);
    shiftResumeTimerList(tierbannSteine, pausedMs);
    shiftResumeTimerList(playerExpOrbs, pausedMs);

    shiftResumeTimerObject(goatActor, pausedMs);
    shiftResumeTimerObject(moleEvent, pausedMs);
    shiftResumeTimerObject(oedegard, pausedMs);
    shiftResumeTimerObject(trunkenbold, pausedMs);

    // Tierbannstein uses one standalone deadline per map.
    for (const [mapId, deadline] of tierbannMapTimers.entries()) {
      if (Number.isFinite(deadline) && deadline > 0) {
        tierbannMapTimers.set(mapId, deadline + pausedMs);
      }
    }

    // Standalone gameplay deadlines that are not stored inside actor objects.
    if (nextWolfHowlAt > 0) nextWolfHowlAt += pausedMs;
    if (nextBoarNearbySoundAt > 0) nextBoarNearbySoundAt += pausedMs;
    if (nextMoleCheckAt > 0) nextMoleCheckAt += pausedMs;
    if (nextRamsbachBearNearbySoundAt > 0) nextRamsbachBearNearbySoundAt += pausedMs;

    if (oedsbachInnerNextAt > 0) oedsbachInnerNextAt += pausedMs;

    if (ramsbachSnapReleaseUntil > 0) ramsbachSnapReleaseUntil += pausedMs;
    if (hubackerCliffReleaseUntil > 0) hubackerCliffReleaseUntil += pausedMs;
    if (neuensteinReleaseUntil > 0) neuensteinReleaseUntil += pausedMs;

    if (stadiumBookmakerNextAt > 0) stadiumBookmakerNextAt += pausedMs;
    if (stadiumBookmakerActionEndAt > 0) stadiumBookmakerActionEndAt += pausedMs;
    if (stadiumFightPhaseEndAt > 0) stadiumFightPhaseEndAt += pausedMs;
    if (stadiumFightNextFrameAt > 0) stadiumFightNextFrameAt += pausedMs;
    if (stadiumFightFighterBNextFrameAt > 0) stadiumFightFighterBNextFrameAt += pausedMs;
    if (stadiumFinalSequenceStartedAt > 0) stadiumFinalSequenceStartedAt += pausedMs;
    if (stadiumBrawlPhaseEndAt > 0) stadiumBrawlPhaseEndAt += pausedMs;
    if (stadiumBrawlApproachStartedAt > 0) stadiumBrawlApproachStartedAt += pausedMs;

    // Timed player effects pause with the game instead of expiring while hidden.
    if (playerRespawnProtectedUntil > 0) playerRespawnProtectedUntil += pausedMs;
    if (playerDamageBuffUntil > 0) playerDamageBuffUntil += pausedMs;
  }

  function suspendGameTiming() {
    if (gameTimingSuspended) return;
    gameTimingSuspended = true;
    gameTimingPauseStartedAt = performance.now();

    // Keep the proven R110 protection against lost keyup events.
    // This affects only transient keyboard/combat input, never world state.
    resetTransientPlayerControls();
  }

  function resumeGameTiming() {
    const now = performance.now();

    if (!gameTimingSuspended) {
      // focus/pageshow may fire in addition to visibilitychange.
      // Re-baselining is harmless and prevents a stale first-frame delta.
      lastFrame = now;
      return;
    }

    const pausedMs = Math.max(0, now - gameTimingPauseStartedAt);
    shiftAllSimulationDeadlines(pausedMs);

    gameTimingSuspended = false;
    gameTimingPauseStartedAt = 0;
    lastFrame = now;

    // Animation accumulators never inherit time spent in another tab.
    walkFrameTimer = 0;

    // Reassert a valid player visual immediately. World actors keep their
    // exact pre-pause states and continue naturally on the next frame.
    if (!playerDead && !attacking && !moving) setIdleSprite();
  }

  // Losing focus or hiding the tab freezes timing immediately.
  window.addEventListener("blur", suspendGameTiming);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) suspendGameTiming();
    else resumeGameTiming();
  });

  // Different browsers resume through different events; all are idempotent.
  window.addEventListener("focus", resumeGameTiming);
  window.addEventListener("pageshow", resumeGameTiming);

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
    preloadCaliphLampUltimateSounds();

    // R102: do NOT create the HUD here. The start flow is still active.
    // createPlayerHud() is called only when startFlowState becomes "campaign".

    // R67 TEST: first weapon starts in page I at the first free vertical 1x2 area.
    // Later this single line can be removed when the weapon becomes a world reward.
    addItemToInventory(PINK_PIG_CLUB_ITEM);

    // R105 TEST: lamp starts in the first free 1x1 inventory slot.
    // Remove this line later when Ödegard's quest awards it.
    addItemToInventory(CALIPH_LAMP_ITEM);

    // R151: 10x each, one vertical column directly below the Kalifenlampe.
    addStarterHealthConsumables();

    // R144: first armor kit is seeded deterministically into the marked 2x3 area.
    addStarterWhiteStagKit();

    // R170 DEV: one 1x1 travel-map item in the next genuinely free inventory cell.
    addItemToInventory(TELEPORTER_ITEM);

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

    installOedegardStyles();
  createOedegard();
  createOedsbachRedneckScene();
  createKuhbachFlorianusScene();
  createKuhbachCreekEffect();
  createOedsbachFog();
  createRamsbachFog();
  createHubackerFog();
  createWinterbachSnow();
  createOedsbachShadowSystem();

  // R99: cache/decode every Caliph visual and preload every circle voice at boot.
  preloadOedsbachShadowSprites();
  preloadOedsbachCaliphSounds();

  createAreaSigns();
    installIcePlayerStyles();
    createRabbits();
    createWolves();
    createGoat();
    createBoars();
    createMoosmaennleSystem();
    createOppenauAmbientPair();
    createRamsbachBears();
    createTierbannsteinSystem();
    createMoleSystem();
    createOberkirchBuildings();
    createR11Buildings();
    createWinterbachObsthof();
    createLautenbachBuildings();
    createHubackerBuildings();
    createRamsbachCastle();
    createOppenauCastle();
    createOppenauDecor();
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