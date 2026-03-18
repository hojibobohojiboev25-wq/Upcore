import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Keep app alive with fallback screen instead of hard close.
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.screen}>
          <Text style={styles.title}>Upcore</Text>
          <Text style={styles.text}>Unexpected error happened. Please reload app.</Text>
          <Pressable style={styles.btn} onPress={() => this.setState({ hasError: false })}>
            <Text style={styles.btnText}>Reload</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0B1220',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 10
  },
  title: { color: '#E9EFFD', fontSize: 24, fontWeight: '900' },
  text: { color: '#A7B4D1', textAlign: 'center' },
  btn: {
    marginTop: 8,
    backgroundColor: '#4F8CFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  btnText: { color: '#fff', fontWeight: '800' }
});

export default AppErrorBoundary;
