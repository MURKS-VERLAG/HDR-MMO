# Die Herren der Rench – Build 04

## Neu: echte technische Beinanimation

Der gelieferte rechte Laufcharakter wurde **ohne KI-Neugenerierung** technisch in drei transparente Ebenen zerlegt:

- `PLAYER WALK BODY.png`
- `PLAYER WALK LEG FRONT.png`
- `PLAYER WALK LEG BACK.png`

Die beiden Beine werden im Browser gegensinnig um die Hüftbereiche bewegt. Dadurch entsteht erstmals ein echter alternierender Schritt, ohne dass eine Bild-KI ein zweites Laufbild erzeugen muss.

### Blickrichtung
- Rechts: originale Ebenen.
- Links: dieselbe komplette Laufanimation technisch horizontal gespiegelt.
- Nach links laufen und stoppen: `PLAYER STAND LEFT.png`.
- Nach rechts laufen und stoppen: originales `PLAYER STAND.png`.

### Steuerung
WASD / Pfeiltasten – Spieler bewegen  
Mausrad / + / - – Zoom

### Hinweis
Dies ist der erste technische Rig-Test. Die Beinwinkel sind bewusst moderat gehalten, damit Mantel und Kleidung möglichst stabil wirken.
