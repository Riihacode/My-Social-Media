package com.development.mysocialmedia.model

import com.google.gson.annotations.SerializedName

data class ResponseHomepageVideo(

	@field:SerializedName("videos")
	val videos: List<VideosItem>
)

data class VideosItem(

	@field:SerializedName("video_url")
	val videoUrl: String,

	@field:SerializedName("uploaded_at")
	val uploadedAt: String,

	@field:SerializedName("description")
	val description: String,

	@field:SerializedName("id")
	val id: Int,

	@field:SerializedName("username")
	val username: String
) {
	fun getFullVideoUrl(): String {
		return "http://192.168.100.185:3000/$videoUrl"
	}
}
