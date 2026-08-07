# Die Herren der Rench – Build 05

## Laufanimationen

Alle Bewegungsrichtungen wechseln jetzt schnell zwischen zwei vollständigen PNG-Frames.

- **D / Rechts:** `PLAYER WALK RIGHT.png` ↔ `PLAYER WALK RIGHT 2.png`
- **A / Links:** exakt gespiegelte Versionen der beiden rechten Frames
- **S / Runter:** `PLAYER WALK DOWN 1.png` ↔ `PLAYER WALK DOWN 2.png`
- **W / Hoch:** `PLAYER WALK UP 1.png` ↔ `PLAYER WALK UP 2.png`

### Diagonalen

Wenn gleichzeitig **W oder S + A oder D** gedrückt wird, hat die horizontale Richtung Priorität:

- W+A / S+A → linke Seitenanimation
- W+D / S+D → rechte Seitenanimation

Die Bewegungsrichtung selbst bleibt diagonal.

## Timing

Framewechsel: **120 ms**  
Zusätzlich bleibt nur ein sehr kleines vertikales Bobbing von 4 px für einen weicheren Eindruck.

## Stand

- zuletzt rechts → Stand rechts
- zuletzt links → Stand links

## Steuerung

WASD / Pfeiltasten – Spieler bewegen  
Mausrad / + / - – Zoom
