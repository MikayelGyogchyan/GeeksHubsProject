import {useEffect, useState} from "react";
import axios from 'axios';
import './App.css';
import MovieCard from "./components/MovieCard";
import YouTube from "react-youtube";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function App() {
  const IMAGE_PATH = "https://image.tmdb.org/t/p/w1280"
  const API_URL = "https://api.themoviedb.org/3"
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState({});
  const [searchKey, setSearchKey] = useState("");
  const [playTrailer, setPlayTrailer] = useState(false);

  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover"
    const {data: {results}} = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: process.env.REACT_APP_MOVIE_API_KEY,
        query: searchKey
      }
    })

    setMovies(results)
    await selectMovie(results[0])
    
  }

  const fetchMovie = async (id) => {
    const {data} = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: process.env.REACT_APP_MOVIE_API_KEY,
        append_to_response: 'videos'
      }
    })

    return data
  }

  const selectMovie = async (movie) => {
    setPlayTrailer(false)
    const data = await fetchMovie(movie.id)
    setSelectedMovie(data)
  }

  useEffect(() => {
    fetchMovies()
  }, [])

  const renderMovies = () => movies.slice(0, 10).map(movie => 
      <MovieCard 
          key= {movie.id}
          movie={movie}
          selectMovie={selectMovie} 
      />
    )
  
  const searchMovies = (e) => {
    e.preventDefault()
    fetchMovies(searchKey)
  }

  const renderTrailer = () => {
    const trailer = selectedMovie.videos.results.find(vid => vid.name === 'Official trailer')
    const key = trailer ? trailer.key : selectedMovie.videos.results[0].key

    return (
      <YouTube
        videoId={key}
        containerClassName = {"youtube-container"}
        opts={{
          width: "700vw",
          height: "500vh",
          playerVars: {
            autoplay: 1,
            controls: 0
          }
        }}
      />
    )
  }

  return (
    
    <div className="App">
      <header className={"header"}>
       <div className={"header-content max-center"}>
        <div className="left">
          <img className="NetgeeksIcon" src="img/geeksfilx.png" alt="" />
        </div>
            <span className="SeccionSpan">Página principal</span>
            <span className="SeccionSpan">Series</span>
            <span className="SeccionSpan">Películas</span>
            <span className="SeccionSpan">Nueva y Popular</span>
            <span className="SeccionSpan">Mi lista</span>
          <div className="right">
            <NotificationsActiveIcon className='icon'/>
            <div className="profile">
            </div>
            <ExpandMoreIcon className='icon'/>
          </div>

          <form onSubmit={searchMovies}>
            <input type = "text" onChange={(e) => setSearchKey(e.target.value)}/>
            <button type = {"submit"}>Buscar</button>
          </form>
        </div>
      
      </header>

      <div className="hero" style={{backgroundImage: `url('${IMAGE_PATH}${selectedMovie.backdrop_path}')`}}>
        <div className="hero-content max-center">
          
          {playTrailer ? <button className={"button button--close"} onClick={() => setPlayTrailer(false)}>Cerrar</button> : null}
          {selectedMovie.videos && playTrailer ? renderTrailer() : null}
          
          <button className={"button"} onClick={() => setPlayTrailer(true)}>Reproducir tráiler</button>
          <h1 className={"hero-title"}>{selectedMovie.title}</h1>
          {selectedMovie.overview ? <p className={"hero-overview"}>{selectedMovie.overview}</p> : null}
        </div>
      </div>
      
      <div className="container max-center"> 
        {renderMovies()}
      </div>
    </div>
  );
}

export default App;