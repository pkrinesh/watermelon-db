import React, {Component} from 'react';
import {Text, FlatList} from 'react-native';
import withObservables from '@nozbe/with-observables';
import {Q} from '@nozbe/watermelondb';
import Comment from './Comment';
import styles from './helpers/styles';
import prompt from './helpers/prompt';
import Button from './helpers/Button';
import {extractId} from '../utils';
import {database} from '../..';

const renderComment = ({item}) => <Comment comment={item} key={item.id} />;

const enhance = withObservables(['post'], ({post}) => ({
  post: post.observe(),
  comments: post.comments.observe(),
}));

const EnhancePost = enhance(({post, comments}) => {
  const addComment = async () => {
    const comment = await prompt('Write a comment');
    await post.addComment(comment);
  };

  return (
    <FlatList
      style={styles.marginContainer}
      data={comments}
      renderItem={renderComment}
      ListHeaderComponent={() => (
        <>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.subtitle}>{post.subtitle}</Text>
          <Text style={styles.body}>{post.body}</Text>
          <Text style={styles.subtitle}>Comments ({comments.length})</Text>
        </>
      )}
      ListFooterComponent={() => (
        <Button
          style={styles.button}
          title="Add comment"
          onPress={addComment}
        />
      )}
      keyExtractor={extractId}
    />
  );
});

const enhancePost = withObservables(['route'], ({route}) => ({
  post: database.get('posts').query(Q.where('id', route.params.postId)),
}));

const Post = enhancePost(({post}) => {
  console.log('post-screen');
  return <EnhancePost post={post[0]} />;
});

export default Post;
