import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription} from 'rxjs';
import {Post} from '../post.model';
import{PostsService} from '../posts.service';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector : 'app-post-list',
    templateUrl : './post-list.component.html',
    styleUrls:['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {
    // posts=[
    //     {title:'First Post',content:'This is my First post\'s content'},
    //     {title:'Second Post',content:'This is my Second post\'s content'},
    //     {title:'Third Post',content:'This is my Third post\'s content'},

    // ]
    posts:Post[]=[];
    isLoading=false;
    totalPosts=10;
    currentpage=1;
    postsPerPage=2;
    pageSizeOptions=[1,2,5,10];
    userIsAuthenticated=false;
    private postSub : Subscription;
    private authStatusSub:Subscription;
    
    constructor(public postsService : PostsService,public authService : AuthService){

    }

    ngOnInit(){
        this.isLoading=true;
        this.postsService.getPosts(this.postsPerPage,this.currentpage);
     
        this.postSub=this.postsService.getPostsUpdatedListner()
        .subscribe(
            (postData:{posts:Post[],postCount:number})=>{
                this.isLoading=false;
                this.totalPosts=postData.postCount
                this.posts=postData.posts;
                console.log('List',this.posts);
            }
        )
        this.userIsAuthenticated=this.authService.getIsAuth();

        this.authStatusSub=this.authService.getAuthStatusListner()
        .subscribe(isAuthenticated=>{
          this.userIsAuthenticated=isAuthenticated;
        })
    }

    onDelete(postId : string){
        this.isLoading=true;
        this.postsService.deletePosts(postId).subscribe(
            ()=>{
                this.postsService.getPosts(this.postsPerPage,this.currentpage)
            }
        );

    }
    onChangedPage(pageData:PageEvent){
        this.isLoading=true;
        this.currentpage=pageData.pageIndex +1 ;
        this.postsPerPage=pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage,this.currentpage);
        console.log('pageData',pageData);
    }

    ngOnDestroy(){
        this.postSub.unsubscribe();
        this.authStatusSub.unsubscribe();

    }


}