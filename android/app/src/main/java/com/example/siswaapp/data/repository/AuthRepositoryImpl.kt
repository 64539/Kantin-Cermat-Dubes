package com.example.siswaapp.data.repository

import com.example.siswaapp.data.local.datastore.AuthPreferences
import com.example.siswaapp.data.remote.api.ApiService
import com.example.siswaapp.data.remote.dto.LoginRequest
import com.example.siswaapp.data.remote.dto.LoginResponse
import com.example.siswaapp.domain.repository.AuthRepository
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject
import javax.inject.Singleton

import com.example.siswaapp.data.remote.dto.RegisterRequest

@Singleton
class AuthRepositoryImpl @Inject constructor(
    private val apiService: ApiService,
    private val authPreferences: AuthPreferences
) : AuthRepository {

    override suspend fun login(email: String, password: String): LoginResponse {
        val response = apiService.login(LoginRequest(email, password))
        authPreferences.saveSession(
            token = response.accessToken,
            id = response.user.id,
            name = response.user.name,
            email = response.user.email
        )
        return response
    }

    override suspend fun register(name: String, email: String, password: String): LoginResponse {
        val response = apiService.register(RegisterRequest(name, email, password))
        authPreferences.saveSession(
            token = response.accessToken,
            id = response.user.id,
            name = response.user.name,
            email = response.user.email
        )
        return response
    }

    override val token: Flow<String?> = authPreferences.authToken
    override val userName: Flow<String?> = authPreferences.userName
    override val userEmail: Flow<String?> = authPreferences.userEmail
    override val userId: Flow<Int?> = authPreferences.userId

    override suspend fun clearSession() {
        authPreferences.clearSession()
    }
}
