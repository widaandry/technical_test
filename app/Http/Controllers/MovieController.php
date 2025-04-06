<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use GuzzleHttp\Client;
use App\Models\FavoriteMovie;

class MovieController extends Controller
{
    /**
     * Search movie
     */
    public function searchMovie(Request $request)
    {
        $movieName = $request->query('movieName', ''); 
        $page = $request->query('page', 1); 
        $year = $request->query('year', ''); 
        $type = $request->query('type', ''); 

        // Validate movie name
        if (empty($movieName)) {
            return response()->json(['error' => 'Movie name is required'], 400);
        }

        $client = new Client();
        
        try {
            $response = $client->request('GET', 'https://www.omdbapi.com/', [
                'query' => [
                    'apikey' => env('OMDB_API_KEY'),  // Use environment variable for API key
                    's' => $movieName, // Movie title to search
                    'page' => $page, // Page number for pagination
                    'y' => $year, //Year release
                    'type' => $type, //Type (movie, series, episode)
                ]
            ]);
        
            $responseBody = $response->getBody()->getContents();
            $data = json_decode($responseBody, true);
            
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch movie data', 'message' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Get movie details by IMDb ID
     */
    public function movieDetail(Request $request)
    {
        $imdbID = $request->query('imdbID', '');

        if (empty($imdbID)) {
            return response()->json(['error' => 'imdbID is required'], 400);
        }

        $user = auth()->user(); 

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $client = new Client();

        $response = $client->request('GET', 'https://www.omdbapi.com/', [
            'query' => [
                'apikey' => env('OMDB_API_KEY'),
                'i' => $imdbID,  // IMDb ID for the specific movie
            ],
        ]);

        $responseBody = $response->getBody()->getContents();
        $data = json_decode($responseBody, true);

        return response()->json($data);
    }

    public function getListFavorite(Request $request)
    {
        $user = $request->user(); 
        $favorite = FavoriteMovie::where('user_id', $user->id)->get();
        
        return response()->json($favorite);
    }

    public function toggleFavorite(Request $request)
    {
        $imdbID = $request->imdbID;

        if (empty($imdbID)) {
            return response()->json(['error' => 'imdbID is required'], 400);
        }

        $user = $request->user(); 
        $favorite = FavoriteMovie::where('user_id', $user->id)
            ->where('imdbID', $imdbID)->first();

        if ($favorite) {
            // If movie is already favorited, remove it
            $favorite->delete();
            return response()->json([
                'message' => 'Movie removed from favorites',
                'isFavorite' => false,
            ]);
        } else {
            // Add movie to favorites
            $favorite = new FavoriteMovie();
            $favorite->user_id = $user->id;
            $favorite->imdbID = $imdbID;
            $favorite->save();

            return response()->json([
                'message' => 'Movie added to favorites',
                'isFavorite' => true
            ]);
        }
    }
}