package com.example.siswaapp.data.remote.dto

import com.google.gson.annotations.SerializedName

data class CreateOrderRequest(
    @SerializedName("studentName")
    val studentName: String?,
    @SerializedName("studentId")
    val studentId: Int?,
    @SerializedName("items")
    val items: List<CreateOrderItemRequest>
)

data class CreateOrderItemRequest(
    @SerializedName("menu_id")
    val menuId: Int,
    @SerializedName("quantity")
    val quantity: Int
)
