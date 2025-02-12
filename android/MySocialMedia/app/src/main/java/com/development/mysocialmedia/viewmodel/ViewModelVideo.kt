package com.development.mysocialmedia.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.ViewModel
import com.development.mysocialmedia.model.VideosItem
import com.development.mysocialmedia.repository.RepositoryVideo

class ViewModelVideo: ViewModel() {
    private val repository = RepositoryVideo()

    fun getAllVideos(): LiveData<List<VideosItem>> {
        return repository.getHomepageVideos()
    }
}