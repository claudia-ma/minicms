import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ContentService, Content } from '../../core/content.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="max-width: 900px; margin: 40px auto; font-family: system-ui;">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
        <div>
          <h2 style="margin:0;">Admin Panel</h2>
        </div>

        <button (click)="logout()">Logout</button>
      </div>

      <hr style="margin: 20px 0;" />

      <h3 style="margin:0 0 10px;">
        {{ editingId ? 'Edit content' : 'Create content' }}
      </h3>

      <form (ngSubmit)="save()" style="display:grid; gap:10px; margin-bottom: 20px;">
        <div>
  <label>Title</label><br />
  <input
    [(ngModel)]="form.title"
    name="title"
    required
    placeholder="e.g. Building a Mini CMS with Angular and Laravel"
    style="width:100%; padding:8px;"
  />
</div>

<div>
  <label>Slug</label><br />
  <input
    [(ngModel)]="form.slug"
    name="slug"
    required
    placeholder="e.g. building-a-mini-cms"
    style="width:100%; padding:8px;"
  />
</div>

<div>
  <label>Excerpt</label><br />
  <input
    [(ngModel)]="form.excerpt"
    name="excerpt"
    placeholder="Short summary to display in content previews"
    style="width:100%; padding:8px;"
  />
</div>

<div>
  <label>Content</label><br />
  <textarea
    [(ngModel)]="form.body"
    name="body"
    rows="4"
    placeholder="Write the full content here..."
    style="width:100%; padding:8px;"
  ></textarea>
</div>

        <div>
          <label>Status</label><br />
          <select [(ngModel)]="form.status" name="status" style="padding:8px;">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div style="display:flex; gap:10px; align-items:center;">
         <button type="submit" [disabled]="saving">
          {{ saving ? 'Saving...' : (editingId ? 'Update content' : 'Create content') }}
        </button>

          <button
            type="button"
            (click)="cancelEdit()"
            *ngIf="editingId"
            [disabled]="saving"
          >
            Cancel edit
          </button>
        </div>

        <p *ngIf="error" style="color:#b00020; margin:0;">
          {{ error }}
        </p>
      </form>

      <h3 style="margin:40px 0 10px;">Content list</h3>

      <p *ngIf="loading">Loading content...</p>

      <table
        *ngIf="!loading && contents.length > 0"
        border="1"
        cellpadding="8"
        cellspacing="0"
        style="width:100%; border-collapse:collapse;"
      >
        <thead>
          <tr>
            <th align="left">ID</th>
            <th align="left">Title</th>
            <th align="left">Slug</th>
            <th align="left">Status</th>
            <th align="left">Published</th>
            <th align="left">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr *ngFor="let c of contents">
            <td>{{ c.id }}</td>
            <td>{{ c.title }}</td>
            <td>{{ c.slug }}</td>
            <td>{{ c.status }}</td>
            <td>{{ c.published_at ? c.published_at : '-' }}</td>
            <td>
              <button (click)="edit(c)">Edit</button>

              <button
                (click)="remove(c.id)"
                [disabled]="deletingId === c.id"
                style="margin-left:8px;"
              >
                {{ deletingId === c.id ? 'Deleting...' : 'Delete' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!loading && contents.length === 0">
        No content yet.
      </div>
    </div>
  `,
})
export class AdminComponent implements OnInit {
  contents: Content[] = [];
  loading = false;

  error = '';
  saving = false;

  saveOk = false;
  saveMessage = '';

  deletingId: number | null = null;
  editingId: number | null = null;

  form: Partial<Content> = {
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    status: 'draft',
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private contentService: ContentService
  ) {}

  ngOnInit(): void {
    this.loadContents();
  }

  loadContents() {
    this.loading = true;

    this.contentService.list().subscribe({
      next: (data) => {
        this.contents = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? 'Error loading content';
        console.error('Error listing content:', err);
      },
    });
  }

  save() {
    this.error = '';
    this.saveOk = false;
    this.saveMessage = '';
    this.saving = true;

    if (this.editingId) {
      this.contentService.update(this.editingId, this.form).subscribe({
        next: () => this.afterSave(),
        error: (err) => {
          this.saving = false;
          this.error = err?.error?.message ?? 'Error updating content';
          console.error('Error updating content:', err);
        },
      });
      return;
    }

    this.contentService.create(this.form).subscribe({
      next: () => this.afterSave(),
      error: (err) => {
        this.saving = false;
        this.error = err?.error?.message ?? 'Error creating content';
        console.error('Error creating content:', err);
      },
    });
  }

  afterSave() {
    this.saving = false;

    this.editingId = null;

    this.form = {
      title: '',
      slug: '',
      excerpt: '',
      body: '',
      status: 'draft',
    };

    this.loadContents();
  }

  edit(content: Content) {
    this.editingId = content.id;
    this.saveOk = false;
    this.saveMessage = '';
    this.error = '';

    this.form = {
      title: content.title,
      slug: content.slug,
      excerpt: content.excerpt ?? '',
      body: content.body ?? '',
      status: content.status,
    };
  }

  cancelEdit() {
    this.editingId = null;
    this.saveOk = false;
    this.saveMessage = '';
    this.error = '';

    this.form = {
      title: '',
      slug: '',
      excerpt: '',
      body: '',
      status: 'draft',
    };
  }

  remove(id: number) {
    const ok = confirm('Are you sure you want to delete this content?');
    if (!ok) return;

    this.error = '';
    this.saveOk = false;
    this.saveMessage = '';
    this.deletingId = id;

    this.contentService.delete(id).subscribe({
      next: () => {
        this.deletingId = null;
        this.loadContents();
      },
      error: (err) => {
        this.deletingId = null;
        this.error = err?.error?.message ?? 'Error deleting content';
        console.error('Error deleting content:', err);
      },
    });
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}