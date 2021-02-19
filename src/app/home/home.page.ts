import { Component, OnInit } from '@angular/core';
import{ AlertController, ToastController }from'@ionic/angular';
import * as moment from 'moment';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import * as admin from 'firebase-admin';

// 定義したインターフェースをインポート
import { Post } from '../models/post';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  userData: any; // Save logged in user data
  message: string;
  post: Post;
  posts: Post[];

  // Firestoreのコレクションを扱うプロパティ
  postsCollection: AngularFirestoreCollection<Post>;

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private afStore: AngularFirestore,
    private afAuth: AngularFireAuth, 
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
    // コンポーネントの初期化時に、投稿を読み込むgetPosts()を実行
    this.getPosts();
  }

  addPost() {
    // ****************************************************
    // サーバータイムが取得できないので new Date() で取得しています
    // ****************************************************
    this.post = {
      id: '',
      userName: this.userData.displayName,
      message: this.message,
      created: new Date(),
      // created: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Firestoreにデータを追加
    this.afStore.collection('posts').add(this.post)
    .then(docRef => {
      // 投稿後にidを更新する
      this.postsCollection.doc(docRef.id).update({
        id: docRef.id
      });
      // 追加できたら入力フィールドを空にする
      this.message = '';
    })
    .catch(async error => {
      // エラーをToastControllerで表示
      const toast = await this.toastCtrl.create({
        message: error.toString(),
        duration: 3000,
      });
      await toast.present();
    });
  }

  // Firestoreから投稿データを読み込む
  getPosts() {
    // コレクションの参照をここで取得している
    this.postsCollection = this.afStore.collection(
      'posts', ref => ref.orderBy('created', 'desc')
    );

    // データに変更があったらそれを受け取ってpostsに入れる
    this.postsCollection.valueChanges().subscribe(data => {
      this.posts = data;
    });
  }

  async presentPrompt(post: Post) {
    const alert = await this.alertCtrl.create({
      header: 'メッセージ編集',
      inputs: [
        {
          name: 'message',
          type: 'text',
          placeholder: 'メッセージ',
        }
      ],
      buttons: [
        {
          text: 'キャンセル',
          role: 'cancel',
          handler: () => {
            console.log('キャンセルが選択されました');
          }
        },
        {
          text: '更新',
          handler: data => {
            // 投稿を更新するメソッドを実行
            this.updatePost(post, data.message);
          }
        }
      ]
    });
    await alert.present();
  }

  // メッセージをアップデートする
  // 更新されると投稿とメッセージを受け取る
  updatePost(post: Post, message: string) {
    // 入力されたメッセージで投稿を更新
    this.postsCollection.doc(post.id).update({
      message: message,
    })
    .then(async () => {
      const toast = await this.toastCtrl.create({
        message: '投稿が更新されました',
        duration: 3000,
      });
      await toast.present();
    })
    .catch(async error => {
      const toast = await this.toastCtrl.create({
        message: error.toString(),
        duration: 3000,
      });
      await toast.present();
    });
  }

  // 投稿を削除する
  deletePost(post: Post) {
    // 受け取った投稿のidを参照して削除
    this.postsCollection.doc(post.id).delete()
    .then(async () => {
      const toast = await this.toastCtrl.create({
        message: '投稿が削除されました',
        duration: 3000,
      });
      await toast.present();
    })
    .catch(async error => {
      const toast = await this.toastCtrl.create({
        message: error.toString(),
        duration: 3000,
      });
      await toast.present();
    });
  }

  differenceTime(time: Date): string {
    moment.locale('ja');
    return moment(time).fromNow();
  }
}