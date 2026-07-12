package com.example.siswaapp.ui.features.home

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
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
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import android.widget.Toast
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberAsyncImagePainter
import com.example.siswaapp.data.remote.dto.MenuDto
import com.example.siswaapp.theme.BackgroundLight
import com.example.siswaapp.theme.DangerRed
import com.example.siswaapp.theme.MutedTextGray
import com.example.siswaapp.theme.PrimaryBlue
import com.example.siswaapp.theme.SecondarySlate
import com.example.siswaapp.theme.SuccessGreen
import com.example.siswaapp.theme.SurfaceWhite
import com.example.siswaapp.ui.components.UiState
import com.example.siswaapp.ui.features.cart.CartViewModel

@Composable
fun ShimmerPlaceholder(modifier: Modifier = Modifier) {
    val shimmerColors = listOf(
        Color(0xFFE2E8F0),
        Color(0xFFF8FAFC),
        Color(0xFFE2E8F0)
    )

    val transition = rememberInfiniteTransition(label = "shimmer_transition")
    val translateAnim by transition.animateFloat(
        initialValue = 0f,
        targetValue = 1000f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "shimmer_translate"
    )

    val brush = Brush.linearGradient(
        colors = shimmerColors,
        start = Offset(x = translateAnim - 350f, y = translateAnim - 350f),
        end = Offset(x = translateAnim, y = translateAnim)
    )

    Box(
        modifier = modifier.background(brush)
    )
}

@Composable
fun ShimmerMenuCard() {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(200.dp),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceWhite),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column {
            ShimmerPlaceholder(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp)
                    .clip(RoundedCornerShape(topStart = 12.dp, topEnd = 12.dp))
            )
            Column(modifier = Modifier.padding(12.dp)) {
                ShimmerPlaceholder(
                    modifier = Modifier
                        .fillMaxWidth(0.8f)
                        .height(16.dp)
                        .clip(RoundedCornerShape(4.dp))
                )
                Spacer(modifier = Modifier.height(8.dp))
                ShimmerPlaceholder(
                    modifier = Modifier
                        .fillMaxWidth(0.5f)
                        .height(14.dp)
                        .clip(RoundedCornerShape(4.dp))
                )
            }
        }
    }
}

fun getFullImageUrl(imageUrl: String?): String {
    if (imageUrl.isNullOrBlank()) return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"
    if (imageUrl.startsWith("http")) {
        return imageUrl.replace("localhost", "10.0.2.2")
    }
    return "http://10.0.2.2:3000/$imageUrl"
}

fun formatPrice(price: Double): String {
    return String.format("Rp %,.0f", price).replace(",", ".")
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    homeViewModel: HomeViewModel,
    cartViewModel: CartViewModel,
    userName: String,
    onMenuClick: (Int) -> Unit,
    onCartClick: () -> Unit
) {
    val context = LocalContext.current
    val menuState by homeViewModel.menuState.collectAsState()
    val searchQuery by homeViewModel.searchQuery.collectAsState()
    val selectedCategoryId by homeViewModel.selectedCategoryId.collectAsState()
    val cartItems by cartViewModel.cartItems.collectAsState()

    val totalCartCount = cartItems.sumOf { it.quantity }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Kantin Cermat",
                            fontWeight = FontWeight.ExtraBold,
                            fontSize = 20.sp,
                            color = Color.White
                        )
                        Text(
                            text = "SMKN 12 JAKARTA",
                            fontWeight = FontWeight.Normal,
                            fontSize = 12.sp,
                            color = Color.White.copy(alpha = 0.8f)
                        )
                    }
                },
                actions = {
                    BadgedBox(
                        badge = {
                            if (totalCartCount > 0) {
                                Badge(containerColor = Color.Red) {
                                    Text(
                                        text = totalCartCount.toString(),
                                        color = Color.White,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        },
                        modifier = Modifier.padding(end = 16.dp)
                    ) {
                        IconButton(onClick = onCartClick) {
                            Icon(
                                Icons.Default.ShoppingCart,
                                contentDescription = "Cart Button",
                                tint = Color.White
                            )
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = PrimaryBlue)
            )
        },
        containerColor = BackgroundLight
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            // Header Section
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Halo, $userName",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = SecondarySlate
                    )
                    Text(
                        text = "Mau makan apa hari ini?",
                        fontSize = 14.sp,
                        color = MutedTextGray
                    )
                }
            }

            // Search Input
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { homeViewModel.searchMenus(it) },
                placeholder = { Text("Cari makanan, minuman, cemilan...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search Icon", tint = PrimaryBlue) },
                singleLine = true,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = SurfaceWhite,
                    unfocusedContainerColor = SurfaceWhite,
                    focusedBorderColor = PrimaryBlue,
                    unfocusedBorderColor = MutedTextGray
                )
            )

            // Category Filter Row
            val scrollState = rememberScrollState()
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(scrollState)
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                CategoryChip(
                    name = "Semua",
                    isSelected = selectedCategoryId == null,
                    onClick = { homeViewModel.selectCategory(null) }
                )
                CategoryChip(
                    name = "Makanan Utama",
                    isSelected = selectedCategoryId == 4,
                    onClick = { homeViewModel.selectCategory(4) }
                )
                CategoryChip(
                    name = "Minuman Segar",
                    isSelected = selectedCategoryId == 5,
                    onClick = { homeViewModel.selectCategory(5) }
                )
                CategoryChip(
                    name = "Cemilan & Snack",
                    isSelected = selectedCategoryId == 6,
                    onClick = { homeViewModel.selectCategory(6) }
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Main Menu List Grid
            when (val state = menuState) {
                is UiState.Loading -> {
                    LazyVerticalGrid(
                        columns = GridCells.Fixed(2),
                        contentPadding = PaddingValues(12.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        items(6) {
                            ShimmerMenuCard()
                        }
                    }
                }
                is UiState.Error -> {
                    Box(modifier = Modifier.fillMaxSize().padding(24.dp), contentAlignment = Alignment.Center) {
                        Text(
                            text = state.message,
                            color = DangerRed,
                            textAlign = TextAlign.Center,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
                is UiState.Success -> {
                    val menus = state.data
                    if (menus.isEmpty()) {
                        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                            Text(
                                text = "Tidak ada menu yang tersedia.",
                                color = SecondarySlate.copy(alpha = 0.6f),
                                fontWeight = FontWeight.Medium
                            )
                        }
                    } else {
                        LazyVerticalGrid(
                            columns = GridCells.Fixed(2),
                            contentPadding = PaddingValues(12.dp),
                            horizontalArrangement = Arrangement.spacedBy(12.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp),
                            modifier = Modifier.fillMaxSize()
                        ) {
                            items(menus) { menu ->
                                MenuCard(
                                    menu = menu,
                                    onClick = { onMenuClick(menu.id) },
                                    onAddToCartClick = { clickedMenu ->
                                        cartViewModel.addToCart(clickedMenu, 1)
                                        Toast.makeText(context, "${clickedMenu.name} ditambahkan ke keranjang", Toast.LENGTH_SHORT).show()
                                    },
                                    isWishlisted = { homeViewModel.isWishlisted(it) },
                                    onWishlistToggle = { homeViewModel.toggleWishlist(it) }
                                )
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
fun CategoryChip(
    name: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(20.dp))
            .background(if (isSelected) PrimaryBlue else SurfaceWhite)
            .clickable { onClick() }
            .padding(horizontal = 16.dp, vertical = 8.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = name,
            color = if (isSelected) Color.White else SecondarySlate,
            fontWeight = FontWeight.Bold,
            fontSize = 14.sp
        )
    }
}

@Composable
fun MenuCard(
    menu: MenuDto,
    onClick: () -> Unit,
    onAddToCartClick: (MenuDto) -> Unit,
    isWishlisted: (Int) -> Boolean,
    onWishlistToggle: (MenuDto) -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceWhite),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column {
            Box {
                Image(
                    painter = rememberAsyncImagePainter(model = getFullImageUrl(menu.imageUrl)),
                    contentDescription = menu.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(120.dp)
                        .clip(RoundedCornerShape(topStart = 12.dp, topEnd = 12.dp))
                )

                // Favorite (Heart) button per PRD redesign specs
                val isFav = isWishlisted(menu.id)
                IconButton(
                    onClick = { onWishlistToggle(menu) },
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(4.dp)
                        .background(Color.Black.copy(alpha = 0.3f), shape = CircleShape)
                        .size(28.dp)
                ) {
                    Icon(
                        imageVector = if (isFav) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                        contentDescription = "Favorite",
                        tint = if (isFav) Color.Red else Color.White,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            Column(modifier = Modifier.padding(12.dp)) {
                Text(
                    text = menu.name,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = SecondarySlate,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = formatPrice(menu.price),
                    fontWeight = FontWeight.ExtraBold,
                    fontSize = 15.sp,
                    color = PrimaryBlue
                )

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    if (menu.stock > 0 && menu.status) {
                        Text(
                            text = "Stok: ${menu.stock}",
                            fontSize = 12.sp,
                            color = SuccessGreen,
                            fontWeight = FontWeight.Bold
                        )
                    } else {
                        Text(
                            text = "Habis",
                            fontSize = 12.sp,
                            color = DangerRed,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    if (menu.stock > 0 && menu.status) {
                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .background(PrimaryBlue, shape = CircleShape)
                                .clickable { onAddToCartClick(menu) },
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Add,
                                contentDescription = "Quick Add to Cart",
                                tint = Color.White,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun PromoBannerCard(
    title: String,
    desc: String
) {
    Card(
        modifier = Modifier
            .width(300.dp)
            .height(90.dp),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = PrimaryBlue)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(14.dp),
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = title,
                color = Color.White,
                fontWeight = FontWeight.Bold,
                fontSize = 15.sp
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = desc,
                color = Color.White.copy(alpha = 0.9f),
                fontSize = 12.sp,
                lineHeight = 16.sp
            )
        }
    }
}
