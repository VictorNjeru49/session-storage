export type Genre = {
    id?: number;
    name: string;
}

export type Movie = {
    id?: number;
    title: string;
    director: string;
    year: number;
    overview: string;
    release_date: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    vote_count: number;
    popularity: number;
    genres: Genre[];
}



export class DatabaseService {
    private db: IDBDatabase | null =null
    private dbName: string = "movieDB";
    private readonly STORE_NAME: string = "movies";

    constructor() {
        this.openDatabase();
    }

    public async openDatabase(): Promise<void> {
        return new Promise((resolve, reject)=>{
            const request = indexedDB.open(this.dbName, 1);

            // Handle Error
            request.onerror = (event) => { // request.onerror = ()=> reject(request.error);
                console.error("Database error:", event);
                reject(event);
            }

            // Handle Success
            request.onsuccess = () => {
            //     this.db = (event.target as IDBOpenDBRequest).result;
            //     console.log("Database opened successfully");
            //     resolve();
            // }
                this.db = request.result;
                console.log("Database opened successfully");
                resolve();
            }

            // Create Object Store
            request.onupgradeneeded =(event)=>{
                const db = (event.target as IDBOpenDBRequest).result;
                if(!db.objectStoreNames.contains(this.STORE_NAME)){
                    console.log("Creating object store");

                    // Create object store
                    const objectstore= db.createObjectStore(this.STORE_NAME, {keyPath: "id", autoIncrement: true});
                    objectstore.createIndex("title", "title", {unique: false});

                }
            }
        })
    }

    async addMovie(movie: Movie): Promise<void> {
        const movieData ={title: movie.title, overview: movie.overview, director: movie.director,
            year: movie.year, release_date: movie.release_date, poster_path: movie.poster_path, 
            backdrop_path: movie.backdrop_path, vote_average: movie.vote_average, 
            vote_count: movie.vote_count, popularity: movie.popularity, genres: movie.genres};


        return new Promise((resolve, reject)=>{
            const transaction = this.db!.transaction([this.STORE_NAME], "readwrite");  
            // ! to confirm that db is not null  ? to confirm that db is null


            const objectstore = transaction.objectStore(this.STORE_NAME) //? to confirm that db is null
            const request = objectstore.add(movieData);

            request.onerror= (event) =>{
                console.error("Error adding movie:", event);
                reject(event);
            }
            request.onsuccess= () =>{
                console.log("Movie added successfully");
                resolve();
            }
        })
    }

    async updateMovie(movie: Movie): Promise<void> {


        return new Promise((resolve, reject) => {
            if (movie.id === undefined) {
                reject(new Error("Movie id is undefined"));
                return;
            }
            const transaction = this.db!.transaction([this.STORE_NAME], "readwrite");
            const objectstore = transaction.objectStore(this.STORE_NAME);
            const request = objectstore.put(movie.id);

            request.onerror = (event) => {
                console.error("Error updating movie:", event);
                reject(event);
            };

            request.onsuccess = () => {
                console.log("Movie updated successfully");
                resolve();
            };
        })
    }

    async deleteMovie(id: number): Promise<void> {
        return new Promise((resolve, reject)=>{
            const transaction = this.db!.transaction([this.STORE_NAME], "readwrite");
            const objectstore = transaction.objectStore(this.STORE_NAME);
            const request = objectstore.delete(id);

            request.onerror= (event) =>{
                console.error("Error deleting movie:", event);
                reject(event);
            }

            request.onsuccess= () =>{
                console.log("Movie deleted successfully");
                resolve();
            }
        })
    }

    async getAllMovies(): Promise<Movie[]> {
        return new Promise((resolve, reject)=>{
            const transaction = this.db!.transaction([this.STORE_NAME], "readonly");
            const objectstore = transaction.objectStore(this.STORE_NAME);
            const request = objectstore.getAll();

            request.onerror= (event) =>{
                console.error("Error getting movies:", event);
                reject(event);
            }

            request.onsuccess= () =>{
                console.log("Movies retrieved successfully");
                resolve(request.result);
            }
        })
    }
}