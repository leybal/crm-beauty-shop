import { Component } from '@angular/core';
import { NguCarousel } from '@ngu/carousel';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent {
  public items: object[] = [];

  public carouselConfig: NguCarousel;

  constructor() {
    this.items = [
      {
        title: 'slide 1',
        color: 'f1f1f1',
        src: 'https://s3.eu-central-1.amazonaws.com/aws-avatars/slider/slider-1.jpg',
        srcSm: 'https://s3.eu-central-1.amazonaws.com/aws-avatars/slider/sm-slider-1.jpg',
      },
      {
        title: 'slide 2',
        color: 'f1f1f1',
        src: 'https://s3.eu-central-1.amazonaws.com/aws-avatars/slider/slider-2.jpg',
        srcSm: 'https://s3.eu-central-1.amazonaws.com/aws-avatars/slider/sm-slider-2.jpg',
      },
      {
        title: 'slide 3',
        color: 'f1f1f1',
        src: 'https://s3.eu-central-1.amazonaws.com/aws-avatars/slider/slider-3.jpg',
        srcSm: 'https://s3.eu-central-1.amazonaws.com/aws-avatars/slider/sm-slider-3.jpg',
      }
    ];

    this.carouselConfig = {
      grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
      slide: 1,
      speed: 400,
      interval: 4000,
      load: 1,
      custom: 'banner',
      point: {
        visible: true,
        pointStyles: `
          .ngucarouselPoint {
            list-style-type: none;
            text-align: center;
            padding: 12px;
            margin: 0;  position: absolute; bottom: -50px;
            white-space: nowrap;
            overflow: auto;
            position: absolute;
            width: 100%;
            left: 0;
            box-sizing: border-box;
          }
          .ngucarouselPoint li {
            display: inline-block;
            border: 1px solid #ccc;
            border-radius: 0; width: 50px; height: 5px;
            background: rgba(255, 255, 255, 0.55);
            padding: 5px;
            margin: 0 3px;
            cursor: pointer;
            transition: .4s ease all;
          }
          .ngucarouselPoint li.active {
              background: #ccc;
              width: 55px;height: 10px;
          }
        `
      },
      loop: true,
      touch: true
    };
  }
}
