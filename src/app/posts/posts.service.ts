import { Post } from './post.model';
import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import{HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import{Router} from '@angular/router';

@Injectable({providedIn : 'root'})
export class PostsService{
    private posts:Post[]=[];
    private postsUpdated= new Subject<{posts: Post[],postCount : number}>();
    constructor(private http : HttpClient,
                private router:Router){}

    getPosts(postsPerPage:number,currentPage:number){
        const queryParams=`?pageSize=${postsPerPage}&page=${currentPage}`;
        this.http.get<{message :string,posts:any,maxPosts:number}>('http://localhost:3000/api/posts' +queryParams)
        .pipe(map((postData)=>{
        return { posts: postData.posts.map((post)=>{
        return {
           title :post.title,
           content:post.content,
           id:post._id,
           imagePath:post.imagePath,
           creator : post.creator
        }
        }),
        maxPosts:postData.maxPosts
    }
        }))
        .subscribe((transformedPostsData)=>{
            console.log(transformedPostsData);
            this.posts=transformedPostsData.posts;
            this.postsUpdated.next({posts:[...this.posts],postCount:transformedPostsData.maxPosts});
        });
        //return [...this.posts];
    }
    getPostsUpdatedListner(){
        return this.postsUpdated.asObservable();
    }

    getPost(id:string){

        return this.http.get<{_id:string,title:string,content:string,imagePath:string}>('http://localhost:3000/api/posts/'+id);

    }

    updatePost(id:string,title:string,content:string,image:File | string){
  console.log('Update Service',id,title,content,null);
        let postData : Post | FormData;
        if(typeof(image) === 'object'){
         postData = new FormData();
         postData.append("id",id);
         postData.append("title",title);
         postData.append("content",content);
         postData.append("image",image,title);
         console.log('Postsif',postData);
         
        }
        else {
           postData ={
                id:id,
                title:title,
                content:content,
                imagePath:image
            }

        }

        console.log('Postsssss',postData);
        this.http.put('http://localhost:3000/api/posts/'+id,postData)
        .subscribe((responseData
            )=>{
              
            //     const updatedPosts=[...this.posts];
            //    const oldPostIndex=updatedPosts.findIndex(p=>p.id === id);
            //    const post:Post={
            //     id:id,
            //     title:title,
            //     content:content,
            //     imagePath:""
                   
            //    }
            //    updatedPosts[oldPostIndex]=post;
            //     this.posts=updatedPosts;
            //     this.postsUpdated.next([...this.posts]);
                this.router.navigate(['/']);

        })
        
    }
    addPosts(title:string,content:string,image:File){
        // const post = {
        //     id : null,
        //     title  : title,
        //     content : content
        // }

        const PostData= new FormData();
        PostData.append("title",title);
        PostData.append("content",content);
        PostData.append("image",image,title);
        this.http.post<{message:string,post:Post}>('http://localhost:3000/api/posts',PostData)
        .subscribe((responseData)=>{
        //     const post:Post={id:responseData.post.id,title:title,content:content,
        //     imagePath:responseData.post.imagePath}
         
        //     this.posts.push(post);
        // this.postsUpdated.next([...this.posts])
        this.router.navigate(['/']);
        })

        

        
    }

    deletePosts(postId : string){
        return this.http.delete('http://localhost:3000/api/posts/'+postId)
        // .subscribe(()=>{
        //     const updatedPosts=this.posts.filter(
        //         post=>post.id!==postId);
        //        this.posts=updatedPosts;
        //        this.postsUpdated.next([...this.posts])
           
        // })
    }
}