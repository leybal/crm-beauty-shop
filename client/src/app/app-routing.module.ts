import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import { UsersComponent } from "./pages/users/users.component";
import { UserComponent } from "./pages/user/user.component";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './guards/index';
import { NotfoundComponent } from "./pages/notfound/notfound.component";
import { EditProfileComponent } from "./pages/edit-profile/edit-profile.component";
import { EntriesListComponent } from "./pages/entries-list/entries-list.component";
import { ForgotPasswordComponent } from "./pages/forgot-password/forgot-password.component";
import { UpdatePasswordComponent } from "./pages/update-password/update-password.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UsersComponent },
  { path: 'users/:id', component: UserComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'edit-profile', canActivate: [AuthGuard], component: EditProfileComponent },
  { path: 'entries', canActivate: [AuthGuard], component: EntriesListComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'update-password', component: UpdatePasswordComponent },
  { path: '**', component: NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
