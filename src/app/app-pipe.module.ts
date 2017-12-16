import { NgModule }      from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from './filter/search.pipe';

@NgModule({
    imports:        [FormsModule],
    declarations:   [SearchPipe],
    exports:        [SearchPipe],
})

export class PipeModule {

  static forRoot() {
     return {
         ngModule: PipeModule,
         providers: [],
     };
  }
}