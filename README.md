# Die Herren der Rench – Build 07: Kampfsystem

## Leertaste
Leertaste gedrückt halten startet die vollständige Angriffskombo. Jeder gestartete Durchlauf wird sauber bis zum FINISH-Frame beendet. Solange Space gehalten wird, startet danach sofort der nächste Durchlauf.

### Rechts
RIGHT 1 400 ms → BASE 100 ms → RIGHT 2 400 ms → BASE 100 ms → RIGHT 3 400 ms → BASE 100 ms → FINISH 400 ms → BASE 100 ms.

### Links
Exakt dieselbe Sequenz mit technisch horizontal gespiegelten Bildern.

### S / nach unten
Nach S bleibt `PLAYER COMBAT BASE` als Ruhehaltung bestehen.

DOWN-Kombo:
BASE 100 ms → DOWN 1 400 ms → BASE 100 ms → DOWN 2 400 ms → BASE 100 ms → DOWN 3 400 ms → BASE 100 ms → FINISH 400 ms → BASE 100 ms.

## Bewegung
Während eines Angriffs ist Bewegung gesperrt. Bestehende Map-, Kamera-, Zoom- und Laufsteuerung bleiben erhalten.

## Dateigröße
Die neuen Combat-Assets sind transparente hochwertige WebP-Dateien, damit der GitHub-Build unter 25 MB bleibt.

## Blocken
STRG gedrückt halten: `PLAYER BLOCK.webp` wird allein angezeigt. Währenddessen sind Bewegung und Angriff gesperrt. Beim Loslassen kehrt die normale Steuerung zurück.
