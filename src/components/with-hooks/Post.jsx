import React from 'react';
import {Text, View, FlatList} from 'react-native';
import {Q} from '@nozbe/watermelondb';
import {useObservable, useObservableState} from 'observable-hooks';

import styles from '../helpers/styles';
import prompt from '../helpers/prompt';
import Button from '../helpers/Button';
import {extractId} from '../../utils';
import {database} from '../../..';
import {useRoute} from '@react-navigation/native';
import {from} from 'rxjs';
import {Comment} from './Comment';

const renderComment = ({item}) => <Comment commentObs={item} key={item.id} />;

const CommentList = ({post}) => {
  const comments$ = useObservable(() => post.comments.observe());
  const comments = useObservableState(comments$, []);

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
};

const Post = () => {
  console.log('post-hooks');

  const routeState = useRoute();
  const post$ = useObservable(() =>
    database
      .get('posts')
      .query(Q.where('id', routeState.params.postId))
      .observe(),
  );

  const post = useObservableState(post$, null);

  if (!post) {
    return <Text>Loading...</Text>;
  }
  return <CommentList post={post[0]} />;
};

export default Post;
