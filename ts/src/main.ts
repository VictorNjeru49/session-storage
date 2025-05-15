import './style.css'
import { DatabaseService } from './database.service.ts'


async function init(){
  const dbService = new DatabaseService();

  // Open the database
  await dbService.openDatabase()
  console.log("Database opened successfully");

  async function DisplayMovies(){
      // get all movies
  const movies = await dbService.getAllMovies()
  console.log("Movies:", movies);


  const cardContainer = document.querySelector('.card')!;
    
  cardContainer.innerHTML = movies.map((movie) => {
      return `
      <div class="card-item">
      <img src="${movie.poster_path}" alt="${movie.title}" height="150px" width="200px">
        <h2>${movie.title}</h2>
        <p>Director: ${movie.director}</p>
        <p>Year: ${movie.year}</p>
        <button class="delete-movie" data-id="${movie.id}">Delete</button>
        <button class="edit-movie" data-id="${movie.id}">Edit</button>
      </div>
      `
    
  }).join('');
  }

  document.querySelector<HTMLButtonElement>('#add-movie')!.onclick = async () => {
    const title = (document.querySelector<HTMLInputElement>('#movie-title')!).value;
    const director = (document.querySelector<HTMLInputElement>('#movie-director')!).value;
    const year = (document.querySelector<HTMLInputElement>('#movie-year')!).value;

    const movie = {
      title: title,
      director: director,
      overview: "This is a sample overview",
      year: year,
      release_date: "upcoming",
      poster_path: "https://static.hbo.com/game-of-thrones-1-1920x1080.jpg",
      backdrop_path: "https://static.hbo.com/game-of-thrones-1-1920x1080.jpg",
      vote_average: 0,
      vote_count: 0,
      popularity: 0,
      genres: []
    }

    if (!title || !director || !year) {
      alert("Please fill in all fields");
      return;
    }
    // Check if movie already exists
    if(title && director && year){
    await dbService.addMovie(movie);
    console.log("Movie added successfully");
    DisplayMovies();
    }
  }

// Use event delegation for delete buttons
document.querySelector('.card')!.addEventListener('click', async (event) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains('delete-movie')) {
    window.deleteMovie = async (id: number) => {
      await dbService.deleteMovie(id);
      console.log("Movie deleted successfully");
      DisplayMovies();
    }
    }
});
 
  DisplayMovies();
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <h1> Movie Database</h1>

    <div class="add-movie">
      <input type="text" id="movie-title" placeholder="Movie Title">
      <input type="text" id="movie-director" placeholder="Movie Director">
      <input type="text" id="movie-year" placeholder="Movie Year">
      <button id="add-movie">Add Movie</button>
    
    </div>

    <div class="card">


    </div>

    </div>

`


init().catch((error)=>{
    console.error("Error initializing app:", error);
})

declare global {
  interface Window{
    deleteMovie: (id: number)=> Promise<void>;
    editMovie: (id: number)=> Promise<void>;
  }
}