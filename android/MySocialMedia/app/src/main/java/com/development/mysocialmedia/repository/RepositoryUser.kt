package com.development.mysocialmedia.repository

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.development.mysocialmedia.model.ResponseAuth
import com.development.mysocialmedia.model.RetrofitClient
import com.development.mysocialmedia.model.User
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class RepositoryUser {
    private val apiService = RetrofitClient.instance

    fun registerUser(username: String, email: String, password: String): LiveData<ResponseAuth> {
        val result = MutableLiveData<ResponseAuth>()
        apiService.registerUser(username, email, password).enqueue(object: Callback<ResponseAuth> {
            override fun onResponse(call: Call<ResponseAuth>, response: Response<ResponseAuth>) {
                if (response.isSuccessful) {
                    result.value = response.body()
                }
            }

            override fun onFailure(call: Call<ResponseAuth>, t: Throwable) {
                result.value = ResponseAuth("error", User(-1, "unknown", "unknown"))
            }
        })

        return result
    }

    fun loginUser(email: String, password: String): LiveData<ResponseAuth> {
        val result = MutableLiveData<ResponseAuth>()
        apiService.loginUser(email, password).enqueue(object: Callback<ResponseAuth> {
            override fun onResponse(call: Call<ResponseAuth>, response: Response<ResponseAuth>) {
                if (response.isSuccessful) {
                    result.value = response.body()
                } else {
                    result.value = ResponseAuth("error", User(-1,"unknown", "unknown"))
                }
            }

            override fun onFailure(call: Call<ResponseAuth>, t: Throwable) {
                result.value = ResponseAuth("error", User(-1, "unknown", "unknown"))
            }
        })

        return result
    }
}