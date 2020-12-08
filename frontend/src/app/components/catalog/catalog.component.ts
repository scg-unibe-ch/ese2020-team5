import { Component, HostListener, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { PreferenceService } from '../../services/preference.service';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':leave',
          [
            style({ height: 295, opacity: 1 }),
            animate('0.2s ease-in', style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class CatalogComponent implements OnInit {
  productView = 'card';
  allProducts: Product[];
  products: Product[];
  filterOpen = false;
  showBrowse = true;
  filter: any = {
    search: null,
    type: 'all',
    priceFrom: null,
    priceTo: null,
    salesType: 'sellOrLend',
    sortBy: 'recommended',
    location: null,
    status: 'unchecked',
    deliverable: 'unchecked'
  };

  constructor(
    private productService: ProductService,
    private reviewService: ReviewService,
    private route: ActivatedRoute,
    private router: Router,
    private preferenceService: PreferenceService
  ) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (this.filterOpen) {
      const filterSection = (document.getElementsByClassName('filter-options') as HTMLCollectionOf<HTMLElement>)[0];
      filterSection.style.maxHeight = (filterSection.scrollHeight - 81) + 'px';
    }
    this.calculateProductContainerWidth();
  }

  @HostListener('window:DOMNodeInserted', ['$event'])
  onNodeInserted(event: any): void {
    this.calculateProductContainerWidth();
  }

  ngOnInit(): void {
    this.productView = this.preferenceService.getPreference().view;
    this.initializeFilter();
    this.productService.getApprovedProducts().then(products => {
      this.allProducts = products;
      this.updateFilter();
    });
  }

  initializeFilter(): void {
    if (this.route.snapshot.queryParams.q || this.route.snapshot.queryParams.type) {
      this.showBrowse = false;
    }
    this.filter.search = (this.route.snapshot.queryParams.q) ? this.route.snapshot.queryParams.q : this.filter.search;
    this.filter.type = (this.route.snapshot.queryParams.type) ? this.route.snapshot.queryParams.type : this.filter.type;
  }

  filterProducts(products: Product[]): Product[] {
    if (this.filter.search) {
      products = products.filter(product =>
        product.title.toLowerCase().indexOf(this.filter.search.toLowerCase()) > -1
        || product.description.toLowerCase().indexOf(this.filter.search.toLowerCase()) > -1
      );
    }
    if (this.filter.type === 'items') {
      products = products.filter(product => product.type === 0);
    } else if (this.filter.type === 'services') {
      products = products.filter(product => product.type === 1);
    }
    if (this.filter.priceFrom) {
      products = products.filter(product => product.price >= parseInt(this.filter.priceFrom, 10));
    }
    if (this.filter.priceTo) {
      products = products.filter(product => product.price <= parseInt(this.filter.priceTo, 10));
    }
    if (this.filter.salesType === 'sell') {
      products = products.filter(product => product.sellOrLend === 0);
    } else if (this.filter.salesType === 'lend') {
      products = products.filter(product => product.sellOrLend === 1);
    }
    if (this.filter.location) {
      products = products.filter(product => product.location.toLowerCase().indexOf(this.filter.location.toLowerCase()) > -1);
    }
    if (this.filter.status === 'checked') {
      products = products.filter(product => product.status === 1);
    } else if (this.filter.status === 'crossed') {
      products = products.filter(product => product.status === 0);
    }
    if (this.filter.deliverable === 'checked') {
      products = products.filter(product => product.deliverable === 1);
    } else if (this.filter.deliverable === 'crossed') {
      products = products.filter(product => product.deliverable === 0);
    }
    if (this.filter.sortBy === 'rating') {
      products.sort((a, b) => this.sortByRating(a, b));
    } else if (this.filter.sortBy === 'totalReviews') {
      products.sort((a, b) => this.sortByTotalReviews(a, b));
    } else {
      products.sort((a, b) => this.sortByRecommended(a, b));
    }
    return products;
  }

  sortByRecommended(a: Product, b: Product): number {
    const avgRating = {
      a: (a.reviews.length > 0) ? this.reviewService.getAvgRating(a.reviews) : 2.5,
      b: (b.reviews.length > 0) ? this.reviewService.getAvgRating(b.reviews) : 2.5
    };
    if (((avgRating.a - 2.5) * (a.reviews.length / 10)) < ((avgRating.b - 2.5) * (b.reviews.length / 10))) {
      return 1;
    } else if (((avgRating.a - 2.5) * (a.reviews.length / 10)) > ((avgRating.b - 2.5) * (b.reviews.length / 10))) {
      return -1;
    } else if (a.reviews.length > b.reviews.length) {
      return -1;
    } else if (b.reviews.length > a.reviews.length) {
      return 1;
    } else {
      return 0;
    }
  }

  sortByRating(a: Product, b: Product): number {
    const avgRating = {
      a: (a.reviews.length > 0) ? this.reviewService.getAvgRating(a.reviews) : 2.5,
      b: (b.reviews.length > 0) ? this.reviewService.getAvgRating(b.reviews) : 2.5
    };
    if (avgRating.a > avgRating.b) {
      return -1;
    } else if (avgRating.b > avgRating.a) {
      return 1;
    } else if (a.reviews.length > b.reviews.length) {
      return -1;
    } else if (b.reviews.length > a.reviews.length) {
      return 1;
    } else {
      return 0;
    }
  }

  sortByTotalReviews(a: Product, b: Product): number {
    return -1 * (a.reviews.length - b.reviews.length);
  }

  updateFilter(): void {
    this.products = this.filterProducts(this.allProducts);
  }

  calculateProductContainerWidth(): void {
    if (this.productView === 'card' && document.getElementsByClassName('product-list')[0]) {
      let windowWidth: number;
      if (window.innerWidth > 1200) {
        windowWidth = window.innerWidth * 0.9 + 15;
      } else {
        windowWidth = window.innerWidth * 0.95 + 15;
      }
      const times = Math.floor(windowWidth / 322);
      (document.getElementsByClassName('product-list') as HTMLCollectionOf<HTMLElement>)[0].style.width = (322 * times - 15) + 'px';
    }
  }

  checkBox(value: string, key: string): void {
    if (value === 'unchecked') {
      value = 'checked';
    } else if (value === 'checked') {
      value = 'crossed';
    } else if (value === 'crossed') {
      value = 'unchecked';
    }
    if (key === 'status') {
      this.filter.status = value;
    } else if (key === 'deliverable') {
      this.filter.deliverable = value;
    }
    this.updateFilter();
  }

  openCloseFilters(): void {
    if (this.showBrowse) {
      this.showBrowse = false;
    }
    this.filterOpen = !this.filterOpen;
    const filterSection = (document.getElementsByClassName('filter-options') as HTMLCollectionOf<HTMLElement>)[0];
    if (this.filterOpen) {
      filterSection.style.maxHeight = (filterSection.scrollHeight - 81) + 'px';
    } else {
      filterSection.style.maxHeight = 0 + 'px';
    }
  }

  changePreference(): void {
    this.preferenceService.setPreference({ view: this.productView });
  }
}
