<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('service_usage_jobs', function (Blueprint $table) {
            $table->id();
            $table->string("status")->nullable();
            $table->json("content")->nullable();
            $table->integer("service_usage_id");
            $table->timestamps();
            $table->softDeletes();

            $table->foreign("service_usage_id")->references("id")->on("service_usages");

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_usage_jobs');
    }
};
