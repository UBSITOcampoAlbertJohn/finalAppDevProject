import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Movie, ApiResponse } from '../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:4200/api/movies';

  movies = signal<Movie[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  totalMovies = computed(() => this.movies().length);
  publishedCount = computed(() => this.movies().filter((m) => m.status === 'Published').length);
  draftCount = computed(() => this.movies().filter((m) => m.status === 'Draft').length);
  averageRating = computed(() => {
    const list = this.movies();
    if (!list.length) return 0;
    const sum = list.reduce((acc, m) => acc + m.rating, 0);
    return Number((sum / list.length).toFixed(1));
  });

  loadMovies(filters?: {
    search?: string;
    category?: string;
    genre?: string;
    status?: string;
    sort?: string;
  }): void {
    this.loading.set(true);
    this.error.set(null);

    let params = new HttpParams();
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.category && filters.category !== 'All') params = params.set('category', filters.category);
    if (filters?.genre && filters.genre !== 'All') params = params.set('genre', filters.genre);
    if (filters?.status && filters.status !== 'All') params = params.set('status', filters.status);
    if (filters?.sort) params = params.set('sort', filters.sort);

    this.http.get<ApiResponse<Movie[]>>(this.apiUrl, { params }).subscribe({
      next: (res) => {
        this.movies.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load movies from server.');
        this.loading.set(false);
      },
    });
  }

  getMovieById(id: string): Observable<ApiResponse<Movie>> {
    return this.http.get<ApiResponse<Movie>>(`${this.apiUrl}/${id}`);
  }

  createMovie(movie: Movie): Observable<ApiResponse<Movie>> {
    return this.http.post<ApiResponse<Movie>>(this.apiUrl, movie).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.movies.update((current) => [res.data, ...current]);
        }
      })
    );
  }

  updateMovie(id: string, movie: Partial<Movie>): Observable<ApiResponse<Movie>> {
    return this.http.put<ApiResponse<Movie>>(`${this.apiUrl}/${id}`, movie).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.movies.update((current) =>
            current.map((m) => (m._id === id ? res.data : m))
          );
        }
      })
    );
  }

  deleteMovie(id: string): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${this.apiUrl}/${id}`).pipe(
      tap((res) => {
        if (res.success) {
          this.movies.update((current) => current.filter((m) => m._id !== id));
        }
      })
    );
  }
}