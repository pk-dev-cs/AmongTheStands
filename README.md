# AmongTheStands

Interaktywna mapa Międzynarodowych Targów Książki w Krakowie. Aplikacja wyświetla oficjalny plan edycji 2026 i pozwala wyszukać wystawcę, markę lub numer stoiska. Wybrana lokalizacja jest przybliżana i zaznaczana na zielono.

## Uruchomienie

Aplikacja jest statyczna, bez instalowania zależności i bez procesu budowania.

```sh
python3 -m http.server 8000 --directory dist
```

Otwórz http://localhost:8000. Do hostingu wystarczy zawartość katalogu `dist/`.

## Testy

Wymagany Node.js 18 lub nowszy.

```sh
node tests/catalog.test.cjs
```

Testy obejmują zgodność katalogu, wyszukiwanie wszystkich wpisów z polskimi znakami i bez nich, wybór lokalizacji, pełną listę oraz reset mapy.

## Dane

Stan katalogu: 23 października 2026. Zaimportowano 483 wpisy wystawców, marek i współwystawców. 466 wpisów ma lokalizację na planie; 17 wpisów jest oznaczonych jako online lub nie ma lokalizacji podanej przez organizatora. Współwystawcy mogą korzystać z tego samego stoiska.

- `dist/` — gotowa aplikacja HTML/CSS/JavaScript, katalog, obraz planu i oryginalny PDF.
- `data/catalog.json` — czytelna kopia zaimportowanego katalogu i metadane źródła.
- `data/stand-regions.json` — obszary stoisk i sal we współrzędnych obrazu planu (2122 × 3000).
- `tests/catalog.test.cjs` — testy aplikacji i danych.

Źródła: [strona organizatora](https://ksiazka.krakow.pl/), [katalog wystawców](https://targiksiazki.exposupport.pl/wystawcy), [oficjalny plan PDF](https://targi.krakow.pl/storage/file/core_files/2026/10/14/5de2176b069e1717a494c9f78ddfdb46/KSIAZKA26_plan_hali_www.pdf).

Plan i materiały targowe pochodzą od organizatora. Projekt jest niezależną aplikacją korzystającą z tych materiałów. Zewnętrzne fonty są ładowane z Google Fonts; przy braku połączenia używane są fonty systemowe.
