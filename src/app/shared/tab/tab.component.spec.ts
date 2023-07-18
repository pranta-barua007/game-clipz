import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabComponent } from './tab.component';
import { By } from '@angular/platform-browser';

describe('TabComponent', () => {
  let component: TabComponent;
  let fixture: ComponentFixture<TabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have .hidden class', () => {
    // ways to select elems of a component 
    //way 1 (preferred)
    const element = fixture.debugElement.query(
      By.css('.hidden')
    );
    //way 2
    //const element2 = fixture.nativeElement.querySelector('.hidden');
    //way 3 (not recommended)
    //const element3 = document.querySelector('.hidden');
    expect(element).toBeTruthy();
  });

  it('should not have .hidden class', () => {
    component.active = true;
    fixture.detectChanges();

    const element = fixture.debugElement.query(
      By.css('.hidden')
    );
    
    expect(element).not.toBeTruthy();
  });
});
