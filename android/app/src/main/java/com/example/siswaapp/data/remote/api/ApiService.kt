package com.example.siswaapp.data.remote.api

import com.example.siswaapp.data.remote.dto.CreateOrderRequest
import com.example.siswaapp.data.remote.dto.LoginRequest
import com.example.siswaapp.data.remote.dto.LoginResponse
import com.example.siswaapp.data.remote.dto.MenuDto
import com.example.siswaapp.data.remote.dto.OrderResponse
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

import com.example.siswaapp.data.remote.dto.RegisterRequest

interface ApiService {

    @POST("auth/register")
    suspend fun register(
        @Body request: RegisterRequest
    ): LoginResponse

    @POST("auth/login")
    suspend fun login(
        @Body request: LoginRequest
    ): LoginResponse

    @GET("menu")
    suspend fun getMenus(
        @Query("status") status: Boolean = true,
        @Query("search") search: String? = null,
        @Query("categoryId") categoryId: Int? = null
    ): List<MenuDto>

    @POST("orders")
    suspend fun createOrder(
        @Body request: CreateOrderRequest
    ): OrderResponse

    @GET("orders")
    suspend fun getOrders(): List<OrderResponse>
}
