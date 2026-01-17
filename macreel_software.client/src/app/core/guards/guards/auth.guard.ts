import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = () => {
  const authServices = inject(AuthService);
  const router = inject(Router);

  if (!authServices.isTokenValid()) {
    Swal.fire({
      icon: 'warning',
      title: 'Session Expired',
      text: 'Your session has expired. Please log in again.',
      didClose: () =>{
        authServices.logout();
        router.navigate(['/login']);
      }
    });
    return false;
  }
  return true;
};
