# Backlog projektu: Spotify Stats & Discovery App

## Zrealizowane

- [x] Strona główna
- [x] Docker + środowisko developerskie
- [x] Logowanie przez Spotify (OAuth 2.0)

---

## 🔄 W trakcie

*Brak – gotowy do realizacji kolejnych funkcji.*

---

## 🔜 Do zrealizowania

### 1. Statystyki odsłuchów (2.1)
**Opis:** Wyświetlanie liczby minut odsłuchu w podziale na lata i miesiące + średnia miesięczna.

- [ ] Backend: pobieranie danych z historii Spotify
- [ ] Frontend: wykresy (słupkowy/obszarowy)
- [ ] Średnia minut/miesiąc

**Priorytet:** Wysoki  
**Zależności:** Autoryzacja Spotify  
**Kryteria akceptacji:**
- Dane wizualizowane w wykresach
- Obsługa braku danych

---

### 2. Ewolucja muzyczna (2.2)
**Opis:** Śledzenie zmiany gustów muzycznych (gatunki/artysty) w czasie.

- [ ] Backend: grupowanie danych po miesiącu/roku
- [ ] Frontend: wykres zmian dominujących gatunków/artystów

**Priorytet:** Średni  
**Zależności:** Statystyki odsłuchów  
**Kryteria akceptacji:**
- Interaktywna oś czasu
- Widoczna zmiana trendów

---

### 3. Odkrycie miesiąca/roku (2.3)
**Opis:** Wyszukanie piosenek słuchanych po raz pierwszy i najczęściej odtwarzanych w danym okresie.

- [ ] Backend: analiza „first listen”
- [ ] Frontend: widżet z piosenką + przycisk „play” przez Spotify SDK

**Priorytet:** Średni  
**Zależności:** Statystyki odsłuchów  
**Kryteria akceptacji:**
- Wskazana piosenka z datą i liczbą streamów
- Klikalny link do Spotify

---

### 4. Rankingi (2.4)
**Opis:** Lista top 100 utworów, artystów, gatunków i playlist.

- [ ] Backend: agregacja danych
- [ ] Frontend: 4 zakładki z rankingami

**Priorytet:** Wysoki  
**Zależności:** Statystyki odsłuchów  
**Kryteria akceptacji:**
- Każda zakładka ładuje się osobno
- Widoczne dane liczbowe

---

### 5. Analiza językowa (2.5)
**Opis:** Określenie dominujących języków słuchanych utworów.

- [ ] Backend: klasyfikacja języka (Spotify lub NLP)
- [ ] Frontend: wykres rankingowy + udział procentowy

**Priorytet:** Średni  
**Zależności:** Pełne metadane utworów  
**Kryteria akceptacji:**
- Minimum 90% piosenek ma przypisany język
- Interaktywna wizualizacja

---

### 6. Dynamiczna playlista: Discovery Playlist (3.1)
**Opis:** Automatyczna playlista aktualizowana co 12h, z opcją ręcznej edycji.

- [ ] Backend: algorytm rotacji utworów (najświeższe/ostatnio słuchane)
- [ ] Frontend: zarządzanie playlistą + dodawanie własnych utworów
- [ ] Synchronizacja z kontem Spotify

**Priorytet:** Wysoki  
**Zależności:** Historia słuchania  
**Kryteria akceptacji:**
- Playlista zawsze zawiera 15–20 utworów
- Zmiany odzwierciedlone na koncie Spotify

---

### 7. Dynamiczna playlista: Best Songs Playlist (3.2)
**Opis:** Stała playlista z 100 najczęściej słuchanych piosenek.

- [ ] Backend: agregacja danych lifetime
- [ ] Frontend: lista z opcją „Odtwórz wszystko”
- [ ] Synchronizacja z kontem Spotify

**Priorytet:** Wysoki  
**Zależności:** Statystyki odsłuchów  
**Kryteria akceptacji:**
- Dokładnie 100 utworów
- Aktualizacja minimum raz dziennie

---

### 8. System rekomendacji językowych (AI) (4)
**Opis:** AI sugeruje podcasty i piosenki w wybranym języku na podstawie zainteresowań.

- [ ] UI: wybór języków + preferencji
- [ ] Backend: integracja z GPT + Spotify + LyricsTranslate
- [ ] Pobieranie tekstów i tłumaczeń

**Priorytet:** Średni  
**Zależności:** Analiza językowa, integracja AI  
**Kryteria akceptacji:**
- Rekomendacje zgodne z gustem użytkownika
- Generowanie playlisty + tekstów piosenek

---

### 9. Testowanie (6)
**Opis:** Testy jednostkowe frontend/backend, testy systemowe.

- [ ] Konfiguracja test runnerów
- [ ] Testy dla głównych funkcji backendu
- [ ] Testy komponentów React
- [ ] Testy systemowe (Docker, Spotify flow)

**Priorytet:** Wysoki  
**Zależności:** Minimum jeden gotowy feature  
**Kryteria akceptacji:**
- 80% pokrycia backendu i 70% frontend
- Testy CI w pipeline

