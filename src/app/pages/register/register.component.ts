import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/srvices/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  errorMessages = {
    user_full_name: '',
    user_email: '',
    user_phone: '',
    user_password: '',
    user_password_2: '',
  };
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
  ) {}
  registerForm!: FormGroup;
  loading = false;
  submitted = false;

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      // firstName: ['', Validators.required],
      // lastName: ['', Validators.required],

      user_full_name: ['', Validators.required],
      user_phone: ['', Validators.required],
      user_email: ['', [Validators.required, Validators.email]],
      user_password: ['', [Validators.required, Validators.minLength(6)]],
      user_password_2: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get fval() {
    return this.registerForm.controls;
  }
  onFormSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;

    const user = this.registerForm.value;
    console.log(user);

    this.userService.addUser(user).subscribe(
      (response) => {
        console.log('Registration successful:', response);
        this.toastr.success('User Registered successfully!!');
        this.router.navigate(['/login']);
       
      },
      (error) => {
        this.loading = false;
        // this.submitted = false;
        console.error(error);
        if (error == 'Email already exists') {
          this.errorMessages = { ...this.errorMessages, user_email: error };
          console.log(
            'this.errorMessages.user_email :',
            this.errorMessages.user_email
          );
        }
        this.loading = false;
        // Handle error here
      }
    );
  }
}

// onFormSubmit() {
//   this.submitted = true;
//   if (this.registerForm.invalid) {
//     return;
//   }
//   this.loading = true;

//   const user = this.registerForm.value;

//   this.userService.addUser(user).subscribe(
//     (response) => {
//       console.log(response);
//       if (typeof response === 'string' && response === 'Register Success') {
//         this.toastr.success('User Registered successfully!!');
//         this.router.navigate(['/login']);
//       }
//       this.loading = false;
//       this.submitted = false;
//     },
//     (error) => {
//       console.log('Server Error:', error);
//       if (error && error.error) {
//         console.log('Server Error Message:', error.error);
//         if (typeof error.error === 'string') {
//           this.errorMessages.user_email = error.error;
//           this.registerForm.get('user_email')?.setErrors({ serverError: true });
//         } else {
//           this.errorMessages.user_email = '';
//         }
//       } else {
//         this.errorMessages.user_email = '';
//       }
//       this.loading = false;
//     }
//   );
// }

//       this.userService.addUser(user).subscribe(
//           (response) => {
//               console.log(response);
//               if(response=='Register Success'){
//                   this.toastr.success('User Registered successfully!!');
//                   this.router.navigate(['/login'])
//       }

//     },
//     (error) => {
//         console.error('Error registering user', error);
//         // Handle error cases
//       }
//     );

// }
// }

// const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
// console.log(this.registerForm.value)

// generateUniqueId(user);

// users.push(user);
// localStorage.setItem('registeredUsers', JSON.stringify(users));
// this.toastr.success('User Registered successfully!!', 'Success');
// this.router.navigate(['/login']);

// function generateUniqueId(user: any): void {
//   const usedIds = new Set(JSON.parse(localStorage.getItem('usedIds') || '[]'));
//   let newId = '';

//   do {
//     newId = (Math.floor(Math.random() * 900000) + 100000).toString();
//   } while (usedIds.has(newId));

//   usedIds.add(newId);

//   user.id = newId;
// }
// }

// }
