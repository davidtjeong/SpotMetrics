import './App.css';
import {useEffect, useState} from 'react';
import axios from 'axios';

function App() {
  const CLIENT_ID = "06e804946186484a9da662aadf53a393"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const scopes = ["user-top-read"]

  const [token, setToken] = useState("")
  const [artists, setArtists] = useState([]) 

  useEffect(() => {
      const hash = window.location.hash
      let token = window.localStorage.getItem("token")

      if (!token && hash) {
          token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

          window.location.hash = ""
          window.localStorage.setItem("token", token)
      }

      setToken(token)

  }, [])

  const logout = () => {
      setToken("")
      window.localStorage.removeItem("token")
  }

  const getTopArtists = async () => {
    //e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/me/top/artists", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            time_range: "medium_term",
            limit: 50,
            offset: 5,
        }

    })
    console.log(data)
    setArtists(data.items)
  }

  const renderArtists = () => {
    return <article className='All-data'>{artists.map(artist => (
        <div key={artist.id} className='Artist-data'>
            {artist.images.length ? <img width={"100%"} src={artist.images[0].url} className='Artist-image' alt=""/> : <div>No Image</div>}
            <h1 className='Artist-name'>{artist.name}</h1>
        </div>
    ))}</article>
  }

  return (
      <div className="App">
          <header className="App-header">
              <h1 className='App-title'>SpotMetrics</h1>
              {!token ?
                  <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scopes.join("%20")}&response_type=${RESPONSE_TYPE}`}>Login
                      to Spotify</a>
                  : <button onClick={logout} className='App-button'>Logout</button>}
              
              <form onSubmit={getTopArtists}>
                  <button type={"submit"} className='App-button'>Show top artists</button>
              </form>
              {renderArtists()}

          </header>
      </div>

  );
} 

export default App;