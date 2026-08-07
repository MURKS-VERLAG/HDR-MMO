# Die Herren der Rench

Browserbasiertes 2D-RPG – Build 02: Spieler auf OBERKIRCH ZENTRUM.

## MAP1

**OBERKIRCH ZENTRUM**  
10.000 × 6.667 px, WebP.

## Charakter

- `PLAYER STAND.png` – unveränderte Standfigur aus dem gelieferten Anhang.
- `PLAYER WALK RIGHT.png` – unveränderte nach rechts laufende Figur aus dem gelieferten Anhang.
- `PLAYER WALK LEFT.png` – technisch exakt gespiegelte Version von `PLAYER WALK RIGHT.png`; keine KI-Neugenerierung.

Die Figur startet bei X 5000 / Y 3333. Die Kamera folgt ihr ab den näheren Zoomstufen.

## Steuerung

- **WASD / Pfeiltasten** – Spieler bewegen
- **Mausrad / + / -** – vier feste Zoomstufen
- Zoom 0 – komplette Karte
- Zoom 1 – näher
- Zoom 2 – Gameplay-Nähe
- Zoom 3 – stärkster Zoom

Beim horizontalen Laufen wird ausschließlich das gelieferte Laufbild verwendet. Links ist dieselbe Grafik gespiegelt. Für oben/unten wird vorläufig die zuletzt verwendete horizontale Laufrichtung beibehalten; es wird keine neue Pose erfunden.

## GitHub Pages

Kein Build-Prozess, keine Frameworks, keine Abhängigkeiten. Repository hochladen und GitHub Pages auf den Repository-Root setzen.
