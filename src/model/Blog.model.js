import {Model, Q} from '@nozbe/watermelondb';
import {field, children, lazy, writer} from '@nozbe/watermelondb/decorators';

export class Blog extends Model {
  static table = 'blogs';

  static associations = {
    posts: {type: 'has_many', foreignKey: 'blog_id'},
  };

  @field('name')
  name;

  @children('posts')
  posts;

  @lazy
  getPosts = this.collections.get('posts').query(Q.where('blog_id', this.id));

  @lazy
  nastyComments = this.collections
    .get('comments')
    .query(Q.on('posts', 'blog_id', this.id), Q.where('is_nasty', true));

  @writer
  async moderateAll() {
    await this.nastyComments.destroyAllPermanently();
  }
}
