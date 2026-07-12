package com.example.siswaapp.data.repository

import com.example.siswaapp.data.remote.api.ApiService
import com.example.siswaapp.data.remote.dto.MenuDto
import com.example.siswaapp.domain.repository.MenuRepository
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class MenuRepositoryImpl @Inject constructor(
    private val apiService: ApiService
) : MenuRepository {
    override suspend fun getMenus(search: String?, categoryId: Int?): List<MenuDto> {
        return apiService.getMenus(status = true, search = search, categoryId = categoryId)
    }
}
