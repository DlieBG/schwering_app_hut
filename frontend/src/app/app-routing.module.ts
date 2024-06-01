import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WidgetComponent } from './components/widget/widget.component';

const routes: Routes = [
  { path: '', component: HomeComponent, },
  { path: 'widget', component: WidgetComponent, },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
