import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardShellComponent } from './product-card-shell.component';

describe('ProductCardShellComponent', () => {
  let component: ProductCardShellComponent;
  let fixture: ComponentFixture<ProductCardShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCardShellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCardShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
