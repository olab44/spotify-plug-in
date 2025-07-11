## 🎵 Spotify Analytics

Welcome to Spotify Analytics—your ultimate tool to dive into your music journey! This app gives you personalized insights into your listening habits, helps you discover new favorites, and even learn new languages through music.

🌟 Features

🔐 Login with Spotify

Securely connect your Spotify account to get started.

📊 Music Insights

See your listening stats by year or month.
Track your favorite genres and artists over time.
Discover your monthly highlights and hidden gems.

🎧 Playlists

Discovery Mix: Fresh songs every 12 hours, auto-updated for you.
Top 100 Songs: A playlist of your all-time most-played tracks.

🌍 Learn Languages with Music

Choose a language you want to explore.
Get personalized music and podcast suggestions in that language.
Enjoy lyrics with translations, powered by lyricstranslate.com.

Built With

React
FastAPI
PostgreSQL
Docker

Wymagania funkcjonalne
1. Logowanie przez Spotify
Użytkownik może zalogować się do aplikacji za pomocą konta Spotify (OAuth 2.0).

Po zalogowaniu aplikacja uzyskuje dostęp do historii odsłuchów, playlist i preferencji muzycznych użytkownika.

Sesja użytkownika jest utrzymywana w aplikacji do momentu wylogowania.

2. Zakładka użytkownika z analizą muzycznych nawyków
2.1. Statystyki odsłuchów
Liczba odsłuchanych minut w podziale na lata i miesiące.

Średnia liczba minut odsłuchu na miesiąc.

2.2. Ewolucja muzyczna
Zmiana dominujących gatunków i artystów w czasie (miesiąc/rok).

Prezentacja danych w formie wykresów.

2.3. Odkrycie roku/miesiąca
Najczęściej słuchana nowa piosenka w danym okresie.

2.4. Rankingi
Top 100 najczęściej słuchanych utworów (z liczbą streamów).

Top 100 artystów z największą liczbą odsłuchanych minut.

Top 10 gatunków muzycznych najczęściej słuchanych przez użytkownika.

Najczęściej słuchane playlisty.

2.5. Analiza językowa
Jakie języki dominują w utworach użytkownika.

Ranking języków na podstawie liczby odsłuchanych minut.

3. Dynamiczne playlisty
3.1. Discovery Playlist
Automatycznie aktualizowana co 12 godzin.

Zawiera 15-20 nowych utworów (najczęściej słuchanych w ostatnim czasie).

Użytkownik może dodawać utwory ręcznie, wtedy najmniej słuchany utwór zostaje usunięty.

System samodzielnie dodaje i usuwa utwory na podstawie aktywności użytkownika.

3.2. Best Songs Playlist
Stała playlista zawierająca 100 najczęściej słuchanych utworów w historii użytkownika.

Aktualizowana automatycznie na podstawie danych ze Spotify.

4. System rekomendacji językowych (AI)
Użytkownik wybiera język(i) do nauki.

System analizuje zainteresowania użytkownika, ulubione podcasty i poziom językowy.

Rekomenduje:

Nowe podcasty w wybranym języku, zgodne z zainteresowaniami.

Utwory muzyczne w wybranym języku, dopasowane do top 10 gatunków użytkownika.

Tworzy spersonalizowaną playlistę w wybranym języku.

Pobiera teksty piosenek i ich tłumaczenia z lyricstranslate.com.

Wymagania niefunkcjonalne
5. Architektura i technologie
Frontend: React + TypeScript

Backend: FastAPI (Python)

Baza danych: PostgreSQL

Wdrażanie: Docker

Autoryzacja: OAuth 2.0 (Spotify API)

6. Testowanie
Testy jednostkowe dla backendu i frontend.

Testy systemowe na wersji developerskiej.


