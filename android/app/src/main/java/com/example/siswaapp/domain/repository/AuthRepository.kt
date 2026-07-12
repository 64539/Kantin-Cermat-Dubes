package com.example.siswaapp.domain.repository

import com.example.siswaapp.data.remote.dto.LoginResponse
import kotlinx.coroutines.flow.Flow

interface AuthRepository {
    suspend fun login(email: String, password: String): LoginResponse
    suspend fun register(name: String, email: String, password: String): LoginResponse
    val token: Flow<String?>
    val userName: Flow<String?>
    val userEmail: Flow<String?>
    val userId: Flow<Int?>
    suspend fun clearSession()
}
