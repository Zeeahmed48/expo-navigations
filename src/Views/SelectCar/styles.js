import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: 'relative',
  },
  container: {
    paddingVertical: '15%',
    flex: 1,
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
    padding: 12,
  },
  image: {
    width: '100%',
    height: 80,
    resizeMode: 'contain',
  },
  textCenter: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 12,
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
    padding: 20,
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
  modalText: {
    marginTop: 20,
  },
  startBtn: {
    backgroundColor: '#e2b052',
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    borderRadius: 8,
  },
  startBtnText: {
    color: '#fff',
    fontSize: 18,
  },
  reqMessage: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 18,
    marginVertical: 8,
  },
});

export default styles;
