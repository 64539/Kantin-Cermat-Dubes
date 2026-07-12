package com.example.siswaapp.di

import android.content.Context
import com.example.siswaapp.data.local.datastore.AuthPreferences
import com.example.siswaapp.data.repository.AuthRepositoryImpl
import com.example.siswaapp.data.repository.MenuRepositoryImpl
import com.example.siswaapp.data.repository.OrderRepositoryImpl
import com.example.siswaapp.domain.repository.AuthRepository
import com.example.siswaapp.domain.repository.MenuRepository
import com.example.siswaapp.domain.repository.OrderRepository
import dagger.Binds
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class AppModule {

    @Binds
    @Singleton
    abstract fun bindAuthRepository(
        authRepositoryImpl: AuthRepositoryImpl
    ): AuthRepository

    @Binds
    @Singleton
    abstract fun bindMenuRepository(
        menuRepositoryImpl: MenuRepositoryImpl
    ): MenuRepository

    @Binds
    @Singleton
    abstract fun bindOrderRepository(
        orderRepositoryImpl: OrderRepositoryImpl
    ): OrderRepository

    companion object {
        @Provides
        @Singleton
        fun provideAuthPreferences(
            @ApplicationContext context: Context
        ): AuthPreferences {
            return AuthPreferences(context)
        }
    }
}
