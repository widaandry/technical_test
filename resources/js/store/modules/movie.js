// Vuex Store
const state = {
  prevSearchMovie: '',
  movieList: [],  
  favoriteMovies: (() => {
    try {
      return JSON.parse(localStorage.getItem('FavoriteMovies')) || null;
    } catch (e) {
      console.error('Failed to parse FavoriteMovies from localStorage:', e);
      return null;
    }
  })(),
  movieDetail: null,
  page: 1,        
  loading: false, 
  hasMore: true,  
};

const getters = {
  movieList: (state) => state.movieList,
  movieDetail: (state) => state.movieDetail,
  favoriteMovies: (state) => state.favoriteMovies,
  loading: (state) => state.loading,
  hasMore: (state) => state.hasMore,
};

const mutations = {
  setMovieList(state, newMovies) {
    const uniqueMovies = [
      ...state.movieList,
      ...newMovies.filter(movie => !state.movieList.some(existingMovie => existingMovie.imdbID === movie.imdbID))
    ];
    state.movieList = uniqueMovies;
  },
  movieListByFavorite(state, movie) {
    state.movieList = movie;
  },
  resetMovieList(state) {
    state.movieList = [];
  },
  resetFavMovieList() {
    localStorage.removeItem('FavoriteMovies');
    state.favoriteMovies = [];
  },
  setPrevSearch(state, search) {
    state.prevSearchMovie = search; 
  },
  setMovieDetail(state, movie) {
    state.movieDetail = movie; 
  },
  setFavoriteMovies(state, favorites) {
    state.favoriteMovies = favorites;
    try {
      localStorage.setItem('FavoriteMovies', JSON.stringify(favorites)); 
    } catch (e) {
      console.error('Error saving user to localStorage:', e);
    }
  },
  toggleFavorite(state, movie) {
    const index = state.favoriteMovies.findIndex((m) => m.imdbID === movie.imdbID);
    if (index === -1) {
      state.favoriteMovies.push(movie);
    } else {
      state.favoriteMovies.splice(index, 1);
    }
  },
  setLoading(state, status) {
    state.loading = status;
  },
  setHasMore(state, status) {
    state.hasMore = status;
  },
  incrementPage(state) {
    state.page += 10;
  },
};

const actions = {
  async searchMovie({ commit, state }, { movieName, year, type }) {
    try {
      commit('setLoading', true);

      if(state.prevSearchMovie != movieName) {
        commit('resetMovieList');  
      }

      const response = await axios.get('/movie/searchMovie', {
        params: {
          movieName,
          year,
          type,
          page: state.page, 
        }
      });

      const data = response.data;

      if (data.Response === 'True') {
        commit('setPrevSearch', movieName);  
        commit('setMovieList', data.Search);  
        commit('setHasMore', data.totalResults > state.movieList.length);  
      }

    } catch (error) {
      console.error('Error fetching movie data:', error);
    } finally {
      commit('setLoading', false);
    }
  },
  async getMovieDetail({ commit }, imdbID) {
    try {
      commit('setLoading', true);
      const response = await axios.get('/movie/movieDetail', {
        params: {
          imdbID,
        }
      });

      const movie = response.data;

      if (movie.Response === 'True') {
        commit('setMovieDetail', movie);  // Commit the movie detail to Vuex store
      }

    } catch (error) {
      console.error('Error fetching movie detail:', error);
    } finally {
      commit('setLoading', false);
    }
  },
  async listFavorite({ commit }) {
    try {
      const response = await axios.get('/movie/getListFavorite');
      const data = response.data;

      localStorage.setItem('FavoriteMovies', JSON.stringify(data));
      commit('setFavoriteMovies', data);
    } catch (error) {
      console.error("Error get list favorites:", error);
    }
  },
  loadMoreMovies({ dispatch, commit, state }, { movieName }) {
    if (state.loading || !state.hasMore) return; 
  
    commit('setLoading', true);
    commit('incrementPage');

    dispatch('searchMovie', { movieName }) 
      .finally(() => {
        commit('setLoading', false); 
      });
  },
  async toggleFavorite({ commit }, { imdbID, title, type, year, image_url }) {
    try {
      const response = await axios.post('/movie/toggleFavorite', { 
        imdbID, 
        title, 
        type, 
        year, 
        image_url
      });
      
      commit('toggleFavorite', imdbID);
      const { isFavorite } = response.data;
      return isFavorite; 
    } catch (error) {
      console.error("Error adding movie to favorites:", error);
      return { isFavorite: false };
    }
  },
  loadMoreMovies({ dispatch, commit, state }, { movieName }) {
    if (state.loading || !state.hasMore) return; 
  
    commit('setLoading', true);
    commit('incrementPage');

    dispatch('searchMovie', { movieName }) 
      .finally(() => {
        commit('setLoading', false); 
      });
  },
  async getFavoriteMovie({ commit }, imdbID) {
    try {
      commit('setLoading', true);
      const response = await axios.get('/movie/movieDetail', {
        params: {
          imdbID,
        }
      });

      const movie = response.data;

      if (movie.Response === 'True') {
        commit('setPrevSearch', movie.Title);  
        commit('movieListByFavorite', movie);  
      }

    } catch (error) {
      console.error('Error fetching movie detail:', error);
    } finally {
      commit('setLoading', false);
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
  