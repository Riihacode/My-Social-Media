package com.development.mysocialmedia.view.activity

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.development.mysocialmedia.SessionManager
import com.development.mysocialmedia.databinding.ActivityLoginBinding
import com.development.mysocialmedia.viewmodel.ViewModelUser

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private lateinit var sessionManager: SessionManager
    private val viewModelUser: ViewModelUser by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sessionManager = SessionManager(this)

        binding.btnLogin.setOnClickListener {
            val email = binding.etEmail.text.toString()
            val password = binding.etPassword.text.toString()

            viewModelUser.loginUser(email, password).observe(this) { response ->
                if (response.message == "Login successful" && response.user.id != -1) {             //user.id != -1 untuk validasi login sukses.
                    Toast.makeText(this, "Login berhasil", Toast.LENGTH_SHORT).show()

                    // Simpan session login
                    sessionManager.saveLoginSession(response.user.id, email)

                    startActivity(Intent(this, MainActivity::class.java))
                    finish()
                } else {
                    Toast.makeText(this, "Login gagal: ${response.message}", Toast.LENGTH_SHORT).show()
                }

            }
        }

        binding.tvRegister.setOnClickListener{
            startActivity(Intent(this, RegisterActivity::class.java))
        }
    }
}