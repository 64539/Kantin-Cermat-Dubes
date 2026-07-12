package com.example.siswaapp.ui.features.detail

import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.foundation.clickable
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberAsyncImagePainter
import com.example.siswaapp.theme.BackgroundLight
import com.example.siswaapp.theme.DangerRed
import com.example.siswaapp.theme.MutedTextGray
import com.example.siswaapp.theme.PrimaryBlue
import com.example.siswaapp.theme.SecondarySlate
import com.example.siswaapp.theme.SuccessGreen
import com.example.siswaapp.theme.SurfaceWhite
import com.example.siswaapp.ui.components.UiState
import com.example.siswaapp.ui.features.cart.CartViewModel
import com.example.siswaapp.ui.features.home.HomeViewModel
import com.example.siswaapp.ui.features.home.formatPrice
import com.example.siswaapp.ui.features.home.getFullImageUrl

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MenuDetailScreen(
    menuId: Int,
    homeViewModel: HomeViewModel,
    cartViewModel: CartViewModel,
    onBackClick: () -> Unit
) {
    val context = LocalContext.current
    val menuState by homeViewModel.menuState.collectAsState()
    val menu = (menuState as? UiState.Success)?.data?.find { it.id == menuId }

    var quantity by remember { mutableIntStateOf(1) }
    val isAvailable = menu != null && menu.stock > 0 && menu.status

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Detail Menu", fontWeight = FontWeight.Bold, color = Color.White) },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = PrimaryBlue)
            )
        },
        bottomBar = {
            if (menu != null) {
                androidx.compose.material3.Surface(
                    modifier = Modifier.fillMaxWidth(),
                    tonalElevation = 8.dp,
                    color = SurfaceWhite
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        if (isAvailable) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                IconButton(
                                    onClick = { if (quantity > 1) quantity-- },
                                    modifier = Modifier
                                        .size(36.dp)
                                        .background(BackgroundLight, shape = CircleShape)
                                ) {
                                    Icon(Icons.Default.Remove, contentDescription = "Decrease", tint = SecondarySlate)
                                }
                                Text(
                                    text = quantity.toString(),
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = SecondarySlate,
                                    modifier = Modifier.padding(horizontal = 8.dp)
                                )
                                IconButton(
                                    onClick = { if (quantity < menu.stock) quantity++ },
                                    modifier = Modifier
                                        .size(36.dp)
                                        .background(BackgroundLight, shape = CircleShape)
                                ) {
                                    Icon(Icons.Default.Add, contentDescription = "Increase", tint = SecondarySlate)
                                }
                            }

                            Spacer(modifier = Modifier.width(16.dp))

                            Button(
                                onClick = {
                                    cartViewModel.addToCart(menu, quantity)
                                    Toast.makeText(context, "${menu.name} ditambahkan ke keranjang", Toast.LENGTH_SHORT).show()
                                    onBackClick()
                                },
                                modifier = Modifier
                                    .weight(1f)
                                    .height(48.dp),
                                shape = RoundedCornerShape(10.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue)
                            ) {
                                Text(
                                    text = "Tambah ke Keranjang",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = SurfaceWhite
                                )
                            }
                        } else {
                            Button(
                                onClick = {},
                                enabled = false,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(48.dp),
                                shape = RoundedCornerShape(10.dp),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = Color.LightGray,
                                    disabledContainerColor = Color.LightGray.copy(alpha = 0.5f)
                                )
                            ) {
                                Text(
                                    text = "Stok Habis",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.Gray
                                )
                            }
                        }
                    }
                }
            }
        },
        containerColor = BackgroundLight
    ) { innerPadding ->
        if (menu == null) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding),
                contentAlignment = Alignment.Center
            ) {
                Text(text = "Menu tidak ditemukan", fontWeight = FontWeight.SemiBold, color = DangerRed)
            }
            return@Scaffold
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(rememberScrollState())
        ) {
            // Menu Image Header (1/3 of the screen width/height ratio)
            Image(
                painter = rememberAsyncImagePainter(model = getFullImageUrl(menu.imageUrl)),
                contentDescription = menu.name,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(260.dp)
            )

            // Info Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceWhite),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    // Category Badge
                    Box(
                        modifier = Modifier
                            .background(PrimaryBlue.copy(alpha = 0.1f), shape = RoundedCornerShape(12.dp))
                            .padding(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = menu.category?.name ?: "Lain-lain",
                            color = PrimaryBlue,
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Title: 18sp Medium per PRD Typography specs
                    Text(
                        text = menu.name,
                        fontWeight = FontWeight.Medium,
                        fontSize = 18.sp,
                        color = SecondarySlate
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    // Price
                    Text(
                        text = formatPrice(menu.price),
                        fontWeight = FontWeight.Black,
                        fontSize = 24.sp,
                        color = PrimaryBlue
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // Stock and Status indicator
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Status Ketersediaan: ",
                            fontSize = 14.sp,
                            color = MutedTextGray
                        )
                        if (isAvailable) {
                            Text(
                                text = "Tersedia (Sisa ${menu.stock})",
                                fontSize = 14.sp,
                                color = SuccessGreen,
                                fontWeight = FontWeight.Bold
                            )
                        } else {
                            Text(
                                text = "Habis / Tidak Aktif",
                                fontSize = 14.sp,
                                color = DangerRed,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Description text
                    Text(
                        text = "Deskripsi Menu",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = SecondarySlate
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Menu lezat buatan kantin sekolah Dubes, dimasak segar setiap hari menggunakan bahan berkualitas tinggi dan dijamin kebersihannya.",
                        fontSize = 14.sp,
                        color = MutedTextGray,
                        lineHeight = 20.sp
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // Add-ons Section per PRD redesign specs
                    Text(
                        text = "Pilihan Ekstra (Add-ons)",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = SecondarySlate
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    var extraSauce by remember { mutableStateOf(false) }
                    var extraCheese by remember { mutableStateOf(false) }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        AddOnChip(name = "Ekstra Saus", isSelected = extraSauce, onClick = { extraSauce = !extraSauce })
                        AddOnChip(name = "Ekstra Keju", isSelected = extraCheese, onClick = { extraCheese = !extraCheese })
                    }
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
fun AddOnChip(
    name: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .background(
                if (isSelected) PrimaryBlue.copy(alpha = 0.1f) else BackgroundLight,
                shape = RoundedCornerShape(8.dp)
            )
            .clickable { onClick() }
            .padding(horizontal = 12.dp, vertical = 6.dp)
    ) {
        Text(
            text = name,
            color = if (isSelected) PrimaryBlue else MutedTextGray,
            fontWeight = FontWeight.SemiBold,
            fontSize = 12.sp
        )
    }
}
