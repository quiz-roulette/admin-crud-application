import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticationComponent } from './authentication/authentication.component';
import { QuestionComponent } from './questions/question.component';
import { UserGuard } from './guard/User.guard';
import { UserComponent } from './component/users/user.component';
import { CategoryComponent } from './component/categories/category.component';

const routes: Routes = [
  { path: 'login', component: AuthenticationComponent },
  { path: '', component: AuthenticationComponent },
  { path: 'questions', component: QuestionComponent, canActivate:[UserGuard] },
  { path: 'users', component: UserComponent, canActivate:[UserGuard] },
  { path: 'categories', component: CategoryComponent, canActivate:[UserGuard] }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

export const routableComponents = [
    AuthenticationComponent,
    QuestionComponent,
    UserComponent,
    CategoryComponent
];