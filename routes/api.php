<?php

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        // Below mention routes are public, user can access those without any restriction.
        Route::post('register', 'AuthController@register');
        Route::post('login', 'AuthController@login');
        Route::post('logout', 'AuthController@logout');
        // Refresh the JWT Token
        Route::get('refresh', 'AuthController@refresh');

        // Below mention routes are available only for the authenticated users.
        Route::middleware('auth:api')->group(function () {
            Route::get('user', 'AuthController@user');
        });
    });

    Route::middleware('auth:api')->prefix('movie')->group(function () {
        Route::get('searchMovie', 'MovieController@searchMovie');
        Route::get('movieDetail', 'MovieController@movieDetail');
        Route::get('getListFavorite', 'MovieController@getListFavorite');
        Route::post('toggleFavorite', 'MovieController@toggleFavorite');
    });

    Route::middleware('auth:api')->group(function () {
        Route::resource('user', 'UserController')->only(['index','show']);
    });
});