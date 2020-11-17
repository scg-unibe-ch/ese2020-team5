import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {
  constructor() {
    if (!localStorage.getItem('preference')) {
      const defaultValues = {
        view: 'card'
      };
      localStorage.setItem('preference', JSON.stringify(defaultValues));
    }
  }

  getPreference(): any {
    return JSON.parse(localStorage.getItem('preference'));
  }

  setPreference(value: any): void {
    const preference = Object.assign(this.getPreference(), value);
    localStorage.setItem('preference', JSON.stringify(preference));
  }
}
