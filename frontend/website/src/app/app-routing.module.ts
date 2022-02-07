import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {FaqComponent} from "./faq/faq.component";
import {AboutUsComponent} from "./about-us/about-us.component";
import {CameraComponent} from "./camera/camera.component";

const routes: Routes = [

  {path: 'home', component: HomeComponent},
  {path: 'camera', component: CameraComponent},
  {path: 'faq', component: FaqComponent},
  {path: 'about-us', component: AboutUsComponent},
  {path: '**', component: HomeComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
