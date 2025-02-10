package com.development.mysocialmedia.view

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.development.mysocialmedia.SessionManager
import com.development.mysocialmedia.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sessionManager = SessionManager(this)
        // Cek apakah user sudah login
        if (!sessionManager.isLoggedIn()) {
            // Jika belum login, arahkan ke Login Activity
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        } else {
            val userId = sessionManager.getUserId()
            val email = sessionManager.getEmail()

            val isFirstLogin = sessionManager.isFirstLogin()
            if (isFirstLogin) {
                Toast.makeText(this, "Welcome back, $email!", Toast.LENGTH_SHORT).show()
                sessionManager.setFirstLogin(false)
            }
        }

        // Tombol logout
        binding.btnLogout.setOnClickListener {
            sessionManager.logout()
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }

    }
}