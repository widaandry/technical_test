<template>
    <div class="container">
      <div class="card card-default">
        <div class="card-header">
            {{ $t('movie.title') }}
        </div>
        <div class="card-body">
          <!-- Toggle Filter Button: Only shows on small screens -->
          <button 
            class="toggle-filter-button" 
            @click="showFilter = !showFilter"
          >
            {{ showFilter ? $t('movie.filterHide') : $t('movie.filterShow') }}
          </button>

          <div 
            class="filter-container"
            v-show="showFilter || isWideScreen">
            <div class="filter-form">
              <div class="filter-item">
                <label for="movieName" class="filter-label">
                  {{ $t('movie.filterName') }}
                </label>
                <input 
                  v-model="name" 
                  type="text" 
                  id="movieName"
                  placeholder="Search by Movie Name"
                  class="filter-input"
                />
              </div>
  
              <div class="filter-item">
                <label for="year" class="filter-label">
                  {{ $t('movie.filterYear') }}
                </label>
                <input 
                  v-model="year" 
                  type="number" 
                  id="year"
                  placeholder="Year"
                  class="filter-input"
                  min="1900"
                  max="2100"
                />
              </div>
  
              <div class="filter-item">
                <label for="type" class="filter-label">
                  {{ $t('movie.filterType') }}
                </label>
                <select v-model="type" id="type" class="filter-select">
                  <option value="">All Types</option> <!-- Default option (All) -->
                  <option value="movie">Movies</option>
                  <option value="series">Series</option>
                  <option value="episode">Episodes</option>
                </select>
              </div>
  
              <button @click="searchMovies" class="search-button">
                {{ $t('movie.filterSearch') }}
              </button>
            </div>
          </div>
          <div
            @scroll="checkScroll"
            class="movie-container">
  
            <!-- Movie list using CSS Grid -->
            <div class="movie-grid">
              <div 
                v-for="movie in movieList" 
                :key="movie.imdbID" 
                class="movie-card"
                @click="goToDetail(movie.imdbID)">
  
                <div href="#" class="favorite-button"
                  @click="toggleFavorite(movie, $event)">
                  <i :class="['fa', isFavorite(movie.imdbID) ? 'fa-star' : 'fa-star-o']"></i>
                </div>
  
                <img v-lazy="movie.Poster" alt="movie poster" class="movie-poster" />
                <h3>{{ movie.Title }}</h3>
                <p>{{ movie.Type + ', ' + movie.Year }}</p>
                
              </div>
            </div>
  
            <div v-if="loading">{{ $t('movie.loading') }}</div>
            <div v-if="!hasMore && !loading">{{ $t('movie.noLoading') }}</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        name: '',
        year: '',
        type: '',
        listFavorite: null,
        showFilter: false,
        isWideScreen: true
      };
    },
    mounted() {
      this.updateScreenSize();
      window.addEventListener('resize', this.updateScreenSize);
    },
    computed: {
      movieList() {
        return this.$store.getters['movie/movieList'];
      },
      loading() {
        return this.$store.getters['movie/loading'];
      },
      hasMore() {
        return this.$store.getters['movie/hasMore'];
      }
    },
    async created() {
      this.$store.commit('movie/resetMovieList');
      await this.getListFavorite();
    },
    methods: {
      updateScreenSize() {
        this.isWideScreen = window.innerWidth >= 768;
        if (this.isWideScreen) this.showFilter = true;
      },
      async getListFavorite() {
        await this.$store.dispatch('movie/listFavorite');
        this.listFavorite = this.$store.getters['movie/favoriteMovies'];
      },
      async toggleFavorite(movie, event) {
        event.stopPropagation();
        try {
          const parameter = {
            imdbID: movie.imdbID,
            title: movie.Title, 
            type: movie.Type, 
            year: movie.Year, 
            image_url: movie.Poster
          }

          const isFavorite = await this.$store.dispatch('movie/toggleFavorite', parameter);
          const statusFavorite = isFavorite ? ', Added to favorite!' : ', Removed from favorite!';
          this.$toasted.success(movie.Title + statusFavorite );
          
          this.movie;
          this.getListFavorite(); 
        } catch (error) {
          console.error("Error adding to favorites:", error);
        }
      },
      async searchMovies() {
        if (this.name.length > 2) {
          await this.$store.dispatch('movie/searchMovie', { 
            movieName: this.name,
            year: this.year,
            type: this.type,
           });
           this.movie;
        }
      },
      checkScroll(event) {
        const container = event.target;
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
  
        const bottom = scrollHeight - scrollTop === clientHeight || scrollHeight - scrollTop <= clientHeight + 5;
  
        if (bottom) {
          this.loadMoreMovies();
        }
      },
      async loadMoreMovies() {
        await this.$store.dispatch('movie/loadMoreMovies', { movieName: this.name });
        this.movie;
      },
      goToDetail(imdbID) {
        this.$router.push({ name: 'movie-detail', params: { id: imdbID } });
      },
      isFavorite(imdbID) {
        const index = this.listFavorite.findIndex((m) => m.imdbID === imdbID);
        return index != -1 ? true : false
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
  
  /* Filter Container Styling */
  .filter-container {
    display: flex;
    justify-content: center;  
    align-items: center;
  }
  
  .filter-form {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr; 
    gap: 15px;
    max-width: 800px; 
    width: 100%;
    margin-bottom: 20px;
  }
  
  .filter-item {
    display: flex;
    flex-direction: row; 
    align-items: center;
    gap: 10px;
  }
  
  .filter-label {
    font-size: 14px;
    color: #555;
    font-weight: bold;
    white-space: nowrap; 
    width: 30%; 
    text-align: center; 
    display: flex;
    justify-content: center;
  }
  
  .filter-input, .filter-select {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 14px;
    width: 100%; 
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
    
    .filter-form {
      grid-template-columns: 1fr 1fr; 
      width: 90%; 
    }
  
    .filter-item {
      flex-direction: column; 
    }
  
    .filter-label {
      width: 100%; 
      margin-bottom: 5px;
      display: block;  
    }
  
    .filter-input, .filter-select {
      width: 100%; 
    }
  
    .search-button {
      width: 100%;  
      margin-top: 10px;
    }
  }
  
  @media (max-width: 600px) {
    /* Stack form vertically on very small screens */
    .card-body {
        padding: 0 1.25rem 1.25rem 1.25rem;
    }

    .filter-form {
      display: flex;
      flex-direction: column;
      width: 100%; 
    }
  
    .filter-item {
      flex-direction: column;
      width: 100%; 
    }
  
    .filter-label {
      display: block; 
      margin: -5px;
      font-size: 14px;
      color: #555;
      font-weight: bold;
      white-space: nowrap; 
      width: 100%; 
      text-align: left; 
      display: flex;
      justify-content: left;
    }
  
    .filter-input, .filter-select {
      width: 100%;  
    }
  
    .search-button {
      width: 100%;  
      margin-top: 10px;
    }
  }
  </style>