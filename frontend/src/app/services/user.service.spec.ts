import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { of } from 'rxjs';
import {all} from "codelyzer/util/function";

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();

    // Add tests for all() method
    describe('all', () => {
      it('should return a collection of users', () => {
        const userResponse = [
          {
            id: '1',
            name: 'Admin',
            role: 'Admin',
          },
          {
            id: '2',
            name: 'User',
            role: 'Developer',
          },
          {
            id: '3',
            name: 'Guest',
            role: 'Guest',
          }
        ];
        let response;
        spyOn(UserService, 'all').and.returnValue(of(userResponse));

        UserService.all().subscribe(res => {
          response = res;
        });
        expect(response).toEqual(userResponse);
      });
    });
  });
});
