<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\ServiceUsage;
use App\Models\ServiceUsageJob;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class DreamweaverAiController extends Controller
{
    public function generate(Request $request){
        $validated = $request->validate([
            'text_prompt' => 'required|string',
        ]);

        //Generate an image based on a text prompt
        $response = Http::post('192.168.10.2:9002/generate' , [
            'text_prompt' => $validated['text_prompt']
        ]);
        //the it's a bad request
        if($response->status() === 400){
            return response()->json([
                "type" => "/problem/types/400",
                "title" => "Bad Request",
                "status" => 400,
                "detail" => "The request is invalid."
            ], 400);
        }

        if($response->status() === 503){
            return response()->json([
                "type" => "/problem/types/503",
                "title" => "Service Unavailable",
                "status" => 503,
                "detail" => "The service is currently unavailable."
            ], 503);
        }

        $res = $response->json();
        $newServiceUsage = new ServiceUsage();
        $newServiceUsage->duration_in_ms = 0;
        $newServiceUsage->api_token_id = $request->token->id;
        $newServiceUsage->service_id = 2;
        $newServiceUsage->usage_started_at = Carbon::parse($res['started_at']);
        $newServiceUsage->save();

        //create a new service job
        $serviceJob = new ServiceUsageJob();
        $serviceJob->status = "Ongoing";
        $serviceJob->content = json_encode([
            'prompt' => $validated['text_prompt'],
            'job_id' => $res['job_id'],
            'images' => [],
            'progress' => 0,
        ]);
        $serviceJob->service_usage_id = $newServiceUsage->id;
        $serviceJob->save();

        return response()->json([
            "job_id" => $res['job_id']
        ], 201);
    }

    public function getStatus($id, Request $request){
        //check whether the job exists
        $job = ServiceUsageJob::where([
            'content->job_id' => $id
        ])->first();

        if(!$job){
            return response()->json([
                "type" => "/problem/types/404",
                "title" => "Not Found",
                "status" => 404,
                "detail" => "The requested resource was not found."
            ], 404);
        }

        //Get the status and progress of a job
        $response = Http::get('192.168.10.2:9002/status/'.$id);
        //the it's a bad request
        if($response->status() === 400){
            return response()->json([
                "type" => "/problem/types/400",
                "title" => "Bad Request",
                "status" => 400,
                "detail" => "The request is invalid."
            ], 400);
        }

        if($response->status() === 503){
            return response()->json([
                "type" => "/problem/types/503",
                "title" => "Service Unavailable",
                "status" => 503,
                "detail" => "The service is currently unavailable."
            ], 503);
        }

        $res = $response->json();
        if($res['status'] === 'finished'){
            //Get the status and progress of a job
            $response = Http::get('192.168.10.2:9002/result/'.$id);
            //the it's a bad request
            if($response->status() === 400){
                return response()->json([
                    "type" => "/problem/types/400",
                    "title" => "Bad Request",
                    "status" => 400,
                    "detail" => "The request is invalid."
                ], 400);
            }

            if($response->status() === 503){
                return response()->json([
                    "type" => "/problem/types/503",
                    "title" => "Service Unavailable",
                    "status" => 503,
                    "detail" => "The service is currently unavailable."
                ], 503);
            }
            $res = $response->json();
            if($job->status === "Finished"){
                $images = json_decode($job->content ,true)['images'];
                return response()->json([
                    "resource_id" => $res['resource_id'],
                    "image_url" => 'storage/images/'. $images[count($images)-1],
                ],200);
            }
            //store the high resolution image
            $filename = $this->downloadAndStoreImage($res['image_url'], $job->id);
            $content = json_decode($job->content);
            $content->images[] = $filename;
            $content->resource_id = $res['resource_id'];
            $job->status = "Finished";
            $job->content = json_encode($content);
            $job->save();

            //update the service usage 's duration
            $su = $job->serviceUsage;
            $su->duration_in_ms = Carbon::parse($res['finished_at'])->diffInMilliseconds(Carbon::parse($su->usage_started_at));
            $su->save();

            return response()->json([
                "resource_id" => $res['resource_id'],
                "image_url" => 'storage/images/'. $filename,
            ],200);
        }

        //store the image
        $filename = $this->downloadAndStoreImage($res['image_url'], $job->id);
        $content = json_decode($job->content);
        $content->images[] = $filename;
        $content->progress = $res['progress'];
        $job->content = json_encode($content);
        $job->save();



        return response()->json([
            "status" => $res['status'],
            "progress" => $res['progress'],
            "image_url" => 'storage/images/'. $filename,
        ],200);
    }
    public function getResult($id, Request $request){
        //check whether the job exists
        $job = ServiceUsageJob::where([
            'content->job_id' => $id
        ])->first();

        if(!$job){
            return response()->json([
                "type" => "/problem/types/404",
                "title" => "Not Found",
                "status" => 404,
                "detail" => "The requested resource was not found."
            ], 404);
        }
        $response = Http::get('192.168.10.2:9002/result/'.$id);
        //the it's a bad request
        if($response->status() === 400){
            return response()->json([
                "type" => "/problem/types/400",
                "title" => "Bad Request",
                "status" => 400,
                "detail" => "The request is invalid."
            ], 400);
        }

        if($response->status() === 503){
            return response()->json([
                "type" => "/problem/types/503",
                "title" => "Service Unavailable",
                "status" => 503,
                "detail" => "The service is currently unavailable."
            ], 503);
        }
        $res = $response->json();
        if($job->status === 'Finished'){
            $images = json_decode($job->content ,true)['images'];
            return response()->json([
                "resource_id" => $res['resource_id'],
                "image_url" => 'storage/images/'. $images[count($images)-1],
            ],200);
        }
        //store the high resolution image
        $filename = $this->downloadAndStoreImage($res['image_url'], $job->id);
        $content = json_decode($job->content);
        $content->images[] = $filename;
        $content->resource_id = $res['resource_id'];
        $job->status = "Finished";
        $job->content = json_encode($content);
        $job->save();

        //update the service usage 's duration

        $su = $job->serviceUsage;
        $su->duration_in_ms = Carbon::parse($res['finished_at'])->diffInMilliseconds(Carbon::parse($su->usage_started_at));
        $su->save();

        return response()->json([
            "resource_id" => $res['resource_id'],
            "image_url" => 'storage/images/'. $filename,
        ],200);
    }
    public function downloadAndStoreImage($url , $service_job_id){
        $imageContent = file_get_contents($url);
        $extension = get_headers($url , 1);
        $extension  = $extension["Content-Type"];
        if($imageContent && $extension){
            $filename = $service_job_id.'_'.Carbon::now()->format('U').'.'.explode('/' , $extension)[1]; // 'image/jpeg' => 'jpeg'
            //store the image in the storage/images
            Storage::disk('public')->put('images/' . $filename, $imageContent);
            return $filename;
        }

        return response()->json([
            "message" => 'Failed to download the image'
        ],400);
    }

    public function upscale(Request $request){
        $validated = $request->validate([
            'resource_id'=> 'required|string'
        ]);

        //check whether the resource id is valid
        $job = ServiceUsageJob::where([
            'content->resource_id' => $validated['resource_id']
        ])->first();

        if(!$job){
            return response()->json([
                "type" => "/problem/types/404",
                "title" => "Not Found",
                "status" => 404,
                "detail" => "The requested resource was not found."
            ], 400);
        }


        $response =  Http::post("http://192.168.10.2:9002/upscale", [
            "resource_id" => $validated['resource_id']
        ]);
        //the it's a bad request
        if($response->status() === 400){
            return response()->json([
                "type" => "/problem/types/400",
                "title" => "Bad Request",
                "status" => 400,
                "detail" => "The request is invalid."
            ], 400);
        }
        if($response->status() === 404){
            return response()->json([
                "type" => "/problem/types/404",
                "title" => "Not Found",
                "status" => 404,
                "detail" => "The requested resource was not found."
            ],404);
        }
        if($response->status() === 503){
            return response()->json([
                "type" => "/problem/types/503",
                "title" => "Service Unavailable",
                "status" => 503,
                "detail" => "The service is currently unavailable."
            ], 503);
        }

        $res = $response->json();
        //let create a new service usage
        $newServiceUsage = new ServiceUsage();
        $newServiceUsage->duration_in_ms = 0;
        $newServiceUsage->api_token_id = $request->token->id;
        $newServiceUsage->service_id = 2;
        $newServiceUsage->usage_started_at = Carbon::parse($res['started_at']);
        $newServiceUsage->save();

        //create a new service job
        $serviceJob = new ServiceUsageJob();
        $serviceJob->status = "Ongoing";
        $serviceJob->content = json_encode([
            'job_type' => "upscale image 2x",
            'job_id' => $res['job_id'],
            'images' => [],
            'progress' => 0,
        ]);
        $serviceJob->service_usage_id = $newServiceUsage->id;
        $serviceJob->save();

        return response()->json([
            "job_id" => $res['job_id'],
        ],200);
    }


    public function zoomIn(Request $request){
        $validated = $request->validate([
            'resource_id'=> 'required|string'
        ]);

        //check whether the resource id is valid
        $job = ServiceUsageJob::where([
            'content->resource_id' => $validated['resource_id']
        ])->first();

        if(!$job){
            return response()->json([
                "type" => "/problem/types/404",
                "title" => "Not Found",
                "status" => 404,
                "detail" => "The requested resource was not found."
            ], 404);
        }


        $response =  Http::post("http://192.168.10.2:9002/zoom/in", [
            "resource_id" => $validated['resource_id']
        ]);
        //the it's a bad request
        if($response->status() === 400){
            return response()->json([
                "type" => "/problem/types/400",
                "title" => "Bad Request",
                "status" => 400,
                "detail" => "The request is invalid."
            ], 400);
        }
        if($response->status() === 404){
            return response()->json([
                "type" => "/problem/types/404",
                "title" => "Not Found",
                "status" => 404,
                "detail" => "The requested resource was not found."
            ],404);
        }
        if($response->status() === 503){
            return response()->json([
                "type" => "/problem/types/503",
                "title" => "Service Unavailable",
                "status" => 503,
                "detail" => "The service is currently unavailable."
            ], 503);
        }

        $res = $response->json();
        //let create a new service usage
        $newServiceUsage = new ServiceUsage();
        $newServiceUsage->duration_in_ms = 0;
        $newServiceUsage->api_token_id = $request->token->id;
        $newServiceUsage->service_id = 2;
        $newServiceUsage->usage_started_at = Carbon::parse($res['started_at']);
        $newServiceUsage->save();

        //create a new service job
        $serviceJob = new ServiceUsageJob();
        $serviceJob->status = "Ongoing";
        $serviceJob->content = json_encode([
            'job_type' => "zoom in",
            'job_id' => $res['job_id'],
            'images' => [],
            'progress' => 0,
        ]);
        $serviceJob->service_usage_id = $newServiceUsage->id;
        $serviceJob->save();

        return response()->json([
            "job_id" => $res['job_id'],
        ],200);
    }



    public function zoomOut(Request $request){
        $validated = $request->validate([
            'resource_id'=> 'required|string'
        ]);

        //check whether the resource id is valid
        $job = ServiceUsageJob::where([
            'content->resource_id' => $validated['resource_id']
        ])->first();

        if(!$job){
            return response()->json([
                "type" => "/problem/types/404",
                "title" => "Not Found",
                "status" => 404,
                "detail" => "The requested resource was not found."
            ], 404);
        }


        $response =  Http::post("http://192.168.10.2:9002/zoom/out", [
            "resource_id" => $validated['resource_id']
        ]);
        //the it's a bad request
        if($response->status() === 400){
            return response()->json([
                "type" => "/problem/types/400",
                "title" => "Bad Request",
                "status" => 400,
                "detail" => "The request is invalid."
            ], 400);
        }
        if($response->status() === 404){
            return response()->json([
                "type" => "/problem/types/404",
                "title" => "Not Found",
                "status" => 404,
                "detail" => "The requested resource was not found."
            ],404);
        }
        if($response->status() === 503){
            return response()->json([
                "type" => "/problem/types/503",
                "title" => "Service Unavailable",
                "status" => 503,
                "detail" => "The service is currently unavailable."
            ], 503);
        }

        $res = $response->json();
        //let create a new service usage
        $newServiceUsage = new ServiceUsage();
        $newServiceUsage->duration_in_ms = 0;
        $newServiceUsage->api_token_id = $request->token->id;
        $newServiceUsage->service_id = 2;
        $newServiceUsage->usage_started_at = Carbon::parse($res['started_at']);
        $newServiceUsage->save();

        //create a new service job
        $serviceJob = new ServiceUsageJob();
        $serviceJob->status = "Ongoing";
        $serviceJob->content = json_encode([
            'job_type' => "zoom out",
            'job_id' => $res['job_id'],
            'images' => [],
            'progress' => 0,
        ]);
        $serviceJob->service_usage_id = $newServiceUsage->id;
        $serviceJob->save();

        return response()->json([
            "job_id" => $res['job_id'],
        ],200);
    }
}
