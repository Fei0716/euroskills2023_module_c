<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\ServiceUsage;
use App\Models\ServiceUsageJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

class ChatterBlastAiController extends Controller
{

    //Start conversation
    public function store(Request $request){
        try{


            $prompt = $request->getContent();
            if(!$prompt){
                return response()->json([
                    "type" => "/problem/types/400",
                    "title" => "Bad Request",
                    "status" => 400,
                    "detail" => "The request is invalid."
                ], 400);
            }
            //create the conversation first through an endpoint, before you
            //can send a prompt. So, on the unified API, it's one call, behind the scenes you must do 2 calls. The
            //conversation ID is generated by the code you write, is sent to the ChatterBlast API, provided to the
            //user and stored in the database to prohibit concurrent calls.

            //generate the conversation id
            $conversation_id = md5($request->headers->get('X-API-TOKEN').'/'. now());

            //send http request to the chatterblast api to initiate a conversation
            $response = Http::post("http://192.168.10.2:9001/conversation", [
                "conversationId" => $conversation_id
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
            //send the prompt
            $response = Http::withHeaders([
                'Content-Type' => 'text/plain',  // Set the content type to plain text
            ])->post("http://192.168.10.2:9001/conversation/".$conversation_id, $prompt);
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
            $newServiceUsage = new ServiceUsage();
            $newServiceUsage->duration_in_ms = 0;//store value of 0 first
            $newServiceUsage->usage_started_at = now();
            $newServiceUsage->api_token_id = $request->token->id;
            $newServiceUsage->service_id = 1;
            $newServiceUsage->save();

            $job = new ServiceUsageJob();
            $job->status = 'Ongoing';
            $job->content = json_encode([
                "prompt" => $prompt,
                "conversation_id" => $conversation_id,
            ]);
            $job->service_usage_id = $newServiceUsage->id;
            $job->save();

            $response = Http::get("http://192.168.10.2:9001/conversation/".$conversation_id);
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
            $response_text = $response->body();
            //return the conversation id back to the client
            return response()->json([
                "conversation_id" => $conversation_id,
                "response" => $response->body(),
                "is_final" => false,
            ]);

        }catch(\Exception $e){
            // Check if the exception is an instance of ValidationException
            if ($e instanceof \Illuminate\Validation\ValidationException) {
                // Re-throw the ValidationException to let the default handler handle it
                throw $e;
            }
            // Handle other exceptions
            return response($e->getMessage(), 500);
        }
    }

    //Get partial conversation response
    public function show($id, Request $request){
        try{
            if(!$id){
                return response()->json([
                    "type" => "/problem/types/404",
                    "title" => "Not Found",
                    "status" => 404,
                    "detail" => "The requested resource was not found."
                ], 404);
            }
            $response = Http::get("http://192.168.10.2:9001/conversation/".$id);
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

            $response_text = $response->body();
            $is_final = false;
            if(str_contains($response_text , '<EOF>')){
                $is_final = true;
                // Remove everything from '<EOF>' onwards

                $index = strpos($response_text, '<EOF>');

                $duration = preg_replace( '/\D/','',$response_text);
                $response_text = substr($response_text, 0 ,$index);

                //update the status in database
                $job = ServiceUsageJob::where([
                    'content->conversation_id' => $id,//work with json column
                ])->first();
                $job->status = 'Finished';
                $content = json_decode($job->content);
                $content->response = $response_text;
                $job->content = json_encode($content);
                $job->save();

                //update the duration in service_usage
                $su = $job->serviceUsage;
                $su->duration_in_ms = $duration;
                $su->save();

            }
            //check whether the response contains eof if contains eof this means the response is completed and is finalized
            return response()->json([
                "conversation_id" => $id,
                "response" => $response_text,
                "is_final" => $is_final,
            ]);

        }catch(\Exception $e){
            // Check if the exception is an instance of ValidationException
            if ($e instanceof \Illuminate\Validation\ValidationException) {
                // Re-throw the ValidationException to let the default handler handle it
                throw $e;
            }
            // Handle other exceptions
            return response($e->getMessage(), 500);
        }
    }

    public function update($id , Request $request){
        try{
        //check whether there's unfinished conversation
        $hasUnfinishedConversation = ServiceUsageJob::where([
            'content->conversation_id' => $id,//work with json column
            'status' => 'Ongoing',
        ])->get();

        if($hasUnfinishedConversation->count() > 0){
            return response()->json([
                "message" => "There's unfinished conversation, please wait for the response completed"
            ],403);
        }
        //validate the request body
        $validated = $request->validate([
            'prompt' => 'required|string',
        ]);
            //send the prompt
            $response = Http::withHeaders([
                'Content-Type' => 'text/plain',  // Set the content type to plain text
            ])->post("http://192.168.10.2:9001/conversation/".$id, $validated['prompt']);
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
            $newServiceUsage = new ServiceUsage();
            $newServiceUsage->duration_in_ms = 0;//store value of 0 first
            $newServiceUsage->usage_started_at = now();
            $newServiceUsage->api_token_id = $request->token->id;
            $newServiceUsage->service_id = 1;
            $newServiceUsage->save();

            $job = new ServiceUsageJob();
            $job->status = 'Ongoing';
            $job->content = json_encode([
                "prompt" => $validated['prompt'],
                "conversation_id" => $id,
            ]);
            $job->service_usage_id = $newServiceUsage->id;
            $job->save();

            $response = Http::get("http://192.168.10.2:9001/conversation/".$id);
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
            $response_text = $response->body();
            //return the conversation id back to the client
            return response()->json([
                "conversation_id" => $id,
                "response" => $response->body(),
                "is_final" => false,
            ]);

        }catch(\Exception $e){
            // Check if the exception is an instance of ValidationException
            if ($e instanceof \Illuminate\Validation\ValidationException) {
                // Re-throw the ValidationException to let the default handler handle it
                throw $e;
            }
            // Handle other exceptions
            return response($e->getMessage(), 500);
        }

    }
}