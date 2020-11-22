import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent implements OnInit {
  @Input() value = 0;
  @Input() size = 25;
  @Input() editable: boolean | string = false;
  @Output() valueUpdate = new EventEmitter<number>();
  totalStars = [1, 2, 3, 4, 5];
  storedValue = 0;

  constructor() { }

  ngOnInit(): void {
    this.storedValue = this.value;
    this.editable = (this.editable === true || this.editable === 'true');
  }

  hoverStar(event, star: number): void {
    if (this.editable) {
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      if (x <= ((this.size - 2) / 2) && x > (this.size / 12)) {
        this.value = star - 0.5;
      } else if (x > ((this.size - 2) / 2)) {
        this.value = star;
      } else {
        this.value = star - 1;
      }
    }
  }

  setBackValue(): void {
    if (this.editable) {
      this.value = this.storedValue;
    }
  }

  setValue(): void {
    if (this.editable) {
      this.storedValue = this.value;
      this.valueUpdate.emit(this.storedValue);
    }
  }
}
