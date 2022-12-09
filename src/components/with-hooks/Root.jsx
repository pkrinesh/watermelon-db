import React, {Component, Fragment} from 'react';
import {
  ScrollView,
  SafeAreaView,
  Alert,
  Text,
  View,
  Image,
  TextInput,
} from 'react-native';

import Button from '../helpers/Button';
import styles from '../helpers/styles';
import BlogList from './BlogList';

import logoSrc from '../assets/logo-app.png';
import {generate100, generate10k} from '../../model/generate';
import {database} from '../../../index';

const Root = ({
  navigation,
  route: {
    params: {timeToLaunch},
  },
}) => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  const generateWith = async generator => {
    setIsGenerating(true);

    const count = await generator(database);
    Alert.alert(`Generated ${count} records!`);

    setIsGenerating(false);
  };

  const generate100Record = () => generateWith(generate100);

  const generate10kRecord = () => generateWith(generate10k);

  const handleTextChanges = v => setSearch(v);

  const handleOnFocus = () => setIsSearchFocused(true);

  const handleOnBlur = () => setIsSearchFocused(false);

  return (
    <ScrollView>
      <SafeAreaView>
        {!isSearchFocused && (
          <Fragment>
            <Image style={styles.logo} source={logoSrc} />
            <Text style={styles.post}>Launch time: {timeToLaunch} ms</Text>
            <View style={styles.marginContainer}>
              <Text style={styles.header}>Generate:</Text>
              <View style={styles.buttonContainer}>
                <Button title="100 records" onPress={generate100Record} />
                <Button title="10,000 records" onPress={generate10kRecord} />
              </View>
            </View>
          </Fragment>
        )}
        <TextInput
          style={{padding: 5, fontSize: 16}}
          placeholder="Search ..."
          defaultValue=""
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          onChangeText={handleTextChanges}
        />
        {!isGenerating && (
          <BlogList
            database={database}
            search={search}
            // navigation={navigation}
          />
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

export default Root;
