import React, {Component} from 'react';
import {FlatList, Text} from 'react-native';
import withObservables from '@nozbe/with-observables';
import {Q} from '@nozbe/watermelondb';
import Button from './helpers/Button';
import ListItem from './helpers/ListItem';
import styles from './helpers/styles';
import {extractId} from '../utils';
import {database} from '../..';
import {useNavigation} from '@react-navigation/native';

const NastyCommentsItem = ({blog, onPress}) => (
  <ListItem
    title="Nasty comments"
    countObservable={blog.nastyComments.observeCount()}
    onPress={onPress}
  />
);

const RawPostItem = ({post, onPress}) => (
  <ListItem
    title={post.title}
    countObservable={post.comments.observeCount()}
    onPress={onPress}
  />
);

const PostItem = withObservables(['post'], ({post}) => ({
  post: post.observe(),
}))(RawPostItem);

const enhance = withObservables(['blog'], ({blog}) => ({
  blog: blog.observe(),
  posts: blog.posts.observe(),
}));

const EnhanceBlog = enhance(({blog, posts}) => {
  const navigation = useNavigation();
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
});

const enhanceBlog = withObservables(['route'], ({route}) => ({
  blog: database.get('blogs').query(Q.where('id', route.params.blogId)),
}));

const Blog = enhanceBlog(({blog}) => {
  console.log('blog screen');
  return <EnhanceBlog blog={blog[0]} />;
});

export default Blog;
