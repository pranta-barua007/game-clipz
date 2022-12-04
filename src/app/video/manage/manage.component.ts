import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  videoOrder = '1'; //1 ~> DESC, 2 ~> AESC
  
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      (params: Params) => {
        this.videoOrder = params['sort'] === '2'
          ? params['sort'] 
          : '1'
      } 
    )
  }

  sort(event: Event) {
    const { value } = (event.target as HTMLSelectElement);
    //option-1
    //this.router.navigateByUrl(`/manage?sort=${value}`)
    
    //option-2
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value
      }
    });
  }
}
