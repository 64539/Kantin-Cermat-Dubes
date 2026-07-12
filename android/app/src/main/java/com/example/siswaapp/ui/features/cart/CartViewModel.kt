package com.example.siswaapp.ui.features.cart

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.siswaapp.data.remote.dto.CreateOrderItemRequest
import com.example.siswaapp.data.remote.dto.CreateOrderRequest
import com.example.siswaapp.data.remote.dto.MenuDto
import com.example.siswaapp.data.remote.dto.OrderResponse
import com.example.siswaapp.domain.repository.AuthRepository
import com.example.siswaapp.domain.repository.OrderRepository
import com.example.siswaapp.ui.components.UiState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import javax.inject.Inject

data class CartItem(
    val menu: MenuDto,
    val quantity: Int
)

@HiltViewModel
class CartViewModel @Inject constructor(
    private val orderRepository: OrderRepository,
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _cartItems = MutableStateFlow<List<CartItem>>(emptyList())
    val cartItems: StateFlow<List<CartItem>> = _cartItems.asStateFlow()

    private val _orderState = MutableStateFlow<UiState<OrderResponse>>(UiState.Idle)
    val orderState: StateFlow<UiState<OrderResponse>> = _orderState.asStateFlow()

    fun addToCart(menu: MenuDto, quantity: Int = 1) {
        if (menu.stock <= 0 || !menu.status) return

        val currentList = _cartItems.value.toMutableList()
        val index = currentList.indexOfFirst { it.menu.id == menu.id }

        if (index != -1) {
            val item = currentList[index]
            val newQty = (item.quantity + quantity).coerceAtMost(menu.stock)
            currentList[index] = item.copy(quantity = newQty)
        } else {
            currentList.add(CartItem(menu, quantity.coerceAtMost(menu.stock)))
        }
        _cartItems.value = currentList
    }

    fun updateQuantity(menuId: Int, newQty: Int) {
        val currentList = _cartItems.value.toMutableList()
        val index = currentList.indexOfFirst { it.menu.id == menuId }
        if (index != -1) {
            val item = currentList[index]
            if (newQty <= 0) {
                currentList.removeAt(index)
            } else {
                val validatedQty = newQty.coerceAtMost(item.menu.stock)
                currentList[index] = item.copy(quantity = validatedQty)
            }
            _cartItems.value = currentList
        }
    }

    fun clearCart() {
        _cartItems.value = emptyList()
    }

    fun resetOrderState() {
        _orderState.value = UiState.Idle
    }

    fun checkout() {
        if (_cartItems.value.isEmpty()) return
        _orderState.value = UiState.Loading
        viewModelScope.launch {
            try {
                val studentName = authRepository.userName.first() ?: "Siswa"
                val studentId = authRepository.userId.first()

                val itemsRequest = _cartItems.value.map { item ->
                    CreateOrderItemRequest(
                        menuId = item.menu.id,
                        quantity = item.quantity
                    )
                }

                val request = CreateOrderRequest(
                    studentName = studentName,
                    studentId = studentId,
                    items = itemsRequest
                )

                val response = orderRepository.createOrder(request)
                _orderState.value = UiState.Success(response)
                clearCart()
            } catch (e: Exception) {
                _orderState.value = UiState.Error(e.message ?: "Gagal membuat pre-order")
            }
        }
    }
}
