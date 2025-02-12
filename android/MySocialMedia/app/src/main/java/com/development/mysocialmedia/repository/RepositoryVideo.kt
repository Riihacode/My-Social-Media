package com.development.mysocialmedia.repository

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.development.mysocialmedia.model.ResponseHomepageVideo
import com.development.mysocialmedia.model.RetrofitClient
import com.development.mysocialmedia.model.VideosItem
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class RepositoryVideo {
    private val apiService = RetrofitClient.instance

    fun getHomepageVideos(): LiveData<List<VideosItem>>{
        val result = MutableLiveData<List<VideosItem>>()
        apiService.getHomepageVideos().enqueue(object: Callback<ResponseHomepageVideo> {
            override fun onResponse(
                call: Call<ResponseHomepageVideo>,
                response: Response<ResponseHomepageVideo>
            ) {
                if (response.isSuccessful){
                    result.value = response.body()?.videos ?: emptyList()
                } else {
                    result.value = emptyList()
                }
            }

            override fun onFailure(call: Call<ResponseHomepageVideo>, t: Throwable) {
                result.value = emptyList()
            }

        })

        return result
    }
}