package com.example.siswaapp.ui.features.cart

import android.widget.Toast
import androidx.compose.foundation.background
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
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
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
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
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
import com.example.siswaapp.ui.features.home.formatPrice

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CartScreen(
    viewModel: CartViewModel,
    onCheckoutSuccess: () -> Unit,
    onBackClick: () -> Unit
) {
    val context = LocalContext.current
    val cartItems by viewModel.cartItems.collectAsState()
    val orderState by viewModel.orderState.collectAsState()

    val totalAmount = cartItems.sumOf { it.menu.price * it.quantity }

    LaunchedEffect(orderState) {
        when (val state = orderState) {
            is UiState.Success -> {
                Toast.makeText(context, "Pre-order berhasil dibuat!", Toast.LENGTH_LONG).show()
                viewModel.resetOrderState()
                onCheckoutSuccess()
            }
            is UiState.Error -> {
                Toast.makeText(context, state.message, Toast.LENGTH_LONG).show()
                viewModel.resetOrderState()
            }
            else -> {}
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Keranjang Belanja", fontWeight = FontWeight.Bold, color = Color.White) },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = PrimaryBlue)
            )
        },
        containerColor = BackgroundLight
    ) { innerPadding ->
        if (cartItems.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        Icons.Default.ShoppingCart,
                        contentDescription = "Empty Cart",
                        modifier = Modifier.size(64.dp),
                        tint = Color.LightGray
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "Keranjang belanja Anda kosong",
                        color = MutedTextGray,
                        fontWeight = FontWeight.Medium
                    )
                }
            }
            return@Scaffold
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            // Cart Items List
            LazyColumn(
                modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = 16.dp),
                contentPadding = PaddingValues(vertical = 16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(cartItems) { item ->
                    CartItemCard(
                        item = item,
                        onQtyIncrease = {
                            if (item.quantity >= item.menu.stock) {
                                Toast.makeText(context, "Jumlah melebihi stok yang tersedia", Toast.LENGTH_SHORT).show()
                            } else {
                                viewModel.updateQuantity(item.menu.id, item.quantity + 1)
                            }
                        },
                        onQtyDecrease = { viewModel.updateQuantity(item.menu.id, item.quantity - 1) },
                        onRemove = { viewModel.updateQuantity(item.menu.id, 0) }
                    )
                }
            }

            // Checkout Summary Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceWhite),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Total Pembayaran",
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp,
                            color = SecondarySlate
                        )
                        Text(
                            text = formatPrice(totalAmount),
                            fontWeight = FontWeight.Black,
                            fontSize = 20.sp,
                            color = PrimaryBlue
                        )
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Button(
                        onClick = { viewModel.checkout() },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp),
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue),
                        enabled = orderState !is UiState.Loading
                    ) {
                        if (orderState is UiState.Loading) {
                            CircularProgressIndicator(color = SurfaceWhite, modifier = Modifier.size(24.dp))
                        } else {
                            Text(
                                text = "Pesan Sekarang (Pre-Order)",
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp,
                                color = SurfaceWhite
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun CartItemCard(
    item: CartItem,
    onQtyIncrease: () -> Unit,
    onQtyDecrease: () -> Unit,
    onRemove: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceWhite),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = item.menu.name,
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = SecondarySlate
                    )
                    Text(
                        text = "${formatPrice(item.menu.price)} / porsi",
                        fontSize = 12.sp,
                        color = MutedTextGray
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Subtotal: ${formatPrice(item.menu.price * item.quantity)}",
                        fontWeight = FontWeight.ExtraBold,
                        fontSize = 13.sp,
                        color = PrimaryBlue
                    )
                }

                // Quantity Control Row
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    IconButton(
                        onClick = onQtyDecrease,
                        modifier = Modifier
                            .size(28.dp)
                            .background(BackgroundLight, shape = CircleShape)
                    ) {
                        Icon(Icons.Default.Remove, contentDescription = "Decrease Quantity", modifier = Modifier.size(16.dp), tint = SecondarySlate)
                    }

                    Text(
                        text = item.quantity.toString(),
                        fontSize = 16.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = SecondarySlate
                    )

                    IconButton(
                        onClick = onQtyIncrease,
                        modifier = Modifier
                            .size(28.dp)
                            .background(BackgroundLight, shape = CircleShape)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = "Increase Quantity", modifier = Modifier.size(16.dp), tint = SecondarySlate)
                    }

                    Spacer(modifier = Modifier.width(4.dp))

                    IconButton(
                        onClick = onRemove,
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Delete,
                            contentDescription = "Delete Item",
                            tint = DangerRed,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }

            // Validation Warning: Jumlah melebihi stok yang tersedia
            if (item.quantity >= item.menu.stock) {
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "Jumlah melebihi stok yang tersedia",
                    color = DangerRed,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.fillMaxWidth(),
                    textAlign = TextAlign.End
                )
            }
        }
    }
}
