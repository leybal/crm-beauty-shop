import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxCarouselModule } from 'ngx-carousel';

import { AlertComponent } from './directives';
import { AuthGuard } from './guards';
import { AlertService, AuthenticationService, UserService, EntryService, PushService } from './services';
import { JwtInterceptor } from './helpers';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBarModule, MatDialogModule, MatCardModule, MatButtonModule } from '@angular/material';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { LoginComponent } from './pages/login/login.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { RegisterComponent } from './pages/register/register.component';
import { UsersComponent } from './pages/users/users.component';
import { UserComponent } from './pages/user/user.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { EntriesComponent } from './shared/entries/entries.component';
import { EntriesListComponent } from './pages/entries-list/entries-list.component';
import { SearchFilterPipe, SearchStatusPipe, SearchDatePipe } from './pipes';
import { CarouselComponent } from './shared/carousel/carousel.component';
import { SliderComponent } from './shared/slider/slider.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { UpdatePasswordComponent } from './pages/update-password/update-password.component';
import { DialogComponent } from './shared/dialog/dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    NotfoundComponent,
    RegisterComponent,
    UsersComponent,
    AlertComponent,
    UserComponent,
    EditProfileComponent,
    EntriesComponent,
    EntriesListComponent,
    SearchFilterPipe,
    SearchStatusPipe,
    SearchDatePipe,
    CarouselComponent,
    SliderComponent,
    ForgotPasswordComponent,
    UpdatePasswordComponent,
    DialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    NgxCarouselModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  entryComponents: [
    DialogComponent
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    EntryService,
    PushService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
