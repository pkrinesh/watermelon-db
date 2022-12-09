import React from 'react';
import {Q} from '@nozbe/watermelondb';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useObservable, useObservableState} from 'observable-hooks';
import {FlatList, Text} from 'react-native';
import {database} from '../../..';
import {extractId} from '../../utils';
import Button from '../helpers/Button';
import ListItem from '../helpers/ListItem';
import styles from '../helpers/styles';

const NastyCommentsItem = ({blog, onPress}) => (
  <ListItem
    title="Nasty comments"
    countObservable={blog.nastyComments.observeCount()}
    onPress={onPress}
  />
);

const PostItem = ({post, onPress}) => {
  const post$ = useObservable(() => post.observe());
  const post$$ = useObservableState(post$, null);

  return (
    <ListItem
      title={post$$.title}
      countObservable={post$$.comments.observeCount()}
      onPress={onPress}
    />
  );
};

const PostList = ({blog}) => {
  const navigation = useNavigation();

  const posts$ = useObservable(() => blog.posts.observe());
  const posts = useObservableState(posts$, []);

  const moderate = async () => {
    await blog.moderateAll();
  };

  return (
    <FlatList
      data={posts}
      renderItem={({item: post}) => (
        <PostItem
          post={post}
          key={post.id}
          onPress={() => navigation.navigate('Post', {postId: post.id})}
        />
      )}
      ListHeaderComponent={() => (
        <>
          <Button style={styles.button} title="Moderate" onPress={moderate} />
          <NastyCommentsItem
            blog={blog}
            onPress={() =>
              navigation.navigate('ModerationQueue', {blogId: blog.id})
            }
          />
          <Text style={styles.postsListHeader}>Posts: {posts.length}</Text>
        </>
      )}
      keyExtractor={extractId}
    />
  );
};

const Blog = () => {
  const routeState = useRoute();
  const blog$ = useObservable(() =>
    database
      .get('blogs')
      .query(Q.where('id', routeState.params.blogId))
      .observe(),
  );
  const blog = useObservableState(blog$, null);

  if (!blog) {
    return <Text>Loading...</Text>;
  }
  console.log('blog-hooks');
  return <PostList blog={blog[0]} />;
};

export default Blog;
