package com.example.siswaapp.domain.repository

import com.example.siswaapp.data.remote.dto.MenuDto

interface MenuRepository {
    suspend fun getMenus(search: String? = null, categoryId: Int? = null): List<MenuDto>
}
