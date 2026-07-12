package com.example.siswaapp.data.repository

import com.example.siswaapp.data.remote.api.ApiService
import com.example.siswaapp.data.remote.dto.CreateOrderRequest
import com.example.siswaapp.data.remote.dto.OrderResponse
import com.example.siswaapp.domain.repository.OrderRepository
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class OrderRepositoryImpl @Inject constructor(
    private val apiService: ApiService
) : OrderRepository {
    override suspend fun createOrder(request: CreateOrderRequest): OrderResponse {
        return apiService.createOrder(request)
    }

    override suspend fun getOrders(): List<OrderResponse> {
        return apiService.getOrders()
    }
}
