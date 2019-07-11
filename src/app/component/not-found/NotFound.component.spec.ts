import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { NotFoundComponent } from './NotFound.Component'

describe('WelcomeComponent (class only)', () => {
    let comp: NotFoundComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            // provide the component-under-test and dependent service
            providers: [
                NotFoundComponent
            ]
        });
        // inject both the component and the dependent service.
        comp = TestBed.get(NotFoundComponent);
    });

    it('should not have message after construction', () => {
        expect(comp.message).toBeUndefined();
    });

    it('should contain a value for message after ngOnInit', () => {
        comp.ngOnInit();
        expect(comp.message).toContain("Not Found");
    });
});