HDR R67 – TIERBANNSTEIN LEVEL 1

PATCH-INHALT
- game.js
- assets/events/TIERBANNSTEIN LEVEL 1.png

BETROFFENE KARTEN
- MAP 2 WINTERBACH · RANGLEHEN
- MAP 3 LAUTENBACH
Keine andere Map erhält Tierbannsteine.

SPAWN
- Pro Karte eigener Timer.
- Alle 120 Sekunden eigener unabhängiger 25%-Wurf.
- Bei Erfolg wird EIN freier blauer Spawnpunkt der betreffenden Karte gewählt.
- Ein bereits belegter Punkt kann niemals einen zweiten Stein bekommen.
- Ein nicht zerstörter Stein blockiert nur seinen eigenen Spawnpunkt.
- Nach zwei weiteren Minuten kann deshalb theoretisch ein weiterer Stein
  an einem ANDEREN freien Punkt erscheinen.
- Nach Zerstörung wird sein Spawnpunkt wieder frei.

EXAKTE BLAUE PUNKTE
WINTERBACH:
(2502,656), (8368,1349), (4274,2097), (2085,2666), (4781,3530), (3121,4169)

LAUTENBACH:
(8822,1026), (8599,2412), (8614,5049)

STEIN
- 2000 HP.
- Spieler verursacht exakt seine vorhandenen 20/20/20/40 Treffer.
- Kritischer 4. Schlag bleibt kritisch + Staub, aber KEIN Knockback am Stein.
- Jeder Treffer lässt den starren Stein kurz wackeln.
- Spawn: kleine Fallbewegung von oben, Aufprallstaub, zweimaliges Hin-/Herwackeln.
- 0 HP: großer Staub-/Fade-Abgang; Spawnpunkt wird wieder frei.

WELLEN
1900 HP -> 10 Hasen
1700 HP -> 1 Wildschwein
1500 HP -> 10 Hasen
1300 HP -> 3 Wildschweine
1000 HP -> 10 Hasen
 800 HP -> 3 Wildschweine
 500 HP -> 15 Hasen
 300 HP -> 2 Wildschweine
 100 HP -> 1 Wolf

HASEN
- Spawnen direkt aus der Steinmitte.
- Fliehen sofort radial in unterschiedliche Richtungen.
- Nach einigen Metern stoppen sie und gehen in freie normale Bewegung über.
- Für ihre Sonderbewegung wird die vorhandene Landschaft-/Fluss-/Gebäudekollision benutzt.
- HP, Treffer, Sounds und vorhandener Hasenloot bleiben gleich.
- Eventhasen respawnen nach Tod nicht erneut, damit sich die Welt nicht endlos vervielfacht.

WILDSCHWEINE / WOLF
- Spawnen verteilt in einem größeren Kreis um den Stein, nicht auf einem Fleck.
- Gültige Spawnpunkte werden gegen bestehende Landschaftskollision geprüft.
- Kandidaten weiter vom Spieler werden bevorzugt, damit nichts direkt auf ihm erscheint.
- Danach verfolgen sie den Spieler unmittelbar.
- Bestehende HP, Treffer, Death-Bilder, Sounds und Lootsysteme bleiben erhalten.
- Eventtiere respawnen nach Tod nicht erneut.

NICHT VERÄNDERT
- vorhandene Tierpopulationen/Habitate
- Maps und Mapwechsel
- Spieleranimationen
- Schaden
- Inventar
- Lootchancen
- Musik
- Startscreen
- Gebäude

node --check: OK
