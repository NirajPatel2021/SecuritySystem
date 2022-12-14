import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FaqComponent } from './components/faq/faq.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { CameraComponent } from './components/camera/camera.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import {RecordsComponent} from "./components/records/records.component";
import { ProfileComponent } from "./components/profile/profile.component";
import {PasswordResetComponent} from "./components/password-reset/password-reset.component";
import {ChangePasswordComponent} from "./components/change-password/change-password.component";
import { AuthPageComponent } from './components/auth-page/auth-page.component';
import {EnterTokenComponent} from "./components/enter-token/enter-token.component";
import {PreferencesComponent} from "./components/preferences/preferences.component";
import {PathGuard} from "./components/guards/path.guard";
import { NeighborsComponent } from './components/neighbors/neighbors.component';
import { MediaInfoComponent } from './components/media-info/media-info.component';
import { MyDevicesComponent } from './components/my-devices/my-devices.component';
import { MediaInfoVideoComponent } from './components/media-info-video/media-info-video.component';


const routes: Routes = [

  {path: 'camera', component: CameraComponent, canActivate: [PathGuard]},
  {path: 'camera/:id', component: CameraComponent, canActivate: [PathGuard]},
  {path: 'faq', component: FaqComponent},
  {path: 'about-us', component: AboutUsComponent},
  {path: 'login', component:  LoginComponent},
  {path:'register', component: RegisterComponent},
  {path:'records', component: RecordsComponent},
  {path:'records/:deviceId', component: RecordsComponent, canActivate: [PathGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [PathGuard]},
  {path:'password-reset', component: PasswordResetComponent},
  {path: 'enter-token', component: EnterTokenComponent},
  {path:'change-password', component: ChangePasswordComponent},
  {path: 'auth', component: AuthPageComponent},
  {path: 'preferences', component: PreferencesComponent, canActivate: [PathGuard]},
  {path: 'home', component: HomeComponent},
  {path: 'neighbors', component: NeighborsComponent, canActivate: [PathGuard]},
  {path: 'devices', component: MyDevicesComponent, canActivate: [PathGuard]},
  {path: 'media-info/:id', component: MediaInfoComponent, canActivate: [PathGuard]},
  {path: 'media-info-video/:id', component: MediaInfoVideoComponent, canActivate: [PathGuard]},
  {path: '**', component: HomeComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
