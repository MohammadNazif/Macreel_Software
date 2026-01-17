import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';

// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatSelectModule } from '@angular/material/select';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ReactiveFormsModule } from '@angular/forms';

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
    // BrowserAnimationsModule,
    // MatFormFieldModule,
    // MatSelectModule,
    // ReactiveFormsModule,
    HttpClientModule,
     SweetAlert2Module.forRoot() 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
