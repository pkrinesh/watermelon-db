import React from 'react';
import withObservablesSynchronized from '@nozbe/with-observables';
import {useObservable, useObservableState} from 'observable-hooks';

import {View, Text} from 'react-native';

export const Comment = ({commentObs}) => {
  const comment$ = useObservable(() => commentObs.observe());
  const comment = useObservableState(comment$, []);

  return (
    <View>
      <Text>{comment.body}</Text>
    </View>
  );
};
