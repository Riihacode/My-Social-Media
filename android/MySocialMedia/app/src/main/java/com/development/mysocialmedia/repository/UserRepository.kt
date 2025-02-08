package com.development.mysocialmedia.repository

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.development.mysocialmedia.model.LoginResponse
import com.development.mysocialmedia.model.RetrofitClient
import okhttp3.ResponseBody
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class UserRepository {
    private val apiService = RetrofitClient.instance

    fun registerUser(username: String, email: String, password: String): LiveData<LoginResponse> {
        val result = MutableLiveData<LoginResponse>()
        apiService.registerUser(username, email, password).enqueue(object: Callback<LoginResponse> {
            override fun onResponse(call: Call<LoginResponse>, response: Response<LoginResponse>) {
                if (response.isSuccessful) {
                    result.value = response.body()
                }
            }

            override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                result.value = LoginResponse("error",  null)
            }
        })

        return result
    }


    fun loginUser(email: String, password: String): LiveData<LoginResponse> {
        val result = MutableLiveData<LoginResponse>()
        apiService.loginUser(email, password).enqueue(object: Callback<LoginResponse> {
            override fun onResponse(call: Call<LoginResponse>, response: Response<LoginResponse>) {
                if (response.isSuccessful) {
                    result.value = response.body()
                } else {
                    result.value = LoginResponse("error",  null)
                }
            }

            override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                result.value = LoginResponse("error", null)
            }
        })

        return result
    }



    /*
    fun loginUser(email: String, password: String): LiveData<LoginResponse>{
        val  result = MutableLiveData<LoginResponse>()

        apiService.loginUser(email, password).enqueue(object: Callback<ResponseBody> {
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.isSuccessful) {
                    response.body()?.let {
                        val jsonObject = JSONObject(it.string())
                        val message = jsonObject.getString("message")
                        val userObject = jsonObject.optJSONObject("user")
                        val userId = userObject?.getInt("id") ?: -1

                        result.value = LoginResponse("success", message, userId)
                    }
                } else {
                    result.value = LoginResponse("error", "Login failed", null)
                }
            }

            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                result.value = LoginResponse("error", t.message ?: "Unknown error", null)
            }

        })

    }

     */
}