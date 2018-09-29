import { Component, OnInit } from '@angular/core';
import { HTTPService } from '../../service/http.service';
import {Router} from "@angular/router";
import { Result } from '../../model/Result';
import { Group } from '../../model/Group';

@Component({
    selector: 'group',
    templateUrl: 'group.component.html',
    styleUrls: ['group.component.css']
})

export class GroupComponent implements OnInit {
    groups: Group[];
    newGroup: Group;
    result: Result;

    constructor(private httpService:HTTPService, private router: Router) { }

    ngOnInit() { 
        this.newGroup = new Group();
        this.result = new Result();
        this.getAllGroups();
    }

    getAllGroups(){
        this.result.updateInfo("Getting groups...")
        this.httpService.getAllGroups().then((result) => {
            this.groups = result;
            this.result.updateSuccess(true);
        }).catch((err) => {
            this.result.updateError("Error!");
        });
    }

    addGroup(){
        this.result.updateInfo("Adding new Group...");
        // console.log(this.newGroup);
        this.httpService.addGroup(this.newGroup).then((result) => {
            // console.log(result);
            if(result){
                this.groups.push(this.newGroup);
                this.newGroup = new Group();
                this.result.updateSuccess(true);
            }
        }).catch((err) => {
            this.result.updateError("Error!");
        });
    }

    deleteGroup(categoryName){
            this.result.updateInfo("Deleting group...");
            this.httpService.deleteGroup(categoryName).then((result) => {
                if(result){
                    this.result.updateTextSuccess("Deleted group Successfully");
                    this.getAllGroups();
                }
            }).catch((err) => {
                this.result.updateError("Error!");
            });
    }

    assignUsers(groupName){
        this.router.navigate(['/assign-users', groupName]);
    }

    updateResult(result: Result){
        this.result = result;
    }
}