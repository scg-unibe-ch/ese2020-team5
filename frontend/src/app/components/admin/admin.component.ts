// src/app/pages/admin/admin.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
// @ts-ignore
import { AuthService } from './../../auth/auth.service';
// @ts-ignore
import { ApiService } from './../../core/api.service';
// @ts-ignore
import { UtilsService } from './../../core/utils.service';
// @ts-ignore
import { FilterSortService } from './../../core/filter-sort.service';
import { Subscription } from 'rxjs';
// @ts-ignore
import { EventModel } from './../../core/models/event.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  pageTitle = 'Admin';
  eventsSub: Subscription;
  eventList: EventModel[];
  filteredEvents: EventModel[];
  loading: boolean;
  error: boolean;
  query = '';

  constructor(
    private title: Title,
    public auth: AuthService,
    private api: ApiService,
    public utils: UtilsService,
    public fs: FilterSortService
  ) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    this._getEventList();
  }

  private _getEventList() {
    this.loading = true;
    // Get all (admin) events
    this.eventsSub = this.api
      .getAdminEvents$()
      .subscribe(
        res => {
          this.eventList = res;
          this.filteredEvents = res;
          this.loading = false;
        },
        err => {
          console.error(err);
          this.loading = false;
          this.error = true;
        }
      );
  }

  // tslint:disable-next-line:typedef
  searchEvents() {
    this.filteredEvents = this.fs.search(this.eventList, this.query, '_id', 'mediumDate');
  }

  resetQuery() {
    this.query = '';
    this.filteredEvents = this.eventList;
  }

  ngOnDestroy() {
    this.eventsSub.unsubscribe();
  }

}
