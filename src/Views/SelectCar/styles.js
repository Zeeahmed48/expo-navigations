import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: 'relative',
  },
  container: {
    paddingVertical: '15%',
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  floatBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 8,
    zIndex: 99,
  },
  backIcon: {
    backgroundColor: '#383838',
    borderRadius: 50,
    padding: 5,
    marginRight: 8,
  },
  carVarietyContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
  },
  carContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    // alignItems: 'center',
    padding: 12,
  },
  // imageWrapper: {},
  image: {
    width: '100%',
    height: 80,
    resizeMode: 'contain',
  },
});

export default styles;
