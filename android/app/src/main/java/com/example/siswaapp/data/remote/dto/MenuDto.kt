package com.example.siswaapp.data.remote.dto

import com.google.gson.annotations.SerializedName

data class MenuDto(
    @SerializedName("id")
    val id: Int,
    @SerializedName("name")
    val name: String,
    @SerializedName("price")
    val price: Double,
    @SerializedName("stock")
    val stock: Int,
    @SerializedName("imageUrl")
    val imageUrl: String?,
    @SerializedName("status")
    val status: Boolean,
    @SerializedName("categoryId")
    val categoryId: Int,
    @SerializedName("category")
    val category: CategoryDto?
)

data class CategoryDto(
    @SerializedName("id")
    val id: Int,
    @SerializedName("name")
    val name: String
)
