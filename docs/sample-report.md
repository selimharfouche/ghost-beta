# Ghost beta report

Target: http://127.0.0.1:4319/

Mode: codex · Model: gpt-6-astra · Status: completed

9 grouped findings · 37 observations

## 1. [high] Trip creation leaves no visible trip

observed; browser + Astra. 9 occurrence(s).

Expected: Creating a named trip adds it to Your trips and keeps it available when revisiting My trips.

Observed: No trip or feedback appeared after submission; revisiting My trips reset the input and still showed an empty list.

URL: http://127.0.0.1:4319/planner

### ghost-1 · browser

Observed: Trip creation failed: itinerary is undefined

1. Open http://127.0.0.1:4319/
2. click Plan your weekend → — http://127.0.0.1:4319/
3. fill Trip name = Cedar Weekend Test — http://127.0.0.1:4319/planner
4. click Create trip — http://127.0.0.1:4319/planner

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-1/003.jpg

### ghost-2 · browser

Observed: Trip creation failed: itinerary is undefined

1. Open http://127.0.0.1:4319/
2. fill Search destinations = mountains — http://127.0.0.1:4319/
3. click Plan this escape — http://127.0.0.1:4319/
4. fill Trip name = Cedar weekend test — http://127.0.0.1:4319/planner
5. click Create trip — http://127.0.0.1:4319/planner

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-2/004.jpg

### ghost-3 · browser

Observed: Trip creation failed: itinerary is undefined

1. Open http://127.0.0.1:4319/
2. click Plan your weekend → — http://127.0.0.1:4319/
3. fill Trip name = Test Cedar Weekend — http://127.0.0.1:4319/planner
4. click Create trip — http://127.0.0.1:4319/planner

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-3/003.jpg

### ghost-1 · Astra

Observed: After clicking Create trip, the name remains entered, Your trips remains empty, and no feedback appears.

1. Open http://127.0.0.1:4319/
2. click Plan your weekend → — http://127.0.0.1:4319/
3. fill Trip name = Cedar Weekend Test — http://127.0.0.1:4319/planner
4. click Create trip — http://127.0.0.1:4319/planner

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-1/003.jpg

### ghost-2 · Astra

Observed: After clicking Create trip, the name remains in the form, Your trips stays empty, and no success, error, or loading message appears.

1. Open http://127.0.0.1:4319/
2. fill Search destinations = mountains — http://127.0.0.1:4319/
3. click Plan this escape — http://127.0.0.1:4319/
4. fill Trip name = Cedar weekend test — http://127.0.0.1:4319/planner
5. click Create trip — http://127.0.0.1:4319/planner

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-2/004.jpg

### ghost-3 · Astra

Observed: After clicking Create trip, Your trips remains empty, the entered name remains in the form, and no confirmation or error appears.

1. Open http://127.0.0.1:4319/
2. click Plan your weekend → — http://127.0.0.1:4319/
3. fill Trip name = Test Cedar Weekend — http://127.0.0.1:4319/planner
4. click Create trip — http://127.0.0.1:4319/planner

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-3/003.jpg

### ghost-1 · Astra

Observed: Creating Cedar Weekend Test gave no feedback; opening My trips shows no trip and resets the name field.

1. Open http://127.0.0.1:4319/
2. click Plan your weekend → — http://127.0.0.1:4319/
3. fill Trip name = Cedar Weekend Test — http://127.0.0.1:4319/planner
4. click Create trip — http://127.0.0.1:4319/planner
5. click My trips — http://127.0.0.1:4319/planner

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-1/004.jpg

### ghost-2 · Astra

Observed: My trips opens the same planner with an empty trip list and clears the entered name; the submitted trip is unavailable.

1. Open http://127.0.0.1:4319/
2. fill Search destinations = mountains — http://127.0.0.1:4319/
3. click Plan this escape — http://127.0.0.1:4319/
4. fill Trip name = Cedar weekend test — http://127.0.0.1:4319/planner
5. click Create trip — http://127.0.0.1:4319/planner
6. click My trips — http://127.0.0.1:4319/planner

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-2/005.jpg

### ghost-3 · Astra

Observed: No trip or feedback appeared after submission; revisiting My trips reset the input and still showed an empty list.

1. Open http://127.0.0.1:4319/
2. click Plan your weekend → — http://127.0.0.1:4319/
3. fill Trip name = Test Cedar Weekend — http://127.0.0.1:4319/planner
4. click Create trip — http://127.0.0.1:4319/planner
5. click My trips — http://127.0.0.1:4319/planner

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-3/004.jpg

## 2. [high] Help link opens a 404 page

observed; browser + Astra. 6 occurrence(s).

Expected: Help provides planning guidance.

Observed: The Help link opens /help displaying Page not found and This help page is unavailable.

URL: http://127.0.0.1:4319/help

### ghost-1 · browser

Observed: HTTP 404 at http://127.0.0.1:4319/help

1. Open http://127.0.0.1:4319/
2. click Plan your weekend → — http://127.0.0.1:4319/
3. fill Trip name = Cedar Weekend Test — http://127.0.0.1:4319/planner
4. click Create trip — http://127.0.0.1:4319/planner
5. click My trips — http://127.0.0.1:4319/planner
6. click Discover — http://127.0.0.1:4319/planner
7. fill Search destinations = coast — http://127.0.0.1:4319/
8. press  = Enter — http://127.0.0.1:4319/
9. click Plan a coastal trip — http://127.0.0.1:4319/
10. click Help — http://127.0.0.1:4319/planner

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-1/009.jpg

### ghost-2 · browser

Observed: HTTP 404 at http://127.0.0.1:4319/help

1. Open http://127.0.0.1:4319/
2. fill Search destinations = mountains — http://127.0.0.1:4319/
3. click Plan this escape — http://127.0.0.1:4319/
4. fill Trip name = Cedar weekend test — http://127.0.0.1:4319/planner
5. click Create trip — http://127.0.0.1:4319/planner
6. click My trips — http://127.0.0.1:4319/planner
7. click Help — http://127.0.0.1:4319/planner

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-2/006.jpg

### ghost-3 · browser

Observed: HTTP 404 at http://127.0.0.1:4319/help

1. Open http://127.0.0.1:4319/
2. click Plan your weekend → — http://127.0.0.1:4319/
3. fill Trip name = Test Cedar Weekend — http://127.0.0.1:4319/planner
4. click Create trip — http://127.0.0.1:4319/planner
5. click My trips — http://127.0.0.1:4319/planner
6. click Discover — http://127.0.0.1:4319/planner
7. click Compare escapes — http://127.0.0.1:4319/
8. click Help — http://127.0.0.1:4319/compare

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-3/007.jpg

### ghost-1 · Astra

Observed: The Help link opens /help displaying Page not found and This help page is unavailable.

1. Open http://127.0.0.1:4319/
2. click Plan your weekend → — http://127.0.0.1:4319/
3. fill Trip name = Cedar Weekend Test — http://127.0.0.1:4319/planner
4. click Create trip — http://127.0.0.1:4319/planner
5. click My trips — http://127.0.0.1:4319/planner
6. click Discover — http://127.0.0.1:4319/planner
7. fill Search destinations = coast — http://127.0.0.1:4319/
8. press  = Enter — http://127.0.0.1:4319/
9. click Plan a coastal trip — http://127.0.0.1:4319/
10. click Help — http://127.0.0.1:4319/planner

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-1/009.jpg

### ghost-2 · Astra

Observed: The Help link opens /help showing “404 â€” Page not found” and “This help page is unavailable.”

1. Open http://127.0.0.1:4319/
2. fill Search destinations = mountains — http://127.0.0.1:4319/
3. click Plan this escape — http://127.0.0.1:4319/
4. fill Trip name = Cedar weekend test — http://127.0.0.1:4319/planner
5. click Create trip — http://127.0.0.1:4319/planner
6. click My trips — http://127.0.0.1:4319/planner
7. click Help — http://127.0.0.1:4319/planner

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-2/006.jpg

### ghost-3 · Astra

Observed: Clicking Help opens /help with “Page not found” and “This help page is unavailable.”

1. Open http://127.0.0.1:4319/
2. click Plan your weekend → — http://127.0.0.1:4319/
3. fill Trip name = Test Cedar Weekend — http://127.0.0.1:4319/planner
4. click Create trip — http://127.0.0.1:4319/planner
5. click My trips — http://127.0.0.1:4319/planner
6. click Discover — http://127.0.0.1:4319/planner
7. click Compare escapes — http://127.0.0.1:4319/
8. click Help — http://127.0.0.1:4319/compare

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-3/007.jpg

## 3. [high] Failed HTTP response

observed; browser. 1 occurrence(s).

Expected: The page completes the requested operation without errors.

Observed: HTTP 500 at http://127.0.0.1:4319/api/export

URL: http://127.0.0.1:4319/planner

### ghost-3 · browser

Observed: HTTP 500 at http://127.0.0.1:4319/api/export

1. Open http://127.0.0.1:4319/
2. click Plan your weekend → — http://127.0.0.1:4319/
3. fill Trip name = Test Cedar Weekend — http://127.0.0.1:4319/planner
4. click Create trip — http://127.0.0.1:4319/planner
5. click My trips — http://127.0.0.1:4319/planner
6. click Discover — http://127.0.0.1:4319/planner
7. click Compare escapes — http://127.0.0.1:4319/
8. click Help — http://127.0.0.1:4319/compare
9. click Return to Waypoint — http://127.0.0.1:4319/help
10. fill Search destinations = coast — http://127.0.0.1:4319/
11. scroll  = down — http://127.0.0.1:4319/
12. click Plan a coastal trip — http://127.0.0.1:4319/
13. click Export itinerary — http://127.0.0.1:4319/planner

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-3/012.jpg

## 4. [medium] Search does not distinguish matching destinations

observed; Astra. 4 occurrence(s).

Expected: Searching coast filters destinations or clearly highlights Coastal hideaway.

Observed: All three cards remain visible and equally faded after typing coast and pressing Enter, with no search feedback.

URL: http://127.0.0.1:4319/

### ghost-1 · Astra

Observed: All three cards remain visible and equally faded after typing coast and pressing Enter, with no search feedback.

1. Open http://127.0.0.1:4319/
2. click Plan your weekend → — http://127.0.0.1:4319/
3. fill Trip name = Cedar Weekend Test — http://127.0.0.1:4319/planner
4. click Create trip — http://127.0.0.1:4319/planner
5. click My trips — http://127.0.0.1:4319/planner
6. click Discover — http://127.0.0.1:4319/planner
7. fill Search destinations = coast — http://127.0.0.1:4319/
8. press  = Enter — http://127.0.0.1:4319/

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-1/007.jpg

### ghost-2 · Astra

Observed: All three cards remain visible but faded, including Cedar cabin described as a mountain retreat; no result count or no-match feedback appears.

1. Open http://127.0.0.1:4319/
2. fill Search destinations = mountains — http://127.0.0.1:4319/

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-2/001.jpg

### ghost-3 · Astra

Observed: With coast entered, Cedar cabin and Coastal hideaway both appear dimmed and remain in their original order.

1. Open http://127.0.0.1:4319/
2. click Plan your weekend → — http://127.0.0.1:4319/
3. fill Trip name = Test Cedar Weekend — http://127.0.0.1:4319/planner
4. click Create trip — http://127.0.0.1:4319/planner
5. click My trips — http://127.0.0.1:4319/planner
6. click Discover — http://127.0.0.1:4319/planner
7. click Compare escapes — http://127.0.0.1:4319/
8. click Help — http://127.0.0.1:4319/compare
9. click Return to Waypoint — http://127.0.0.1:4319/help
10. fill Search destinations = coast — http://127.0.0.1:4319/
11. scroll  = down — http://127.0.0.1:4319/

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-3/010.jpg

### ghost-3 · Astra

Observed: Cedar cabin remains first and occupies the visible results area, though dimmed; Coastal hideaway remains below the fold.

1. Open http://127.0.0.1:4319/
2. click Plan your weekend → — http://127.0.0.1:4319/
3. fill Trip name = Test Cedar Weekend — http://127.0.0.1:4319/planner
4. click Create trip — http://127.0.0.1:4319/planner
5. click My trips — http://127.0.0.1:4319/planner
6. click Discover — http://127.0.0.1:4319/planner
7. click Compare escapes — http://127.0.0.1:4319/
8. click Help — http://127.0.0.1:4319/compare
9. click Return to Waypoint — http://127.0.0.1:4319/help
10. fill Search destinations = coast — http://127.0.0.1:4319/

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-3/009.jpg

## 5. [medium] Cabin planning shortcut loses visible destination context

suspected; Astra. 3 occurrence(s).

Expected: Selecting “Plan this escape” carries Cedar cabin into the planner or confirms the selected destination.

Observed: The planner shows only a blank trip-name form, with no mention of Cedar cabin or its destination.

URL: http://127.0.0.1:4319/planner

### ghost-1 · Astra

Observed: Plan a coastal trip opens the generic blank planner with no coastal destination shown.

1. Open http://127.0.0.1:4319/
2. click Plan your weekend → — http://127.0.0.1:4319/
3. fill Trip name = Cedar Weekend Test — http://127.0.0.1:4319/planner
4. click Create trip — http://127.0.0.1:4319/planner
5. click My trips — http://127.0.0.1:4319/planner
6. click Discover — http://127.0.0.1:4319/planner
7. fill Search destinations = coast — http://127.0.0.1:4319/
8. press  = Enter — http://127.0.0.1:4319/
9. click Plan a coastal trip — http://127.0.0.1:4319/

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-1/008.jpg

### ghost-3 · Astra

Observed: The link opens the same blank trip-name form as the general planning link, with no coastal destination shown.

1. Open http://127.0.0.1:4319/
2. click Plan your weekend → — http://127.0.0.1:4319/
3. fill Trip name = Test Cedar Weekend — http://127.0.0.1:4319/planner
4. click Create trip — http://127.0.0.1:4319/planner
5. click My trips — http://127.0.0.1:4319/planner
6. click Discover — http://127.0.0.1:4319/planner
7. click Compare escapes — http://127.0.0.1:4319/
8. click Help — http://127.0.0.1:4319/compare
9. click Return to Waypoint — http://127.0.0.1:4319/help
10. fill Search destinations = coast — http://127.0.0.1:4319/
11. scroll  = down — http://127.0.0.1:4319/
12. click Plan a coastal trip — http://127.0.0.1:4319/

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-3/011.jpg

### ghost-2 · Astra

Observed: The planner shows only a blank trip-name form, with no mention of Cedar cabin or its destination.

1. Open http://127.0.0.1:4319/
2. fill Search destinations = mountains — http://127.0.0.1:4319/
3. click Plan this escape — http://127.0.0.1:4319/

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-2/002.jpg

## 6. [medium] Comparison lacks travel and price context

suspected; Astra. 2 occurrence(s).

Expected: Travel times identify an origin or transport mode, and prices identify their unit.

Observed: The table shows 2–3 hours and prices from $120–$180 without those details.

URL: http://127.0.0.1:4319/compare

### ghost-1 · Astra

Observed: The table shows 2–3 hours and prices from $120–$180 without those details.

1. Open http://127.0.0.1:4319/
2. click Plan your weekend → — http://127.0.0.1:4319/
3. fill Trip name = Cedar Weekend Test — http://127.0.0.1:4319/planner
4. click Create trip — http://127.0.0.1:4319/planner
5. click My trips — http://127.0.0.1:4319/planner
6. click Discover — http://127.0.0.1:4319/planner
7. fill Search destinations = coast — http://127.0.0.1:4319/
8. press  = Enter — http://127.0.0.1:4319/
9. click Plan a coastal trip — http://127.0.0.1:4319/
10. click Help — http://127.0.0.1:4319/planner
11. click Return to Waypoint — http://127.0.0.1:4319/help
12. click Compare escapes — http://127.0.0.1:4319/

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-1/011.jpg

### ghost-2 · Astra

Observed: The table lists “2 hours,” “3 hours,” “$120,” and “$180” without that context.

1. Open http://127.0.0.1:4319/
2. fill Search destinations = mountains — http://127.0.0.1:4319/
3. click Plan this escape — http://127.0.0.1:4319/
4. fill Trip name = Cedar weekend test — http://127.0.0.1:4319/planner
5. click Create trip — http://127.0.0.1:4319/planner
6. click My trips — http://127.0.0.1:4319/planner
7. click Help — http://127.0.0.1:4319/planner
8. click Return to Waypoint — http://127.0.0.1:4319/help
9. click Compare escapes — http://127.0.0.1:4319/

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-2/008.jpg

## 7. [medium] City nook details link opens a comparison without City nook

observed; Astra. 3 occurrence(s).

Expected: “See the details” on City nook displays information about that destination.

Observed: The link opens /compare, which lists only Cedar cabin and Coastal hideaway, with no City nook details.

URL: http://127.0.0.1:4319/compare

### ghost-2 · Astra

Observed: The link opens /compare, which lists only Cedar cabin and Coastal hideaway, with no City nook details.

1. Open http://127.0.0.1:4319/
2. fill Search destinations = mountains — http://127.0.0.1:4319/
3. click Plan this escape — http://127.0.0.1:4319/
4. fill Trip name = Cedar weekend test — http://127.0.0.1:4319/planner
5. click Create trip — http://127.0.0.1:4319/planner
6. click My trips — http://127.0.0.1:4319/planner
7. click Help — http://127.0.0.1:4319/planner
8. click Return to Waypoint — http://127.0.0.1:4319/help
9. click Compare escapes — http://127.0.0.1:4319/
10. click Discover — http://127.0.0.1:4319/compare
11. click See the details — http://127.0.0.1:4319/

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-2/010.jpg

### ghost-1 · Astra

Observed: Discover advertises three escapes, but comparison includes only Cedar cabin and Coastal hideaway.

1. Open http://127.0.0.1:4319/
2. click Plan your weekend → — http://127.0.0.1:4319/
3. fill Trip name = Cedar Weekend Test — http://127.0.0.1:4319/planner
4. click Create trip — http://127.0.0.1:4319/planner
5. click My trips — http://127.0.0.1:4319/planner
6. click Discover — http://127.0.0.1:4319/planner
7. fill Search destinations = coast — http://127.0.0.1:4319/
8. press  = Enter — http://127.0.0.1:4319/
9. click Plan a coastal trip — http://127.0.0.1:4319/
10. click Help — http://127.0.0.1:4319/planner
11. click Return to Waypoint — http://127.0.0.1:4319/help
12. click Compare escapes — http://127.0.0.1:4319/

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-1/011.jpg

### ghost-2 · Astra

Observed: Only Cedar cabin and Coastal hideaway appear; City nook is omitted without explanation.

1. Open http://127.0.0.1:4319/
2. fill Search destinations = mountains — http://127.0.0.1:4319/
3. click Plan this escape — http://127.0.0.1:4319/
4. fill Trip name = Cedar weekend test — http://127.0.0.1:4319/planner
5. click Create trip — http://127.0.0.1:4319/planner
6. click My trips — http://127.0.0.1:4319/planner
7. click Help — http://127.0.0.1:4319/planner
8. click Return to Waypoint — http://127.0.0.1:4319/help
9. click Compare escapes — http://127.0.0.1:4319/

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-2/008.jpg

## 8. [medium] Comparison table overflows the mobile viewport

observed; browser + Astra. 2 occurrence(s).

Expected: Destination comparison details fit the narrow screen or provide an obvious way to access remaining columns.

Observed: The table extends past the right edge: Best for is clipped and From prices are offscreen. The observation reports horizontal overflow.

URL: http://127.0.0.1:4319/compare

### ghost-3 · browser

Observed: Document wider than 390px viewport.

1. Open http://127.0.0.1:4319/
2. click Plan your weekend → — http://127.0.0.1:4319/
3. fill Trip name = Test Cedar Weekend — http://127.0.0.1:4319/planner
4. click Create trip — http://127.0.0.1:4319/planner
5. click My trips — http://127.0.0.1:4319/planner
6. click Discover — http://127.0.0.1:4319/planner
7. click Compare escapes — http://127.0.0.1:4319/

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-3/006.jpg

### ghost-3 · Astra

Observed: The table extends past the right edge: Best for is clipped and From prices are offscreen. The observation reports horizontal overflow.

1. Open http://127.0.0.1:4319/
2. click Plan your weekend → — http://127.0.0.1:4319/
3. fill Trip name = Test Cedar Weekend — http://127.0.0.1:4319/planner
4. click Create trip — http://127.0.0.1:4319/planner
5. click My trips — http://127.0.0.1:4319/planner
6. click Discover — http://127.0.0.1:4319/planner
7. click Compare escapes — http://127.0.0.1:4319/

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-3/006.jpg

## 9. [low] Error heading contains garbled punctuation

observed; Astra. 2 occurrence(s).

Expected: The heading displays readable punctuation.

Observed: The heading displays “404 â€” Page not found”.

URL: http://127.0.0.1:4319/help

### ghost-1 · Astra

Observed: The heading displays “404 â€” Page not found”.

1. Open http://127.0.0.1:4319/
2. click Plan your weekend → — http://127.0.0.1:4319/
3. fill Trip name = Cedar Weekend Test — http://127.0.0.1:4319/planner
4. click Create trip — http://127.0.0.1:4319/planner
5. click My trips — http://127.0.0.1:4319/planner
6. click Discover — http://127.0.0.1:4319/planner
7. fill Search destinations = coast — http://127.0.0.1:4319/
8. press  = Enter — http://127.0.0.1:4319/
9. click Plan a coastal trip — http://127.0.0.1:4319/
10. click Help — http://127.0.0.1:4319/planner

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-1/009.jpg

### ghost-3 · Astra

Observed: The heading displays “404 â€” Page not found”.

1. Open http://127.0.0.1:4319/
2. click Plan your weekend → — http://127.0.0.1:4319/
3. fill Trip name = Test Cedar Weekend — http://127.0.0.1:4319/planner
4. click Create trip — http://127.0.0.1:4319/planner
5. click My trips — http://127.0.0.1:4319/planner
6. click Discover — http://127.0.0.1:4319/planner
7. click Compare escapes — http://127.0.0.1:4319/
8. click Help — http://127.0.0.1:4319/compare

Evidence: /artifacts/4046b6e1-8479-4c2a-a579-47a4a616ed25/ghost-3/007.jpg


Automated findings need human triage. A screenshot replay records observations; it does not re-execute the actions.
