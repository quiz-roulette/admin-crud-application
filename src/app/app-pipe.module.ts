import { NgModule }      from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from './filter/search.pipe';
import { LimitPipe } from './filter/limit.pipe';

@NgModule({
    imports:        [FormsModule],
    declarations:   [SearchPipe, LimitPipe],
    exports:        [SearchPipe, LimitPipe],
})

export class PipeModule {

  static forRoot() {
     return {
         ngModule: PipeModule,
         providers: [],
     };
  }
}