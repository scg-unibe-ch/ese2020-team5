import {Component, HostListener, OnInit} from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
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
            animate('0.3s ease-in', style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class CatalogComponent implements OnInit {
  products: Product[];
  filterOpen = false;
  showBrowse = true;
  filter: any = {
    search: null,
    type: 'all',
    priceFrom: null,
    priceTo: null,
    salesType: 'sellOrLend',
    sortBy: 'recommended'
  };

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (this.filterOpen) {
      const filterSection = (document.getElementsByClassName('filter-options') as HTMLCollectionOf<HTMLElement>)[0];
      filterSection.style.maxHeight = (filterSection.scrollHeight - 81) + 'px';
    }
    this.calculateProductContainerWidth();
  }

  ngOnInit(): void {
    this.calculateProductContainerWidth();
    this.initializeFilter();
    this.getFilteredProducts().then(products => this.products = products);
  }

  initializeFilter(): void {
    if (this.route.snapshot.queryParams.q || this.route.snapshot.queryParams.type) {
      this.showBrowse = false;
    }
    this.filter.search = (this.route.snapshot.queryParams.q) ? this.route.snapshot.queryParams.q : this.filter.search;
    this.filter.type = (this.route.snapshot.queryParams.type) ? this.route.snapshot.queryParams.type : this.filter.type;
    this.filter.priceFrom = (this.route.snapshot.queryParams.priceFrom) ? this.route.snapshot.queryParams.priceFrom : this.filter.priceFrom;
    this.filter.priceTo = (this.route.snapshot.queryParams.priceTo) ? this.route.snapshot.queryParams.priceTo : this.filter.priceTo;
    this.filter.salesType = (this.route.snapshot.queryParams.salesType) ? this.route.snapshot.queryParams.salesType : this.filter.salesType;
    this.filter.sortBy = (this.route.snapshot.queryParams.sortBy) ? this.route.snapshot.queryParams.sortBy : this.filter.sortBy;
  }

  getFilteredProducts(): Promise<Product[]> {
    return new Promise<Product[]>((resolve, reject) => {
      this.productService.getApprovedProducts().then(products => {
        products = this.filterProducts(products);
        resolve(products);
      }).catch(() => {
        reject(null);
      });
    });
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
    return products;
  }

  updateFilter(): void {
    let queryParams: any = {};
    if (this.filter.search) {
      queryParams = Object.assign(queryParams, { q: this.filter.search });
    }
    if (this.filter.type !== 'all') {
      queryParams = Object.assign(queryParams, { type: this.filter.type });
    }
    if (this.filter.priceFrom) {
      queryParams = Object.assign(queryParams, { priceFrom: this.filter.priceFrom });
    }
    if (this.filter.priceTo) {
      queryParams = Object.assign(queryParams, { priceTo: this.filter.priceTo });
    }
    if (this.filter.salesType !== 'sellOrLend') {
      queryParams = Object.assign(queryParams, { salesType: this.filter.salesType });
    }
    if (this.filter.sortBy !== 'recommended') {
      queryParams = Object.assign(queryParams, { sortBy: this.filter.sortBy });
    }
    this.getFilteredProducts().then(products => this.products = products);
    this.router.navigate(['catalog'], { queryParams });
  }

  calculateProductContainerWidth(): void {
    let windowWidth = 0;
    if (window.innerWidth > 1200) {
      windowWidth = window.innerWidth * 0.9 + 15;
    } else {
      windowWidth = window.innerWidth * 0.95 + 15;
    }
    const times = Math.floor(windowWidth / 322);
    (document.getElementsByClassName('product-list') as HTMLCollectionOf<HTMLElement>)[0].style.width = (322 * times - 15) + 'px';
    return null;
  }

  mouseEnterItem(index: number): void {
    document.getElementById('product-description-' + index).style.display = 'block';
  }

  mouseLeaveItem(index: number): void {
    document.getElementById('product-description-' + index).style.display = 'none';
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
}
