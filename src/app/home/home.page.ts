import { Component } from '@angular/core';

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

  addPost() {
    this.post = {
      userName: 'Kohki Nakamura',
      message: this.message,
      createdDate: '数秒前',
    };

    this.posts.push(this.post);
    this.message = '';
  }

  constructor() {}
}