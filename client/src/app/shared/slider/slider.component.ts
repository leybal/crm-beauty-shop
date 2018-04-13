import {Component} from '@angular/core';
import {NgxCarousel} from 'ngx-carousel';


@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent {
  public items: object[] = [];

  public carouselConfig: NgxCarousel;

  constructor() {
    this.items = [
      {
        title: 'slide 1',
        color: 'f1f1f1',
        src: 'http://www.ciudadypoder.mx/wp-content/uploads/2017/07/spaa.jpg'
      },
      {
        title: 'slide 2',
        color: 'f1f1f1',
        src: 'http://www.tichkule.com/upload/image/home_1505296587.jpg'
      },
      {
        title: 'slide 3',
        color: 'f1f1f1',
        src: 'https://jivaspa.tajhotels.com/content/dam/jiva-spa/generic-image/16x7/JivaSpaDetails1_16x7.jpg'
      }
    ]

    this.carouselConfig = {
      grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
      slide: 1,
      speed: 400,
      interval: 10000,
      point: {
        visible: true,
        pointStyles: `
          .ngxcarouselPoint {
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
          .ngxcarouselPoint li {
            display: inline-block;
            border: 1px solid #ccc;
            border-radius: 0; width: 50px; height: 5px;
            background: rgba(255, 255, 255, 0.55);
            padding: 5px;
            margin: 0 3px;
            cursor: pointer;
            transition: .4s ease all;
          }
          .ngxcarouselPoint li.active {
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
