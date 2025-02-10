package com.development.mysocialmedia

import android.content.Context
import android.content.SharedPreferences

class SessionManager(context: Context) {
    private val sharedPreferences: SharedPreferences =
        context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    private val editor: SharedPreferences.Editor = sharedPreferences.edit()

    fun saveLoginSession(userId: Int, email: String) {
        editor.putBoolean(KEY_IS_LOGGED_IN, true)
        editor.putInt(KEY_USER_ID, userId)
        editor.putString(KEY_EMAIL, email)
        editor.putBoolean(KEY_IS_FIRST_LOGIN, true) // tandai sebagai login pertama kali
        editor.apply()
    }

    fun isLoggedIn(): Boolean {
        return sharedPreferences.getBoolean(KEY_IS_LOGGED_IN, false)
    }

    fun isFirstLogin(): Boolean {
        return sharedPreferences.getBoolean(KEY_IS_FIRST_LOGIN, false)
    }

    fun setFirstLogin(value: Boolean) {
        editor.putBoolean(KEY_IS_FIRST_LOGIN, value)
        editor.apply()
    }

    fun getUserId(): Int {
        return sharedPreferences.getInt(KEY_USER_ID, -1)
    }

    fun getEmail(): String? {
        return sharedPreferences.getString(KEY_EMAIL, null)
    }

    fun logout() {
        editor.clear()
        editor.apply()
    }

    companion object {
        private const val PREF_NAME = "user_session"
        private const val KEY_IS_LOGGED_IN = "isLoggedIn"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_EMAIL = "email"
        private const val KEY_IS_FIRST_LOGIN = "isFirstLogin"
    }
}