<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceUsageJob extends Model
{
    use HasFactory;

    public function serviceUsage(){
        return $this->belongsTo(ServiceUsage::class);
    }
}
