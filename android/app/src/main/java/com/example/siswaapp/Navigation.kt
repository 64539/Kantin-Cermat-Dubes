package com.example.siswaapp

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.rememberCoroutineScope
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation3.runtime.entryProvider
import androidx.navigation3.runtime.rememberNavBackStack
import androidx.navigation3.ui.NavDisplay
import com.example.siswaapp.data.local.datastore.AuthEventBus
import com.example.siswaapp.domain.repository.AuthRepository
import com.example.siswaapp.ui.features.auth.LoginScreen
import com.example.siswaapp.ui.features.auth.LoginViewModel
import com.example.siswaapp.ui.features.auth.SplashScreen
import com.example.siswaapp.ui.features.cart.CartScreen
import com.example.siswaapp.ui.features.cart.CartViewModel
import com.example.siswaapp.ui.features.detail.MenuDetailScreen
import com.example.siswaapp.ui.features.home.HomeViewModel
import com.example.siswaapp.ui.features.main.MainContainer
import com.example.siswaapp.ui.features.order_history.OrderHistoryViewModel
import kotlinx.coroutines.launch

@Composable
fun MainNavigation(
    authRepository: AuthRepository,
    authEventBus: AuthEventBus
) {
    val backStack = rememberNavBackStack(Splash)
    val coroutineScope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        authEventBus.unauthorizedEvent.collect {
            while (backStack.removeLastOrNull() != null) {
                // Popping all backstack
            }
            backStack.add(Login)
        }
    }

    val homeViewModel: HomeViewModel = hiltViewModel()
    val cartViewModel: CartViewModel = hiltViewModel()
    val orderHistoryViewModel: OrderHistoryViewModel = hiltViewModel()

    NavDisplay(
        backStack = backStack,
        onBack = { backStack.removeLastOrNull() },
        entryProvider = entryProvider {
            entry<Splash> {
                SplashScreen(
                    authRepository = authRepository,
                    onTokenChecked = { isLoggedIn ->
                        backStack.removeLastOrNull()
                        if (isLoggedIn) {
                            backStack.add(MainContainer)
                        } else {
                            backStack.add(Login)
                        }
                    }
                )
            }

            entry<Login> {
                val loginViewModel: LoginViewModel = hiltViewModel()
                LoginScreen(
                    viewModel = loginViewModel,
                    onLoginSuccess = {
                        backStack.removeLastOrNull()
                        backStack.add(MainContainer)
                    }
                )
            }

            entry<MainContainer> {
                MainContainer(
                    homeViewModel = homeViewModel,
                    cartViewModel = cartViewModel,
                    orderHistoryViewModel = orderHistoryViewModel,
                    authRepository = authRepository,
                    onMenuClick = { menuId ->
                        backStack.add(MenuDetail(menuId))
                    },
                    onCartClick = {
                        backStack.add(Cart)
                    },
                    onLogoutClick = {
                        coroutineScope.launch {
                            authRepository.clearSession()
                            backStack.removeLastOrNull()
                            backStack.add(Login)
                        }
                    }
                )
            }

            entry<MenuDetail> { key ->
                MenuDetailScreen(
                    menuId = key.menuId,
                    homeViewModel = homeViewModel,
                    cartViewModel = cartViewModel,
                    onBackClick = {
                        backStack.removeLastOrNull()
                    }
                )
            }

            entry<Cart> {
                CartScreen(
                    viewModel = cartViewModel,
                    onCheckoutSuccess = {
                        backStack.removeLastOrNull()
                    },
                    onBackClick = {
                        backStack.removeLastOrNull()
                    }
                )
            }
        }
    )
}
