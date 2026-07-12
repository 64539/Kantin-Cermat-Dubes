package com.example.siswaapp.ui.features.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.siswaapp.data.remote.dto.MenuDto
import com.example.siswaapp.domain.repository.MenuRepository
import com.example.siswaapp.ui.components.UiState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val menuRepository: MenuRepository
) : ViewModel() {

    private val _menuState = MutableStateFlow<UiState<List<MenuDto>>>(UiState.Idle)
    val menuState: StateFlow<UiState<List<MenuDto>>> = _menuState.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedCategoryId = MutableStateFlow<Int?>(null)
    val selectedCategoryId: StateFlow<Int?> = _selectedCategoryId.asStateFlow()

    private val _wishlistItems = MutableStateFlow<List<MenuDto>>(emptyList())
    val wishlistItems: StateFlow<List<MenuDto>> = _wishlistItems.asStateFlow()

    init {
        fetchMenus()
    }

    fun toggleWishlist(menu: MenuDto) {
        val current = _wishlistItems.value.toMutableList()
        if (current.any { it.id == menu.id }) {
            current.removeAll { it.id == menu.id }
        } else {
            current.add(menu)
        }
        _wishlistItems.value = current
    }

    fun isWishlisted(menuId: Int): Boolean {
        return _wishlistItems.value.any { it.id == menuId }
    }

    fun searchMenus(query: String) {
        _searchQuery.value = query
        fetchMenus()
    }

    fun selectCategory(categoryId: Int?) {
        _selectedCategoryId.value = categoryId
        fetchMenus()
    }

    fun fetchMenus() {
        _menuState.value = UiState.Loading
        viewModelScope.launch {
            try {
                val query = _searchQuery.value.ifBlank { null }
                val response = menuRepository.getMenus(
                    search = query,
                    categoryId = _selectedCategoryId.value
                )
                _menuState.value = UiState.Success(response)
            } catch (e: Exception) {
                _menuState.value = UiState.Error(e.message ?: "Gagal mengambil daftar menu")
            }
        }
    }
}
