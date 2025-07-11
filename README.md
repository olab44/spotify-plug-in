Built With

React
FastAPI
PostgreSQL
Docker

How to Use

## 1. Clone this repository.


## 2. Set up your environment with Spotify API keys (see below).

Create .env file in root directory with your Spotify Keys (From https://developer.spotify.com/dashboard)

structure:
```s
SPOTIFY_CLIENT_ID=<your-client-id>
SPOTIFY_CLIENT_SECRET=<your-client-secret>
SECRETE_KEY=<your-secret>
SPOTIFY_REDIRECT_URI=<your-redirect-uri>
```


## 3. Run the app:

In terminal enter:

`docker compose up --build`


