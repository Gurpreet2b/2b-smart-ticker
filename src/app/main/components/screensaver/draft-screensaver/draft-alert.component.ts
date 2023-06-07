import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-draft-alert',
  templateUrl: './draft-alert.component.html',
  styleUrls: ['./draft-alert.component.css'],
})
export class DraftWallpaperComponent implements OnInit {
  public loading = false;
  public ScreenSaverList: any = [];
  public Permission: any = [];
  public RoleName: any;
  public RoleAssign: any = [];

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute, private router: Router,
    private dtPipe: DatePipe, public translate: TranslateService,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Screensavers Draft`);
    this.Permission = this.authService.getPermission();
    this.RoleAssign = JSON.parse(this.Permission.access_control_list);
    this.RoleName = this.Permission.role;
    this.GetScreenSaverList(1);
  }

  dateformat(datas: string) {
    return this.authService.Dateformat(datas);
  }

  Timeformat(time: string) {
    return this.authService.Timeformat(time);
  }

  formScreenSaver = new FormGroup({
    search: new FormControl(''),
  });

  onSearchScreenSaver(formValue: any) {
    this.GetScreenSaverList(1)
  }

  PageJump: any = 10;
  PageTotalNumber: any = [];
  GetScreenSaverList(page: number) {
    this.loading = true;

    const formData = new FormData();
    const formValue = this.formScreenSaver.value;
    const search = formValue.search || '';
    formData.append('search', search);

    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`screensaveralert/dashboard_draft_list/?search=${search}`, null, { params: params }).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.ScreenSaverList = res.data;
        this.totalItems = responseData.count;
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
      this.PageTotalNumber = [];
      let Count = responseData.count / 10;
      for (let i = 0; i < Count; i += this.PageJump) {
        this.PageTotalNumber.push(i);
      }
    }, error => {
      if (error.error.code === 'token_not_valid') {
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.loading = false;
      } else {
        this.toastr.error(error);
        this.loading = false;
      }
    });
  }

  currentPage: number = 1;
  totalItems: number | undefined;
  onPageChange(event: any, data: any) {
    if (data === '1') {
      this.currentPage = event;
      this.GetScreenSaverList(event)
    } else {
      this.currentPage = Number(event.target.value);
      this.GetScreenSaverList(this.currentPage)
    }
  }

  delete(id: number) {
    if (confirm('Are you sure delete this record?')) {
      this.onDeleteScreenSaver(id);
    }
  }
  onDeleteScreenSaver(id: number) {
    this.loading = true;
    this.http.delete(`screensaveralert/${id}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success("ScreenSaver Alert Deleted Successfully");
        this.GetScreenSaverList(this.currentPage);
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.toastr.error(res.error);
        this.loading = false;
      }
    }, error => {
      if (error.error.code === 'token_not_valid') {
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.loading = false;
      } else {
        this.toastr.error(error);
        this.loading = false;
      }
    });
  }

}