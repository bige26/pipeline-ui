import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {Feed} from '../../../models/feed';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit, OnDestroy {

  public feeds: Feed[] = [];
  public page = 1;
  private feedSub: Subscription = null;

  constructor(private router: Router,
              private userService: UserService) {
  }

  ngOnInit() {

    this.feedSub = this.userService.getLatestFeeds().subscribe(response => {
      this.feeds = response;
    });
  }

  public openBuilds(feed: Feed) {

    this.router.navigate(['drone/builds', {user: feed.owner, repo: feed.name}]);
  }

  ngOnDestroy() {
    this.feedSub.unsubscribe();
  }

}
