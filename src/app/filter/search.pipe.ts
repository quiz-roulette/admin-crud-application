
import { Pipe, PipeTransform } from '@angular/core';
import { QuestionWrapper } from '../model/questionWrapper';

@Pipe({
    name: 'search'
})

export class SearchPipe implements PipeTransform {
    transform(values: QuestionWrapper[], args: string[]): any[] {
        var search = "";
        var levelFilter = "";
        var priceFilter = "";

        if(args){
            search = args[0] ? args[0] : "";
        }
        if(values){
            values = values.filter(function(el){
                if(el.Text.includes(search)){
                    return el;
                }
            })
        }
        
        return values;
    }
}