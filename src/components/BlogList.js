import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';
import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {useObservable, useObservableState} from 'observable-hooks';
// import ListItem from './helpers/ListItem';
import {database} from '../../index';
import styles from './helpers/styles';
import {useNavigation} from '@react-navigation/native';

const RawCounter = ({count}) => count;
const isAndroid = Platform.OS === 'android';

const Counter = withObservables(['observable'], ({observable}) => ({
  count: observable,
}))(RawCounter);

const ListItem = ({title, countObservable, onPress}) =>
  isAndroid ? (
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
  ) : (
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

const enhanceBlogItem = withObservables(['blog'], ({blog}) => ({
  blog: blog.observe(),
}));

const BlogItem = enhanceBlogItem(function ({blog, onPress}) {
  return (
    <ListItem
      title={blog.name}
      countObservable={blog.posts.observeCount()}
      onPress={onPress}
    />
  );
});

const enhanceBlogList = withObservables(['search'], ({database, search}) => ({
  blogs: database.collections
    .get('blogs')
    .query(Q.where('name', Q.like(`%${Q.sanitizeLikeString(search)}%`))),
}));

export const BlogList = enhanceBlogList(({blogs}) => {
  console.log('blogList-screen');
  const navigation = useNavigation();
  return (
    <View>
      {blogs.map(blog => (
        <BlogItem
          blog={blog}
          key={blog.id}
          onPress={() => {
            return navigation.navigate('Blog', {blogId: blog.id});
          }}
        />
      ))}
    </View>
  );
});

export default BlogList;
