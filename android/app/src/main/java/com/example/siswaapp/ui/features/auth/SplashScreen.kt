package com.example.siswaapp.ui.features.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.siswaapp.domain.repository.AuthRepository
import com.example.siswaapp.theme.BackgroundLight
import com.example.siswaapp.theme.MutedTextGray
import com.example.siswaapp.theme.PrimaryBlue
import com.example.siswaapp.theme.SecondarySlate
import com.example.siswaapp.theme.SurfaceWhite
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.first

@Composable
fun SplashScreen(
    authRepository: AuthRepository,
    onTokenChecked: (Boolean) -> Unit
) {
    LaunchedEffect(Unit) {
        delay(1500) // Beautiful splash delay
        val token = authRepository.token.first()
        onTokenChecked(!token.isNullOrBlank())
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(PrimaryBlue),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Kantin Cermat",
                fontSize = 32.sp,
                fontWeight = FontWeight.ExtraBold,
                color = SurfaceWhite
            )
            Text(
                text = "SMKN 12 JAKARTA",
                fontSize = 16.sp,
                fontWeight = FontWeight.Normal,
                color = SurfaceWhite.copy(alpha = 0.8f)
            )

            Spacer(modifier = Modifier.height(32.dp))

            CircularProgressIndicator(
                color = SurfaceWhite,
                strokeWidth = 3.dp,
                modifier = Modifier.size(36.dp)
            )
        }
    }
}
