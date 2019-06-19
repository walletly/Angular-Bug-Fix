import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-member',
  templateUrl: './modal-member.component.html',
  styleUrls: ['./modal-member.component.scss']
})
export class ModalMemberComponent implements OnInit {
  showLink;
  api;
  toolTipStatus = 'Copy';
  copied;

  @Input() show;
  @Output() closeModal = new EventEmitter;

  constructor() { }

  ngOnInit() {
    this.api = 'https://walletly.io/invitation/administrator_f93f9eff19ecf46525'
  }

  close(){
    this.closeModal.emit();
  }

  mouseMove() {
    this.toolTipStatus = 'Copy';
  }

  copyApi() {
    this.toolTipStatus = 'Copied';
  }

}
