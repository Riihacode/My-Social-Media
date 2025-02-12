package com.development.mysocialmedia.view.fragment

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.development.mysocialmedia.R
import com.development.mysocialmedia.databinding.FragmentAccountBinding

class AccountFragment : Fragment() {

    private lateinit var binding: FragmentAccountBinding

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentAccountBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)


        forcedRedBackgroundColorLogOutButton()
    }

    private fun forcedRedBackgroundColorLogOutButton() {
        binding.btnAccountLogout.setBackgroundResource(R.drawable.rounded_button)
        binding.btnAccountLogout.backgroundTintList = null
    }
}