<!-- movie.vue -->
<template>
  <div class="container">
    <div class="card card-default">
      <div class="card-header">Detail Movie</div>
      <div class="card-body">
        <div class="movie-detail-container">
          <!-- <div class="back-button">
            <button @click="goBack">Back</button>
          </div> -->
          <button type="button" class="bg-gray-800 text-white rounded-l-md border-r border-gray-100 py-2 hover:bg-red-700 hover:text-white px-3">
            <div class="flex flex-row align-middle">
              <svg class="w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
              </svg>
              <p class="ml-2">Prev</p>
            </div>
          </button>

          <div v-if="!movie" class="loading">
            <p>Loading...</p>  <!-- Loading message or a spinner -->
          </div>
          
          <div v-else class="movie-detail">
            <h1 class="movie-title">{{ movie.Title }}
              <!-- Add to Favorites Star Icon -->
              <i 
                :class="['fa', isFavorite ? 'fa-star' : 'fa-star-o']" 
                class="favorite-icon" 
                @click="toggleFavorite(movie.imdbID)">
              </i>
            </h1>
            <div class="movie-info">
              <div class="movie-poster">
                <img :src="movie.Poster" alt="Movie Poster" />
              </div>
              <div class="movie-overview">
                <h3>Overview</h3>
                <p>{{ movie.Plot }}</p>
                <p><i class="fas fa-users"></i> <strong>Actors:</strong> {{ movie.Actors }}</p>
                <p><i class="fas fa-star"></i> <strong>Rated:</strong> {{ movie.Rated }}</p>
                <p><i class="fas fa-trophy"></i> <strong>Awards:</strong> {{ movie.Awards }}</p>
                <p><i class="fas fa-calendar-check"></i> <strong>Released:</strong> {{ movie.Released }}</p>
                <p><i class="fas fa-star-half-alt"></i> <strong>IMDb Rating:</strong> {{ movie.imdbRating }}</p>
              </div>
              <div class="movie-additional-info">
                <p><i class="fas fa-calendar-alt"></i> <strong>Year:</strong> {{ movie.Year }}</p>
                <p><i class="fas fa-feed"></i> <strong>Type:</strong> {{ movie.Type }}</p>
                <p><i class="fas fa-film"></i> <strong>Genre:</strong> {{ movie.Genre }}</p>
                <p><i class="fas fa-user-director"></i> <strong>Director:</strong> {{ movie.Director }}</p>
                <p><i class="fas fa-flag"></i> <strong>Country:</strong> {{ movie.Country }}</p>
                <p><i class="fas fa-language"></i> <strong>Language:</strong> {{ movie.Language }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      movie: null,
      isFavorite: false,
    };
  },
  computed: {
    movieDetail() {
      this.movie = this.$store.getters['movie/movieDetail'];
      return this.movie;
    },
    loading() {
      return this.$store.getters['movie/loading'];
    },
  },
  created() {
    const imdbID = this.$route.params.id; 
    this.fetchmovie(imdbID);
  },
  methods: {
    async toggleFavorite(imdbID) {
      try {
        const response = await this.$store.dispatch('movie/toggleFavorite', imdbID);
        this.isFavorite = response.isFavorite; 
      } catch (error) {
        console.error("Error adding to favorites:", error);
      }
    },
    async fetchmovie(imdbID) {
      try {
        await this.$store.dispatch('movie/getMovieDetail', imdbID)
        this.movieDetail;

        const listFavorite = this.$store.getters['movie/favoriteMovies'];
        const index = listFavorite.findIndex((m) => m.imdbID === imdbID);
        if (index >= 1) {
          this.isFavorite = true
        } 
        
      } catch (error) {
        console.error("Error fetching movie detail:", error);
      }
    },
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style scoped>
.favorite-icon {
  color: gold;
  cursor: pointer;
  margin-left: 10px;
}

.favorite-icon:hover {
  color: darkgoldenrod;
}

.movie-detail-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.back-button {
  margin-bottom: 20px;
}

.back-button button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.back-button button:hover {
  background-color: #0056b3;
}

.movie-detail {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.movie-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 15px;
}

.movie-info {
  display: flex;
  gap: 20px;
}

.movie-poster {
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}

.movie-poster img {
  max-width: 300px;
  height: auto;
  border-radius: 8px;
}

.movie-overview h3 {
  font-size: 1.5rem;
}

.movie-overview p {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 10px;
}

.movie-additional-info p {
  font-size: 1rem;
  margin: 5px 0;
}

/* Loading state */
.loading {
  text-align: center;
  font-size: 1.5rem;
  color: #007bff;
}

@media (max-width: 768px) {
  .movie-info {
    flex-direction: column;
    align-items: center;
  }

  .movie-title {
    text-align: center;
  }

  .movie-poster img {
    max-width: 100%;
  }
}
</style>