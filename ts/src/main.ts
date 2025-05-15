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
        <button class="delete-movie"onclick="deleteMovie" data-id="${movie.id}">Delete</button>
        <button class="edit-movie" onclick ="editMovie" data-id="${movie.id}">Edit</button>
      </div>

      <div class="edit-form" id="edit-${movie.id}" style="display: none;">
              <input type="text" class="edit-title" value="${movie.title}" placeholder="Movie Title">
              <input type="text" class="edit-director" value="${movie.director}" placeholder="Director">
              <input type="number" class="edit-year" value="${movie.year}" placeholder="Year">
              <button onclick="saveMovie(${movie.id})">Save</button>
              <button onclick="cancelEdit(${movie.id})">Cancel</button>
          </div>
      `
    
  }).join('');
  }

  document.querySelector<HTMLButtonElement>('#add-movie')!.onclick = async () => {
    const title = (document.querySelector('#movie-title') as HTMLInputElement).value;
    const director = (document.querySelector ('#movie-director') as HTMLInputElement).value;
    const year = parseInt((document.querySelector ('#movie-year') as HTMLInputElement).value);

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
    // Check if movie already exists
    if(title && director && year){
    await dbService.addMovie(movie);
    console.log("Movie added successfully");
    DisplayMovies();
    }
    
    // clear inputs
    (document.querySelector('#title') as HTMLInputElement).value = '';
    (document.querySelector('#director') as HTMLInputElement).value = '';
    (document.querySelector('#year') as HTMLInputElement).value = '';
  }

// Use event delegation for delete buttons
window.deleteMovie = async(id: number)=>{
  await dbService.deleteMovie(id)
  await DisplayMovies()
}

window.cancelEdit = (id: number) => {
  const movieCard = document.querySelector(`#movie-${id} .movie-content`)! as HTMLElement;
  const editForm = document.querySelector(`#edit-${id}`)! as HTMLElement;
  movieCard.style.display = 'block';
  editForm.style.display = 'none';
};

window.saveMovie = async (id: number) => {
  const editForm = document.querySelector(`#edit-${id}`)!;
  const title = (editForm.querySelector('.edit-title') as HTMLInputElement).value;
  const director = (editForm.querySelector('.edit-director') as HTMLInputElement).value;
  const year = parseInt((editForm.querySelector('.edit-year') as HTMLInputElement).value);

  if (title && director && year) {
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

    await dbService.updateMovie(movie);
    await DisplayMovies();
  }
};


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
    editMovie: (id: number)=> void;
    cancelEdit: (id: number) => void;
    saveMovie: (id: number) => void;
  }
}