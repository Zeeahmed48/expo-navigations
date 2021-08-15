import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
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
  input: {
    flex: 1,
    height: 40,
    borderColor: '#383838',
    borderWidth: 1,
    padding: 5,
    backgroundColor: '#e2b052',
    borderRadius: 15,
    color: '#383838',
  },
  confirmationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#383838',
    paddingHorizontal: 8,
    paddingVertical: 12,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  confirmText: {
    flex: 1,
    color: '#e2b052',
    fontSize: 18,
    fontWeight: 'bold',
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    padding: 5,
    borderRadius: 50,
    borderWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
  },
  confirmBtn: {
    backgroundColor: '#e2b052',
    borderColor: 'transparent',
    marginHorizontal: 5,
  },

  cancelBtn: {
    backgroundColor: 'transparent',
    borderColor: '#e2b052',
  },
});

export default styles;
