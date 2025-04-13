<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use Validator;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $v = Validator::make($request->all(), [
            'name' => 'required|min:3',
            'username' => 'required|min:3',
            'email' => 'required|email|unique:users',
            'password'  => 'required|min:3|confirmed',
        ]);

        $isExistsU = User::where('username',$request->username)->first();
        $isExistsE = User::where('email',$request->email)->first();

        if($isExistsU || $isExistsE) 
        {
            return response()->json([
                'status' => 'error',
                'message' => 'Username or Email already taken!.'
            ], 422);
        }

        if ($v->fails())
        {
            return response()->json([
                'status' => 'error',
                'message' => $v->errors()
            ], 422);
        }
        $user = new User();
        $user->name = $request->name;
        $user->username = $request->username;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);
        $user->save();
        return response()->json(['status' => 'success'], 200);
    }
    /**
     * Login user and return a token
     */
    public function login(Request $request)
    {
        $credentials = $request->only('login', 'password');

        // Detect if it's an email or username
        $fieldType = filter_var($credentials['login'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        $user = User::where($fieldType, $credentials['login'])->first();
        
        // Attempt login with the detected field
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Username or Email not found!.'
            ], 401);
        }

        if (!\Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Incorrect password.'
            ], 401);
        }

        $token = $this->guard()->attempt([$fieldType => $credentials['login'], 'password' => $credentials['password']]);

        return response()->json([
            'status' => 'success',
            'token' => $token,
            'userData' => $user
        ], 200)->header('Authorization', $token);
    }
    /**
     * Logout User
     */
    public function logout()
    {
        $this->guard()->logout();
        return response()->json([
            'status' => 'success',
            'msg' => 'Logged out Successfully.'
        ], 200);
    }
    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        // $user = User::find(Auth::user()->id);
        $user = User::all();
        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }
    /**
     * Refresh JWT token
     */
    public function refresh()
    {
        if ($token = $this->guard()->refresh()) {
            return response()
                ->json([
                    'status' => 'success',
                    'token' => $token
                ], 200)
                ->header('Authorization', $token);
        }
        return response()->json(['error' => 'refresh_token_error'], 401);
    }
    /**
     * Return auth guard
     */
    private function guard()
    {
        return Auth::guard('api');
    }
}
