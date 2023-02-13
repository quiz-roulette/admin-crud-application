
import { Pipe, PipeTransform } from '@angular/core';
import { QuestionWrapper } from '../model/questionWrapper';

@Pipe({
    name: 'limit'
})

export class LimitPipe implements PipeTransform {
    transform(values: any, args: string[]): any[] {
        console.log(args[1])
        values = values ? values : [];
        var min = 0;
        var max = values.length;
        if (args.length == 3) {
            min = Number.parseInt(args[0]);
            //args[1] = ":"
            max = Number.parseInt(args[2]);
        }
        var limited = new Array();
        for (var i = min; i < values.length && i < max; i++) {
            limited[i] = values[i];
        }
        return limited;
    }
}