import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { QuestionItem } from './category.component.config';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { ActivatedRoute } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { GenerateAnswerModalComponent } from '../generate-answer-modal/generate-answer-modal.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatProgressSpinnerModule, TruncatePipe, GenerateAnswerModalComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['position', 'question', 'answer', 'actions'];
  dataSource = new MatTableDataSource<QuestionItem>();
  category: string = '';
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    public categoriesService: CategoriesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        switchMap((param) => {
          this.category = param.get('categoryId') || '';
          this.isLoading = true;
          return this.categoriesService.getQuestionsByCategory(this.category);
        })
      )
      .subscribe((response) => {
        this.isLoading = false;
        this.dataSource = response.data as any;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openGenerateAnswerModal(question: QuestionItem, index: number): void {
    const dialogRef = this.dialog.open(GenerateAnswerModalComponent, {
      width: '600px',
      data: { ...question, index }
    });

    dialogRef.afterClosed().subscribe((result: string | undefined) => {
      if (result) {
        question.answer = result;
        console.log('Answer saved:', result);
      }
    });
  }

  deleteAnswer(categoryName: string, id: number): void {
    this.categoriesService
      .deleteCategoryQuestionById(categoryName, id)
      .subscribe((response) => {
        console.log(response);
      });
  }

  openDeleteDialog(question: QuestionItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent, {
      width: '333px',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      console.log('The dialog was closed', result);
      if (result) {
        console.log('Question would be deleted.', question);
        this.deleteAnswer(this.category, question.id);
      }
    });
  }
}
