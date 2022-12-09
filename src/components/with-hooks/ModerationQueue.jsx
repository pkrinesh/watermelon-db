import React from 'react';
import {FlatList, Text} from 'react-native';
import withObservables from '@nozbe/with-observables';
import {Q} from '@nozbe/watermelondb';
import {useObservable, useObservableState} from 'observable-hooks';
import {useRoute} from '@react-navigation/native';
import Comment from '../Comment';
import styles from '../helpers/styles';
import {extractId} from '../../utils';
import {database} from '../../..';

const renderComment = ({item}) => <Comment comment={item} key={item.id} />;

const ModerationQueue = ({blog}) => {
  const nastyCommentsObs = useObservable(() => blog.nastyComments.observe());
  const nastyComments = useObservableState(nastyCommentsObs, []);

  return (
    <FlatList
      ListHeaderComponent={() => (
        <>
          <Text style={styles.title}>Moderation queue for {blog.name}</Text>
          <Text style={styles.subtitle}>
            Nasty comments ({nastyComments.length})
          </Text>
        </>
      )}
      data={nastyComments}
      renderItem={renderComment}
      keyExtractor={extractId}
    />
  );
};

const Queue = () => {
  console.log('moderationQueue-hooks');

  const routeParams = useRoute().params;

  const blogObs = useObservable(() =>
    database.get('blogs').query(Q.where('id', routeParams.blogId)).observe(),
  );
  const blog = useObservableState(blogObs, null);

  if (!blog) {
    return <Text>Loading...</Text>;
  }
  return <ModerationQueue blog={blog[0]} />;
};

export default Queue;
