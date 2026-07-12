package com.example.siswaapp.ui.features.wishlist

import androidx.compose.foundation.Image
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
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
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
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
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
import com.example.siswaapp.data.remote.dto.MenuDto
import com.example.siswaapp.theme.BackgroundLight
import com.example.siswaapp.theme.DangerRed
import com.example.siswaapp.theme.MutedTextGray
import com.example.siswaapp.theme.PrimaryBlue
import com.example.siswaapp.theme.SecondarySlate
import com.example.siswaapp.theme.SurfaceWhite
import com.example.siswaapp.ui.features.cart.CartViewModel
import com.example.siswaapp.ui.features.home.HomeViewModel
import com.example.siswaapp.ui.features.home.formatPrice
import com.example.siswaapp.ui.features.home.getFullImageUrl
import android.widget.Toast

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WishlistScreen(
    homeViewModel: HomeViewModel,
    cartViewModel: CartViewModel,
    onMenuClick: (Int) -> Unit
) {
    val context = LocalContext.current
    val wishlistItems by homeViewModel.wishlistItems.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Favorit Saya",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = Color.White
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = PrimaryBlue)
            )
        },
        containerColor = BackgroundLight
    ) { innerPadding ->
        if (wishlistItems.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "Belum Ada Menu Favorit",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = SecondarySlate
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Tandai menu kesukaanmu untuk disimpan di sini.",
                        fontSize = 12.sp,
                        color = MutedTextGray
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(wishlistItems) { menu ->
                    WishlistItemRow(
                        menu = menu,
                        onClick = { onMenuClick(menu.id) },
                        onRemoveClick = { homeViewModel.toggleWishlist(menu) },
                        onAddToCartClick = {
                            cartViewModel.addToCart(menu, 1)
                            Toast.makeText(context, "${menu.name} ditambahkan ke keranjang", Toast.LENGTH_SHORT).show()
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun WishlistItemRow(
    menu: MenuDto,
    onClick: () -> Unit,
    onRemoveClick: () -> Unit,
    onAddToCartClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceWhite),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Image(
                painter = rememberAsyncImagePainter(model = getFullImageUrl(menu.imageUrl)),
                contentDescription = menu.name,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .size(72.dp)
                    .clip(RoundedCornerShape(8.dp))
            )

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = menu.name,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = SecondarySlate
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = formatPrice(menu.price),
                    fontWeight = FontWeight.ExtraBold,
                    fontSize = 14.sp,
                    color = PrimaryBlue
                )
            }

            Row(verticalAlignment = Alignment.CenterVertically) {
                // Delete/Remove Favorite button
                IconButton(onClick = onRemoveClick) {
                    Icon(
                        imageVector = Icons.Default.Delete,
                        contentDescription = "Hapus dari Favorit",
                        tint = DangerRed
                    )
                }

                Spacer(modifier = Modifier.width(4.dp))

                // Quick Add to Cart
                if (menu.stock > 0 && menu.status) {
                    IconButton(
                        onClick = onAddToCartClick,
                        modifier = Modifier
                            .background(PrimaryBlue, shape = CircleShape)
                            .size(36.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = "Tambah ke Keranjang",
                            tint = Color.White,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }
        }
    }
}
