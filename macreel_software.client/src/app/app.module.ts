import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';

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
      showForeground: true
    }),
    HttpClientModule,
     SweetAlert2Module.forRoot() 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
