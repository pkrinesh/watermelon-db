import React from 'react';
import withObservablesSynchronized from '@nozbe/with-observables';

import {View, Text} from 'react-native';

const enhance = withObservablesSynchronized(['comment'], ({comment}) => ({
  comment,
}));

const EnhancedComment = enhance(({comment}) => {
  return (
    <View>
      <Text>{comment.body}</Text>
    </View>
  );
});

export default EnhancedComment;
