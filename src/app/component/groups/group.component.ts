import { Component, OnInit } from '@angular/core';
import { HTTPService } from '../../service/http.service';
import { Router } from "@angular/router";
import { Result } from '../../model/Result';
import { Group } from '../../model/Group';
import { HttpEventType } from '@angular/common/http';

@Component({
    selector: 'group',
    templateUrl: 'group.component.html',
    styleUrls: ['group.component.css']
})

export class GroupComponent implements OnInit {
    groups!: Group[];
    newGroup!: Group;
    result!: Result;

    constructor(private httpService: HTTPService, private router: Router) { }

    ngOnInit() {
        this.newGroup = new Group();
        this.result = new Result();
        this.getAllGroups();
    }

    getAllGroups() {
        this.result.updateInfo("Getting groups...")
        this.httpService.getAllGroups().subscribe((resultEvent: any) => {
            console.log("Get All Groups ", resultEvent)
            if (resultEvent.type === HttpEventType.Response) {
                var result = resultEvent.body;
                this.groups = result;
                this.result.updateSuccess(true);
            }
        })
    }

    addGroup() {
        this.result.updateInfo("Adding new Group...");
        // console.log(this.newGroup);
        this.httpService.addGroup(this.newGroup).subscribe((resultEvent: any) => {
            // console.log(result);
            console.log("Add Group ", resultEvent)
            if (resultEvent.type === HttpEventType.Response) {
                var result = resultEvent.body;
                this.groups.push(this.newGroup);
                this.newGroup = new Group();
                this.result.updateSuccess(true);
            }
        })
    }

    deleteGroup(categoryName: any) {
        this.result.updateInfo("Deleting group...");
        this.httpService.deleteGroup(categoryName).subscribe((resultEvent: any) => {
            console.log("Deleting Group ", resultEvent)
            if (resultEvent.type === HttpEventType.Response) {
                var result = resultEvent.body;
                this.result.updateTextSuccess("Deleted group Successfully");
                this.getAllGroups();
            }
        })
    }

    assignUsers(groupName: any) {
        this.router.navigate(['/assign-users', groupName]);
    }

    updateResult(result: Result) {
        this.result = result;
    }
}