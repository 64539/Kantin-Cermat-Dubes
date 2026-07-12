package com.example.siswaapp.data.remote.dto

import com.google.gson.annotations.SerializedName

data class OrderResponse(
    @SerializedName("id")
    val id: Int,
    @SerializedName("orderNumber")
    val orderNumber: String,
    @SerializedName("studentName")
    val studentName: String?,
    @SerializedName("studentId")
    val studentId: Int?,
    @SerializedName("totalAmount")
    val totalAmount: Double,
    @SerializedName("status")
    val status: String,
    @SerializedName("createdAt")
    val createdAt: String,
    @SerializedName("updatedAt")
    val updatedAt: String,
    @SerializedName("items")
    val items: List<OrderItemResponse>
)

data class OrderItemResponse(
    @SerializedName("id")
    val id: Int,
    @SerializedName("menuId")
    val menuId: Int,
    @SerializedName("quantity")
    val quantity: Int,
    @SerializedName("priceAtPurchase")
    val priceAtPurchase: Double,
    @SerializedName("menu")
    val menu: OrderMenuDto?
)

data class OrderMenuDto(
    @SerializedName("id")
    val id: Int,
    @SerializedName("name")
    val name: String,
    @SerializedName("imageUrl")
    val imageUrl: String?
)
