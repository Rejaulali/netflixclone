import React,{ useState, useEffect} from 'react'
import axios from './axios'
import "./Row.css"
import Youtube from "react-youtube"
import movieTrailer from "movie-trailer"
const base_url_image = "https://image.tmdb.org/t/p/original"
function Row({title, fetchUrl, isLargeRow}) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl,setTrailerUrl] = useState("");
    useEffect(()=>{
        async function fetchdata(){
            const request = await axios.get(fetchUrl)
            setMovies(request.data.results)
            return request
        }
        fetchdata()

    },[fetchUrl])
    const opts = {
      height: '390',
      width: '100%',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
      },
    };

    const handleClick = async (name)=>{
      if(trailerUrl){
        setTrailerUrl("")
      }
      else{
	console.log(name)
        await movieTrailer(name)
        .then(url=>{
        	console.log(url)
          const urlParams = new URLSearchParams(new URL(url).search)
          setTrailerUrl(urlParams.get('v'))
          console.log(urlParams.get('v'))
        })
        .catch(error=>{
          console.log(error)
        })
      }
    }
    return (
        <div className="row">
            <h2>{title}</h2>
            <div className={`row_posters`}>
                {movies.map(movie=>{
                    return <img
                    key={movie.id}
                    onClick={() =>handleClick(movie?.name || movie?.title || movie?.original_name || "")}
                    className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                    src={`${base_url_image}${isLargeRow?movie.poster_path:movie.backdrop_path}`}
                    alt={movie.name}/>
                })}
            </div>
            {trailerUrl && <Youtube videoId={trailerUrl} opts={opts}/>}

        </div>
    )
}

export default Row
