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

## Railway

Repozytorium zawiera `Dockerfile` uruchamiający aplikację w Nginx oraz `railway.toml` z kontrolą dostępności pod `/`. Serwer korzysta z portu przekazanego przez Railway w zmiennej `PORT` (domyślnie 8080).

Źródłem usługi Railway powinno być repozytorium `pk-dev-cs/AmongTheStands`, gałąź `main`, z włączonym automatycznym wdrażaniem. Powiązanie repozytorium, domena i automatyczne wdrażanie są ustawieniami usługi Railway; sam plik `railway.toml` ich nie tworzy.

Lokalne sprawdzenie obrazu (wymaga Dockera):

```sh
docker build -t among-the-stands .
docker run --rm -p 8080:8080 -e PORT=8080 among-the-stands
```

## Wdrożenie produkcyjne

Aplikacja: https://amongthestands-production.up.railway.app

Panel projektu: https://railway.com/project/32131362-e329-49cc-aede-de432e8e3287

Usługa Railway jest połączona z gałęzią `main` tego repozytorium. Każdy push na `main` uruchamia automatyczną budowę i wdrożenie. Nie jest przypięta do pojedynczego commita i nie wymaga ręcznego publikowania.
