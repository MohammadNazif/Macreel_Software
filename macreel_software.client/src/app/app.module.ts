import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CommonModule, DatePipe } from '@angular/common';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { authInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,  
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
   

    NgxUiLoaderModule.forRoot({
      fgsType: 'ball-spin-fade-rotating',
      fgsColor: '#ffffff',
      pbColor: '#ffffff'
    }),
    NgxUiLoaderModule,
        NgxUiLoaderHttpModule.forRoot({
      showForeground: true,
      excludeRegexp : [
    'api/Admin/getAllProject',
    'api/Auth/refresh'
  ]
    }),
    HttpClientModule,
     SweetAlert2Module.forRoot() 
  ],
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
