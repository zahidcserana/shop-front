import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  currentLang$ = new BehaviorSubject<string>('en');

  constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem('app_lang') || 'en';
    this.translate.addLangs(['en', 'bn']);
    this.translate.setDefaultLang('en');
    this.translate.use(savedLang);
    this.currentLang$.next(savedLang);
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('app_lang', lang);
    this.currentLang$.next(lang);
  }

  get currentLang() {
    return this.translate.currentLang || 'en';
  }
}
