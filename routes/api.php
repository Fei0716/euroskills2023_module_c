<?php

use App\Http\Controllers\Api\v1\ChatterBlastAiController;
use App\Http\Controllers\Api\v1\DreamweaverAiController;
use App\Http\Controllers\Api\v1\MindreaderAiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
//
//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//    return $request->user();
//});


    Route::middleware(['check.token', 'check.limit'])->group(function(){
//        for testing middlewares
//        Route::get('test', function(){
//            return response("middleware is working!!!");
//        });
        Route::prefix('chat')->group(function(){
            Route::apiResource('conversation' , ChatterBlastAiController::class)->only('store','update', 'show');
        });
        Route::prefix('imagegeneration')->group(function(){
            Route::post('generate' , [DreamweaverAiController::class , 'generate']);
            Route::get('status/{id}' , [DreamweaverAiController::class , 'getStatus']);
            Route::get('result/{id}' , [DreamweaverAiController::class , 'getResult']);
            Route::post('upscale' , [DreamweaverAiController::class , 'upscale']);
            Route::post('zoom/in' , [DreamweaverAiController::class , 'zoomIn']);
            Route::post('zoom/out' , [DreamweaverAiController::class , 'zoomOut']);

        });
        Route::post('imagerecognition/recognize' , [MindreaderAiController::class , 'recognize']);

    });

