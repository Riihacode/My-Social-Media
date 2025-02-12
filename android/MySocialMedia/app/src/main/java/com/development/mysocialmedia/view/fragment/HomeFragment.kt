package com.development.mysocialmedia.view.fragment

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import com.development.mysocialmedia.R
import com.development.mysocialmedia.adapter.AdapterVideo
import com.development.mysocialmedia.databinding.FragmentHomeBinding
import com.development.mysocialmedia.viewmodel.ViewModelVideo

class HomeFragment : Fragment() {

    private lateinit var binding: FragmentHomeBinding
    private lateinit var adapterVideo: AdapterVideo
    private val viewModelVideo: ViewModelVideo by viewModels()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Setup RecyclerView
        binding.recyclerViewVideos.layoutManager = LinearLayoutManager(requireContext())

        // Observe data dari ViewModel
        viewModelVideo.getAllVideos().observe(viewLifecycleOwner) { videos ->
            adapterVideo = AdapterVideo(videos)
            binding.recyclerViewVideos.adapter = adapterVideo
        }
    }
}