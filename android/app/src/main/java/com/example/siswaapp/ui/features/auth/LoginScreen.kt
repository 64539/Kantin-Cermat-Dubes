package com.example.siswaapp.ui.features.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.siswaapp.theme.BackgroundLight
import com.example.siswaapp.theme.DangerRed
import com.example.siswaapp.theme.MutedTextGray
import com.example.siswaapp.theme.PrimaryBlue
import com.example.siswaapp.theme.SecondarySlate
import com.example.siswaapp.theme.SurfaceWhite
import com.example.siswaapp.ui.components.UiState

@Composable
fun LoginScreen(
    viewModel: LoginViewModel,
    onLoginSuccess: () -> Unit
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var isPasswordVisible by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf("") }

    // Register states
    var isRegisterMode by remember { mutableStateOf(false) }
    var registerName by remember { mutableStateOf("") }
    var registerEmail by remember { mutableStateOf("") }
    var registerPassword by remember { mutableStateOf("") }
    var registerErrorMessage by remember { mutableStateOf("") }

    val loginState by viewModel.loginState.collectAsState()
    val registerState by viewModel.registerState.collectAsState()

    LaunchedEffect(loginState) {
        when (val state = loginState) {
            is UiState.Success -> {
                errorMessage = ""
                onLoginSuccess()
                viewModel.resetState()
            }
            is UiState.Error -> {
                errorMessage = state.message
            }
            else -> {}
        }
    }

    LaunchedEffect(registerState) {
        when (val state = registerState) {
            is UiState.Success -> {
                registerErrorMessage = ""
                isRegisterMode = false
                viewModel.resetRegisterState()
                onLoginSuccess()
            }
            is UiState.Error -> {
                registerErrorMessage = state.message
            }
            else -> {}
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundLight)
    ) {
        // Curved Top Header (occupying 30% height) with PrimaryBlue
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight(0.3f)
                .background(PrimaryBlue, shape = RoundedCornerShape(bottomStart = 80.dp)),
            contentAlignment = Alignment.Center
        ) {
            if (isRegisterMode) {
                Text(
                    text = "Create Account",
                    color = SurfaceWhite,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center
                )
            } else {
                Icon(
                    imageVector = Icons.Default.Person,
                    contentDescription = "User Avatar",
                    tint = SurfaceWhite,
                    modifier = Modifier.size(72.dp)
                )
            }
        }

        // Curved Form Container
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .background(SurfaceWhite, shape = RoundedCornerShape(topEnd = 40.dp))
                .padding(horizontal = 28.dp, vertical = 24.dp)
                .verticalScroll(rememberScrollState())
        ) {
            if (!isRegisterMode) {
                // --- LOGIN FORM ---
                Text(
                    text = "Login",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = SecondarySlate,
                    modifier = Modifier.padding(bottom = 24.dp)
                )

                // Label: E-mail
                Text(
                    text = "Email Siswa",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = SecondarySlate,
                    modifier = Modifier.padding(bottom = 6.dp)
                )
                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    placeholder = { Text("Hello@dream.com") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = SurfaceWhite,
                        unfocusedContainerColor = SurfaceWhite,
                        focusedBorderColor = PrimaryBlue,
                        unfocusedBorderColor = MutedTextGray.copy(alpha = 0.3f)
                    )
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Label: Password
                Text(
                    text = "Password",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = SecondarySlate,
                    modifier = Modifier.padding(bottom = 6.dp)
                )
                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    placeholder = { Text("********") },
                    visualTransformation = if (isPasswordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                    trailingIcon = {
                        IconButton(onClick = { isPasswordVisible = !isPasswordVisible }) {
                            Icon(
                                imageVector = if (isPasswordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                                contentDescription = "Toggle password visibility",
                                tint = MutedTextGray
                            )
                        }
                    },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = SurfaceWhite,
                        unfocusedContainerColor = SurfaceWhite,
                        focusedBorderColor = PrimaryBlue,
                        unfocusedBorderColor = MutedTextGray.copy(alpha = 0.3f)
                    )
                )

                // Forget Password?
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp),
                    contentAlignment = Alignment.CenterEnd
                ) {
                    Text(
                        text = "Forget Password?",
                        fontSize = 12.sp,
                        color = MutedTextGray,
                        modifier = Modifier.clickable { /* Action */ }
                    )
                }

                Spacer(modifier = Modifier.height(28.dp))

                if (errorMessage.isNotEmpty()) {
                    Text(
                        text = errorMessage,
                        color = DangerRed,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        modifier = Modifier.padding(bottom = 12.dp),
                        textAlign = TextAlign.Center
                    )
                }

                // Submit Button
                Button(
                    onClick = {
                        viewModel.login(email, password)
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp)
                        .alpha(if (loginState is UiState.Loading) 0.6f else 1.0f),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = PrimaryBlue,
                        disabledContainerColor = PrimaryBlue.copy(alpha = 0.6f)
                    ),
                    enabled = loginState !is UiState.Loading
                ) {
                    if (loginState is UiState.Loading) {
                        CircularProgressIndicator(
                            color = SurfaceWhite,
                            modifier = Modifier.size(24.dp),
                            strokeWidth = 2.dp
                        )
                    } else {
                        Text(
                            text = "Login",
                            color = SurfaceWhite,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                Spacer(modifier = Modifier.height(28.dp))

                // Toggle Switch Text
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = "Don't have any account? ", color = MutedTextGray, fontSize = 14.sp)
                    Text(
                        text = "Sign Up",
                        color = PrimaryBlue,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        modifier = Modifier.clickable {
                            isRegisterMode = true
                            errorMessage = ""
                        }
                    )
                }
            } else {
                // --- SIGN UP FORM ---
                Text(
                    text = "Sign Up",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = SecondarySlate,
                    modifier = Modifier.padding(bottom = 24.dp)
                )

                // Label: Full Name
                Text(
                    text = "Nama Lengkap",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = SecondarySlate,
                    modifier = Modifier.padding(bottom = 6.dp)
                )
                OutlinedTextField(
                    value = registerName,
                    onValueChange = { registerName = it },
                    placeholder = { Text("Wasim Bari") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = SurfaceWhite,
                        unfocusedContainerColor = SurfaceWhite,
                        focusedBorderColor = PrimaryBlue,
                        unfocusedBorderColor = MutedTextGray.copy(alpha = 0.3f)
                    )
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Label: Email / NIS (jangan hilangkan NIS)
                Text(
                    text = "Email Sekolah",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = SecondarySlate,
                    modifier = Modifier.padding(bottom = 6.dp)
                )
                OutlinedTextField(
                    value = registerEmail,
                    onValueChange = { registerEmail = it },
                    placeholder = { Text("Hello@dream.com ") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = SurfaceWhite,
                        unfocusedContainerColor = SurfaceWhite,
                        focusedBorderColor = PrimaryBlue,
                        unfocusedBorderColor = MutedTextGray.copy(alpha = 0.3f)
                    )
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Label: Password
                Text(
                    text = "Password",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = SecondarySlate,
                    modifier = Modifier.padding(bottom = 6.dp)
                )
                OutlinedTextField(
                    value = registerPassword,
                    onValueChange = { registerPassword = it },
                    placeholder = { Text("********") },
                    visualTransformation = PasswordVisualTransformation(),
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = SurfaceWhite,
                        unfocusedContainerColor = SurfaceWhite,
                        focusedBorderColor = PrimaryBlue,
                        unfocusedBorderColor = MutedTextGray.copy(alpha = 0.3f)
                    )
                )

                Spacer(modifier = Modifier.height(28.dp))

                if (registerErrorMessage.isNotEmpty()) {
                    Text(
                        text = registerErrorMessage,
                        color = DangerRed,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        modifier = Modifier.padding(bottom = 12.dp),
                        textAlign = TextAlign.Center
                    )
                }

                // Submit Button
                Button(
                    onClick = {
                        viewModel.register(registerName, registerEmail, registerPassword)
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp)
                        .alpha(if (registerState is UiState.Loading) 0.6f else 1.0f),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = PrimaryBlue,
                        disabledContainerColor = PrimaryBlue.copy(alpha = 0.6f)
                    ),
                    enabled = registerState !is UiState.Loading
                ) {
                    if (registerState is UiState.Loading) {
                        CircularProgressIndicator(
                            color = SurfaceWhite,
                            modifier = Modifier.size(24.dp),
                            strokeWidth = 2.dp
                        )
                    } else {
                        Text(
                            text = "Sign Up",
                            color = SurfaceWhite,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                Spacer(modifier = Modifier.height(28.dp))

                // Toggle Switch Text
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = "Already have an account? ", color = MutedTextGray, fontSize = 14.sp)
                    Text(
                        text = "Login",
                        color = PrimaryBlue,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        modifier = Modifier.clickable {
                            isRegisterMode = false
                            registerErrorMessage = ""
                        }
                    )
                }
            }
        }
    }
}
