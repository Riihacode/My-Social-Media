package com.development.mysocialmedia.model

data class LoginResponse (
    val status: String,
    val message: String,
    val user_id: Int?
)