package com.example.siswaapp.ui.features.order_history

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.siswaapp.data.remote.dto.OrderResponse
import com.example.siswaapp.domain.repository.OrderRepository
import com.example.siswaapp.ui.components.UiState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class OrderHistoryViewModel @Inject constructor(
    private val orderRepository: OrderRepository
) : ViewModel() {

    private val _orderHistoryState = MutableStateFlow<UiState<List<OrderResponse>>>(UiState.Idle)
    val orderHistoryState: StateFlow<UiState<List<OrderResponse>>> = _orderHistoryState.asStateFlow()

    private val _isRefreshing = MutableStateFlow(false)
    val isRefreshing: StateFlow<Boolean> = _isRefreshing.asStateFlow()

    init {
        fetchOrders()
    }

    fun fetchOrders(isPullRefresh: Boolean = false) {
        if (isPullRefresh) {
            _isRefreshing.value = true
        } else {
            _orderHistoryState.value = UiState.Loading
        }
        viewModelScope.launch {
            try {
                val response = orderRepository.getOrders()
                // Urutkan pesanan terbaru di paling atas
                val sortedResponse = response.sortedByDescending { it.id }
                _orderHistoryState.value = UiState.Success(sortedResponse)
            } catch (e: Exception) {
                _orderHistoryState.value = UiState.Error(e.message ?: "Gagal mengambil riwayat pesanan")
            } finally {
                _isRefreshing.value = false
            }
        }
    }
}
