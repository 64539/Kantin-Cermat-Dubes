package com.example.siswaapp.domain.repository

import com.example.siswaapp.data.remote.dto.CreateOrderRequest
import com.example.siswaapp.data.remote.dto.OrderResponse

interface OrderRepository {
    suspend fun createOrder(request: CreateOrderRequest): OrderResponse
    suspend fun getOrders(): List<OrderResponse>
}
