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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UsersComponent },
  { path: 'users/:id', component: UserComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'edit-profile', canActivate: [AuthGuard], component: EditProfileComponent },
  { path: '**', component: NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
