import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
} from "@angular/forms";

import { AuthService } from "../shared/auth.service";

import { User } from "../../models/user.model";
import { Subscription } from "rxjs";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit, OnDestroy {
  private authSubscription!: Subscription;
  public formProfile!: UntypedFormGroup;
  public profileErrors!: string;
  private user!: User;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.initFormGroup();
    this.authSubscription = this.authService.user.subscribe((user) => {
      if (user) {
        this.formProfile.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
        this.user = user;
      }
    });
  }

  private initFormGroup() {
    this.formProfile = new UntypedFormGroup({
      firstName: new UntypedFormControl(null, Validators.required),
      lastName: new UntypedFormControl(null, Validators.required),
      email: new UntypedFormControl(null, Validators.email),
      password: new UntypedFormControl(null),
      confirmPassword: new UntypedFormControl(null),
    });
  }

  public onSubmit() {
    // Update Email
    if (this.user.email !== this.formProfile.value.email) {
      this.authService
        .updateEmail(this.formProfile.value.email)
        .catch((error) => {
          this.profileErrors = error.message;
          this.formProfile.patchValue({ email: this.user.email });
        });
    }

    // Update Profile (Firstname, Lastname)
    if (
      this.user.firstName !== this.formProfile.value.firstName ||
      this.user.lastName !== this.formProfile.value.lastName
    ) {
      this.authService.updateProfile(this.formProfile.value);
    }

    // Update password
    if (
      this.formProfile.value.password &&
      this.formProfile.value.confirmPassword &&
      this.formProfile.value.password === this.formProfile.value.confirmPassword
    ) {
      this.authService
        .updatePassword(this.formProfile.value.password)
        .catch((error) => {
          this.profileErrors = error.message;
        });
    }
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
