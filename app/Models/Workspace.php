<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Workspace extends Model
{
    use HasFactory;


    public function tokens(){
        return $this->hasMany(ApiToken::class);
    }

    public function billing_quota(){
        return $this->belongsTo(BillingQuota::class);
    }
}
