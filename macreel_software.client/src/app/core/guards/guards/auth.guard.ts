import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const authServices = inject(AuthService);
  const router = inject(Router);
  const role = authServices.getRole();
debugger;
  if (!role) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
