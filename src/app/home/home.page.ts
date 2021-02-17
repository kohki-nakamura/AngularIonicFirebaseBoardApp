import { Component } from '@angular/core';
import{AlertController}from'@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  post: {
    userName: string,
    message: string,
    createdDate: any,
  };
  message: string;

  posts: { userName: string, message: string, createdDate: any }[] = [
    {
      userName: 'test1',
      message: 'これはテストメッセージ1です',
      createdDate: '10分前',
    },
    {
      userName: 'test2',
      message: 'これはテストメッセージ2です',
      createdDate: '10分前',
    },
  ];

  constructor(private alertCtrl: AlertController) {}

  addPost() {
    this.post = {
      userName: 'Kohki Nakamura',
      message: this.message,
      createdDate: '数秒前',
    };

    this.posts.push(this.post);
    this.message = '';
  }

  async presentPrompt(index: number) {
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
          handler: date => {
            console.log(date);
            this.posts[index].message = date.message;
          }
        }
      ]
    });
    await alert.present();
  }
}