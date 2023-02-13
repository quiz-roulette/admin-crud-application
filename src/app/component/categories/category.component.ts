import { Component, OnInit } from '@angular/core';
import { HTTPService } from '../../service/http.service';
import { QuizUser } from '../../model/QuizUser';
import { Result } from '../../model/Result';
import { Category } from '../../model/category';
import { Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';

@Component({
    selector: 'categories',
    templateUrl: 'category.component.html',
    styleUrls: ['category.component.css']
})

export class CategoryComponent implements OnInit {
    categories!: Category[];
    newCategory!: Category;
    result!: Result;

    constructor(private httpService: HTTPService, private router: Router) { }

    ngOnInit() {
        this.newCategory = new Category();
        this.result = new Result();
        this.getAllCategories();
    }

    getAllCategories() {
        this.result.updateInfo("Getting Categories...")
        this.httpService.getAllCategories().subscribe((resultEvent: any) => {
            if (resultEvent.type === HttpEventType.Response) {
                var result = resultEvent.body;
                this.categories = result;
                this.result.updateSuccess(true);
            }
        })
    }

    addCategory() {
        this.result.updateInfo("Adding Category...");
        this.httpService.addCategory(this.newCategory).subscribe((resultEvent: any) => {
            console.log("While adding category ", resultEvent)
            this.categories.push(this.newCategory)
            this.result.updateSuccess(true);
        })
    }

    deleteCategory(categoryName: any) {
        this.result.updateInfo("Deleting Category...");
        this.httpService.deleteCategory(categoryName).subscribe((resultEvent: any) => {
            console.log("While deleting category ", resultEvent)
            this.result.updateTextSuccess("Deleted User Successfully");
            this.getAllCategories();
        })
    }

    controlQuiz(catName: any) {
        this.router.navigate(['controlledquiz/' + catName]);
    }

    updateResult(result: Result) {
        this.result = result;
    }
}