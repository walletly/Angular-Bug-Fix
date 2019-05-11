import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bots-details',
  templateUrl: './bots-details.component.html',
  styleUrls: ['./bots-details.component.scss']
})
export class BotsDetailsComponent implements OnInit {

  items = [
    {
      icon: 'icon-menu bit-map',
      title: 'ManyChat',
      expanded: true,
      children: [
        {
          title: 'Customer Service',
          link: [],
        },
        {
          title: 'Online Store',
          link: [],
        },
        {
          title: 'Hospitality',
          link: [],
        },
        {
          title: 'Business',
          link: [],
        },
        {
          title: 'Healthcare',
          link: [],
        },
        {
          title: 'Financial & Legal',
          link: [],
        },
        {
          title: 'Branding',
          link: [],
        },
        {
          title: 'Event',
          link: [],
        },
        {
          title: 'Restaurant & Food',
          link: [],
        },
        {
          title: 'Education',
          link: [],
        },
      ],
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
