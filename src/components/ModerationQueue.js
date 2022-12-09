import React from 'react';
import {FlatList, Text} from 'react-native';
import withObservables from '@nozbe/with-observables';
import {Q} from '@nozbe/watermelondb';
import Comment from './Comment';
import styles from './helpers/styles';
import {extractId} from '../utils';
import {database} from '../..';

const renderComment = ({item}) => <Comment comment={item} key={item.id} />;

const enhance = withObservables(['blog'], ({blog}) => ({
  blog: blog.observe(),
  nastyComments: blog.nastyComments.observe(),
}));

const ModerationQueue = enhance(({blog, nastyComments}) => {
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
});

const EnhanceModerationQueue = withObservables(['route'], ({route}) => ({
  blog: database.get('blogs').query(Q.where('id', route.params.blogId)),
}));

const Queue = EnhanceModerationQueue(({blog}) => {
  console.log('moderationQueue-screen');
  return <ModerationQueue blog={blog[0]} />;
});

export default Queue;
