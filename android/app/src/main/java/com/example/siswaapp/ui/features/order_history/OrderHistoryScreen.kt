package com.example.siswaapp.ui.features.order_history

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.siswaapp.data.remote.dto.OrderResponse
import com.example.siswaapp.theme.BackgroundLight
import com.example.siswaapp.theme.DangerRed
import com.example.siswaapp.theme.MutedTextGray
import com.example.siswaapp.theme.PrimaryBlue
import com.example.siswaapp.theme.SecondarySlate
import com.example.siswaapp.theme.SuccessGreen
import com.example.siswaapp.theme.SurfaceWhite
import com.example.siswaapp.theme.WarningAmber
import com.example.siswaapp.ui.components.UiState
import com.example.siswaapp.ui.features.home.formatPrice

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OrderHistoryScreen(
    viewModel: OrderHistoryViewModel
) {
    val historyState by viewModel.orderHistoryState.collectAsState()
    val isRefreshing by viewModel.isRefreshing.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Riwayat Pesanan", fontWeight = FontWeight.Bold, color = Color.White) },
                actions = {
                    IconButton(onClick = { viewModel.fetchOrders() }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Refresh", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = PrimaryBlue)
            )
        },
        containerColor = BackgroundLight
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (val state = historyState) {
                is UiState.Loading -> {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(color = PrimaryBlue)
                    }
                }
                is UiState.Error -> {
                    Box(modifier = Modifier.fillMaxSize().padding(24.dp), contentAlignment = Alignment.Center) {
                        Text(
                            text = state.message,
                            color = DangerRed,
                            fontWeight = FontWeight.SemiBold,
                            modifier = Modifier.clickable { viewModel.fetchOrders() }
                        )
                    }
                }
                is UiState.Success -> {
                    val orders = state.data
                    PullToRefreshBox(
                        isRefreshing = isRefreshing,
                        onRefresh = { viewModel.fetchOrders(isPullRefresh = true) },
                        modifier = Modifier.fillMaxSize()
                    ) {
                        if (orders.isEmpty()) {
                            Box(
                                modifier = Modifier.fillMaxSize(),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "Belum ada riwayat pesanan.",
                                    color = MutedTextGray,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        } else {
                            LazyColumn(
                                modifier = Modifier.fillMaxSize(),
                                contentPadding = PaddingValues(16.dp),
                                verticalArrangement = Arrangement.spacedBy(16.dp)
                            ) {
                                items(orders) { order ->
                                    OrderCard(order = order)
                                }
                            }
                        }
                    }
                }
                else -> {}
            }
        }
    }
}

@Composable
fun OrderCard(order: OrderResponse) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceWhite),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header Row (Invoice + Status)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = order.orderNumber,
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = SecondarySlate
                    )
                    Text(
                        text = formatOrderDate(order.createdAt),
                        fontSize = 12.sp,
                        color = SecondarySlate.copy(alpha = 0.6f)
                    )
                }

                StatusBadge(status = order.status)
            }

            Spacer(modifier = Modifier.height(12.dp))
            Spacer(modifier = Modifier.height(1.dp).fillMaxWidth().background(Color.LightGray.copy(alpha = 0.5f)))
            Spacer(modifier = Modifier.height(12.dp))

            // Order Items
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                order.items.forEach { item ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "${item.quantity}x ${item.menu?.name ?: "Menu Terhapus"}",
                            fontSize = 14.sp,
                            color = SecondarySlate.copy(alpha = 0.8f),
                            fontWeight = FontWeight.Medium
                        )
                        Text(
                            text = formatPrice(item.priceAtPurchase * item.quantity),
                            fontSize = 14.sp,
                            color = SecondarySlate,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))
            Spacer(modifier = Modifier.height(1.dp).fillMaxWidth().background(Color.LightGray.copy(alpha = 0.5f)))
            Spacer(modifier = Modifier.height(12.dp))

            // Total Amount Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Total Bayar",
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    color = SecondarySlate
                )
                Text(
                    text = formatPrice(order.totalAmount),
                    fontWeight = FontWeight.Black,
                    fontSize = 18.sp,
                    color = PrimaryBlue
                )
            }
        }
    }
}

@Composable
fun StatusBadge(status: String) {
    val (color, text) = when (status) {
        "PENDING" -> WarningAmber to "Menunggu"
        "PROCESSING" -> WarningAmber to "Diproses"
        "READY" -> SuccessGreen to "Siap Saji"
        "COMPLETED" -> SuccessGreen to "Selesai"
        "CANCELLED" -> DangerRed to "Batal"
        else -> MutedTextGray to status
    }

    Box(
        modifier = Modifier
            .background(color.copy(alpha = 0.1f), shape = RoundedCornerShape(8.dp))
            .padding(horizontal = 10.dp, vertical = 4.dp)
    ) {
        Text(
            text = text,
            color = color,
            fontWeight = FontWeight.Bold,
            fontSize = 12.sp
        )
    }
}

fun formatOrderDate(dateStr: String): String {
    // Simple parser for standard date string "2026-07-10T20:00:00Z" -> "10 Juli 2026, 20:00"
    return try {
        val parts = dateStr.split("T")
        val datePart = parts[0] // YYYY-MM-DD
        val timePart = parts[1].substring(0, 5) // HH:MM

        val dateSplit = datePart.split("-")
        val year = dateSplit[0]
        val monthInt = dateSplit[1].toInt()
        val day = dateSplit[2]

        val months = listOf(
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        )
        val monthName = months[monthInt - 1]

        "$day $monthName $year, $timePart"
    } catch (e: Exception) {
        dateStr
    }
}
