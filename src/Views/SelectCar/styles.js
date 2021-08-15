import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  imageWrapper: {
    flex: 1,
    padding: 12,
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
  },
});

export default styles;
