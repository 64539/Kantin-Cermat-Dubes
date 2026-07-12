package com.example.siswaapp.ui.features.main

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.example.siswaapp.domain.repository.AuthRepository
import com.example.siswaapp.ui.features.cart.CartViewModel
import com.example.siswaapp.ui.features.home.HomeScreen
import com.example.siswaapp.ui.features.home.HomeViewModel
import com.example.siswaapp.ui.features.order_history.OrderHistoryScreen
import com.example.siswaapp.ui.features.order_history.OrderHistoryViewModel
import com.example.siswaapp.ui.features.profile.ProfileScreen
import com.example.siswaapp.ui.features.wishlist.WishlistScreen

private val PrimaryBlue = Color(0xFF2563EB)
private val SurfaceWhite = Color(0xFFFFFFFF)

enum class Tab {
    Home, Wishlist, History, Profile
}

@Composable
fun MainContainer(
    homeViewModel: HomeViewModel,
    cartViewModel: CartViewModel,
    orderHistoryViewModel: OrderHistoryViewModel,
    authRepository: AuthRepository,
    onMenuClick: (Int) -> Unit,
    onCartClick: () -> Unit,
    onLogoutClick: () -> Unit
) {
    var selectedTab by remember { mutableStateOf(Tab.Home) }

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = SurfaceWhite,
                tonalElevation = 8.dp
            ) {
                NavigationBarItem(
                    selected = selectedTab == Tab.Home,
                    onClick = { selectedTab = Tab.Home },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Beranda") },
                    label = { Text("Beranda") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PrimaryBlue,
                        selectedTextColor = PrimaryBlue,
                        indicatorColor = PrimaryBlue.copy(alpha = 0.1f)
                    )
                )

                NavigationBarItem(
                    selected = selectedTab == Tab.Wishlist,
                    onClick = { selectedTab = Tab.Wishlist },
                    icon = { Icon(Icons.Default.Favorite, contentDescription = "Favorit") },
                    label = { Text("Favorit") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PrimaryBlue,
                        selectedTextColor = PrimaryBlue,
                        indicatorColor = PrimaryBlue.copy(alpha = 0.1f)
                    )
                )

                NavigationBarItem(
                    selected = selectedTab == Tab.History,
                    onClick = {
                        selectedTab = Tab.History
                        orderHistoryViewModel.fetchOrders() // Refresh orders list
                    },
                    icon = { Icon(Icons.Default.History, contentDescription = "Riwayat") },
                    label = { Text("Riwayat") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PrimaryBlue,
                        selectedTextColor = PrimaryBlue,
                        indicatorColor = PrimaryBlue.copy(alpha = 0.1f)
                    )
                )

                NavigationBarItem(
                    selected = selectedTab == Tab.Profile,
                    onClick = { selectedTab = Tab.Profile },
                    icon = { Icon(Icons.Default.Person, contentDescription = "Profil") },
                    label = { Text("Profil") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PrimaryBlue,
                        selectedTextColor = PrimaryBlue,
                        indicatorColor = PrimaryBlue.copy(alpha = 0.1f)
                    )
                )
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (selectedTab) {
                Tab.Home -> {
                    val userName by authRepository.userName.collectAsState(initial = "")
                    HomeScreen(
                        homeViewModel = homeViewModel,
                        cartViewModel = cartViewModel,
                        userName = userName ?: "Siswa",
                        onMenuClick = onMenuClick,
                        onCartClick = onCartClick
                    )
                }
                Tab.Wishlist -> {
                    WishlistScreen(
                        homeViewModel = homeViewModel,
                        cartViewModel = cartViewModel,
                        onMenuClick = onMenuClick
                    )
                }
                Tab.History -> {
                    OrderHistoryScreen(
                        viewModel = orderHistoryViewModel
                    )
                }
                Tab.Profile -> {
                    ProfileScreen(
                        authRepository = authRepository,
                        onLogoutClick = onLogoutClick
                    )
                }
            }
        }
    }
}
