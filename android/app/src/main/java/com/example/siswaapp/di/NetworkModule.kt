package com.example.siswaapp.di

import com.example.siswaapp.data.local.datastore.AuthEventBus
import com.example.siswaapp.data.local.datastore.AuthPreferences
import com.example.siswaapp.data.remote.api.ApiService
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    private const val BASE_URL = "http://10.0.2.2:3000/"

    @Provides
    @Singleton
    fun provideAuthInterceptor(
        authPreferences: AuthPreferences,
        authEventBus: AuthEventBus
    ): Interceptor {
        return Interceptor { chain ->
            val token = runBlocking { authPreferences.authToken.first() }
            val request = chain.request().newBuilder()
            if (!token.isNullOrBlank()) {
                request.addHeader("Authorization", "Bearer $token")
            }
            val response = chain.proceed(request.build())
            if (response.code == 401) {
                runBlocking {
                    authPreferences.clearSession()
                }
                authEventBus.triggerUnauthorized()
            }
            response
        }
    }

    @Provides
    @Singleton
    fun provideLoggingInterceptor(): HttpLoggingInterceptor {
        return HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }
    }

    @Provides
    @Singleton
    fun provideOkHttpClient(
        authInterceptor: Interceptor,
        loggingInterceptor: HttpLoggingInterceptor
    ): OkHttpClient {
        return OkHttpClient.Builder()
            .addInterceptor(authInterceptor)
            .addInterceptor(loggingInterceptor)
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(15, TimeUnit.SECONDS)
            .build()
    }

    @Provides
    @Singleton
    fun provideApiService(okHttpClient: OkHttpClient): ApiService {
        return Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}
