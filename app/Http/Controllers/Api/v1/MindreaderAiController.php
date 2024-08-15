<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\ServiceUsage;
use App\Models\ServiceUsageJob;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class MindreaderAiController extends Controller
{
    public function recognize(Request $request) {
        // Validate the request
        $validated = $request->validate([
            'image' => 'required|file|mimes:jpeg,png,jpg' // Ensure the file type is valid
        ]);

        // Measure time
        $initial = microtime(true);
        $usage_started_at = now();

        try {
            // Store the image temporarily
            $tempPath = $validated['image']->store('temp', 'public');

            // Send the image to the MindReader API
            $response = Http::attach(
                'image',  // Form field name expected by the API
                file_get_contents(Storage::disk('public')->path($tempPath)),  // Read file content
                $validated['image']->getClientOriginalName()  // Original file name
            )->post("http://192.168.10.2:9003/recognize");

            // Clean up the temporary file
            Storage::disk('public')->delete($tempPath);

            // Check the API response status
            if ($response->status() === 400) {
                return response()->json([
                    "type" => "/problem/types/400",
                    "title" => "Bad Request",
                    "status" => 400,
                    "detail" => "The request is invalid."
                ], 400);
            }

            if ($response->status() === 503) {
                return response()->json([
                    "type" => "/problem/types/503",
                    "title" => "Service Unavailable",
                    "status" => 503,
                    "detail" => "The service is currently unavailable."
                ], 503);
            }

            // Decode the JSON response
            $res = $response->json();

            // Convert the duration to milliseconds
            $duration = (microtime(true) - $initial) * 1000;

            // Create a new service usage record
            $newServiceUsage = new ServiceUsage();
            $newServiceUsage->duration_in_ms = $duration;
            $newServiceUsage->api_token_id = $request->token->id;
            $newServiceUsage->service_id = 3; // Ensure this service ID is correct
            $newServiceUsage->usage_started_at = $usage_started_at;
            $newServiceUsage->save();

            // Create a new service job record
            $serviceJob = new ServiceUsageJob();
            $serviceJob->status = "Finished";
            $serviceJob->content = json_encode($res); // Save the response content
            $serviceJob->service_usage_id = $newServiceUsage->id;
            $serviceJob->save();

            // Return the API response objects
            return response()->json([
                "objects" => $res
            ], 200);

        } catch (\Exception $e) {
            // Handle exceptions and log errors
            return response()->json([
                "type" => "/problem/types/500",
                "title" => "Internal Server Error",
                "status" => 500,
                "detail" => "An unexpected error occurred."
            ], 500);
        }
    }

}
