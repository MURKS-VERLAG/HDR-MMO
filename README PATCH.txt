HDR MMO – R67 SCHWEINEKEULE / WAFFE 1

GitHub-Patch: Dateien im Repository-Stamm entpacken/überschreiben.
index.html und alle bestehenden Karten-/Tier-/Audio-Dateien bleiben unverändert.

Neu:
- Schweinekeule als 1x2-Inventaritem (senkrecht)
- Teststart direkt im ersten freien vertikalen 1x2-Bereich auf Inventarseite I
- Rechtsklick auf Keule: Ausrüsten in oberen linken Waffenplatz
- Rechtsklick auf ausgerüstete Keule: Zurück ins erste freie 1x2-Inventarfeld
- Drag & Drop Inventar -> Waffenplatz
- Drag & Drop Waffenplatz -> Inventarraster
- Drag & Drop der Keule innerhalb des Rasters
- Levelgrenze vorbereitet: Level 1 bis 10
- Ohne Keule: bestehender Faustkampf unverändert
- Mit Keule: 4 fertige Charakter+Waffe-Angriffsframes je Richtung
- RIGHT ist die horizontale Spiegelung von LEFT
- keine Lauf-/Stand-Overlays, keine separate Waffenebene
- bestehender Angriffssound, Damage, Crit, Knockback und Trefferpipeline bleiben erhalten

Sprite-QA:
- 16 Dateien, je 1024x1536, Alpha vorhanden
- genau eine große zusammenhängende Figur pro Datei
- kein Sprite berührt den Bildrand
- kein Nachbarcharakter in den Exporten
- Keule/Charakter vollständig innerhalb der exportierten Silhouette soweit im gelieferten Quellbild vorhanden
- RIGHT sichtbare Pixel sind exakte Spiegelung von LEFT

Hinweis:
Die einzige Zeile, die später entfernt werden muss, wenn die Keule als Weltbelohnung erhältlich wird,
ist im initialize()-Block mit "R67 TEST" markiert.
