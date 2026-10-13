# Quest publication policy — 13 October 2026

The previous public inventory mixed 63 entries labelled documented and 35 entries awaiting historical confirmation. An uncertainty badge is insufficient for a site explicitly restricted to Tibia 7.4.

The new public catalogue admits 62 reviewed entries. Explorer Brooch is withheld because the reward is explicitly dated to 7.6 in both item references, conflicting with the 6.1 quest-table entry. The other 35 entries are withheld for insufficient dated evidence in this project. Withholding does **not** establish that every such quest is post-7.4.

Evidence checked:
- https://www.tibiawiki.com.br/wiki/Explorer_Brooch — item addition 7.6.
- https://tibia.fandom.com/wiki/Explorer_Brooch — same item date.
- https://tibia.fandom.com/wiki/Updates/6.1 — conflicting Explorer Brooch quest row.
- https://tibia.fandom.com/wiki/Updates/6.4 — old Edron collections; modern redirects to Against the Spider Cult (8.1) are not dates of the original treasure collections.
- https://tibia.fandom.com/wiki/Giant_Smithhammer_Quest — original collection dated 7.24.
- https://www.tibiawiki.com.br/wiki/Skull_of_Ratha and https://tibiawiki.com.br/wiki/Ratha — 7.24; later Explorer Society missions must not be imported into the original collection.
- https://tibicam.com/video/fuwapiwu-tibia-73-40ea53c1 — Crusader Helmet dated recording retained as historical presence evidence, not an introduction date.

The previously gathered Portuguese wiki pages for all 98 records were compared with the existing version and dated-recording inventory. A current parent-quest redirect or an item existing in 7.4 alone does not establish when an individual reward container was introduced. Unknown dates are not converted into guessed versions.

Implementation:
- A reviewed allowlist plus a release-label check controls the shared runtime quest array and map routes.
- Catalogue, global search, city collections, planner, journal listings and direct map routes use that same array.
- Historic key records remain readable, but unavailable related quest links are withheld. Lore entries without an admitted guide are hidden.
- Withdrawn static URLs show a short `noindex,follow` notice, without instructions, rewards or map links. They are absent from the directory and sitemap.
- Notes already stored locally are not deleted or rewritten.
- The sitemap now has 82 URLs: 62 quest guides, 14 hunts, 2 directories and 4 general pages.

This audit concerns whether an entry may be presented as a 7.4 guide. It is not in-game validation of every instruction, reward quantity or map tile. The detailed decision inventory is in `quest-version-audit-20261013.json`.
