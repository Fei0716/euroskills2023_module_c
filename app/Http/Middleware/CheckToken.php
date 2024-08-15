<?php

namespace App\Http\Middleware;

use App\Models\ApiToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        //check whether the client send valid api token in X-API-TOKEN header
        $token = $request->headers->get('X-API-TOKEN');
        if(!$token){
            //return 401 error
            return response()->json([
                "type" => "/problem/types/401",
                "title" => "Unauthorized",
                "status" => 401,
                "detail" => "The header X-API-TOKEN is missing or invalid."
            ] , 401);
        }

        $tokenIsValid = ApiToken::where([
            'token' => $token,
            'revoked_at' => null,
        ])->exists();

        if(!$tokenIsValid){
            //return 401 error
            return response()->json([
                "type" => "/problem/types/401",
                "title" => "Unauthorized",
                "status" => 401,
                "detail" => "The header X-API-TOKEN is missing or invalid."
            ] , 401);
        }

        //add the token object to the req
        $request->token = ApiToken::where([
            'token' => $token,
            'revoked_at' => null,
        ])->first();
        return $next($request);
    }
}
