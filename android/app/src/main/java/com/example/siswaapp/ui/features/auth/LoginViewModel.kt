package com.example.siswaapp.ui.features.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.siswaapp.data.remote.dto.LoginResponse
import com.example.siswaapp.domain.repository.AuthRepository
import com.example.siswaapp.ui.components.UiState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _loginState = MutableStateFlow<UiState<LoginResponse>>(UiState.Idle)
    val loginState: StateFlow<UiState<LoginResponse>> = _loginState.asStateFlow()

    private val _registerState = MutableStateFlow<UiState<LoginResponse>>(UiState.Idle)
    val registerState: StateFlow<UiState<LoginResponse>> = _registerState.asStateFlow()

    fun login(email: String, password: String) {
        if (email.isBlank() || password.isBlank()) {
            _loginState.value = UiState.Error("Email dan password tidak boleh kosong")
            return
        }
        _loginState.value = UiState.Loading
        viewModelScope.launch {
            try {
                val response = authRepository.login(email, password)
                if (response.user.role != "STUDENT") {
                    // Hanya izinkan role STUDENT masuk ke aplikasi Siswa
                    authRepository.clearSession()
                    _loginState.value = UiState.Error("Hanya akun Siswa yang diperbolehkan masuk ke aplikasi ini")
                } else {
                    _loginState.value = UiState.Success(response)
                }
            } catch (e: Exception) {
                _loginState.value = UiState.Error(e.message ?: "Login gagal, terjadi kesalahan jaringan")
            }
        }
    }

    fun register(name: String, email: String, password: String) {
        if (name.isBlank() || email.isBlank() || password.isBlank()) {
            _registerState.value = UiState.Error("Semua field wajib diisi")
            return
        }
        _registerState.value = UiState.Loading
        viewModelScope.launch {
            try {
                val response = authRepository.register(name, email, password)
                _registerState.value = UiState.Success(response)
            } catch (e: Exception) {
                _registerState.value = UiState.Error(e.message ?: "Registrasi gagal, silakan coba lagi")
            }
        }
    }

    fun resetState() {
        _loginState.value = UiState.Idle
    }

    fun resetRegisterState() {
        _registerState.value = UiState.Idle
    }
}
