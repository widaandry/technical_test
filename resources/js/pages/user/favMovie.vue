<template>
    <div class="container">
      <div class="card card-default">
        <div class="card-header">
            {{ $t('movie.titleFavorite') }}
        </div>
        <div class="card-body">
            <div v-if="listFavorite.length == 0">
                <div class="card align-items-center">
                    <div class="card-block text-center">
                        <h4 class="card-title">{{ $t('movie.noData') }}</h4>
                    </div>
                </div>
            </div>
          <div v-if="listFavorite.length > 0" class="movie-container">
            <!-- Movie list using CSS Grid -->
            <div class="movie-grid">
              <div 
                v-for="favorite in listFavorite" 
                :key="favorite.imdbID" 
                class="movie-card"
                @click="goToDetail(favorite.imdbID)">
  
                <div href="#" class="favorite-button"
                  @click="toggleFavorite(favorite, $event)">
                  <i class="fa fa-star"></i>
                </div>
  
                <img v-lazy="favorite.image_url" alt="movie poster" class="movie-poster" />
                <h3>{{ favorite.title }}</h3>
                <p>{{ favorite.type + ', ' + favorite.year }}</p>
                
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
        showFilter: false,
        isWideScreen: true
      };
    },
    computed: {
      listFavorite() {
        return this.$store.getters['movie/favoriteMovies'];
      }
    },
    async created() {
      this.$store.commit('movie/resetMovieList');
      await this.getListFavorite();
    },
    methods: {
      async getListFavorite() {
        await this.$store.dispatch('movie/listFavorite');
        this.listFavorite;
      },
      async toggleFavorite(movie, event) {
        event.stopPropagation();
        try {
          const parameter = {
            imdbID: movie.imdbID,
            title: movie.title, 
            type: movie.type, 
            year: movie.year, 
            image_url: movie.poster
          }

          const isFavorite = await this.$store.dispatch('movie/toggleFavorite', parameter);
          const statusFavorite = isFavorite ? ', Added to favorite!' : ', Removed from favorite!';
          this.$toasted.success(movie.title + statusFavorite );

          this.getListFavorite(); 
        } catch (error) {
          console.error("Error adding to favorites:", error);
        }
      },
      goToDetail(imdbID) {
        this.$router.push({ name: 'movie-detail', params: { id: imdbID } });
      }
    },
  }
  </script>
  
  <style scoped>
  .favorite-button {
    position: absolute; 
    top: 10px; 
    right: 10px; 
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%; 
    padding: 5px; 
    cursor: pointer;
  }
  
  .favorite-button i {
    color: yellow; 
    font-size: 35px; 
  }
  
  .favorite-icon {
    color: gold;
    cursor: pointer;
    margin-left: 10px;
  }
  
  .favorite-icon:hover {
    color: darkgoldenrod;
  }
  
  .search-button {
    padding: 8px 16px;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    grid-column: span 3; /* Make the button span across all 3 columns */
    align-self: center;
    margin-top: 10px;
  }
  
  .search-button:hover {
    background-color: #0056b3;
  }
  
  /* Movie List Styling */
  .movie-container {
    height: 60vh;
    overflow-y: auto;
  }
  
  .movie-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);  /* 3 columns for large screens */
    gap: 16px;
  }
  
  .movie-card {
    position: relative;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 16px;
    text-align: center;
  }
  
  .movie-card img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 12px;
  }
  
  .movie-card h3 {
    font-size: 18px;
    margin: 8px 0;
  }
  
  .movie-card p {
    color: #777;
    font-size: 14px;
  }
  
  .toggle-filter-button {
    display: none;
    margin: 10px auto;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .toggle-filter-button:hover {
    background-color: #0056b3;
  }
  
  /* Responsive Styling */
  @media (max-width: 768px) {
    /* Adjust form to 2 columns for screens below 768px */
    .card-body {
        padding: 0 1.25rem 1.25rem 1.25rem;
    }

    .toggle-filter-button {
      display: block;
    }

    .movie-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr); 
      gap: 16px;
    }
  }
  
  @media (max-width: 600px) {
    /* Stack form vertically on very small screens */
    .card-body {
        padding: 0 1.25rem 1.25rem 1.25rem;
    }
  }
  </style>