import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';

import { Post } from '../models/post';
import { Comment } from '../models/comment';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {
  userData: any; // Save logged in user data
  sourcePost: Post;
  message: string;
  comment: Comment;
  comments: Comment[];
  commentsCollection: AngularFirestoreCollection<Comment>;

  constructor(
    private toastCtrl: ToastController,
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private modalCtrl: ModalController,
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })

  }

  ngOnInit() {
    this.getComments();
  }

  getComments() {
    // 条件を指定して、投稿日時でソート
    this.commentsCollection = this.afStore.collection(
      'comments',
      ref => ref.where('sourcePostId', '==', this.sourcePost.id).orderBy('created', 'desc')
    );
    // コメントに変更があったときにコメント情報を更新
    this.commentsCollection.valueChanges().subscribe(
      data => { this.comments = data; }
    );
  }

  addComment() {
    this.comment = {
      userName: this.userData.displayName,
      message: this.message,
      created: new Date(),
      sourcePostId: this.sourcePost.id,
    };

    this.afStore.collection('comments').add(this.comment)
    .then(async () => {
      const toast = await this.toastCtrl.create({
        message: 'コメントを投稿しました',
        duration: 3000,
      });
      await toast.present();
      this.message = '';
    })
    .catch(async error => {
      const toast = await this.toastCtrl.create({
        message: error.toString(),
        duration: 3000,
      });
      await toast.present();
    });
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

}
