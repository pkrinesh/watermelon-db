import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';
import {Q} from '@nozbe/watermelondb';
import {useObservable, useObservableState} from 'observable-hooks';
import {database} from '../../../index';
import styles from '../helpers/styles';
import {useNavigation} from '@react-navigation/native';

const RawCounter = ({count}) => count;
const isAndroid = Platform.OS === 'android';

const Counter = ({observable}) => {
  const count = useObservableState(observable, null);

  return <RawCounter count={count} />;
};

const ListItem = ({title, countObservable, onPress}) => {
  if (isAndroid) {
    return (
      <TouchableNativeFeedback onPress={onPress}>
        <View style={styles.listItem}>
          <Text style={styles.listItemTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.listItemCounter}>
            <Counter observable={countObservable} />
          </Text>
        </View>
      </TouchableNativeFeedback>
    );
  } else {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.listItem}
        activeOpacity={0.5}>
        <Text style={styles.listItemTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.listItemCounter}>
          <Counter observable={countObservable} />
        </Text>
      </TouchableOpacity>
    );
  }
};

const BlogItem = ({blog, onPress}) => {
  return (
    <ListItem
      title={blog.name}
      countObservable={blog.posts.observeCount()}
      onPress={onPress}
    />
  );
};

const BlogList = ({search}) => {
  console.log('blogList-hooks');
  const navigator = useNavigation();

  const blogs$ = useObservable(() =>
    database
      .get('blogs')
      .query(Q.where('name', Q.like(`%${Q.sanitizeLikeString(search)}%`)))
      .observe(),
  );
  const blogs = useObservableState(blogs$, null);

  if (!blogs) {
    return <Text>loading...</Text>;
  }

  return (
    <View>
      {blogs.map(blog => (
        <BlogItem
          blog={blog}
          key={blog.id}
          onPress={() => navigator.navigate('Blog', {blogId: blog.id})}
        />
      ))}
    </View>
  );
};

export default BlogList;
