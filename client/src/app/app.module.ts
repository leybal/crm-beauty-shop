import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AlertComponent } from './directives/index';
import { AuthGuard } from './guards/index';
import { AlertService, AuthenticationService, UserService, EntryService } from './services/index';
import { JwtInterceptor } from './helpers/index';

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
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { EntriesComponent } from './shared/entries/entries.component';
import { EntriesListComponent } from './pages/entries-list/entries-list.component';
import {SearchStatusPipe} from "./pipes/searchStatus.pipe";
import {SearchDatePipe} from "./pipes/search-date";


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
    SearchFilterPipe,
    EntriesComponent,
    EntriesListComponent,
    SearchStatusPipe,
    SearchDatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule.forRoot()
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    EntryService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
