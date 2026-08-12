R92 – WINTERBACH -> ÖDSBACH EAST EXIT MINIFIX

Geändert:
- Ausschließlich clampPlayer().
- Auf MAP 2 WINTERBACH darf der Spieler innerhalb der bestehenden
  ÖDSBACH-Ostausgangsspur beim Rechtslaufen bis leaveX + 80 laufen.
- Dadurch kann die bereits vorhandene checkMapExit()-Transition bei X >= 10018
  ausgelöst werden.

Unverändert:
- Exit-Koordinaten
- Spawnpunkte
- checkMapExit()
- ÖDSBACH-Rückweg
- andere Maps und Exits
- Kamera, Zoom, Kampf, NPCs, Tiere, Musik und Collision-Systeme
