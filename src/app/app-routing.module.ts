import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticationComponent } from './authentication/authentication.component';
import { QuestionComponent } from './questions/question.component';
import { UserGuard } from './guard/User.guard';
import { UserComponent } from './component/users/user.component';
import { CategoryComponent } from './component/categories/category.component';
import { GroupComponent } from './component/groups/group.component';
import { AssignUserComponent } from './component/groups/assign-user/assign-user.component';
import { AssignGroupComponent } from './component/users/assign-group/assign-group.component';
import { QuizComponent } from './component/quizes/quiz.component';
import { OneTimeQuizComponent } from './component/one-time-quiz/one-time-quiz.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';

const routes: Routes = [
  { path: 'login', component: AuthenticationComponent },
  { path: '', component: AuthenticationComponent },
  { path: 'questions', component: QuestionComponent, canActivate:[UserGuard] },
  { path: 'users', component: UserComponent, canActivate:[UserGuard] },
  { path: 'categories', component: CategoryComponent, canActivate:[UserGuard] },
  { path: 'groups', component: GroupComponent, canActivate:[UserGuard] },
  { path: 'quizes', component: QuizComponent, canActivate:[UserGuard] },
  { path: 'assign-users/:groupname', component: AssignUserComponent, canActivate:[UserGuard] },
  { path: 'assign-groups/:quizuserid', component: AssignGroupComponent, canActivate:[UserGuard] },
  { path: 'onetimequiz',component: OneTimeQuizComponent, canActivate:[UserGuard]},
  { path: 'dashboard/:quizname',component: DashboardComponent, canActivate:[UserGuard]}
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
    CategoryComponent,
    QuizComponent,
    GroupComponent,
    AssignUserComponent,
    AssignGroupComponent,
    OneTimeQuizComponent,
    DashboardComponent
];