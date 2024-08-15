<?php

namespace App\Http\Middleware;

use App\Models\ApiToken;
use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckLimit
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        //middleware to check whether the there's a quota limit set and whether it already exceed the quota
        $token = $request->headers->get('X-API-TOKEN');


        $tokenObject = ApiToken::where('token', $token)->first();
        if($tokenObject->workspace->billing_quota_id){
            //if has a limit set then check for this month's total cost
            $thisMonthUsages = $tokenObject->services();
            $totalCost = 0;
            $currentMonth = Carbon::now()->format('m');
            foreach($thisMonthUsages as $s){
                $totalCost += $s[$currentMonth]->total_cost;
            }
            if($totalCost >= $tokenObject->workspace->billing_quota->limit){
                return response()->json([
                    "type" => "/problem/types/403",
                    "title" => "Quota Exceeded",
                    "status" => 403,
                    "detail" => "You have exceeded your quota."
                ]);
            }
        }

        return $next($request);
    }
}
