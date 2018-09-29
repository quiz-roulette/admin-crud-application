import { Component, OnInit } from '@angular/core';
import { HTTPService } from '../../service/http.service';
import { QuizUser } from '../../model/QuizUser';
import { Result } from '../../model/Result';
import { Category } from '../../model/category';

@Component({
    selector: 'categories',
    templateUrl: 'category.component.html',
    styleUrls: ['category.component.css']
})

export class CategoryComponent implements OnInit {
    categories: Category[];
    newCategory: Category;
    result: Result;

    constructor(private httpService: HTTPService) { }

    ngOnInit() {
        this.newCategory = new Category();
        this.result = new Result();
        this.getAllCategories();
    }

    getAllCategories() {
        this.result.updateInfo("Getting Categories...")
        this.httpService.getAllCategories().then((result) => {
            this.categories = result;
            this.result.updateSuccess(true);
        }).catch((err) => {
            this.result.updateError("Error!");
        });
    }

    addCategory() {
        this.result.updateInfo("Adding Category...");
        this.httpService.addCategory(this.newCategory).then((result) => {
            if (result) {
                this.categories.push(this.newCategory);
                // this.httpService.assignUsersToGroup(this.newCategory.CategoryName).then((res) => {
                //     console.log("Successfully added all users to the group.")

                // });
                this.newCategory = new Category();
                this.result.updateSuccess(true);
            }
        }).catch((err) => {
            this.result.updateError("Error!");
        });
    }

    deleteCategory(categoryName) {
        this.result.updateInfo("Deleting Category...");
        this.httpService.deleteCategory(categoryName).then((result) => {
            if (result) {
                this.result.updateTextSuccess("Deleted User Successfully");
                this.getAllCategories();
            }
        }).catch((err) => {
            this.result.updateError("Error!");
        });
    }

    updateResult(result: Result) {
        this.result = result;
    }
}