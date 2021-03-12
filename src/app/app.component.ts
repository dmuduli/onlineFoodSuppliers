import {
  Component,
  OnInit,
  HostListener,
  Inject,
  ViewChild,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { Location } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { User } from './modules/shared/models/user';

import { AuthService } from './modules/shared/services/auth.service';
import { CartService } from './modules/shared/services/cart.service';
import { FoodService } from './modules/shared/services/food.service';
import { LocationService } from './modules/shared/services/location.service';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { LocationComponent } from './modules/shared/modals/location/location.component';
import { concat, from, fromEvent, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Homemade-UI';
  isShow: boolean = false;
  layer_is_visible: boolean = false;
  is_show_normal: boolean = false;
  is_navToTop_visible: boolean = false;
  isLoggedIn: boolean;
  isHideHeader: boolean;
  headerSubscription: any;
  user: any;
  cartItemCount: any = 0;
  guestCartCount: any = 0;
  filteredOptions: Observable<any> | null;
  filteredOptionsMobile: Observable<any> | null;
  searchVal: string;
  @ViewChild('searchInput', { static: false }) input: any;
  @ViewChild('searchInputOne', { static: false }) inputOne: any;
  isCollapse1Show: boolean;
  isCollapse2Show: boolean;
  isCollapse3Show: boolean;
  isCollapse4Show: boolean;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private cartService: CartService,
    private authService: AuthService,
    private foodService: FoodService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private locationService : LocationService
  ) {
    this.isLoggedIn = false;
    this.isHideHeader = false;
    this.filteredOptions = null;
    this.filteredOptionsMobile = null;
    this.searchVal = '';
    this.isCollapse1Show = false;
    this.isCollapse2Show = false;
    this.isCollapse3Show = false;
    this.isCollapse4Show = false;
  }

  ngOnInit() {
    sessionStorage.setItem('fromSession', JSON.stringify(false));
    sessionStorage.setItem('signInFromHome', JSON.stringify(false));
    this.authService.setHeaderDisplayStatus(false);
    this.cartService.getCartItemCount().subscribe((val) => {
      this.cartItemCount = val;
    });
    this.authService.user.subscribe((x) => {
      this.user = x;
      if (x != null) {
        this.cartService.getCartCountAPIResp();
      }
    });
    // this.cartService.getCartCountAPIResp();
    if (!sessionStorage.getItem('cartData')) {
      sessionStorage.setItem('cartData', JSON.stringify([]));
      this.cartService.updateGuestCart();
    }

    this.cartService.guestData.subscribe((val) => {
      const cartData = JSON.parse(val);
      this.guestCartCount = cartData.length;
    });

    this.headerSubscription = this.authService.hideHeaderStatusChange.subscribe(
      (val) => {
        this.isHideHeader = val;
        this.cd.detectChanges();
      }
    );
  }

  ngAfterViewInit() {
    if (
      this.input &&
      'nativeElement' in this.input &&
      this.input.nativeElement
    ) {
      const searchCodes$ = fromEvent<any>(
        this.input.nativeElement,
        'keyup'
      ).pipe(
        map((event) => event.target.value),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((search) => this.getItemByName(search))
      );

      const initialCodes$ = this.getItemByName();

      this.filteredOptions = concat(initialCodes$, searchCodes$);
    }

    if (
      this.inputOne &&
      'nativeElement' in this.inputOne &&
      this.inputOne.nativeElement
    ) {
      const searchItem$ = fromEvent<any>(
        this.inputOne.nativeElement,
        'keyup'
      ).pipe(
        map((event) => event.target.value),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((search) => this.getItemByName(search))
      );

      const initialItem$ = this.getItemByName();

      this.filteredOptionsMobile = concat(initialItem$, searchItem$);
    }
  }

  redirectToAuth() {
    sessionStorage.setItem('signInFromHome', JSON.stringify(true));
    this.router.navigate(['/', 'auth']);
  }

  getItemByName(searchText = '') {
    return from(this.foodService.getItemByName(searchText));
  }

  navigateToCategory(category: string) {
    // this.router
    //   .navigateByUrl('/', { skipLocationChange: true })
    //   .then(() => this.router.navigate(['/', 'foods', 'category', category],{replaceUrl: true}));
    this.router.navigate(['/', 'foods', 'category', category]);
  }

  @HostListener('window:scroll', []) onScroll(): void {
    let pxShow = 800; // height on which the button will show
    if (
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop >= pxShow
    ) {
      this.is_navToTop_visible = true;
    } else {
      this.is_navToTop_visible = false;
    }
  }

  enableSandwichMenu() {
    this.isShow = this.isShow == true ? false : true;
    this.layer_is_visible = this.layer_is_visible == true ? false : true;
  }

  expandCollapseSandwichSubMenu() {
    this.is_show_normal = this.is_show_normal == true ? false : true;
  }

  scrollToTop() {
    (function smoothscroll() {
      var currentScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - currentScroll / 8);
      }
    })();
  }

  setLocation() {
    var city = this.locationService.CurrentCity;
    const addDialogRef = this.dialog.open(LocationComponent, {
      width: this.getBrowserWidth(),
      disableClose: true,
      maxWidth: '90vw',
    });
    addDialogRef.afterClosed().subscribe((result) => {
      let newcity = this.locationService.CurrentCity;
      if(city != newcity)
      {
        location.reload();
      }
    });
  }

  getBrowserWidth(): string {
    const innerWidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
    if (innerWidth) {
      if (innerWidth < 340) {
        return Math.round((innerWidth * 95) / 100) + 'px';
      } else if (innerWidth < 640) {
        return Math.round((innerWidth * 95) / 100) + 'px';
      } else if (innerWidth < 768) {
        return Math.round((innerWidth * 80) / 100) + 'px';
      } else if (innerWidth < 1024) {
        return Math.round((innerWidth * 70) / 100) + 'px';
      } else if (innerWidth >= 1024) {
        return Math.round((innerWidth * 45) / 100) + 'px';
      }
    }
    return '80%';
  }

  navigateToDetailPage(event: any, option: any) {
    if (event.isUserInput) {
      if (option.type === 'subcategoryname') {
        // this.router
        //   .navigateByUrl('/', { skipLocationChange: true })
        //   .then(() =>
        //     this.router.navigate([
        //       '/',
        //       'foods',
        //       'category',
        //       option.subcategoryName,
        //     ],{replaceUrl: true})
        //   );
        this.router.navigate(['/','foods','category',option.subcategoryName]);
      } else if (option.type === 'vendorname') {
        // this.router
        //   .navigateByUrl('/', { skipLocationChange: true })
        //   .then(() =>
        //     this.router.navigate(['/', 'foods', 'chef', option.vendorId],{replaceUrl: true})
        //   );
        this.router.navigate(['/', 'foods', 'chef', option.vendorId]);
      } else if (option.type === 'item') {
        // this.router
        //   .navigateByUrl('/', { skipLocationChange: true })
        //   .then(() =>
        //     this.router.navigate(['/', 'foods', 'detail', option.itemId],{replaceUrl: true})
        //   );
        this.router.navigate(['/', 'foods', 'detail', option.itemId],{replaceUrl: true});
      }
    }
  }

  logOutUser() {
    sessionStorage.setItem('signInFromHome', JSON.stringify(true));
    this.authService.logout();
    this.authService.user.subscribe((x) => {
      this.user = x;
    });
  }
}
