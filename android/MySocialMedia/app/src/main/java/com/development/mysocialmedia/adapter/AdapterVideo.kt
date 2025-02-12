package com.development.mysocialmedia.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.development.mysocialmedia.databinding.ItemVideoBinding
import com.development.mysocialmedia.model.VideosItem
import com.google.android.exoplayer2.MediaItem
import com.google.android.exoplayer2.SimpleExoPlayer

class AdapterVideo(private val videos: List<VideosItem>):
    RecyclerView.Adapter<AdapterVideo.VideoViewHolder>() {
    inner class VideoViewHolder(val binding: ItemVideoBinding) : RecyclerView.ViewHolder(binding.root) {
        private var player: SimpleExoPlayer? = null

        fun bind(videosItem: VideosItem) {
            binding.tvUsername.text = videosItem.username
            binding.tvDescription.text = videosItem.description

            // Setup ExoPlayer untuk memutar video
            player = SimpleExoPlayer.Builder(binding.root.context).build()
            binding.videoView.player = player
            val mediaItem = MediaItem.fromUri(videosItem.getFullVideoUrl())
            player = SimpleExoPlayer.Builder(binding.root.context).build()
            player?.setMediaItem(mediaItem)
            player?.prepare()
        }

        fun releasePlayer() {
            player?.release()
            player = null
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VideoViewHolder {
        val binding = ItemVideoBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return VideoViewHolder(binding)
    }

    override fun getItemCount(): Int = videos.size

    override fun onBindViewHolder(holder: VideoViewHolder, position: Int) {
        holder.bind(videos[position])
    }

    override fun onViewRecycled(holder: VideoViewHolder) {
        holder.releasePlayer()
        super.onViewRecycled(holder)
    }
}