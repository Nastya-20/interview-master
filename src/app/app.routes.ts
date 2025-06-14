import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AngularComponent } from './components/angular/angular.component';
import { TypescriptComponent } from './components/typescript/typescript.component';
import { JavascriptComponent } from './components/javascript/javascript.component';
import { RxjsComponent } from './components/rxjs/rxjs.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'angular', component: AngularComponent  },
  { path: 'typescript', component: TypescriptComponent },
  { path: 'javascript', component: JavascriptComponent },
  { path: 'rxjs', component: RxjsComponent  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
