import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core';
import { finalize, debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	resetPasswordForm: FormGroup;
	isLoading = false;
	errorMessage: string;
	constructor(
		public router: Router,
		private formBuilder: FormBuilder,
		private authenticationService: AuthenticationService
	) {
		this.createForm();
	}
	private _success = new Subject<string>();

	ngOnInit() {
		this._success.subscribe((message) => this.errorMessage = message);
		this._success.pipe(
			debounceTime(5000)
		).subscribe(() => this.errorMessage = null);
	}
	public changeErrorMessage() {
		this._success.next('Nu s-a putut realiza autentificarea, va rugam verificati datele si reincercati');
	}
	login() {
		this.router.navigate(['/'], {
							replaceUrl: true
						});
		this.isLoading = true;
		this.authenticationService
			.login(this.loginForm.value)
			.pipe(
				finalize(() => {
					this.loginForm.markAsPristine();
					this.isLoading = false;
				})
			)
			.subscribe(
				(credentials: Authentication.Credentials) => {
					console.log(credentials);
					this.router.navigate(['/'], {
						replaceUrl: true
					});
				},
				(error: any) => {
					this.changeErrorMessage()
					console.log('Login error: ',error);
				}
			);
	}

	resetPassword() {
		// TODO: Implement Reset Password
	}

	private createForm() {
		this.loginForm = this.formBuilder.group({
			email: ['', [Validators.required]],
			password: ['', Validators.required]
		});
	}
}
