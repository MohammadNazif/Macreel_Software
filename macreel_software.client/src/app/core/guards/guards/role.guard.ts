import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const allowedRoles  = route.data['roles'] as string;
  const userRole = authService.getRole() as string;
  if (allowedRoles && allowedRoles.includes(userRole)) {
    return true;
  }

  Swal.fire({
    icon: 'error',
    title: 'Access Denied',
    text: 'You are not authorized to access this page'
  });

  router.navigate(['/login'], {queryParams: {_:'key'}});
  return false;
};
