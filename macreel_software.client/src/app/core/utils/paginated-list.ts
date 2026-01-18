import { Observable } from 'rxjs';
import { PaginatedResult } from '../models/employee.interface';


export class PaginatedList<T> {

  readonly items: T[] = [];

  private page = 1;
  private readonly size: number;
  private totalPages = 0;

  loading = false;
  hasMore = true;

  constructor(
    pageSize: number,
    private readonly fetchFn: (
      search: string,
      page: number,
      size: number
    ) => Observable<PaginatedResult<T>>
  ) {
    this.size = pageSize;
  }

  load(search = ''): void {
    if (this.loading || !this.hasMore) return;

    this.loading = true;

    this.fetchFn(search, this.page, this.size).subscribe({
      next: res => {
        this.items.push(...res.data);
        this.totalPages = res.totalPages;
        this.hasMore = this.page < this.totalPages;
        this.page++;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  reset(): void {
    this.items.length = 0;
    this.page = 1;
    this.totalPages = 0;
    this.hasMore = true;
  }

  handleScroll(event: Event, search = '', threshold = 80): void {
    const el = event.target as HTMLElement;

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - threshold) {
      this.load(search);
    }
  }
}
