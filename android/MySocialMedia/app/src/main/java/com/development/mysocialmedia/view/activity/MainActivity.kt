package com.development.mysocialmedia.view.activity

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.development.mysocialmedia.R
import com.development.mysocialmedia.SessionManager
import com.development.mysocialmedia.databinding.ActivityMainBinding
import com.development.mysocialmedia.view.fragment.AccountFragment
import com.development.mysocialmedia.view.fragment.HomeFragment

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        checkSessionUserLogin()
        setupBottomNavigationListener()
        // logoutUserLogin()
    }

    /*
    private fun logoutUserLogin() {
        // Tombol logout
        binding.btnLogout.setOnClickListener {
            sessionManager.logout()
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }
    }
     */

    private fun checkSessionUserLogin() {
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
    }

    private fun setupBottomNavigationListener() {
        binding.bottomNavigationView.setOnItemSelectedListener{ item ->
            when (item.itemId) {
                R.id.navigation_home -> replaceFragment(HomeFragment())
                R.id.navigation_account -> replaceFragment(AccountFragment())
            }

            true
        }
    }

    private fun replaceFragment(fragment: Fragment, addToBackStack:Boolean = false) {
        val transaction = supportFragmentManager.beginTransaction().replace(R.id.frame_layout, fragment)

        if (addToBackStack) {
            transaction.addToBackStack(null)
        }

        transaction.commit()
    }
}