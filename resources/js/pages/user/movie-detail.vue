<!-- movie.vue -->
<template>
    <div class="container">
      <div class="card card-default">
        <div class="card-header">
          {{ $t('movie.titleDetail') }}
          <button class="btn-arrow float-right" @click="goBack">
            <i class="fa fa-arrow-left"></i>
            <span>Back</span>
          </button>
        </div>
        <div class="card-body">
          <div class="movie-detail-container">
  
            <div v-if="!movie" class="loading">
              <p>Loading...</p>  <!-- Loading message or a spinner -->
            </div>
            
            <div v-else class="movie-detail">
              <h1 class="movie-title">{{ movie.Title }}
                <!-- Add to Favorites Star Icon -->
                <i 
                  :class="['fa', isFavorite ? 'fa-star' : 'fa-star-o']" 
                  class="favorite-icon" 
                  @click="toggleFavorite(movie)">
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
      async toggleFavorite(movie) {
        try {
          const parameter = {
            imdbID: movie.imdbID,
            title: movie.Title, 
            type: movie.Type, 
            year: movie.Year, 
            image_url: movie.Poster
          }

          const isFavorite = await this.$store.dispatch('movie/toggleFavorite', parameter);
          const statusFavorite = isFavorite ? ' Added to favorite!' : ' Removed to favorite!';
          
          this.$toasted.success(this.movie.Title + statusFavorite );
          this.isFavorite = isFavorite; 
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
          this.isFavorite = index != -1 ? true : false;
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
  .card-header {
    box-shadow: none;
  }

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

  .btn-arrow {
    display: inline-flex;
    align-items: center;
    padding: 6px 14px;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    background: #007bff;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.2s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    gap: 8px; /* Space between icon and text */
  }

  .btn-arrow:hover {
    background: #007bff;
    transform: scale(1.05);
  }

  .btn-arrow i {
    font-size: 14px;
    vertical-align: middle;
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