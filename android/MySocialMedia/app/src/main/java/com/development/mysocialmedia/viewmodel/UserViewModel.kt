package com.development.mysocialmedia.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.ViewModel
import com.development.mysocialmedia.model.LoginResponse
import com.development.mysocialmedia.repository.UserRepository

class UserViewModel: ViewModel() {
    private val repository = UserRepository()

    fun registerUser(username: String, email: String, password: String): LiveData<LoginResponse> {
        return repository.registerUser(username, email, password)
    }

    fun loginUser(email: String, password: String): LiveData<LoginResponse> {
        return repository.loginUser(email, password)
    }
}