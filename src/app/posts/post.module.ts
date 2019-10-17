import { NgModule } from '@angular/core';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { AppRoutingModule } from '../app-routing.module';
import { CommonModule } from '@angular/common';



@NgModule({
declarations :[
    PostListComponent,
    PostCreateComponent, 
],
imports:[
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AppRoutingModule
]
})
export class PostModule{

}