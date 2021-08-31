import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  marker: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  calloutContainer: {
    minWidth: 130,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  calloutText: {
    color: '#000',
  },
  centeredView: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    margin: 'auto',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTextWrapper: {
    marginBottom: 20,
  },
  btnContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalBtn: {
    backgroundColor: '#e2b052',
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    borderRadius: 8,
  },
  modalBtnText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default styles;
