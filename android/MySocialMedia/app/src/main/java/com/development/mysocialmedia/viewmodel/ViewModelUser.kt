package com.development.mysocialmedia.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.ViewModel
import com.development.mysocialmedia.model.ResponseAuth
import com.development.mysocialmedia.repository.RepositoryUser

class ViewModelUser: ViewModel() {
    private val repository = RepositoryUser()

    fun registerUser(username: String, email: String, password: String): LiveData<ResponseAuth> {
        return repository.registerUser(username, email, password)
    }

    fun loginUser(email: String, password: String): LiveData<ResponseAuth> {
        return repository.loginUser(email, password)
    }
}