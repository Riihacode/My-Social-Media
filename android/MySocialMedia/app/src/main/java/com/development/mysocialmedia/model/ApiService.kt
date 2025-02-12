package com.development.mysocialmedia.model

import retrofit2.Call
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.GET
import retrofit2.http.POST

interface ApiService {
    @FormUrlEncoded
    @POST("/api/users/register")
    fun registerUser(
        @Field("username") username: String,
        @Field("email") email: String,
        @Field("password") password: String
    ): Call<ResponseAuth>

    @FormUrlEncoded
    @POST("/api/users/login")
    fun loginUser(
        @Field("email") email: String,
        @Field("password") password: String
    ): Call<ResponseAuth>

    @GET("/api/videos/videos")
    fun getHomepageVideos(): Call<ResponseHomepageVideo>
}