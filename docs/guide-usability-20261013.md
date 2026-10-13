# Guide maps, step links and small-screen presentation — 13 October 2026

## Problem and resulting behavior

The standalone pages removed the interactive guide's canvas figures. Readers arriving through Google or a direct link therefore lost the map reference visible in the atlas. The builder now emits accessible SVG minimaps from the same published floor PNGs, coordinates, markers and partial polylines. Maps work without JavaScript; there are no generated raster illustrations or invented map connections.

The 65 published quest/collection guides contain 540 maps: one for each detailed stage, or a single area map for an area-only reference. The 14 hunt pages show their existing local circuits/markers; the 303 NPC pages show their catalogued floor and position. Total: 857 map figures. The source remains the site's community map reference, not an independently validated original game route.

Stage URLs such as `/quests/noble-armor/#etapa-2` are linkable and numbered. Previous/next links move between instructions; the lightweight page script opens the containing spoiler and selected stage before scrolling. Those links do not imply that two markers are connected by a walkable path.

## Scope and content checks

- Existing quest lines remain dashed and explicitly approximate. Isolated targets remain points with no drawn route. Different floors are not connected by SVG lines.
- Hunt captions distinguish local circuits from travel to the cave and floor changes. Numbered respawns are reference points, not mandatory rotation order. Gaps remain visible instead of being filled by guessed walks.
- NPC maps identify a position of reference and disclose server variation; no route to the NPC is invented.
- Renewable collection wording now says “Sua referência de coleta”, consistently with Iron Helmet's respawn classification.
- Four frequently used rune records were checked against available community spell tables: HMM creation ML 3, mana 70, five charges; GFB creation ML 9, mana 120, two charges; SD creation ML 25, mana 220, one charge; UH rune creation ML 11, mana 100, one charge. No conflicting evidence justified changing the catalogued values. Casting/creation ML remains distinct from rune-use ML. Reconstruction tables are supporting comparisons, not proof of every original-7.4 rule.
- The 33 withheld entries remain withheld. No new historical presence claim is made by adding a map.

Small-screen CSS makes maps scale to their containers, provides 44px stage navigation targets, wraps teacher/trade links and preserves prices. Mechanism tables can scroll locally. These are structural responsive checks; the cloud browser's available API does not provide a mobile viewport override, so no claim of physical-phone testing is made.

## Validation

The integration test checks all 857 figures against the admitted quest routes, hunt paths and NPC coordinates; tests floor image availability, marker coordinates, isolated-point versus polyline behavior, stage anchor targets and direct-link spoiler opening. Existing map terrain, historical admission, NPC dialogue, library links, hunts and explorer tests remain in the publishing pipeline. Sitemap count stays 1,256; all source pages preserve their canonical URLs and the main page's verification metadata.

Supporting spell comparisons:
- https://www.tibialegacy.com/spells.php
- https://primora.arcanum74.com/about/spellView/Great%2BFireball

Game validation of unconfirmed passages, full travel paths to hunt entrances and individual historical evidence for the withheld entries remain outstanding. This change restores useful maps and navigation across published guides without presenting those remaining tasks as finished.
